import ExpressWs from 'express-ws';
import WebSocket from 'ws';
import { LLMService } from '../llm';
import { getLocalTemplateData } from '../lib/utils/llm/getTemplateData';
import { log } from '../lib/utils/logger';

// Store active conversations
const activeConversations = new Map<string, {
  ws: WebSocket;
  llm: LLMService | null;
  ttl: number;
  targetWorker?: string;
}>();

// Store phone logs
const phoneLogs = new Map<string, any[]>();

// Store recent activity
const recentActivity = new Map<string, {
  phoneNumber: string;
  lastActivity: Date;
  isActive: boolean;
}>();

// TTL cleanup interval - runs every 10 minutes
setInterval(() => {
  const totalConnections = activeConversations.size;
  console.log('Starting cleanup check - ' + totalConnections + ' active conversations');

  let expiredCount = 0;
  activeConversations.forEach((conversation, phoneNumber) => {
    if (conversation.ttl < Date.now()) {
      console.log('Closing expired conversation for ' + phoneNumber);
      conversation.ws?.close();
      activeConversations.delete(phoneNumber);

      const existingActivity = recentActivity.get(phoneNumber);
      if (existingActivity) {
        existingActivity.isActive = false;
      }
      expiredCount++;
    }
  });

  console.log('Cleanup complete - removed ' + expiredCount + ' expired conversations');
}, 10 * 60 * 1000);

export const setupConversationRelayRoute = (app: ExpressWs.Application) => {
  app.ws('/conversation-relay', (ws) => {
    let phoneNumber: string = 'unknown';
    let llm: LLMService;
    
    console.log('WebSocket connection established');
    
    // Create a simple wrapper to mimic TypedWs.end() behavior
    const wss = {
      send: (data: any) => ws.send(JSON.stringify(data)),
      end: (handoffData?: Record<string, any>) => {
        // Send end message with handoff data (like ramp-agent's TypedWs)
        ws.send(JSON.stringify({ 
          type: 'end', 
          handoffData: JSON.stringify(handoffData ?? {}) 
        }));
      },
      close: () => ws.close()
    };

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        log.info({
          label: 'conversation',
          phone: phoneNumber,
          message: 'Received message',
          data: data.type
        });
        
        // Handle different message types from Twilio ConversationRelay
        if (data.type === 'setup') {
          // Extract call parameters from setup message
          const { from, to, direction, callSid } = data;
          
          if (direction && direction.includes('outbound')) {
            // For outbound calls, the customer is the 'to' number
            phoneNumber = to;
            console.log('Outbound call detected. Customer number: ' + phoneNumber + ', Twilio number: ' + from);
          } else {
            // For inbound calls, the customer is the 'from' number
            phoneNumber = from;
            console.log('Inbound call detected. Customer number: ' + phoneNumber + ', Twilio number: ' + to);
          }
          
          // Get template data and initialize LLM service
          const templateData = await getLocalTemplateData();
          llm = new LLMService(phoneNumber, templateData);
          
          // Set call context with callSid (like ramp-agent does)
          await llm.setCallContext(from, to, direction, callSid);
          
          // Store the connection
          activeConversations.set(phoneNumber, {
            ws,
            llm,
            ttl: Date.now() + (30 * 60 * 1000), // 30 minutes TTL
            targetWorker: process.env.TWILIO_FLEX_WORKER_SID
          });
          
          // Set up LLM event handlers
          llm.on('text', (chunk: string, isFinal: boolean, fullText?: string) => {
            // Send text token to Twilio ConversationRelay
            wss.send({
              type: 'text',
              token: chunk,
              last: isFinal
            });
          });

          llm.on('handoff', (data: any) => {
            // Get the stored conversation to access targetWorker
            const conversation = activeConversations.get(phoneNumber);
            const enhancedData = {
              ...data,
              targetWorker: conversation?.targetWorker || process.env.TWILIO_FLEX_WORKER_SID || undefined,
            };
            
            console.log('🔄 Initiating live agent handoff:', enhancedData);
            console.log('📞 Call status: Transferring to live agent');
            
            // Use wss.end() like ramp-agent (triggers Connect verb)
            wss.end(enhancedData);
          });

          llm.on('language', (data: any) => {
            const languageMessage = {
              type: 'language' as const,
              ttsLanguage: data.ttsLanguage,
              transcriptionLanguage: data.transcriptionLanguage,
            };

            console.log('Sending language message to Twilio:', languageMessage);
            wss.send(languageMessage);
          });

          // Start the conversation
          llm.isVoiceCall = true;
          console.log('Starting conversation for ' + phoneNumber);
          await llm.notifyInitialCallParams();
          await llm.run();
        } else if (data.type === 'message') {
          // User speech message
          if (!llm) {
            console.log('LLM not initialized yet, ignoring message');
            return;
          }
          llm.addMessage({
            role: 'user',
            content: data.content || data.message || ''
          });
          await llm.run();
        } else if (data.type === 'interrupt') {
          // Handle interruption
          if (!llm) {
            console.log('LLM not initialized yet, ignoring interrupt');
            return;
          }
          console.log('Interrupting conversation for ' + phoneNumber);
          // Optionally restart the LLM response
          await llm.run();
        } else if (data.type === 'dtmf') {
          // Handle DTMF tones
          if (!llm) {
            console.log('LLM not initialized yet, ignoring DTMF');
            return;
          }
          console.log('DTMF received: ' + data.digit);
          llm.addMessage({
            role: 'user',
            content: `DTMF: ${data.digit}`
          });
          await llm.run();
        } else if (data.type === 'prompt') {
          // User speech prompt from Twilio ConversationRelay
          if (!llm) {
            console.log('LLM not initialized yet, ignoring prompt');
            return;
          }
          console.log('Received voice prompt:', data.voicePrompt);
          llm.addMessage({
            role: 'user',
            content: data.voicePrompt || ''
          });
          await llm.run();
        } else if (data.type === 'info') {
          // Handle info messages (heartbeat/status updates from Twilio)
          console.log('📊 Info message from Twilio for ' + phoneNumber + ':', {
            timestamp: new Date().toISOString(),
            data: data
          });
        } else if (data.type === 'error') {
          console.error('Error from Twilio:', data.description);
        } else {
          console.log('Unhandled message type:', data.type);
        }
      } catch (error) {
        log.error({
          label: 'conversation',
          phone: phoneNumber,
          message: 'Error processing message',
          data: error
        });
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed for ' + phoneNumber);
      activeConversations.delete(phoneNumber);
      
      const existingActivity = recentActivity.get(phoneNumber);
      if (existingActivity) {
        existingActivity.isActive = false;
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error for ' + phoneNumber + ':', error);
      activeConversations.delete(phoneNumber);
    });
  });
};

export { activeConversations, phoneLogs, recentActivity };
