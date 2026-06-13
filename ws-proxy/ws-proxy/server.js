#!/usr/bin/env node

/**
 * WebSocket Proxy — Browser → Next.js BFF → Python Engine
 *
 * Listens for WebSocket connections from the browser, authenticates
 * via Bearer token (query param), and proxies bidirectionally to
 * the Python simulation engine on port 9000.
 *
 * Routes:
 *   /ws/instance/<id>                    → engine /ws/instance/<id>
 *   /ws/instance/<id>/console/<devId>   → engine /ws/instance/<id>/console/<devId>
 *
 * Usage:
 *   node server.js [--port 3001] [--engine http://localhost:9000]
 */

import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

const ENGINE_URL = process.env.ENGINE_URL || 'http://localhost:9000';
const PORT = parseInt(process.env.PORT || '3001', 10);
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-in-production';

function decodeToken(token) {
  try {
    const normalized = token.includes('%') ? decodeURIComponent(token) : token;
    const json = Buffer.from(normalized, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getToken(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded || (Date.now() - (decoded.timestamp || 0)) > 24 * 60 * 60 * 1000) {
    return null;
  }
  return decoded;
}

function healthResponse(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', service: 'sim-ws-proxy', port: PORT }));
}

const wss = new WebSocketServer({ noServer: true });

const server = createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    return healthResponse(res);
  }
  res.writeHead(404);
  res.end('Not Found');
});

server.on('upgrade', (req, socket, head) => {
  const token = getToken(req);
  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req, token);
  });
});

wss.on('connection', async (ws, req, token) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let path = url.pathname;

  // Verify path matches expected patterns
  const instanceMatch = path.match(/^\/ws\/instance\/([^/]+)$/);
  const consoleMatch = path.match(/^\/ws\/instance\/([^/]+)\/console\/([^/]+)$/);

  let enginePath;
  if (instanceMatch) {
    enginePath = `/ws/instance/${instanceMatch[1]}`;
  } else if (consoleMatch) {
    enginePath = `/ws/instance/${consoleMatch[1]}/console/${consoleMatch[2]}`;
  } else {
    ws.close(1008, 'Invalid path');
    return;
  }

  // Connect to Python engine
  const engineWsUrl = ENGINE_URL.replace(/^http/, 'ws') + enginePath;

  let engineWs;
  let closed = false;

  try {
    const { default: WebSocket } = await import('ws');
    engineWs = new WebSocket(engineWsUrl);

    const cleanup = () => {
      if (closed) return;
      closed = true;
      try { ws.close(); } catch { /* ignore */ }
      try { engineWs.close(); } catch { /* ignore */ }
    };

    engineWs.on('open', () => {
      // Bidirectional pipe
      ws.on('message', (data) => {
        if (!closed && engineWs.readyState === WebSocket.OPEN) {
          engineWs.send(data);
        }
      });

      ws.on('close', cleanup);
      ws.on('error', cleanup);

      engineWs.on('message', (data) => {
        if (!closed && ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });

      engineWs.on('close', cleanup);
      engineWs.on('error', cleanup);
    });

    engineWs.on('error', (err) => {
      console.error('Engine WS error:', err.message);
      if (!closed) {
        ws.send(JSON.stringify({ type: 'error', detail: `Engine connection failed: ${err.message}` }));
        cleanup();
      }
    });

  } catch (err) {
    console.error('Failed to connect to engine:', err.message);
    ws.send(JSON.stringify({ type: 'error', detail: `Cannot connect to engine: ${err.message}` }));
    ws.close(1011);
  }
});

server.listen(PORT, () => {
  console.log(`WS proxy listening on :${PORT}, engine: ${ENGINE_URL}`);
});
