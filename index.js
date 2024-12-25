/**
 * Main server application file that sets up an Express server with WebSocket support.
 * @module server/index
 *
 * @requires express
 * @requires path
 * @requires body-parser
 * @requires ws
 * @requires http
 * @requires ./routes/base
 * @requires ./routes/ffmpeg
 * @requires ./routes/downloaders
 * @requires ./routes/converters
 * @requires ./routes/tools
 * @requires ./routes/ai
 * @requires ./routes/search
 * @requires ./routes/_upload
 *
 * @description
 * Sets up an Express server with:
 * - Body parser middleware for URL-encoded and JSON bodies
 * - WebSocket server for real-time client connections
 * - Multiple API routes mounted under /api
 * - Static file serving for web client
 * - Endpoint to track connected users
 *
 * @constant {express.Application} app - Express application instance
 * @constant {number} port - Server port (default: 3000)
 * @constant {WebSocketServer} wss - WebSocket server instance
 * @constant {Set} connectedClients - Set of connected WebSocket clients
 */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import Router1 from './routes/base.js';
import Router2 from './routes/ffmpeg.js';
import Router3 from './routes/downloaders.js';
import Router4 from './routes/converters.js';
import Router5 from './routes/tools.js';
import Router6 from './routes/ai.js';
import Router7 from './routes/search.js';
import Router8 from './routes/anime.js';
import Router9 from './routes/meme.js';
import uploadRouter from './routes/_upload.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const server = createServer(app);

const wss = new WebSocketServer({ server });
const connectedClients = new Set();

wss.on('connection', ws => {
	connectedClients.add(ws);

	ws.on('close', () => {
		connectedClients.delete(ws);
	});
});

app.use(express.json());
app.use('/api', Router1);
app.use('/api', Router2);
app.use('/api', Router3);
app.use('/api', Router4);
app.use('/api', Router5);
app.use('/api', Router6);
app.use('/api', Router7);
app.use('/api', Router8);
app.use('/api', Router9);
app.use('/api/upload', uploadRouter);

app.get('/api/users', (_, res) => {
	res.json({ users: connectedClients.size });
});

app.get('/', (_, res) => {
	res.sendFile(path.join(process.cwd(), 'web', 'index.html'));
});

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
