// External npm packages
import 'dotenv/config';
import twilio from 'twilio';

// Local imports
import { assignPhoneNumber } from './services/assignPhoneNumber';
import createConversationalIntelligence from './services/createConversationalIntelligence';
import { createMessagingService } from './services/createMessagingService';
import { createTaskRouterService } from './services/createTaskRouter';
import { log } from '../../src/lib/utils/logger';

// Main deployment script that orchestrates the creation of services needed.
async function twilioInit() {
  // Validate environment variables
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error(
      'Missing required environment variables. Please check .env file.'
    );
  }

  log.lightPurple({
    label: 'deployment',
    message: '=== Deployment Started 🚀 ===',
  });

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    log.brightCyan({
      label: 'deployment',
      message: 'Step 1: Deploy Task Router Service...',
    });
    const taskRouterService = await createTaskRouterService(client);

    log.brightCyan({
      label: 'deployment',
      message: '\nStep 2: Assign Phone Number...',
    });
    const phoneNumberData = await assignPhoneNumber(client);

    log.brightCyan({
      label: 'deployment',
      message: '\nStep 3: Create Messaging Service...',
    });
    const messagingService = await createMessagingService(
      client,
      phoneNumberData.conversationNumber
    );

    // Step 4: Create the Voice Intelligence Service
    log.brightCyan({
      label: 'deployment',
      message: '\nStep 4: Create Conversational Intelligence Service...',
    });
    const conversationIntelligenceService =
      await createConversationalIntelligence(client);

    // Deployment summary
    log.lightPurple({
      label: 'deployment',
      message: '\n=== Deployment Summary  🎉 ===',
    });
    log.lightBlue({
      label: 'deployment',
      message: 'TaskRouter Workspace SID:',
      data: taskRouterService.workspace?.sid,
    });
    log.lightBlue({
      label: 'deployment',
      message: 'TaskRouter TaskQueue SID:',
      data: taskRouterService.taskQueue?.sid,
    });
    log.lightBlue({
      label: 'deployment',
      message: 'TaskRouter Workflow SID:',
      data: taskRouterService.workflow?.sid,
    });
    log.lightBlue({
      label: 'deployment',
      message: 'Conversation Phone Number:',
      data: phoneNumberData.conversationNumber,
    });
    log.lightBlue({
      label: 'deployment',
      message: 'Messaging Service SID:',
      data: messagingService.accountSid,
    });
    log.lightBlue({
      label: 'deployment',
      message: 'Messaging Service Name:',
      data: messagingService.friendlyName,
    });
    log.lightBlue({
      label: 'deployment',
      message: 'Conversational Intelligence Service SID:',
      data: conversationIntelligenceService.serviceSid,
    });
  } catch (error: any) {
    console.error('\n❌ Deployment failed:');
    console.error('Error:', error.message);

    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.status) {
      console.error('Status Code:', error.status);
    }

    console.log('\nTroubleshooting suggestions:');
    console.log('1. Check your Twilio credentials');
    console.log('2. Verify your account has AI Assistant access');
    console.log('3. Ensure all webhook URLs are valid');
    console.log('4. Check for any duplicate resource names');

    // Close readline interface
    throw error;
  }
}

// Add cleanup function for handling interruptions
process.on('SIGINT', async () => {
  console.log('\n\nReceived interrupt signal. Cleaning up...');
  process.exit(0);
});

// Run the deployment if this script is executed directly
if (require.main === module) {
  twilioInit()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nDeployment failed. See error details above.');
      process.exit(1);
    });
}

export default twilioInit;
