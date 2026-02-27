import 'dotenv/config';
import express from 'express';
import ExpressWs from 'express-ws';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Local imports
import { log } from './lib/utils/logger';
import { setupConversationRelayRoute } from './routes/conversationRelay';
import callRouter from './routes/call';
import smsRouter from './routes/sms';
import liveAgentRouter from './routes/liveAgent';
import outboundCallRouter from './routes/outboundCall';
import statsRouter from './routes/stats';
import activeNumbersRouter from './routes/activeNumbers';
import outboundMessageRouter from './routes/outboundMessage';
import liveNumbersRouter from './routes/liveNumbers';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const { app } = ExpressWs(express());

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Configure CORS based on environment
if (process.env.NODE_ENV !== 'production') {
  // In development, allow localhost:3000 to talk to localhost:3001
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
} else {
  // In production, allow your frontend domain
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
}

app.use(express.urlencoded({ extended: true })).use(express.json());

// Set up WebSocket route for conversation relay
setupConversationRelayRoute(app);

// Set up HTTP routes
app.use('/', callRouter);
app.use('/', smsRouter);
app.use('/', liveAgentRouter);
app.use('/', outboundCallRouter);
app.use('/', statsRouter);
app.use('/', activeNumbersRouter);
app.use('/', outboundMessageRouter);
app.use('/', liveNumbersRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  log.info({
    label: 'server',
    message: `Server listening on port ${PORT}`,
  });
});
