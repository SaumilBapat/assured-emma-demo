import { ToolManifest } from '../../lib/types';

export const getAirtableDataManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'getAirtableData',
    description: 'Get data from Airtable',
    parameters: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          description: 'Phone number to look up'
        }
      },
      required: ['phoneNumber']
    }
  }
};