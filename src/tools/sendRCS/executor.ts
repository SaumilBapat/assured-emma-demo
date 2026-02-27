// External npm packages
import twilio from 'twilio';

// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';
import { trackMessage } from '../../lib/utils/trackMessage';

export type SendRCSParams = {
  to: string;
  title?: string;
  message?: string;
  cardEmoji?: string;
  quickReplies?: string[];
  content?: string;
  contentSid?: string;
  messagingServiceSid?: string;
  contentVariables?: Record<string, string>;
};

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  return {
    twilioContentSid: toolData?.twilioContentSid || process.env.TWILIO_CONTENT_SID,
    twilioMessagingServiceSid: toolData?.twilioMessagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID,
    twilioAccountSid: toolData?.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: toolData?.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: toolData?.twilioNumber || process.env.TWILIO_CONVERSATION_NUMBER,
    callerPhoneNumber: toolData?.callerPhoneNumber,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { to, title, message, cardEmoji, quickReplies, content, contentVariables } = args as SendRCSParams;
  const {
    twilioContentSid,
    twilioMessagingServiceSid,
    twilioAccountSid,
    twilioAuthToken,
    twilioNumber,
    callerPhoneNumber,
  } = getToolEnvData(toolData);

  // Always send to the actual caller — ignore whatever `to` the LLM passes
  const recipient = callerPhoneNumber || (args as SendRCSParams).to;

  if (!twilioAccountSid || !twilioAuthToken) {
    return {
      success: false,
      error: `Missing ${!twilioAccountSid ? 'TWILIO_ACCOUNT_SID' : 'TWILIO_AUTH_TOKEN'}`,
    };
  }

  const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
  const messageBody = message || content || 'Message from Emma, powered by Assured × Twilio';

  try {
    // Full RCS mode: ContentSid + MessagingServiceSid configured
    if (twilioContentSid && twilioMessagingServiceSid) {
      const messageData = await twilioClient.messages.create({
        to: recipient,
        contentSid: twilioContentSid,
        messagingServiceSid: twilioMessagingServiceSid,
        contentVariables: JSON.stringify({
          ...contentVariables,
          content: contentVariables?.content || messageBody,
        }),
      });

      await trackMessage({
        userId: recipient,
        callType: 'rcs',
        phoneNumber: recipient,
        label: 'outboundMessage',
        direction: 'outbound',
        event: 'RCS Interaction',
        messageSid: messageData.sid,
      });

      return {
        success: true,
        data: {
          mode: 'rcs',
          message: 'RCS message sent successfully',
          content: messageData,
        },
      };
    }

    // Demo fallback: send as SMS with rich formatting when RCS template SIDs are not configured
    // This simulates what the RCS card would look like in text form
    if (!twilioNumber) {
      return {
        success: false,
        error: 'Missing TWILIO_CONVERSATION_NUMBER for demo SMS fallback',
      };
    }

    // Build clean SMS body (Twilio RCS → SMS fallback format)
    const cardTitle = title || 'Emma · Progressive Claims';
    const emoji = cardEmoji || '📋';
    const replies = quickReplies && quickReplies.length > 0
      ? `\nReply: ${quickReplies.join(' | ')}`
      : '';

    const smsBody = `${emoji} ${cardTitle}\n\n${messageBody}${replies}\n\n— Emma, Assured × Progressive\nPowered by Twilio`;

    const messageData = await twilioClient.messages.create({
      to: recipient,
      from: twilioNumber,
      body: smsBody,
    });

    await trackMessage({
      userId: recipient,
      callType: 'sms',
      phoneNumber: recipient,
      label: 'outboundMessage',
      direction: 'outbound',
      event: 'RCS Fallback SMS',
      messageSid: messageData.sid,
    });

    return {
      success: true,
      data: {
        mode: 'rcs_sms_fallback',
        title: cardTitle,
        body: messageBody,
        cardEmoji: emoji,
        quickReplies: quickReplies || [],
        messageSid: messageData.sid,
        message: 'RCS card sent (SMS fallback for unsupported devices)',
      },
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err) || 'Failed to send RCS';
    return { success: false, error: errorMessage };
  }
}
