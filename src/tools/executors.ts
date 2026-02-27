import { execute as sendTextExecute } from './sendText/executor';
import { execute as sendRCSExecute } from './sendRCS/executor';
import { execute as sendEmailExecute } from './sendEmail/executor';
import { execute as getSegmentProfileExecute } from './getSegmentProfile/executor';
import { execute as getSegmentEventsExecute } from './getSegmentEvents/executor';
import { execute as updateSegmentProfileExecute } from './updateSegmentProfile/executor';
import { execute as postSegmentTrackExecute } from './postSegmentTrack/executor';
import { execute as getAirtableDataExecute } from './getAirtableData/executor';
import { execute as upsertAirtableDataExecute } from './upsertAirtableData/executor';
import { execute as sendToLiveAgentExecute } from './sendToLiveAgent/executor';
import { execute as switchLanguageExecute } from './switchLanguage/executor';
import { ToolExecutorParams, ToolResult } from '../lib/types';

export async function executeTool(params: ToolExecutorParams): Promise<ToolResult> {
  const { currentToolName, args, toolData, webhookUrl } = params;
  
  try {
    switch (currentToolName) {
      case 'sendText':
        return await sendTextExecute(args, toolData);
      case 'sendRCS':
        return await sendRCSExecute(args, toolData);
      case 'sendEmail':
        return await sendEmailExecute(args, toolData);
      case 'getSegmentProfile':
        return await getSegmentProfileExecute(args, toolData);
      case 'getSegmentEvents':
        return await getSegmentEventsExecute(args, toolData);
      case 'updateSegmentProfile':
        return await updateSegmentProfileExecute(args, toolData);
      case 'postSegmentTrack':
        return await postSegmentTrackExecute(args, toolData);
      case 'getAirtableData':
        return await getAirtableDataExecute(args, toolData);
      case 'upsertAirtableData':
        return await upsertAirtableDataExecute(args, toolData);
      case 'sendToLiveAgent':
        return await sendToLiveAgentExecute(args, toolData);
      case 'switchLanguage':
        return await switchLanguageExecute(args, toolData);
      default:
        return {
          success: false,
          error: `Unknown tool: ${currentToolName}`,
        };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Tool execution failed',
    };
  }
}
