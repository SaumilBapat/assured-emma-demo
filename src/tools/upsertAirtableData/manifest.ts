import { ToolManifest } from '../../lib/types';

export const upsertAirtableDataManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'upsertAirtableData',
    description: 'Create or update Airtable record',
    parameters: {
      type: 'object',
      properties: {
        queryField: {
          type: 'string',
          description: 'Field to query by (phone or email)',
          enum: ['phone', 'email']
        },
        queryValue: {
          type: 'string',
          description: 'Value to query for'
        },
        data: {
          type: 'object',
          description: 'Data to insert or update'
        }
      },
      required: ['queryField', 'queryValue', 'data']
    }
  }
};