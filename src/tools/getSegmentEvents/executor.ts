// External npm packages
import axios from 'axios';

// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';
import { sendToWebhook } from '../../lib/utils/webhook';

export type GetSegmentEventsParams = {
  phone: string;
};

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  const {
    segmentWriteKey: segmentWriteKeyEnv,
  } = process.env;

  // For Segment Events, we need space and token
  const spaceEvents = process.env.SEGMENT_SPACE;
  const tokenEvents = process.env.SEGMENT_TOKEN;

  return {
    spaceEvents,
    tokenEvents,
    segmentWriteKey: toolData?.segmentWriteKey || segmentWriteKeyEnv,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { phone } = args as GetSegmentEventsParams;
  const { spaceEvents, tokenEvents } = getToolEnvData(toolData);

  try {
    if (!spaceEvents) {
      throw new Error(
        `Missing Segment Space. Please provide SEGMENT_SPACE in environment`
      );
    }

    if (!tokenEvents) {
      throw new Error(
        `Missing Segment Token. Please provide SEGMENT_TOKEN in environment`
      );
    }

    if (!phone) {
      throw new Error('Phone number is required');
    }

    const encodedPhone = encodeURIComponent(phone);
    const URL = `https://profiles.segment.com/v1/spaces/${spaceEvents}/collections/users/profiles/phone:${encodedPhone}/events?limit=50`;
    const response = await axios.get<{ data: any[] }>(URL, {
      auth: {
        username: tokenEvents,
        password: '',
      },
    });
    
    // Function to reduce event objects to only include timestamp, event, and properties
    const reduceEventData = (events: any[]): any[] => {
      return events.map((event) => ({
        timestamp: event.timestamp,
        event: event.event,
        properties: event.properties,
      }));
    };
    let eventsData = reduceEventData(response.data.data);

    await sendToWebhook(
      {
        sender: 'system:customer_events',
        type: 'JSON',
        message: JSON.stringify({ eventsData: eventsData }),
        phoneNumber: phone,
      },
      process.env.WEBHOOK_URL
    ).catch((err) => console.error('Failed to send to webhook:', err));

    return {
      success: true,
      data: eventsData,
    };
  } catch (err) {
    let errorMessage = 'Failed to get Segment events';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}