import { ToolManifest } from '../../lib/types';

export const sendToLiveAgentManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'sendToLiveAgent',
    description: 'Transfer conversation to live agent',
    parameters: {
      type: 'object',
      properties: {
        callSid: {
          type: 'string',
          description: 'Call SID from Twilio'
        },
        reason: {
          type: 'string',
          description: 'Reason for handoff'
        },
        priority: {
          type: 'string',
          description: 'Priority level',
          enum: ['low', 'medium', 'high', 'urgent']
        }
      },
      required: ['callSid', 'reason']
    }
  }
};