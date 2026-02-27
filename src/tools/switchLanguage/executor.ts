import { SwitchLanguageParams, ToolResult } from '../../lib/types';
import {
  LANGUAGE_CODE_MAP,
  isLanguageSupported,
  getLanguageLabel,
} from '../../lib/config/languages';

export async function execute(
  args: Record<string, any>,
  toolData: any
): Promise<ToolResult> {
  try {
    const { ttsLanguage, transcriptionLanguage } = args as SwitchLanguageParams;

    if (!ttsLanguage || !transcriptionLanguage) {
      return {
        success: false,
        error: 'Both ttsLanguage and transcriptionLanguage are required',
      };
    }

    // Normalize language codes
    const normalizedTtsLanguage = LANGUAGE_CODE_MAP[ttsLanguage] || ttsLanguage;
    const normalizedTranscriptionLanguage =
      LANGUAGE_CODE_MAP[transcriptionLanguage] || transcriptionLanguage;

    // Validate language codes using centralized configuration
    if (!isLanguageSupported(normalizedTtsLanguage)) {
      return {
        success: false,
        error: `Unsupported TTS language: ${normalizedTtsLanguage}. Supported languages: ${Object.keys(
          LANGUAGE_CODE_MAP
        ).join(', ')}`,
      };
    }

    if (!isLanguageSupported(normalizedTranscriptionLanguage)) {
      return {
        success: false,
        error: `Unsupported transcription language: ${normalizedTranscriptionLanguage}. Supported languages: ${Object.keys(
          LANGUAGE_CODE_MAP
        ).join(', ')}`,
      };
    }

    // Warn if languages don't match (AI might not understand speech in target language)
    const warning =
      normalizedTtsLanguage !== normalizedTranscriptionLanguage
        ? `Warning: TTS language (${normalizedTtsLanguage}) differs from transcription language (${normalizedTranscriptionLanguage}). The AI may not understand speech in the target language.`
        : null;

    // Return success with language data - the actual emission will be handled by the LLM service
    return {
      success: true,
      data: {
        message: `Language switched to ${getLanguageLabel(
          normalizedTranscriptionLanguage
        )}`,
        ttsLanguage: normalizedTtsLanguage,
        transcriptionLanguage: normalizedTranscriptionLanguage,
        warning,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to switch language',
    };
  }
}