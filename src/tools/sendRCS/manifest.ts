import { ToolManifest } from '../../lib/types';

export const sendRCSManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'sendRCS',
    description: 'Send a rich RCS card to the caller with dynamic content based on what they asked about. Use this to send claim summaries, inspection details, payment info, document requests, or any follow-up info during or after the call. Twilio will fall back to SMS automatically if the device does not support RCS.',
    parameters: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Phone number to send to (the caller)'
        },
        title: {
          type: 'string',
          description: 'Short card title, e.g. "Inspection Scheduled", "Claim Summary", "Document Request"'
        },
        message: {
          type: 'string',
          description: 'Main card body text — the key info the user asked about'
        },
        cardEmoji: {
          type: 'string',
          description: 'Single emoji that represents the card topic, e.g. 📋 for claim, 🔧 for repair, 📅 for schedule, 💰 for payment, 📸 for photos'
        },
        quickReplies: {
          type: 'array',
          items: { type: 'string' },
          description: 'Up to 3 quick reply button labels relevant to the topic, e.g. ["View Details", "Call Adjuster", "OK"]'
        }
      },
      required: ['to', 'title', 'message']
    }
  }
};