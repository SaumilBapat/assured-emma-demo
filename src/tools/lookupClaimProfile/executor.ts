import { ToolResult, LocalTemplateData } from '../../lib/types';

export type LookupClaimProfileParams = {
  phoneNumber: string;
};

/**
 * Demo executor — returns a hardcoded Jordan Kim claim profile.
 * In production this would query Airtable, a claims management system, or a carrier API.
 */
export async function execute(
  args: Record<string, unknown>,
  _toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { phoneNumber } = args as LookupClaimProfileParams;

  if (!phoneNumber) {
    return { success: false, error: 'phoneNumber is required' };
  }

  // Demo: always return Jordan Kim's profile regardless of number
  // In production: query your CRM / claims system by phoneNumber
  return {
    success: true,
    data: {
      found: true,
      claimant: {
        name: 'Jordan Kim',
        firstName: 'Jordan',
        phone: phoneNumber,
        email: 'jordan.kim@email.com',
        preferredLanguage: 'en-US',
      },
      claim: {
        claimNumber: 'CLM-2026-00847',
        policyNumber: 'PRG-444-7821-KIM',
        carrier: 'Progressive Insurance',
        status: 'FNOL Received — Inspection Scheduled',
        dateOpened: '2026-02-25',
        dateOfLoss: '2026-02-25',
        timeOfLoss: '4:30 PM PST',
        incidentType: 'Auto — Rear-End Collision',
        incidentLocation: 'Market St & Van Ness Ave, San Francisco, CA 94102',
        vehicle: '2023 Honda Accord Silver — CA plate 7TRK482',
        damageAreas: ['Rear bumper', 'Trunk lid'],
        drivable: true,
        injuries: 'None reported',
        otherParty: 'John Davis — State Farm (claim in process)',
        estimatedDamage: 'Pending inspection',
        adjusterName: 'Sarah Chen',
        adjusterPhone: process.env.DEMO_ADJUSTER_PHONE || '+15005550006',
        adjusterEmail: 'sarah.chen@progressive.com',
        nextStep: 'Vehicle inspection scheduled for March 3, 2026 at 10:00 AM — Caliber Collision, 450 8th St, San Francisco',
        photoUploadLink: 'https://claims.assured.com/photos/CLM-2026-00847',
      },
      tcpa: {
        consentStatus: 'PEWC on file',
        consentDate: '2026-01-14',
        optOutStatus: 'active',
        channelsAllowed: ['sms', 'rcs', 'voice'],
      },
      priorInteractions: [
        {
          channel: 'rcs',
          date: '2026-02-27T09:15:00Z',
          summary: 'Proactive RCS outreach sent — Jordan tapped "Start Claim" quick reply and completed FNOL form',
        },
      ],
    },
  };
}
