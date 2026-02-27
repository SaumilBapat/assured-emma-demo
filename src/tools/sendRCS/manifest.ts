import { ToolManifest } from '../../lib/types';

export const sendRCSManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'sendRCS',
    description: 'Send RCS message',
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