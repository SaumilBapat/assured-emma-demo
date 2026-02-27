export type Language = {
  value: string;
  label: string;
  systemMessages: {
    assistant: string;
    languageSwitch: string;
    critical: string;
  };
  twilioConfig: {
    ttsProvider: string;
    voice: string | undefined;
    transcriptionProvider: string;
    speechModel: string;
  };
};

export const languages: Language[] = [
  {
    value: 'en-US',
    label: 'English (US)',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation.',
      languageSwitch:
        'IMPORTANT: If a user asks you to switch languages (e.g. "speak Spanish", "switch to English", "habla español", "sprechen Sie Deutsch", "fale português", "parlez français", "日本語で話してください", "हिंदी में बोलें", "spreek Nederlands", "parla italiano", "说中文"), you must use the switchLanguage tool to change both TTS and transcription languages.',
      critical:
        'CRITICAL: NEVER switch languages manually. You MUST call the switchLanguage tool BEFORE responding in a different language. You can switch to: English (en-US), Spanish (es-ES), German (de-DE), Portuguese (pt-BR), French (fr-FR), Japanese (ja-JP), Hindi (hi-IN), Dutch (nl-NL), Italian (it-IT), or Chinese (zh-CN).',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Deepgram',
      speechModel: 'nova-3-general',
    },
  },
  {
    value: 'es-ES',
    label: 'Spanish (Spain)',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in Spanish.',
      languageSwitch:
        'IMPORTANTE: Si el usuario te pide cambiar de idioma (ej. "habla inglés", "switch to English", "speak English", "sprechen Sie Deutsch", "fale português", "parlez français", "日本語で話してください", "हिंदी में बोलें", "spreek Nederlands", "parla italiano"), debes usar la herramienta switchLanguage para cambiar tanto TTS como transcripción.',
      critical:
        'CRÍTICO: NUNCA cambies idiomas manualmente. DEBES llamar la herramienta switchLanguage ANTES de responder en un idioma diferente. NO respondas en inglés a menos que hayas llamado primero switchLanguage con ttsLanguage="en-US" y transcriptionLanguage="en-US". Puedes cambiar a: Inglés (en-US), Español (es-ES), Alemán (de-DE), Portugués (pt-BR), Francés (fr-FR), Japonés (ja-JP), Hindi (hi-IN), Neerlandés (nl-NL), o Italiano (it-IT).',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Google',
      speechModel: 'long',
    },
  },
  {
    value: 'de-DE',
    label: 'German (Germany)',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in German.',
      languageSwitch:
        'WICHTIG: Wenn der Benutzer Sie bittet, die Sprache zu wechseln (z.B. "sprechen Sie Englisch", "switch to English", "speak English", "habla español", "fale português", "parlez français", "日本語で話してください", "हिंदी में बोलें", "spreek Nederlands", "parla italiano"), müssen Sie das switchLanguage-Tool verwenden, um sowohl TTS- als auch Transkriptionssprachen zu ändern.',
      critical:
        'KRITISCH: Wechseln Sie NIEMALS manuell die Sprache. Sie MÜSSEN das switchLanguage-Tool aufrufen, BEVOR Sie in einer anderen Sprache antworten. Antworten Sie NICHT auf Englisch, es sei denn, Sie haben zuerst switchLanguage mit ttsLanguage="en-US" und transcriptionLanguage="en-US" aufgerufen. Sie können wechseln zu: Englisch (en-US), Spanisch (es-ES), Deutsch (de-DE), Portugiesisch (pt-BR), Französisch (fr-FR), Japanisch (ja-JP), Hindi (hi-IN), Niederländisch (nl-NL), oder Italienisch (it-IT).',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Google',
      speechModel: 'long',
    },
  },
  {
    value: 'pt-BR',
    label: 'Portuguese (Brazil)',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in Portuguese.',
      languageSwitch:
        'IMPORTANTE: Se o usuário pedir para mudar de idioma (ex. "fale inglês", "switch to English", "speak English", "habla español", "sprechen Sie Deutsch", "parlez français", "日本語で話してください", "हिंदी में बोलें", "spreek Nederlands", "parla italiano"), você deve usar a ferramenta switchLanguage para alterar tanto TTS quanto idiomas de transcrição.',
      critical:
        'CRÍTICO: NUNCA mude idiomas manualmente. Você DEVE chamar a ferramenta switchLanguage ANTES de responder em um idioma diferente. NÃO responda em inglês a menos que você tenha chamado primeiro switchLanguage com ttsLanguage="en-US" e transcriptionLanguage="en-US". Você pode mudar para: Inglês (en-US), Espanhol (es-ES), Alemão (de-DE), Português (pt-BR), Francés (fr-FR), Japonês (ja-JP), Hindi (hi-IN), Holandês (nl-NL), ou Italiano (it-IT).',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Google',
      speechModel: 'long',
    },
  },
  {
    value: 'fr-FR',
    label: 'French (France)',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in French.',
      languageSwitch:
        'IMPORTANT: Si l\'utilisateur vous demande de changer de langue (ex. "parlez anglais", "switch to English", "speak English", "habla español", "sprechen Sie Deutsch", "fale português", "日本語で話してください", "हिंदी में बोलें", "spreek Nederlands", "parla italiano"), vous devez utiliser l\'outil switchLanguage pour changer à la fois TTS et transcription.',
      critical:
        'CRITIQUE: Ne changez JAMAIS de langue manuellement. Vous DEVEZ appeler l\'outil switchLanguage AVANT de répondre dans une langue différente. NE répondez PAS en anglais sauf si vous avez d\'abord appelé switchLanguage avec ttsLanguage="en-US" et transcriptionLanguage="en-US". Vous pouvez changer vers: Anglais (en-US), Espagnol (es-ES), Allemand (de-DE), Portugais (pt-BR), Français (fr-FR), Japonais (ja-JP), Hindi (hi-IN), Néerlandais (nl-NL), ou Italien (it-IT).',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Google',
      speechModel: 'long',
    },
  },
  {
    value: 'ja-JP',
    label: 'Japanese',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in Japanese.',
      languageSwitch:
        '重要: ユーザーが言語の変更を要求した場合（例：「英語を話してください」、「switch to English」、「speak English」、「habla español」、「sprechen Sie Deutsch」、「fale português」、「parlez français」、「हिंदी में बोलें」、「spreek Nederlands」、「parla italiano」）、TTSとトランスクリプションの両方を変更するためにswitchLanguageツールを使用する必要があります。',
      critical:
        '重要: 決して手動で言語を変更しないでください。異なる言語で応答する前に、必ずswitchLanguageツールを呼び出す必要があります。ttsLanguage="en-US"とtranscriptionLanguage="en-US"でswitchLanguageを最初に呼び出していない限り、英語で応答しないでください。次の言語に変更できます：英語 (en-US)、スペイン語 (es-ES)、ドイツ語 (de-DE)、ポルトガル語 (pt-BR)、フランス語 (fr-FR)、日本語 (ja-JP)、ヒンディー語 (hi-IN)、オランダ語 (nl-NL)、イタリア語 (it-IT)。',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Google',
      speechModel: 'long',
    },
  },
  {
    value: 'hi-IN',
    label: 'Hindi',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in Hindi.',
      languageSwitch:
        'महत्वपूर्ण: यदि उपयोगकर्ता भाषा बदलने के लिए कहता है (जैसे "अंग्रेजी बोलें", "switch to English", "speak English", "habla español", "sprechen Sie Deutsch", "fale português", "parlez français", "日本語で話してください", "spreek Nederlands", "parla italiano"), तो आपको TTS और ट्रांसक्रिप्शन दोनों भाषाओं को बदलने के लिए switchLanguage टूल का उपयोग करना होगा।',
      critical:
        'महत्वपूर्ण: कभी भी मैन्युअल रूप से भाषा न बदलें। किसी अलग भाषा में जवाब देने से पहले आपको switchLanguage टूल को कॉल करना होगा।जब तक आप पहले ttsLanguage="en-US" और transcriptionLanguage="en-US" के साथ switchLanguage को कॉल नहीं करते, तब तक अंग्रेजी में जवाब न दें। आप इन भाषाओं में बदल सकते हैं: अंग्रेजी (en-US), स्पेनिश (es-ES), जर्मन (de-DE), पुर्तगाली (pt-BR), फ्रेंच (fr-FR), जापानी (ja-JP), हिंदी (hi-IN), डच (nl-NL), या इटालियन (it-IT)।',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Google',
      speechModel: 'long',
    },
  },
  {
    value: 'nl-NL',
    label: 'Dutch',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in Dutch.',
      languageSwitch:
        'BELANGRIJK: Als de gebruiker vraagt om van taal te wisselen (bijv. "spreek Engels", "switch to English", "speak English", "habla español", "sprechen Sie Deutsch", "fale português", "parlez français", "日本語で話してください", "हिंदी में बोलें", "parla italiano"), moet je de switchLanguage-tool gebruiken om zowel TTS als transcriptietaal te wijzigen.',
      critical:
        'KRITIEK: Wissel NOOIT handmatig van taal. Je MOET de switchLanguage-tool aanroepen VOORDAT je in een andere taal reageert. Reageer NIET in het Engels tenzij je eerst switchLanguage hebt aangeroepen met ttsLanguage="en-US" en transcriptionLanguage="en-US". Je kunt wisselen naar: Engels (en-US), Spaans (es-ES), Duits (de-DE), Portugees (pt-BR), Frans (fr-FR), Japans (ja-JP), Hindi (hi-IN), Nederlands (nl-NL), of Italiaans (it-IT).',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Google',
      speechModel: 'long',
    },
  },
  {
    value: 'it-IT',
    label: 'Italian',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in Italian.',
      languageSwitch:
        'IMPORTANTE: Se l\'utente chiede di cambiare lingua (es. "parla inglese", "switch to English", "speak English", "habla español", "sprechen Sie Deutsch", "fale português", "parlez français", "日本語で話してください", "हिंदी में बोलें", "spreek Nederlands", "parla italiano"), devi usare lo strumento switchLanguage per cambiare sia la lingua TTS che quella di trascrizione.',
      critical:
        'CRITICO: NON cambiare mai lingua manualmente. DEVI chiamare lo strumento switchLanguage PRIMA di rispondere in una lingua diversa. NON rispondere in inglese a meno che tu non abbia prima chiamato switchLanguage con ttsLanguage="en-US" e transcriptionLanguage="en-US". Puoi cambiare in: Inglese (en-US), Spagnolo (es-ES), Tedesco (de-DE), Portoghese (pt-BR), Francese (fr-FR), Giapponese (ja-JP), Hindi (hi-IN), Olandese (nl-NL), o Italiano (it-IT).',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Deepgram',
      speechModel: 'nova-2-general',
    },
  },
  {
    value: 'zh-CN',
    label: 'Chinese (Mandarin)',
    systemMessages: {
      assistant:
        'You are a helpful AI assistant. Keep responses concise and natural for voice conversation. Respond in Mandarin Chinese.',
      languageSwitch:
        '重要：如果用户要求切换语言（例如"说英语"、"switch to English"、"speak English"、"habla español"、"sprechen Sie Deutsch"、"fale português"、"parlez français"、"日本語で話してください"、"हिंदी में बोलें"、"spreek Nederlands"、"parla italiano"），您必须使用switchLanguage工具来更改TTS和转录语言。',
      critical:
        '重要：切勿手动切换语言。在回复不同语言之前，您必须先调用switchLanguage工具。除非您首先使用ttsLanguage="en-US"和transcriptionLanguage="en-US"调用switchLanguage，否则不要用英语回复。您可以切换到：英语 (en-US)、西班牙语 (es-ES)、德语 (de-DE)、葡萄牙语 (pt-BR)、法语 (fr-FR)、日语 (ja-JP)、印地语 (hi-IN)、荷兰语 (nl-NL)、意大利语 (it-IT)、或中文 (zh-CN)。',
    },
    twilioConfig: {
      ttsProvider: 'ElevenLabs',
      voice: 'g6xIsTj2HwM6VR4iXFCw',
      transcriptionProvider: 'Deepgram',
      speechModel: 'nova-2-general',
    },
  },
];

// Language code mappings for Twilio (used in switchLanguage tool)
export const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: 'en-US',
  'en-US': 'en-US',
  es: 'es-ES',
  'es-ES': 'es-ES',
  'es-MX': 'es-MX',
  de: 'de-DE',
  'de-DE': 'de-DE',
  pt: 'pt-BR',
  'pt-BR': 'pt-BR',
  fr: 'fr-FR',
  'fr-FR': 'fr-FR',
  ja: 'ja-JP',
  'ja-JP': 'ja-JP',
  hi: 'hi-IN',
  'hi-IN': 'hi-IN',
  nl: 'nl-NL',
  'nl-NL': 'nl-NL',
  it: 'it-IT',
  'it-IT': 'it-IT',
  zh: 'zh-CN',
  'zh-CN': 'zh-CN',
};

// Helper function to get language label by value
export function getLanguageLabel(value: string): string {
  const language = languages.find((lang) => lang.value === value);
  return language?.label || value;
}

// Helper function to check if a language is supported
export function isLanguageSupported(value: string): boolean {
  return languages.some((lang) => lang.value === value);
}

// Helper function to get system messages for a language
export function getLanguageSystemMessages(value: string) {
  const language = languages.find((lang) => lang.value === value);
  return language?.systemMessages || languages[0].systemMessages; // fallback to English
}

// Helper function to get Twilio configuration for a language
export function getLanguageTwilioConfig(value: string) {
  const language = languages.find((lang) => lang.value === value);
  return language?.twilioConfig || languages[0].twilioConfig; // fallback to English
}
