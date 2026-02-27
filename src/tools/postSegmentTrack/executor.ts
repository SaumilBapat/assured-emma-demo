// External npm packages
import axios from 'axios';

// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';
import { sendToWebhook } from '../../lib/utils/webhook';

export type PostSegmentTrackParams = {
  phone: string;
  event: string;
  properties?: Record<string, any>;
};

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  const {
    segmentWriteKey: segmentWriteKeyEnv,
  } = process.env;

  return {
    segmentWriteKeyTrack: toolData?.segmentWriteKey || segmentWriteKeyEnv,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { phone, event, properties, ...otherArgs } =
    args as PostSegmentTrackParams & Record<string, any>;
  const { segmentWriteKeyTrack } = getToolEnvData(toolData);

  try {
    if (!segmentWriteKeyTrack) {
      throw new Error(
        `Missing Segment Write Key. Please provide SEGMENT_WRITE_KEY in environment`
      );
    }

    if (!phone) {
      throw new Error('Phone number is required');
    }

    if (!event) {
      throw new Error('Event name is required');
    }

    // Extract properties - either from properties object or from other arguments
    const eventProperties = properties || otherArgs;

    // Create the track payload for Segment
    const trackPayload = {
      userId: phone,
      event: event,
      properties: {
        ...(eventProperties || {}),
        phone: phone,
      },
    };

    // Send track call to Segment
    const response = await axios.post(
      'https://api.segment.io/v1/track',
      trackPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            segmentWriteKeyTrack + ':'
          ).toString('base64')}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Segment API returned status ${response.status}`);
    }

    await sendToWebhook(
      {
        sender: 'system:segment_track',
        type: 'JSON',
        message: JSON.stringify({
          phone: phone,
          event: event,
          properties: eventProperties,
          success: true,
        }),
        phoneNumber: phone,
      },
      process.env.WEBHOOK_URL
    ).catch((err) => console.error('Failed to send to webhook:', err));

    return {
      success: true,
      data: {
        message: 'Track event sent successfully',
        phone: phone,
        event: event,
        properties: eventProperties,
      },
    };
  } catch (err) {
    let errorMessage = 'Failed to send Segment track event';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}