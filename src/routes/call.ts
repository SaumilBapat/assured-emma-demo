import { Router } from 'express';
 import { twiml } from 'twilio';
 import axios from 'axios';
 import { languages } from '../lib/config/languages';
 import { log } from '../lib/utils/logger';

const router = Router();

router.get('/call', async (req: any, res: any) => {
  await handleCallRequest(req, res);
});

router.post('/call', async (req: any, res: any) => {
  await handleCallRequest(req, res);
});

async function handleCallRequest(req: any, res: any) {
  const env = process.env.NODE_ENV;
  const isProduction = env === 'production';

  const {
    From: fromNumber,
    To: toNumber,
    Direction: direction,
    CallSid: callSid,
  } = req.query as { From?: string; To?: string; Direction?: string; CallSid?: string };

  // For outbound calls, use the "To" number as the caller number
  let callerNumber: string;
  if (direction && direction.includes('outbound')) {
    callerNumber = toNumber || '';
    console.log('Outbound call detected. Using "To" number as caller: ' + callerNumber);
  } else {
    callerNumber = fromNumber || '';
    console.log('Inbound call detected. Using "From" number as caller: ' + callerNumber);
  }

  // Track the start of the call conversation
  if (process.env.SEGMENT_WRITE_KEY) {
    try {
      await axios.post(
        'https://api.segment.io/v1/track',
        {
          userId: callerNumber,
          event: 'Conversation Started',
          properties: {
            type: 'voice',
            phoneNumber: callerNumber,
            direction: direction || 'inbound',
            timestamp: new Date().toISOString(),
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + Buffer.from((process.env.SEGMENT_WRITE_KEY || '') + ':').toString('base64'),
          },
        }
      );
    } catch (trackError) {
      log.error({
        label: 'call',
        message: 'Failed to track call conversation start',
        data: trackError,
      });
    }
  }

  // action endpoint will be executed when action is dispatched to the ConversationRelay websocket
  const baseActionUrl = isProduction
    ? 'https://' + process.env.LIVE_HOST_URL + '/live-agent'
    : 'https://' + (process.env.NGROK_URL || req.get('host')) + '/live-agent';

  const relayUrl = isProduction
    ? `wss://${process.env.LIVE_HOST_URL}/conversation-relay?callSid=${callSid || 'unknown'}&from=${fromNumber || 'unknown'}&to=${toNumber || 'unknown'}&direction=${direction || 'unknown'}`
    : `wss://${process.env.NGROK_URL || req.get('host')}/conversation-relay?callSid=${callSid || 'unknown'}&from=${fromNumber || 'unknown'}&to=${toNumber || 'unknown'}&direction=${direction || 'unknown'}`;

  console.log('🔧 Relay URL:', relayUrl);
  console.log('🔧 NGROK_URL:', process.env.NGROK_URL);
  console.log('🔧 LIVE_HOST_URL:', process.env.LIVE_HOST_URL);

  const twilioTwiml = new twiml.VoiceResponse();
  
  // Connect to ConversationRelay
  const connect = twilioTwiml.connect({
    action: `${baseActionUrl}?method=POST`,
  });

  // Define comprehensive parameters for the ConversationRelay
  const relayParams = {
    url: relayUrl,
    voice: 'g6xIsTj2HwM6VR4iXFCw', // Default ElevenLabs voice for English
    transcriptionProvider: 'Deepgram', // Primary transcription provider
    ttsProvider: 'ElevenLabs', // Text-to-Speech provider
    speechModel: 'nova-2-general', // Speech model for transcription
    dtmfDetection: true, // DTMF detection enabled
    debug: 'true', // Debugging enabled for troubleshooting (string type)
  };

  
  const conversationRelay = connect.conversationRelay(relayParams);
  console.log('✅ ConversationRelay created successfully');

  // Configure supported languages for TwiML
  try {

    
    // Filter to working languages (those with proper Twilio configuration)
    const workingLanguages = languages.filter(
      (lang) =>
        lang.value === 'en-US' ||
        lang.value === 'de-DE' ||
        lang.value === 'fr-FR' ||
        lang.value === 'es-ES' ||
        lang.value === 'pt-BR' ||
        lang.value === 'ja-JP' ||
        lang.value === 'hi-IN' ||
        lang.value === 'nl-NL' ||
        lang.value === 'it-IT' ||
        lang.value === 'zh-CN'
    );


    // Configure each language individually
    let configuredCount = 0;
    let failedCount = 0;
    
    workingLanguages.forEach((language, index) => {
      try {
        // Build language configuration with detailed settings
        const languageConfig = {
          code: language.value,
          ttsProvider: relayParams.ttsProvider, // Use default from relayParams
          transcriptionProvider: relayParams.transcriptionProvider, // Use default from relayParams
          speechModel: relayParams.speechModel, // Use default from relayParams
          voice: language.twilioConfig.voice || relayParams.voice,
        };


        // Add language to ConversationRelay
        conversationRelay.language(languageConfig);
        configuredCount++;
        
      } catch (languageError) {
        failedCount++;
        console.error(`❌ Failed to configure language ${language.value}:`, languageError);
      }
    });

    console.log(`📊 Language configuration summary:`);
    console.log(`   - Successfully configured: ${configuredCount} languages`);
    console.log(`   - Failed: ${failedCount} languages`);
    console.log(`   - Total attempted: ${workingLanguages.length} languages`);
    
    if (configuredCount === 0) {
      throw new Error('No languages were successfully configured');
    }
    
  } catch (error) {
    console.error('❌ Critical error during language configuration:', error);

    // Fallback to English-only configuration
    console.log('🔄 Implementing fallback: English-only configuration...');
    
    try {
      const fallbackConfig = {
        code: 'en-US',
        ttsProvider: 'ElevenLabs',
        voice: 'g6xIsTj2HwM6VR4iXFCw',
        transcriptionProvider: 'Deepgram',
        speechModel: 'nova-2-general',
      };
      
      console.log('🔄 Fallback language config:', fallbackConfig);
      conversationRelay.language(fallbackConfig);
      console.log('✅ Fallback English configuration applied successfully');
    } catch (fallbackError) {
      console.error('💥 CRITICAL: Even fallback configuration failed:', fallbackError);
      // Continue anyway - let Twilio handle with defaults
    }
  }

  // Send response
  res.type('text/xml');
  res.send(twilioTwiml.toString());
  
  console.log('📤 TwiML response sent successfully');
}

export default router;
