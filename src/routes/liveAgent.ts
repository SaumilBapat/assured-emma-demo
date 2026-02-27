import { Router } from 'express';
import { twiml } from 'twilio';

const router = Router();

router.post('/live-agent', async (req: any, res: any) => {
  const { From: from, To: to, Direction: direction } = req.body;
  const customerNumber = direction?.includes('outbound') ? to : from;

  console.log('Received live agent request:', { from, to, direction, customerNumber });

  const twilioTwiml = new twiml.VoiceResponse();
  
  if (process.env.TWILIO_WORKFLOW_SID) {
    const enqueue = twilioTwiml.enqueue({ 
      workflowSid: process.env.TWILIO_WORKFLOW_SID 
    });
    enqueue.task(JSON.stringify({
      name: customerNumber,
      handoffReason: 'Customer requested live agent',
      reasonCode: 'live_agent_request',
      conversationSummary: 'Customer transferred to live agent'
    }));
  } else {
    twilioTwiml.say('Please hold while we transfer you to a live agent.');
    twilioTwiml.hangup();
  }

  res.type('text/xml');
  res.send(twilioTwiml.toString());
});

export default router;