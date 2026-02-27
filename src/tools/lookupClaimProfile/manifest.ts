import { ToolManifest } from '../../lib/types';

export const lookupClaimProfileManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'lookupClaimProfile',
    description: 'Look up a claimant profile and active claim details by phone number. Returns the claimant name, policy number, claim number, carrier, vehicle, incident details, assigned adjuster, claim status, TCPA consent status, and prior interaction history. Call this at the start of every conversation.',
    parameters: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          description: "The claimant's phone number in E.164 format (e.g. +14155551234)",
        },
      },
      required: ['phoneNumber'],
    },
  },
};
