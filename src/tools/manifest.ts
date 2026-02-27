import { sendTextManifest } from './sendText/manifest';
import { sendRCSManifest } from './sendRCS/manifest';
import { sendEmailManifest } from './sendEmail/manifest';
import { getSegmentProfileManifest } from './getSegmentProfile/manifest';
import { getSegmentEventsManifest } from './getSegmentEvents/manifest';
import { updateSegmentProfileManifest } from './updateSegmentProfile/manifest';
import { postSegmentTrackManifest } from './postSegmentTrack/manifest';
import { getAirtableDataManifest } from './getAirtableData/manifest';
import { upsertAirtableDataManifest } from './upsertAirtableData/manifest';
import { sendToLiveAgentManifest } from './sendToLiveAgent/manifest';
import { switchLanguageManifest } from './switchLanguage/manifest';
import { ToolManifest } from '../lib/types';

export const tools: Record<string, { manifest: ToolManifest }> = {
  sendText: {
    manifest: sendTextManifest,
  },
  sendRCS: {
    manifest: sendRCSManifest,
  },
  sendEmail: {
    manifest: sendEmailManifest,
  },
  getSegmentProfile: {
    manifest: getSegmentProfileManifest,
  },
  getSegmentEvents: {
    manifest: getSegmentEventsManifest,
  },
  updateSegmentProfile: {
    manifest: updateSegmentProfileManifest,
  },
  postSegmentTrack: {
    manifest: postSegmentTrackManifest,
  },
  getAirtableData: {
    manifest: getAirtableDataManifest,
  },
  upsertAirtableData: {
    manifest: upsertAirtableDataManifest,
  },
  sendToLiveAgent: {
    manifest: sendToLiveAgentManifest,
  },
  switchLanguage: {
    manifest: switchLanguageManifest,
  },
};
