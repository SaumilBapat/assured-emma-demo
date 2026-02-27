import { ToolResult, LocalTemplateData } from '../../lib/types';

export type CheckTcpaComplianceParams = {
  phoneNumber: string;
  messageText: string;
  channel: 'sms' | 'rcs' | 'voice';
};

// Opt-out intent phrases — matches partial strings, case-insensitive
const OPT_OUT_PATTERNS = [
  'stop',
  'quit',
  'unsubscribe',
  'cancel',
  'remove me',
  'opt out',
  'opt-out',
  "don't contact",
  'do not contact',
  'leave me alone',
  'stop bothering',
  'stop messaging',
  'stop texting',
  "i'm done",
  'no more messages',
  'no more texts',
  "don't text",
  'do not text',
  "don't call",
  'do not call',
  'take me off',
];

/**
 * Detects TCPA opt-out intent in a message and enforces compliance.
 * In production this would call the Twilio Compliance Toolkit API,
 * update the opt-out database, propagate across channels, and
 * queue the contact for human review in your compliance system.
 */
export async function execute(
  args: Record<string, unknown>,
  _toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { phoneNumber, messageText, channel } = args as CheckTcpaComplianceParams;

  if (!phoneNumber || !messageText || !channel) {
    return { success: false, error: 'phoneNumber, messageText, and channel are all required' };
  }

  const lower = messageText.toLowerCase();
  const matchedPhrase = OPT_OUT_PATTERNS.find((phrase) => lower.includes(phrase));
  const optOutDetected = Boolean(matchedPhrase);

  if (optOutDetected) {
    const ticketId = `TCPA-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`;

    // In production:
    // 1. POST to Twilio Compliance Toolkit opt-out endpoint
    // 2. Update your CRM / claims DB opt-out flag for this number
    // 3. Propagate block to Messaging Service (blocks SMS + RCS)
    // 4. Add to DNC (Do Not Contact) list for outbound voice
    // 5. Create compliance review ticket in your workflow tool

    return {
      success: true,
      data: {
        optOutDetected: true,
        matchedPhrase,
        intentConfidence: 0.97,
        detectedOn: channel.toUpperCase(),
        action: 'OPT_OUT_ENFORCED',
        channelsBlocked: ['sms', 'rcs', 'voice'],
        humanReviewQueued: true,
        reviewTicket: ticketId,
        timestamp: new Date().toISOString(),
        summary: `Opt-out intent detected on ${channel.toUpperCase()} for ${phoneNumber}. Matched phrase: "${matchedPhrase}". All outbound communication (SMS, RCS, voice) suspended immediately. Human compliance review queued — ticket ${ticketId}. Do NOT send any further messages to this contact until the review is resolved.`,
      },
    };
  }

  return {
    success: true,
    data: {
      optOutDetected: false,
      intentConfidence: 0.03,
      action: 'NO_ACTION',
      summary: 'No opt-out intent detected. Communication may continue.',
    },
  };
}
