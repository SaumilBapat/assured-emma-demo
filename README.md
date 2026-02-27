# assured-agent

A Twilio ConversationRelay voice agent created with create-twilio-agent.

## Features

This voice agent includes the following tools:
- send text\n- send r c s\n- send email\n- get segment profile\n- get segment events\n- update segment profile\n- post segment track\n- get airtable data\n- upsert airtable data\n- send to live agent\n- switch language

## Architecture

- **TypeScript**: Full TypeScript support with proper types
- **ConversationRelay**: Advanced voice call handling
- **Local Configuration**: No external dependencies like Algolia - uses local files
- **Streaming LLM**: Real-time response streaming with abort controllers
- **Tool System**: Modular tool architecture with individual executors
- **WebSocket Support**: Real-time communication
- **Express Server**: RESTful API endpoints

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your credentials:**
   - Add your Twilio Account SID, Auth Token, and Phone Number
   - Add your OpenAI API Key
   - Configure other service credentials as needed

4. **Customize agent instructions:**
   - Edit `src/lib/prompts/instructions.md` for agent behavior
   - Edit `src/lib/prompts/context.md` for system context

5. **Build the project:**
   ```bash
   npm run build
   ```

6. **Start the agent:**
   ```bash
   npm start
   ```

## Development

### Local Development with Ngrok

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **In a separate terminal, start ngrok:**
   ```bash
   ngrok http 3000
   ```

3. **Update your .env file:**
   Add the ngrok URL to your `.env` file:
   ```env
   NGROK_URL=https://your-ngrok-url.ngrok.io
   ```

4. **Configure Twilio webhooks:**
   Use the ngrok URL in Twilio Console:
   - Voice: `https://your-ngrok-url.ngrok.io/call`
   - SMS: `https://your-ngrok-url.ngrok.io/text`
   - ConversationRelay: `wss://your-ngrok-url.ngrok.io/conversation-relay`

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run ngrok:install` - Install ngrok globally
- `npm run ngrok:start` - Start ngrok tunnel
- `npm run dev:with-ngrok` - Start both ngrok and dev server
- `npm run twilio:init` - Run Twilio setup scripts to configure services

## Configuration

### Agent Instructions

Edit `src/lib/prompts/instructions.md` to customize your agent's behavior, personality, and capabilities.

### Agent Context

Edit `src/lib/prompts/context.md` to provide system-level context about your business, services, or domain-specific information.

### Tools

Tools are located in `src/tools/`. Each tool has:
- `manifest.ts` - OpenAI function definition
- `executor.ts` - Implementation logic

To add custom tools:
1. Create a new directory in `src/tools/`
2. Add `manifest.ts` and `executor.ts`
3. Update `src/tools/manifest.ts` and `src/tools/executors.ts`

### Twilio Setup Scripts

This project includes Twilio setup scripts in `scripts/twilioInit/`:

- **assignPhoneNumber.ts** - Assigns a phone number and configures webhooks
- **createTaskRouter.ts** - Creates TaskRouter workspace, queue, and workflow
- **createMessagingService.ts** - Creates messaging service and attaches phone number
- **createConversationalIntelligence.ts** - Creates conversational intelligence service with custom operators

To run the setup scripts:
```bash
npm run twilio:init
```

Make sure your `.env` file contains:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `SERVICE_NAME` (for naming services)
- `NGROK_URL` or `LIVE_HOST_URL` (for webhook URLs)



## Deployment

This agent can be deployed to any Node.js hosting platform:

- **Heroku**: Use the included `Procfile`
- **Railway**: Deploy directly from Git
- **AWS/GCP/Azure**: Use Docker or serverless functions
- **Vercel**: Deploy as serverless functions

Make sure to set all environment variables in your hosting platform.

## License

MIT
