import { ToolManifest } from '../../lib/types';

export const checkTcpaComplianceManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'checkTcpaCompliance',
    description:
      'Analyze a message for TCPA opt-out intent and enforce compliance. Call this immediately when any inbound message contains opt-out language — including but not limited to: "stop", "quit", "unsubscribe", "leave me alone", "stop bothering me", "I\'m done", "no more messages", "remove me", or any expression of intent to stop receiving communications. This suspends all outbound communication across SMS, RCS, and voice, and queues the contact for human compliance review.',
    parameters: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          description: "The claimant's phone number",
        },
        messageText: {
          type: 'string',
          description: 'The full message text to analyze for opt-out intent',
        },
        channel: {
          type: 'string',
          description: 'Channel where the message was received',
          enum: ['sms', 'rcs', 'voice'],
        },
      },
      required: ['phoneNumber', 'messageText', 'channel'],
    },
  },
};
