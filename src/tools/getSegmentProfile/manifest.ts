import { ToolManifest } from '../../lib/types';

export const getSegmentProfileManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'getSegmentProfile',
    description: 'Get Segment user profile',
    parameters: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          description: 'Phone number to look up'
        }
      },
      required: ['phone']
    }
  }
};