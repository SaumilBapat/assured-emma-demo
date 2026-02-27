import { ToolManifest } from '../../lib/types';

export const updateSegmentProfileManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'updateSegmentProfile',
    description: 'Update Segment user profile traits',
    parameters: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          description: 'Phone number to update'
        },
        traits: {
          type: 'object',
          description: 'Traits to update'
        }
      },
      required: ['phone']
    }
  }
};