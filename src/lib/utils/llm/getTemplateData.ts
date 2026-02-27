import fs from 'fs-extra';
import path from 'path';
import { LocalTemplateData } from '../../types';

export async function getLocalTemplateData(): Promise<LocalTemplateData> {
  // Look in the src directory, not the dist directory
  const rootDir = path.resolve(__dirname, '../../../../');
  
  let instructions = '';
  let context = '';
  
  try {
    const instructionsPath = path.join(rootDir, 'src/lib/prompts/instructions.md');
    console.log('Looking for instructions at:', instructionsPath);
    if (await fs.pathExists(instructionsPath)) {
      instructions = await fs.readFile(instructionsPath, 'utf-8');
      console.log('✅ Successfully loaded instructions.md');
      console.log('Instructions content length:', instructions.length, 'characters');
      console.log('Instructions preview:', instructions.substring(0, 200) + '...');
    } else {
      console.log('❌ instructions.md not found at:', instructionsPath);
    }
  } catch (error) {
    console.warn('Could not read instructions.md:', error);
  }
  
  try {
    const contextPath = path.join(rootDir, 'src/lib/prompts/context.md');
    console.log('Looking for context at:', contextPath);
    if (await fs.pathExists(contextPath)) {
      context = await fs.readFile(contextPath, 'utf-8');
      console.log('✅ Successfully loaded context.md');
      console.log('Context content length:', context.length, 'characters');
      console.log('Context preview:', context.substring(0, 200) + '...');
    } else {
      console.log('❌ context.md not found at:', contextPath);
    }
  } catch (error) {
    console.warn('Could not read context.md:', error);
  }
  
  const result = {
    instructions,
    context,
    webhookUrl: process.env.WEBHOOK_URL,
    toolData: {
      // Tool-specific environment variables
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
      twilioIntelligenceServiceSid: process.env.TWILIO_CONVERSATIONAL_INTELLIGENCE_SID,
      segmentWriteKey: process.env.SEGMENT_WRITE_KEY,
      segmentWorkspace: process.env.SEGMENT_WORKSPACE,
      airtableApiKey: process.env.AIRTABLE_API_KEY,
      airtableBaseId: process.env.AIRTABLE_BASE_ID,
      airtableBaseName: process.env.AIRTABLE_BASE_NAME,
      // SendGrid variables (corrected names)
      sendGridApiKey: process.env.SENDGRID_API_KEY,
      sendGridDomain: process.env.SENDGRID_DOMAIN,
      sendGridTemplateId: process.env.SENDGRID_TEMPLATE_ID,
    },
  };

  console.log('📋 Final template data summary:');
  console.log('- Instructions loaded:', instructions.length > 0 ? 'YES' : 'NO');
  console.log('- Context loaded:', context.length > 0 ? 'YES' : 'NO');
  console.log('- Instructions length:', instructions.length, 'characters');
  console.log('- Context length:', context.length, 'characters');

  return result;
}
