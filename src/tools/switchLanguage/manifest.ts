import { ToolManifest } from '../../lib/types';

export const switchLanguageManifest: ToolManifest = {
  type: 'function',
  function: {
    name: 'switchLanguage',
    description: 'Switch conversation language for both TTS and transcription',
    parameters: {
      type: 'object',
      properties: {
        ttsLanguage: {
          type: 'string',
          description: 'Target language code for text-to-speech',
          enum: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN']
        },
        transcriptionLanguage: {
          type: 'string',
          description: 'Target language code for speech transcription',
          enum: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN']
        }
      },
      required: ['ttsLanguage', 'transcriptionLanguage']
    }
  }
};