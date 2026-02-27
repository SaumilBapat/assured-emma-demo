import { Twilio } from 'twilio';
 import { ToolResult, LocalTemplateData } from '../../lib/types';
 import { trackMessage } from '../../lib/utils/trackMessage';

export async function execute(
  args: { to: string; message: string },
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { to, message } = args;
  
  try {
    // Get Twilio credentials from environment variables
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!twilioAccountSid) {
      throw new Error('Missing TWILIO_ACCOUNT_SID environment variable');
    }
    
    if (!twilioAuthToken) {
      throw new Error('Missing TWILIO_AUTH_TOKEN environment variable');
    }
    
    if (!message || !to) {
      return {
        success: false,
        error: 'Message and phone number are required',
      };
    }
    
    // Use the Twilio number from the conversation context as the "from" number for SMS
    // This should be passed in the toolData from the conversation context
    const fromNumber = toolData?.twilioNumber;
    
    if (!fromNumber) {
      throw new Error('Missing Twilio number in toolData. This should be set from the conversation context.');
    }
    
    const client = new Twilio(twilioAccountSid, twilioAuthToken);
    
    const result = await client.messages.create({
      body: message,
      to: to,
      from: fromNumber
    });
    
    // Track outbound message
    const callType = to.includes('whatsapp:') || (fromNumber && fromNumber.includes('whatsapp:')) ? 'whatsapp' : 'sms';
    trackMessage({
      userId: to,
      callType,
      phoneNumber: to,
      label: 'outboundMessage',
      direction: 'outbound',
      event: 'Text Interaction',
      messageSid: result.sid,
    });

    return {
      success: true,
      data: {
        messageId: result.sid,
        status: result.status,
        message: 'Message sent successfully'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send message'
    };
  }
}