// json-server 0.17 middleware - makes the mock follow the cross-stack contracts
// (../../contracts/conventions.md) closely enough that feature code is IDENTICAL against the mock
// and against et-be. Run with `npm run mock` (routes.json maps /v1/* -> /*).
//
// What it simulates:
//   POST /auth/login    { email, password } -> 200 { user } + readable csrfToken cookie | 401 INVALID_CREDENTIALS | 422 VALIDATION_FAILED
//   GET  /auth/whoami   -> 200 { user } when "signed in" | 401 UNAUTHENTICATED
//   POST /auth/refresh  -> 204 when signed in | 401 UNAUTHENTICATED
//   POST /auth/logout   -> 204 (always)
//   GET  /<collection>?cursor=&limit=  -> { items, nextCursor }   (cursor pagination, like et-be)
//   /users/*            -> 404 (never expose mock users - they contain plaintext mock passwords)
// Everything else (GET /<collection>/:id, POST/PATCH/DELETE) falls through to json-server.
//
// What it does NOT simulate (by design): real tokens, httpOnly cookies, CSRF validation, refresh
// rotation. That logic is exercised against et-be (and MSW in tests), never faked here.
// The "session" is one in-memory flag for the whole mock process (single developer).

const fs = require('node:fs');
const path = require('node:path');

const DB_PATH = path.join(__dirname, 'db.json');
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

let currentUserId = null;

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function sendError(res, status, code, error, details) {
  res.status(status).json(details ? { error, code, details } : { error, code });
}

function publicUser(user) {
  const { password: _password, ...rest } = user;
  return rest;
}

// json-server's CLI does not parse bodies before custom middlewares, so read JSON ourselves.
function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function encodeCursor(offset) {
  return Buffer.from(String(offset)).toString('base64url');
}

function decodeCursor(cursor) {
  const offset = Number(Buffer.from(String(cursor), 'base64url').toString());
  return Number.isInteger(offset) && offset >= 0 ? offset : 0;
}

async function handleAuth(req, res) {
  if (req.method === 'POST' && req.path === '/auth/login') {
    const body = await readJsonBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) {
      return sendError(res, 422, 'VALIDATION_FAILED', 'Invalid request', {
        fields: { ...(email ? {} : { email: 'validation.required' }), ...(password ? {} : { password: 'validation.required' }) },
      });
    }
    const user = (readDb().users || []).find((u) => u.email.toLowerCase() === email && u.password === password);
    if (!user) return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    currentUserId = user.id;
    res.setHeader('Set-Cookie', 'csrfToken=mock-csrf-token; Path=/; SameSite=Lax');
    return res.status(200).json({ user: publicUser(user) });
  }

  if (req.method === 'GET' && req.path === '/auth/whoami') {
    const user = currentUserId && (readDb().users || []).find((u) => u.id === currentUserId);
    if (!user) return sendError(res, 401, 'UNAUTHENTICATED', 'Authentication required');
    return res.status(200).json({ user: publicUser(user) });
  }

  if (req.method === 'POST' && req.path === '/auth/refresh') {
    if (!currentUserId) return sendError(res, 401, 'UNAUTHENTICATED', 'No active session');
    return res.status(204).end();
  }

  if (req.method === 'POST' && req.path === '/auth/logout') {
    currentUserId = null;
    return res.status(204).end();
  }

  return sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
}

function handleCursorList(req, res, items) {
  const limit = Math.min(Math.max(Number(req.query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = req.query.cursor ? decodeCursor(req.query.cursor) : 0;
  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + page.length;
  res.status(200).json({ items: page, nextCursor: nextOffset < items.length ? encodeCursor(nextOffset) : null });
}

module.exports = function contractMiddleware(req, res, next) {
  if (req.path.startsWith('/auth/')) {
    handleAuth(req, res).catch(() => sendError(res, 500, 'INTERNAL_ERROR', 'Internal server error'));
    return;
  }

  if (req.path === '/users' || req.path.startsWith('/users/')) {
    sendError(res, 404, 'NOT_FOUND', 'Not found');
    return;
  }

  const collectionMatch = /^\/([a-z][a-z0-9-]*)$/.exec(req.path);
  if (req.method === 'GET' && collectionMatch) {
    const collection = readDb()[collectionMatch[1]];
    if (Array.isArray(collection)) {
      handleCursorList(req, res, collection);
      return;
    }
  }

  next();
};
