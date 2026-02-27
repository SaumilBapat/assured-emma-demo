// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';

export type SendToLiveAgentParams = {
  callSid: string;
  reason?: string;
  reasonCode?: string;
  conversationSummary?: string;
};

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  try {
    const { callSid, reason, reasonCode, conversationSummary } =
      args as SendToLiveAgentParams;

    if (!callSid) {
      throw new Error('Call SID is required for live agent handoff');
    }

    // Return the handoff data that will be used by the WebSocket to trigger the handoff
    // Note: targetWorker will be added by the conversation relay from stored configuration
    return {
      success: true,
      data: {
        callSid,
        reason: reason || 'Customer requested live agent',
        reasonCode: reasonCode || 'CUSTOMER_REQUEST',
        conversationSummary: conversationSummary || 'No summary provided',
      },
    };
  } catch (err) {
    let errorMessage = 'Failed to transfer to live agent';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}