// External npm packages
 import twilio from 'twilio';

 // Local imports
 import { ToolResult, LocalTemplateData } from '../../lib/types';
 import { trackMessage } from '../../lib/utils/trackMessage';

export type SendRCSParams = {
  to: string;
  content?: string;
  contentSid?: string;
  messagingServiceSid?: string;
  contentVariables?: Record<string, string>;
};

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  const {
    twilioAccountSid: twilioAccountSidEnv,
    twilioAuthToken: twilioAuthTokenEnv,
  } = process.env;

  return {
    twilioContentSid: toolData?.twilioContentSid || process.env.TWILIO_CONTENT_SID,
    twilioMessagingServiceSid: toolData?.twilioMessagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID,
    twilioAccountSid: toolData?.twilioAccountSid || twilioAccountSidEnv,
    twilioAuthToken: toolData?.twilioAuthToken || twilioAuthTokenEnv,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { to, content, contentVariables } = args as SendRCSParams;
  const {
    twilioContentSid,
    twilioMessagingServiceSid,
    twilioAccountSid,
    twilioAuthToken,
  } = getToolEnvData(toolData);

  try {
    if (!twilioContentSid) {
      throw new Error(
        `Missing RCS Template Content SID. Please provide TWILIO_CONTENT_SID in environment`
      );
    }

    if (!twilioMessagingServiceSid) {
      throw new Error(
        `Missing RCS Template Messaging Service SID. Please provide TWILIO_MESSAGING_SERVICE_SID in environment`
      );
    }

    if (!twilioAccountSid || !twilioAuthToken) {
      throw new Error(
        `Missing ${
          !twilioAccountSid ? 'TWILIO_ACCOUNT_SID' : 'TWILIO_AUTH_TOKEN'
        }`
      );
    }

    const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

    const messageData = await twilioClient.messages.create({
      to,
      contentSid: twilioContentSid,
      messagingServiceSid: twilioMessagingServiceSid,
      contentVariables: JSON.stringify({
        ...contentVariables,
        content: contentVariables?.content || content,
      }),
    });
    
    // Track outbound RCS
    await trackMessage({
      userId: to,
      callType: 'rcs',
      phoneNumber: to,
      label: 'outboundMessage',
      direction: 'outbound',
      event: 'Text Interaction',
      messageSid: messageData.sid,
    });
    return {
      success: true,
      data: { message: 'Message sent successfully', content: messageData },
    };
  } catch (err) {
    let errorMessage = 'Failed to send RCS';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}