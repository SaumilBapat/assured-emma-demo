import { ToolManifest } from '../../lib/types';

export const sendEmailManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'sendEmail',
    description: 'Send email via SendGrid',
    parameters: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Email address to send to'
        },
        subject: {
          type: 'string',
          description: 'Email subject'
        },
        content: {
          type: 'string',
          description: 'Email content'
        },
        contentVariables: {
          type: 'object',
          description: 'Template variables for SendGrid'
        }
      },
      required: ['to', 'subject']
    }
  }
};