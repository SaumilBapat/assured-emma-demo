import { EventEmitter } from 'node:events';

export interface Store {
  context: Record<string, any>;
  msgs: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export interface LLMEvents {
  text: (chunk: string, isFinal: boolean, fullText?: string) => void;
  handoff: (data: any) => void;
  language: (data: any) => void;
}

export class TypedEventEmitter<T> extends EventEmitter {
  on<K extends keyof T>(event: K, listener: T[K] extends (...args: any[]) => any ? T[K] : never): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  on(event: any, listener: any): this {
    return super.on(event, listener);
  }

  emit<K extends keyof T>(event: K, ...args: T[K] extends (...args: infer P) => any ? P : never[]): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
  emit(event: any, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }
}

export interface LocalTemplateData {
  instructions: string;
  context: string;
  webhookUrl?: string;
  toolData: {
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioPhoneNumber?: string;
    segmentWriteKey?: string;
    segmentWorkspace?: string;
    airtableApiKey?: string;
    airtableBaseId?: string;
    emailApiKey?: string;
    emailFromAddress?: string;
    [key: string]: any;
  };
}

export interface ToolManifest {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required: string[];
    };
  };
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface SwitchLanguageParams {
  ttsLanguage: string;
  transcriptionLanguage: string;
}

export interface ToolExecutorParams {
  currentToolName: string;
  args: any;
  toolData: LocalTemplateData['toolData'];
  webhookUrl?: string;
}
