import 'dotenv/config';
import http from 'http';
import path from 'path';
import express from 'express';
import ExpressWs from 'express-ws';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';

// Local imports
import { log } from './lib/utils/logger';
import { setDemoIo } from './lib/utils/demoEvents';
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

const expressApp = express();
const server = http.createServer(expressApp);
const { app } = ExpressWs(expressApp, server);

// Socket.io — real-time dashboard events
const io = new SocketIOServer(server, {
  cors: { origin: '*' },
});
setDemoIo(io);

io.on('connection', (socket) => {
  log.info({ label: 'dashboard', message: 'Dashboard client connected', data: socket.id });
  socket.on('disconnect', () => {
    log.info({ label: 'dashboard', message: 'Dashboard client disconnected', data: socket.id });
  });
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // disable CSP so dashboard inline scripts work
app.use(compression());
app.use(morgan('combined'));
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true })).use(express.json());

// Serve static dashboard
app.use(express.static(path.join(__dirname, '..', 'public')));

// Dashboard route
app.get('/dashboard', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

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
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  log.info({
    label: 'server',
    message: `Server listening on port ${PORT}`,
  });
  log.info({
    label: 'server',
    message: `Dashboard: http://localhost:${PORT}/dashboard`,
  });
});
