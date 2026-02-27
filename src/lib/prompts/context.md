# System Context — Assured × Twilio Demo

## Platform
- **Product**: Emma by Assured — Agentic AI for Insurance Claims
- **Powered by**: Twilio ConversationRelay (Voice AI) + Twilio Programmable Messaging (SMS/RCS) + Twilio Conversational Intelligence
- **Deployed for**: Progressive Insurance (this demo)
- **Version**: Emma 2.4.1

## Twilio Products Active in This Demo
- **ConversationRelay** — Real-time bidirectional voice AI with ElevenLabs TTS + Deepgram STT
- **Programmable Messaging** — SMS follow-ups and bidirectional text conversations
- **RCS (Rich Communication Services)** — Rich claim cards with quick-reply buttons, images, and structured data
- **Conversational Intelligence** — Automatic intent detection, sentiment scoring, and entity extraction on every interaction
- **TCPA Compliance Toolkit** — Opt-out intent detection across all channels with cross-channel propagation

## Demo Claimant Profile — Jordan Kim
- **Name**: Jordan Kim
- **Phone**: (the inbound caller/texter's phone number)
- **Email**: jordan.kim@email.com
- **Claim #**: CLM-2026-00847
- **Policy #**: PRG-444-7821-KIM
- **Carrier**: Progressive Insurance
- **Vehicle**: 2023 Honda Accord Silver — CA plate 7TRK482
- **Incident**: Rear-ended at stoplight at Market St & Van Ness Ave, San Francisco, CA
- **Date of Loss**: February 25, 2026 at approximately 4:30 PM
- **Damage**: Rear bumper, trunk damage — drivable
- **Injuries**: None reported
- **Other party**: John Davis, insured by State Farm (claim in progress)
- **Assigned Adjuster**: Sarah Chen, sarah.chen@progressive.com
- **Status**: FNOL Received — Inspection Scheduled for March 3, 2026
- **Prior channel**: Jordan initiated FNOL via RCS quick reply on Feb 27, 2026

## Conversational Intelligence Context
When Twilio Conversational Intelligence analyzes this call, it will extract:
- **Intent**: Auto claim status inquiry, FNOL continuation
- **Sentiment**: Mildly stressed → improving as Emma resolves issues
- **Entities**: Claim number, policy number, vehicle details, date of loss
- **Key moments**: Injury flag (none), escalation trigger (if sentiment drops), opt-out detection

## TCPA Compliance Rules
- Assured operates under TCPA regulations across all 50 states
- Opt-out requires **intent detection** — not just literal "STOP"
- Cross-channel propagation: opt-out on any channel blocks SMS, RCS, and outbound voice
- All contacts require Prior Express Written Consent (PEWC) on file
- Violation cost: $500–$1,500 per message × scale = existential liability
- Human review required for all opt-outs within 24 hours

## Operational Notes
- All conversations are recorded and analyzed by Conversational Intelligence
- Airtable is used as the demo CRM (claim records stored there)
- All messages tracked to Segment for cross-channel journey analytics
- Safety limit: 300 messages per session
- Conversation TTL: 60 minutes (SMS/RCS), 30 minutes (voice)
