import { ToolManifest } from '../../lib/types';

export const postSegmentTrackManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'postSegmentTrack',
    description: 'Track event in Segment',
    parameters: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          description: 'Phone number to track for'
        },
        event: {
          type: 'string',
          description: 'Event name to track'
        },
        properties: {
          type: 'object',
          description: 'Event properties'
        }
      },
      required: ['phone', 'event']
    }
  }
};