export const voices = {
  'en-US': 'nova',
  'es-ES': 'nova',
  'fr-FR': 'nova',
  'de-DE': 'nova',
  'it-IT': 'nova',
  'pt-BR': 'nova',
  'ja-JP': 'nova',
  'ko-KR': 'nova',
  'zh-CN': 'nova',
  default: 'nova'
};

export type Voice = typeof voices[keyof typeof voices];
export type Language = keyof typeof voices;
