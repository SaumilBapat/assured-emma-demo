import { Router } from 'express';
 import twilio from 'twilio';

 // Local imports
 import { getLocalTemplateData } from '../lib/utils/llm/getTemplateData';
 import { activeConversations } from './conversationRelay';
 import { LLMService } from '../llm';
 import { routeNames } from './routeNames';
 import { trackMessage } from '../lib/utils/trackMessage';
 import { emitDemo } from '../lib/utils/demoEvents';
import { analyzeCallerUtterance, addToTranscript, analyzeDamageImage } from '../lib/utils/ciAnalyzer';
 
 const router = Router();

router.post(`/${routeNames.sms}`, async (req: any, res: any) => {
  try {
    const callType =
      req.body.To.includes('whatsapp:') || req.body.From.includes('whatsapp:')
        ? 'whatsapp'
        : 'sms';

    const { From: from, Body: body, To: to } = req.body;
    const numMedia = parseInt(req.body.NumMedia || '0', 10);

    // Validate required fields at the top
    if (!from) {
      console.error('Missing required fields:', { from, body });
      return res.status(400).send('Missing required fields');
    }

    console.log('Received SMS from ' + from + ': ' + body);

    // Handle MMS image attachments
    if (numMedia > 0) {
      const mediaUrl = req.body.MediaUrl0;
      const mediaContentType = req.body.MediaContentType0 || 'image/jpeg';
      console.log(`MMS received: ${mediaUrl} (${mediaContentType})`);

      if (mediaUrl && mediaContentType.startsWith('image/')) {
        // Emit image to dashboard immediately
        emitDemo('sms:image', { from, mediaUrl, phoneNumber: from });

        // Run GPT-4o vision damage analysis (fire and forget — result emitted via socket)
        const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        analyzeDamageImage(mediaUrl, accountSid, authToken);
      }
    }

    // Emit inbound text message to dashboard (even if body is empty on MMS-only)
    if (body && body.trim()) {
      emitDemo('sms:inbound', { from, body, phoneNumber: from });
      addToTranscript('caller', body);
      analyzeCallerUtterance(body);
    }

    // Track inbound message
    await trackMessage({
      userId: from,
      callType: 'sms',
      phoneNumber: from,
      label: 'sms',
      direction: 'inbound',
      event: 'Text Interaction',
    });

    // Build LLM message — include image note if MMS
    const imageNote = numMedia > 0 ? `[The customer sent ${numMedia} photo(s) of vehicle damage. GPT-4o vision is analyzing the damage. Tell them you received their photo and are running an AI damage estimate — you'll share results shortly.]` : '';
    const llmContent = [body?.trim(), imageNote].filter(Boolean).join('\n') || '[Image received]';

    // Check if there's an active conversation for this number
    const conversation = activeConversations.get(from);

    if (conversation && conversation.llm) {
      const { llm } = conversation;

      // Add message to conversation history
      llm.addMessage({
        role: 'user',
        content: llmContent,
      });

      // Process with LLM
      await llm.run();
    } else {
      // Create new conversation for this number
      const templateData = await getLocalTemplateData();
      const llm = new LLMService(from, templateData);

      // Reset voice call flag for SMS conversations
      llm.isVoiceCall = false;

      // Store the conversation
      activeConversations.set(from, {
        ws: null as any, // No WebSocket for SMS-only conversations
        llm,
        ttl: Date.now() + 60 * 60 * 1000, // TTL: current time + 1 hour
      });

      llm.addMessage({
        role: 'system',
        content: `The customer's phone number is ${from}.
        The agent's phone number is ${to}.
        This is an ${callType} conversation.`,
      });

      // Add user's message and start conversation
      llm.addMessage({
        role: 'user',
        content: llmContent,
      });

      await llm.run();
 
      // Track the start of the text conversation (only for new conversations)
      await trackMessage({
        userId: from,
        callType: 'sms',
        phoneNumber: from,
        label: 'sms',
        direction: 'inbound',
        event: 'Conversation Started',
      });
    }

    // Send TwiML response
    const twiml = new twilio.twiml.MessagingResponse();
    res.type('text/xml');
    return res.send(twiml.toString());
  } catch (error: any) {
    console.error('SMS error:', error);
    return res.status(500).send('Error processing message');
  }
});

export default router;