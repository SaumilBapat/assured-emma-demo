// External npm packages
import axios from 'axios';

// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';
import { sendToWebhook } from '../../lib/utils/webhook';

export interface SegmentProfile {
  traits: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
}

export type GetSegmentProfileParams = {
  phone: string;
};

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  const {
    segmentWriteKey: segmentWriteKeyEnv,
  } = process.env;

  // For Segment Profile, we need space and token
  // These would typically come from environment or toolData
  const spaceProfile = process.env.SEGMENT_SPACE;
  const tokenProfile = process.env.SEGMENT_TOKEN;

  return {
    spaceProfile,
    tokenProfile,
    segmentWriteKey: toolData?.segmentWriteKey || segmentWriteKeyEnv,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { phone } = args as GetSegmentProfileParams;
  const { spaceProfile, tokenProfile } = getToolEnvData(toolData);
  
  // Ensure phone number has + prefix for Segment API
  const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

  try {
    if (!spaceProfile) {
      throw new Error(
        `Missing Segment Space. Please provide SEGMENT_SPACE in environment`
      );
    }

    if (!tokenProfile) {
      throw new Error(
        `Missing Segment Token. Please provide SEGMENT_TOKEN in environment`
      );
    }

    const encodedPhone = encodeURIComponent(formattedPhone);
    const URL = `https://profiles.segment.com/v1/spaces/${spaceProfile}/collections/users/profiles/phone:${encodedPhone}/traits?limit=200`;
    const response = await axios.get<{ traits: SegmentProfile['traits'] }>(
      URL,
      {
        auth: {
          username: tokenProfile,
          password: '',
        },
      }
    );

    const customerData = response.data.traits;

    await sendToWebhook(
      {
        sender: 'system:customer_profile',
        type: 'JSON',
        message: JSON.stringify({ customerData: customerData }),
        phoneNumber: formattedPhone,
      },
      process.env.WEBHOOK_URL
    ).catch((err) => console.error('Failed to send to webhook:', err));

    return {
      success: true,
      data: customerData,
    };
  } catch (err) {
    let errorMessage = 'Failed to get Segment record';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}