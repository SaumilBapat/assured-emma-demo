import axios from 'axios';
import { log } from './logger';

export interface WebhookMessage {
  sender: string;
  type: string;
  message: string;
  phoneNumber: string;
}

export async function sendToWebhook(
  message: WebhookMessage,
  webhookUrl?: string
): Promise<void> {
  if (!webhookUrl) {
    // log.warn({
    //   label: 'webhook',
    //   message: 'No webhook URL provided, skipping webhook send',
    // });
    return;
  }

  try {
    await axios.post(webhookUrl, message, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    
    log.info({
      label: 'webhook',
      message: 'Successfully sent to webhook',
      data: { sender: message.sender, type: message.type },
    });
  } catch (error: any) {
    log.error({
      label: 'webhook',
      message: 'Failed to send to webhook',
      data: {
        error: error.message,
        url: webhookUrl,
        sender: message.sender,
      },
    });
    throw error;
  }
}
