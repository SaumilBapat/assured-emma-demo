import { ToolManifest } from '../../lib/types';

export const sendTextManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'sendText',
    description: 'Send SMS text message',
    parameters: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Phone number to send to'
        },
        message: {
          type: 'string',
          description: 'Message content'
        }
      },
      required: ['to', 'message']
    }
  }
};