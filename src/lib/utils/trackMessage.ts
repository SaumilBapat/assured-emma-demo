// External npm packages
import axios from 'axios';

// Local imports
import { log } from './logger';

export type TrackMessageProps = {
  userId: string;
  callType: 'sms' | 'whatsapp' | 'rcs';
  phoneNumber: string;
  label: string;
  event: string;
  direction: 'inbound' | 'outbound';
  messageSid?: string;
};

export const trackMessage = async ({
  userId,
  callType,
  phoneNumber,
  label,
  direction,
  event,
  messageSid,
}: TrackMessageProps) => {
  if (process.env.SEGMENT_WRITE_KEY) {
    try {
      await axios.post(
        'https://api.segment.io/v1/track',
        {
          userId,
          event,
          properties: {
            type: callType,
            direction,
            phoneNumber,
            messageSid,
            timestamp: new Date().toISOString(),
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' +
              Buffer.from((process.env.SEGMENT_WRITE_KEY || '') + ':').toString('base64'),
          },
        }
      );
    } catch (trackError) {
      log.error({
        label,
        message: 'Failed to track ' + direction + ' ' + label,
        data: trackError,
      });
    }
  }
};
