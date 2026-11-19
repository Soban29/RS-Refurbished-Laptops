import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  getLaptops,
  addLaptop,
  updateLaptop,
  deleteLaptop,
  getInquiries,
  addInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getServiceTickets,
  addServiceTicket,
  updateServiceTicketStatus,
  deleteServiceTicket,
  getOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  executeCustomSqlQuery,
  getTableList,
  getTableRows,
  getDatabaseStats,
  getSqlDump,
  resetDatabase,
  loadDatabase,
  getAccessories
} from './server/db.js';
import { syncDatabaseToExcel } from './server/excelSync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const JSON_DB_FILE = path.join(DATA_DIR, 'rs_refurbished_database.json');
const EXCEL_DB_FILE = path.join(DATA_DIR, 'rs_refurbished_database.xlsx');

// -------------------------------------------------------------
// ENVIRONMENT VARIABLE LOADER & INTEGRITY VALIDATOR
// -------------------------------------------------------------
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envFileContent = fs.readFileSync(envPath, 'utf-8');
    envFileContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k && v.length) {
          process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  } catch (e) {
    console.error('Notice: Could not read .env file:', e.message);
  }
}

// -------------------------------------------------------------
// ENFORCE CRITICAL ENVIRONMENT SECRETS (NO HARDCODED FALLBACKS)
// The server must refuse to start if essential secrets are missing.
// Supports either plaintext ADMIN_PASSCODE or pre-hashed ADMIN_PASSCODE_HASH
// -------------------------------------------------------------
const rawPasscode = (process.env.ADMIN_PASSCODE || '').trim();
const passcodeHashEnv = (process.env.ADMIN_PASSCODE_HASH || '').trim().toLowerCase();

if (!rawPasscode && !passcodeHashEnv) {
  console.error('\n❌ [FATAL CONFIGURATION ERROR] Missing ADMIN_PASSCODE or ADMIN_PASSCODE_HASH in environment variables.');
  console.error('The server refuses to start with an insecure default password.');
  console.error('Please define ADMIN_PASSCODE or ADMIN_PASSCODE_HASH in your .env file before starting the application.\n');
  process.exit(1);
}

if (!process.env.ADMIN_JWT_SECRET || !process.env.ADMIN_JWT_SECRET.trim()) {
  console.error('\n❌ [FATAL CONFIGURATION ERROR] Missing ADMIN_JWT_SECRET in environment variables.');
  console.error('The server refuses to start without a cryptographic session signing secret.');
  console.error('Please define ADMIN_JWT_SECRET in your .env file before starting the application.\n');
  process.exit(1);
}

// Compute expected SHA-256 binary hash buffer for timing-safe comparison
const ADMIN_PASSCODE_BUFFER = passcodeHashEnv
  ? Buffer.from(passcodeHashEnv, 'hex')
  : crypto.createHash('sha256').update(rawPasscode).digest();

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET.trim();
const PORT = process.env.PORT || 5000;

const app = express();

// Trust reverse proxy (Render, Vercel, Nginx, Cloudflare) so Express populates req.ip safely
app.set('trust proxy', 1);

// -------------------------------------------------------------
// SECURE CLIENT IP RESOLVER (PREVENTS X-FORWARDED-FOR HEADER SPOOFING)
// -------------------------------------------------------------
function getClientIp(req) {
  // Use Express-validated req.ip under trust proxy settings
  if (req.ip) return req.ip;
  // Fallback to direct TCP socket connection address (cannot be header-spoofed)
  if (req.socket && req.socket.remoteAddress) return req.socket.remoteAddress;
  return '127.0.0.1';
}

// -------------------------------------------------------------
// PRODUCTION DEFENSE LAYER 1: SENSITIVE FILE & DOTFILE BLOCKER
// Safely handles malformed percent-encoding in request paths.
// -------------------------------------------------------------
app.use((req, res, next) => {
  let decoded = '';
  try {
    decoded = decodeURIComponent(req.path).toLowerCase();
  } catch (err) {
    // Malformed percent-encoding like /%99 or /%c0%af - reject with 400 Bad Request
    return res.status(400).json({
      success: false,
      error: 'Bad Request: Malformed URI percent-encoding detected.'
    });
  }

  // Prevent path traversal and direct access to env, git, bat, or data stores
  if (
    decoded.includes('.env') ||
    decoded.includes('.git') ||
    decoded.includes('.bat') ||
    decoded.includes('/data/') ||
    (decoded.endsWith('.json') && !decoded.startsWith('/api/')) ||
    (decoded.endsWith('.xlsx') && !decoded.startsWith('/api/')) ||
    decoded.includes('..')
  ) {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Protected file or system path.'
    });
  }
  next();
});

// -------------------------------------------------------------
// PRODUCTION DEFENSE LAYER 2: SECURITY HEADERS (OWASP RECOMMENDED)
// -------------------------------------------------------------
app.use((req, res, next) => {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent Clickjacking attacks (Disallow frame embeds)
  res.setHeader('X-Frame-Options', 'DENY');
  // Enforce HTTPS in production via HSTS (1 year)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Restrict referrer leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Hardware permission policy lockdown
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data: blob: 'unsafe-inline'; script-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; connect-src 'self' https:;"
  );
  // Strip server signature
  res.removeHeader('X-Powered-By');
  next();
});

// -------------------------------------------------------------
// PRODUCTION DEFENSE LAYER 3: GRANULAR RATE LIMITERS
// Keyed using secure getClientIp (immune to raw header spoofing).
// -------------------------------------------------------------
const createRateLimiter = (windowMs, maxReqs, errorMsg) => {
  const rateMap = new Map();
  return (req, res, next) => {
    const clientIp = getClientIp(req);
    const now = Date.now();
    const stats = rateMap.get(clientIp) || { count: 0, resetTime: now + windowMs };

    if (now > stats.resetTime) {
      stats.count = 1;
      stats.resetTime = now + windowMs;
    } else {
      stats.count++;
    }

    rateMap.set(clientIp, stats);

    // Memory cleanup
    if (rateMap.size > 5000) {
      for (const [ip, data] of rateMap.entries()) {
        if (now > data.resetTime) rateMap.delete(ip);
      }
    }

    if (stats.count > maxReqs) {
      return res.status(429).json({
        success: false,
        error: errorMsg || 'Too many requests. Rate limit triggered. Please wait a moment.'
      });
    }
    next();
  };
};

const generalRateLimiter = createRateLimiter(60 * 1000, 180, 'General API rate limit reached. Please wait.');
const aiChatLimiter = createRateLimiter(60 * 1000, 25, 'AI query rate limit reached (max 25 requests/min). Please wait a moment.');
const submissionLimiter = createRateLimiter(60 * 1000, 10, 'Too many form submissions. Please wait a moment before trying again.');

app.use(generalRateLimiter);

// -------------------------------------------------------------
// PRODUCTION DEFENSE LAYER 4: CORS & PAYLOAD LIMITS
// -------------------------------------------------------------
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limit JSON payload to 200kb to block memory exhaustion / JSON-bomb attacks
app.use(express.json({ limit: '200kb' }));

// -------------------------------------------------------------
// PRODUCTION DEFENSE LAYER 5: RECURSIVE INPUT SANITIZER
// -------------------------------------------------------------
const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:[^"']*/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/data:text\/html[^"']*/gi, '')
      .trim();
  } else if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  } else if (val && typeof val === 'object') {
    const cleaned = {};
    for (const key of Object.keys(val)) {
      cleaned[key] = sanitizeValue(val[key]);
    }
    return cleaned;
  }
  return val;
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  next();
});

// -------------------------------------------------------------
// PRODUCTION DEFENSE LAYER 6: SAFE CENTRALIZED ERROR HANDLER
// -------------------------------------------------------------
function sendSafeError(res, statusCode, publicMsg, rawErr = null) {
  const correlationId = crypto.randomBytes(4).toString('hex');
  if (rawErr) {
    console.error(`[Error Ref: ${correlationId}]`, rawErr?.message || rawErr);
  }
  return res.status(statusCode).json({
    success: false,
    error: publicMsg,
    correlationId
  });
}

// -------------------------------------------------------------
// PRODUCTION DEFENSE LAYER 7: CRYPTOGRAPHIC ADMIN AUTH & SESSIONS
// -------------------------------------------------------------
function generateAdminToken() {
  const payload = {
    role: 'admin',
    iss: 'rs_refurbished_server',
    iat: Date.now(),
    exp: Date.now() + 12 * 60 * 60 * 1000, // 12-hour session
    nonce: crypto.randomBytes(12).toString('hex')
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_JWT_SECRET)
    .update(payloadStr)
    .digest('base64url');
  return `${payloadStr}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.trim().split('.');
  if (parts.length !== 2) return false;
  const [payloadStr, signature] = parts;

  try {
    const expectedSig = crypto
      .createHmac('sha256', ADMIN_JWT_SECRET)
      .update(payloadStr)
      .digest('base64url');

    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSig);
    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (!payload || payload.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return false;

    return true;
  } catch (e) {
    return false;
  }
}

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.query.token || '');

  if (!verifyAdminToken(token)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access. Valid admin session token required.'
    });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC HEALTH CHECK (Sanitized - Zero Leakage)
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'RS Refurbished Laptops & Services API',
    version: '1.0.0',
    contact: '+91 8668848486',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION (Brute-Force & Timing-Attack Protected)
// Lockout keyed using secure getClientIp (spoof-resistant).
// -------------------------------------------------------------
const adminFailedAttempts = new Map();
const ADMIN_MAX_FAILS = 5;
const ADMIN_LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout

app.post('/api/admin/login', (req, res) => {
  const clientIp = getClientIp(req);
  const now = Date.now();
  const attemptInfo = adminFailedAttempts.get(clientIp) || { fails: 0, lockedUntil: 0 };

  if (attemptInfo.lockedUntil && now < attemptInfo.lockedUntil) {
    const remainingMinutes = Math.ceil((attemptInfo.lockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      error: `Security lockout: Too many failed login attempts. Account temporarily protected for ${remainingMinutes} more minute(s).`
    });
  }

  const { passcode } = req.body || {};
  if (!passcode || typeof passcode !== 'string') {
    return res.status(400).json({ success: false, error: 'Passcode is required' });
  }

  // Constant-time comparison using crypto SHA-256 hashes
  const inputHash = crypto.createHash('sha256').update(String(passcode).trim()).digest();
  const isMatch = (inputHash.length === ADMIN_PASSCODE_BUFFER.length) && crypto.timingSafeEqual(inputHash, ADMIN_PASSCODE_BUFFER);

  if (isMatch) {
    adminFailedAttempts.delete(clientIp);
    const token = generateAdminToken();
    return res.json({
      success: true,
      message: 'Authentication successful',
      token
    });
  }

  // Increment failure count
  attemptInfo.fails = (attemptInfo.fails || 0) + 1;
  if (attemptInfo.fails >= ADMIN_MAX_FAILS) {
    attemptInfo.lockedUntil = now + ADMIN_LOCKOUT_MS;
  }
  adminFailedAttempts.set(clientIp, attemptInfo);

  const attemptsLeft = Math.max(0, ADMIN_MAX_FAILS - attemptInfo.fails);
  return res.status(401).json({
    success: false,
    error: `Invalid admin passcode. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining before security lockout.` : 'Account locked for 15 minutes.'}`
  });
});

// -------------------------------------------------------------
// USER MANAGEMENT ENDPOINTS
// Customer Sign-Up & Google Login persist safely via POST /api/users.
// Privilege escalation blocked: unauthenticated users strictly get role='customer'.
// Administrative operations (listing all users, deletion, update) require admin auth.
// -------------------------------------------------------------

// Protected: Only Admin can list all users
app.get('/api/users', requireAdminAuth, (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      const user = getUserByEmail(email);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      return res.json({ success: true, data: user });
    }
    const users = getUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to retrieve users.', err);
  }
});

// Public customer account creation / Google login persistence (rate-limited)
app.post('/api/users', submissionLimiter, (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid email is required' });
    }

    // Verify if caller has admin token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.query.token || '');
    const isAdmin = verifyAdminToken(token);

    const safeUserData = { ...req.body };

    // Prevent privilege escalation: unauthenticated callers are strictly forced to role='customer'
    if (!isAdmin) {
      safeUserData.role = 'customer';
    }

    // Check if user already exists
    const existing = getUserByEmail(email);
    if (existing) {
      if (existing.role === 'admin' && !isAdmin) {
        return res.status(403).json({ success: false, error: 'Administrative accounts cannot be modified without credentials.' });
      }
      const updated = updateUser(existing.id, {
        ...safeUserData,
        role: isAdmin ? (safeUserData.role || existing.role) : existing.role,
        lastLogin: new Date().toISOString()
      });
      return res.json({ success: true, data: updated });
    }

    const newUser = addUser(safeUserData);
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to register or update user account.', err);
  }
});

app.get('/api/users/:id', requireAdminAuth, (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to fetch user.', err);
  }
});

app.put('/api/users/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to update user.', err);
  }
});

app.delete('/api/users/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to delete user.', err);
  }
});

// -------------------------------------------------------------
// LAPTOPS ENDPOINTS (Public Catalog Read, Protected Modification)
// -------------------------------------------------------------
app.get('/api/laptops', (req, res) => {
  try {
    const laptops = getLaptops();
    res.json({ success: true, count: laptops.length, data: laptops });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to retrieve catalog.', err);
  }
});

app.post('/api/laptops', requireAdminAuth, (req, res) => {
  try {
    const newLaptop = addLaptop(req.body);
    res.status(201).json({ success: true, data: newLaptop });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to add laptop.', err);
  }
});

app.put('/api/laptops/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = updateLaptop(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Laptop not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to update laptop.', err);
  }
});

app.delete('/api/laptops/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = deleteLaptop(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Laptop not found' });
    }
    res.json({ success: true, message: 'Laptop deleted successfully' });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to delete laptop.', err);
  }
});

// -------------------------------------------------------------
// ACCESSORIES ENDPOINTS (Public Catalog Read)
// -------------------------------------------------------------
app.get('/api/accessories', (req, res) => {
  try {
    const acc = getAccessories();
    res.json({ success: true, count: acc.length, data: acc });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to retrieve accessories.', err);
  }
});

// -------------------------------------------------------------
// INQUIRIES ENDPOINTS (Public Submission, Protected Management)
// -------------------------------------------------------------
app.get('/api/inquiries', requireAdminAuth, (req, res) => {
  try {
    const inquiries = getInquiries();
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to retrieve inquiries.', err);
  }
});

app.post('/api/inquiries', submissionLimiter, (req, res) => {
  try {
    const newInquiry = addInquiry(req.body);
    res.status(201).json({ success: true, data: newInquiry });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to submit inquiry.', err);
  }
});

app.put('/api/inquiries/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = updateInquiryStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to update inquiry.', err);
  }
});

app.delete('/api/inquiries/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = deleteInquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to delete inquiry.', err);
  }
});

// -------------------------------------------------------------
// SERVICE TICKETS ENDPOINTS (Public Submission, Protected Management)
// -------------------------------------------------------------
app.get('/api/services', requireAdminAuth, (req, res) => {
  try {
    const tickets = getServiceTickets();
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to retrieve service tickets.', err);
  }
});

app.post('/api/services', submissionLimiter, (req, res) => {
  try {
    const newTicket = addServiceTicket(req.body);
    res.status(201).json({ success: true, data: newTicket });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to submit service ticket.', err);
  }
});

app.put('/api/services/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = updateServiceTicketStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to update ticket.', err);
  }
});

app.delete('/api/services/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = deleteServiceTicket(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to delete ticket.', err);
  }
});

// -------------------------------------------------------------
// ORDERS & SALES ENDPOINTS (Public Submission, Protected Management)
// -------------------------------------------------------------
app.get('/api/orders', requireAdminAuth, (req, res) => {
  try {
    const orders = getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to retrieve orders.', err);
  }
});

app.post('/api/orders', submissionLimiter, (req, res) => {
  try {
    // Basic business logic validation
    const orderData = req.body || {};
    orderData.quantity = Math.max(1, Math.min(Number(orderData.quantity) || 1, 1000));
    orderData.totalAmount = Math.max(0, Number(orderData.totalAmount) || 0);
    orderData.amountPaid = Math.max(0, Number(orderData.amountPaid) || 0);

    const newOrder = addOrder(orderData);
    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to record order.', err);
  }
});

app.put('/api/orders/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = updateOrderStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to update order.', err);
  }
});

app.delete('/api/orders/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to delete order.', err);
  }
});

// -------------------------------------------------------------
// CUSTOMER REVIEWS ENDPOINTS (Public Read & Submission)
// -------------------------------------------------------------
app.get('/api/reviews', (req, res) => {
  try {
    const db = loadDatabase();
    const reviews = (db.reviews || []).filter(r => r.approved !== false);
    res.json({ success: true, reviews });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to retrieve reviews.', err);
  }
});

app.post('/api/reviews', submissionLimiter, (req, res) => {
  try {
    const { name, city, rating, text, laptopModel } = req.body;

    if (!name || !rating || !text) {
      return res.status(400).json({ success: false, error: 'Name, rating, and review text are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5.' });
    }

    const db = loadDatabase();
    if (!db.reviews) db.reviews = [];

    const newReview = {
      id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(name).trim().slice(0, 100),
      city: city ? String(city).trim().slice(0, 50) : '',
      rating: Number(rating),
      text: String(text).trim().slice(0, 1000),
      laptopModel: laptopModel ? String(laptopModel).trim().slice(0, 100) : '',
      date: new Date().toISOString(),
      approved: true
    };

    db.reviews.push(newReview);
    saveDatabase(db);

    res.json({ success: true, review: newReview });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to submit review.', err);
  }
});

// -------------------------------------------------------------
// DATABASE INSPECTION & SQL CONSOLE (Strictly Protected)
// -------------------------------------------------------------
app.get('/api/sql/info', requireAdminAuth, (req, res) => {
  try {
    const stats = getDatabaseStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to fetch database info.', err);
  }
});

app.get('/api/sql/tables', requireAdminAuth, (req, res) => {
  try {
    const tables = getTableList();
    const stats = getDatabaseStats();
    res.json({ success: true, count: tables.length, data: tables, stats });
  } catch (err) {
    sendSafeError(res, 500, 'Failed to fetch database tables.', err);
  }
});

app.get('/api/sql/table/:table', requireAdminAuth, (req, res) => {
  try {
    // Validate table name against path traversal
    const safeTable = req.params.table.replace(/[^a-zA-Z0-9_]/g, '');
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const result = getTableRows(safeTable, limit, offset);
    res.json({ success: true, data: result });
  } catch (err) {
    sendSafeError(res, 400, 'Invalid table query.', err);
  }
});

app.post('/api/sql/query', requireAdminAuth, (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'SQL query string is required' });
    }
    const result = executeCustomSqlQuery(query);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    sendSafeError(res, 500, 'SQL query execution failed.', err);
  }
});

// Protected Database Downloads
app.get('/api/data/download', requireAdminAuth, (req, res) => {
  try {
    if (fs.existsSync(JSON_DB_FILE)) {
      res.download(JSON_DB_FILE, 'rs_refurbished_database.json');
    } else {
      res.status(404).json({ success: false, error: 'Database file not found' });
    }
  } catch (err) {
    sendSafeError(res, 500, 'Download failed.', err);
  }
});

app.get('/api/data/download-excel', requireAdminAuth, async (req, res) => {
  try {
    const db = loadDatabase();
    await syncDatabaseToExcel(db);
    if (fs.existsSync(EXCEL_DB_FILE)) {
      res.download(EXCEL_DB_FILE, 'rs_refurbished_database.xlsx');
    } else {
      res.status(404).json({ success: false, error: 'Excel database file not found' });
    }
  } catch (err) {
    sendSafeError(res, 500, 'Excel download failed.', err);
  }
});

app.get('/api/sql/download', requireAdminAuth, (req, res) => {
  try {
    if (fs.existsSync(JSON_DB_FILE)) {
      res.download(JSON_DB_FILE, 'rs_refurbished_database.json');
    } else {
      res.status(404).json({ success: false, error: 'Database file not found' });
    }
  } catch (err) {
    sendSafeError(res, 500, 'Download failed.', err);
  }
});

app.get('/api/sql/dump', requireAdminAuth, (req, res) => {
  try {
    const dump = getSqlDump();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="rs_refurbished_database.json"');
    res.send(dump);
  } catch (err) {
    sendSafeError(res, 500, 'Dump failed.', err);
  }
});

app.post('/api/admin/reset', requireAdminAuth, (req, res) => {
  try {
    resetDatabase();
    res.json({ success: true, message: 'Database reset to factory defaults', stats: getDatabaseStats() });
  } catch (err) {
    sendSafeError(res, 500, 'Reset failed.', err);
  }
});

app.get('/api/admin/export', requireAdminAuth, (req, res) => {
  try {
    const db = loadDatabase();
    res.json({ success: true, data: db });
  } catch (err) {
    sendSafeError(res, 500, 'Export failed.', err);
  }
});

// -------------------------------------------------------------
// GOOGLE GEMINI LLM AI CHAT ADVISOR (Rate-Limited & Hardened)
// -------------------------------------------------------------
app.get('/api/ai/status', (req, res) => {
  res.json({
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  });
});

app.post('/api/ai/chat', aiChatLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid message string is required.' });
    }

    // Cap message length to 1000 characters to prevent prompt injection overflow
    const safeMessage = message.slice(0, 1000).trim();

    if (!apiKey) {
      return res.json({
        success: false,
        fallback: true,
        reason: 'NO_API_KEY',
        message: 'Google Gemini API key not configured. Using smart built-in advisor.'
      });
    }

    // Build Contextual Inventory Knowledge
    const db = loadDatabase();
    const inventoryLaptops = (db.laptops || []).map(l => ({
      name: l.name,
      brand: l.brand,
      model: l.model,
      processor: l.processor,
      ram: l.ram,
      storage: l.storage,
      condition: l.conditionGrade,
      status: l.inStock ? 'In Stock' : 'Out of Stock'
    }));

    const systemPrompt = `You are "RS Assistant", the friendly and knowledgeable store assistant for RS Refurbished Laptops & Services (WhatsApp & Helpline: +91 8668848486, Location: Sant Tukaram Nagar, Pimpri, Pune 411018, Maharashtra, India).

Your personality: Warm, conversational, and helpful — like a knowledgeable friend who works at a tech store. You speak naturally, use friendly language, and never sound robotic or scripted.

IMPORTANT — Answer ANY question the customer asks:
- If it's about laptops, tech, repairs, accessories, specs, software — give a genuinely helpful, detailed answer.
- If it's a general life question, fun question, advice, or anything else — answer it warmly and naturally like a human friend would, then gently tie it back to the store if relevant.
- NEVER say "I can only help with laptops" or refuse to answer. Be a good conversationalist.
- NEVER say you are "powered by Google Gemini" or mention any AI model name. You are simply "RS Assistant".

About the Store:
1. Certified Grade A+ Refurbished Laptops — only the best quality machines.
2. 32-Point Quality Diagnostic Check on every machine before sale.
3. 1-Month Complete Functional Testing Warranty on all parts.
4. Insured Doorstep Delivery across India.
5. In-house Chip-Level Laptop Repair Lab in Pimpri, Pune.
6. Corporate B2B Fleet Rentals and Bulk Procurement.

BUSINESS RULES:
- NEVER state fixed prices. Always say to DM on WhatsApp for today's best deal price.
- NEVER quote specific stock counts. Only say "In Stock" or "Out of Stock".
- Recommend matching models from Live Store Inventory when relevant:
${JSON.stringify(inventoryLaptops, null, 2)}

Formatting:
- Keep responses readable (use markdown bold, bullet points, clean spacing).
- End laptop recommendations with a warm invitation to DM on WhatsApp (+91 8668848486) for live photos and pricing.`;

    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.7-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-1.5-flash'
    ].filter(Boolean);

    // Format chat history for Gemini API
    const formattedContents = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-8).forEach(item => {
        if (item.sender === 'user' || item.role === 'user') {
          formattedContents.push({ role: 'user', parts: [{ text: String(item.text || item.content || '').slice(0, 500) }] });
        } else if (item.sender === 'ai' || item.role === 'model') {
          formattedContents.push({ role: 'model', parts: [{ text: String(item.text || item.content || '').slice(0, 500) }] });
        }
      });
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: safeMessage }]
    });

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    };

    let replyText = '';
    let usedModel = '';

    for (const modelToTry of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload)
        });

        if (response.ok) {
          const data = await response.json();
          const textCandidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textCandidate && textCandidate.trim()) {
            replyText = textCandidate.trim();
            usedModel = modelToTry;
            break;
          }
        } else {
          const errBody = await response.text();
          console.warn(`Gemini model ${modelToTry} failed (${response.status}):`, errBody.slice(0, 150));
        }
      } catch (callErr) {
        console.warn(`Gemini model ${modelToTry} network error:`, callErr.message);
      }
    }

    if (!replyText) {
      return res.json({
        success: false,
        fallback: true,
        reason: 'API_ERROR',
        error: 'All Gemini model candidates failed or returned empty.'
      });
    }

    return res.json({
      success: true,
      reply: replyText,
      model: usedModel
    });

  } catch (error) {
    sendSafeError(res, 500, 'Server AI Chat handler error.', error);
  }
});

// -------------------------------------------------------------
// STATIC FRONTEND SERVING
// -------------------------------------------------------------
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexHtml = path.join(distPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.send(`
    <html>
      <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
        <h2>RS Refurbished Laptops & Services API is Running</h2>
        <p>Official Helpline: <strong>+91 8668848486</strong></p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  RS Refurbished Laptops & Services Server`);
  console.log(`  Database Backend: JSON Document Store (Persistent Database)`);
  console.log(`  Security: OWASP Hardened (HMAC Auth, Rate Limiter, XSS/CSP)`);
  console.log(`  Server running on: http://localhost:${PORT}`);
  console.log(`  Helpline Contact: +91 8668848486`);
  console.log(`======================================================\n`);
});

export default app;
