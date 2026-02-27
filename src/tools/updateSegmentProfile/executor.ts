// External npm packages
import axios from 'axios';

// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';
import { sendToWebhook } from '../../lib/utils/webhook';

export type UpdateSegmentProfileParams = {
  phone: string;
  traits: Record<string, any>;
};

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  const {
    segmentWriteKey: segmentWriteKeyEnv,
  } = process.env;

  return {
    segmentWriteKeyUpdate: toolData?.segmentWriteKey || segmentWriteKeyEnv,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { phone, traits, ...otherArgs } = args as UpdateSegmentProfileParams &
    Record<string, any>;
  const { segmentWriteKeyUpdate } = getToolEnvData(toolData);

  try {
    if (!segmentWriteKeyUpdate) {
      throw new Error(
        `Missing Segment Write Key. Please provide SEGMENT_WRITE_KEY in environment`
      );
    }

    if (!phone) {
      throw new Error('Phone number is required');
    }

    // Extract traits - either from traits object or from other arguments
    const traitsToUpdate = traits || otherArgs;

    if (!traitsToUpdate || Object.keys(traitsToUpdate).length === 0) {
      throw new Error('At least one trait must be provided');
    }

    // Create the identify payload for Segment
    const identifyPayload = {
      userId: phone,
      traits: {
        ...traitsToUpdate,
        phone: phone,
      },
    };

    // Send identify call to Segment
    const response = await axios.post(
      'https://api.segment.io/v1/identify',
      identifyPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            segmentWriteKeyUpdate + ':'
          ).toString('base64')}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Segment API returned status ${response.status}`);
    }

    await sendToWebhook(
      {
        sender: 'system:update_segment_profile',
        type: 'JSON',
        message: JSON.stringify({
          phone: phone,
          updatedTraits: traitsToUpdate,
          success: true,
        }),
        phoneNumber: phone,
      },
      process.env.WEBHOOK_URL
    ).catch((err) => console.error('Failed to send to webhook:', err));

    return {
      success: true,
      data: {
        message: 'Profile traits updated successfully',
        phone: phone,
        updatedTraits: traitsToUpdate,
      },
    };
  } catch (err) {
    let errorMessage = 'Failed to update Segment profile';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}