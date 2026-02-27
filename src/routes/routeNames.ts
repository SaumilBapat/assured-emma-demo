export const routeNames = {
  call: 'call',
  conversationRelay: 'conversation-relay',
  liveAgent: 'live-agent',
  sms: 'text',
  outboundCall: 'outbound-call',
  stats: 'stats',
  activeNumbers: 'active-numbers',
  outboundMessage: 'outbound-message',
  liveNumbers: 'live-numbers',
} as const;

export type RouteNames = typeof routeNames[keyof typeof routeNames];
