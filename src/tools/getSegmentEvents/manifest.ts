import { ToolManifest } from '../../lib/types';

export const getSegmentEventsManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'getSegmentEvents',
    description: 'Get Segment user events',
    parameters: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          description: 'Phone number to look up events for'
        }
      },
      required: ['phone']
    }
  }
};