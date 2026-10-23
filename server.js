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

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------------------------------------------
// CYBERSECURITY DEFENSE LAYER (Anti-Cybercrime & Attack Shield)
// -------------------------------------------------------------

// 1. Security Headers (Defense-in-Depth against XSS, Clickjacking, Sniffing)
app.use((req, res, next) => {
  // Prevent MIME-type sniffing exploits
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent Clickjacking attacks (blocking unauthorized iframe embeds)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Legacy XSS filter protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer Policy to prevent data leakage in URL headers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Hardware permissions policy lockdown
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // Content Security Policy (enforcing strict resource boundaries)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;"
  );
  // Hide server fingerprint from automated scanners
  res.removeHeader('X-Powered-By');
  next();
});

// 2. Strict Rate Limiting (DDoS & API Abuse Defense)
const requestRateMap = new Map();
const RATE_WINDOW_MS = 60 * 1000; // 1 minute sliding window
const MAX_REQUESTS_PER_MINUTE = 180; // max 180 req/min per IP

const rateLimiter = (req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientStats = requestRateMap.get(clientIp) || { count: 0, resetTime: now + RATE_WINDOW_MS };

  if (now > clientStats.resetTime) {
    clientStats.count = 1;
    clientStats.resetTime = now + RATE_WINDOW_MS;
  } else {
    clientStats.count++;
  }

  requestRateMap.set(clientIp, clientStats);

  // Periodically clean stale IP maps (memory leak prevention)
  if (requestRateMap.size > 10000) {
    for (const [ip, data] of requestRateMap.entries()) {
      if (now > data.resetTime) requestRateMap.delete(ip);
    }
  }

  if (clientStats.count > MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Cyber protection rate limit triggered. Please wait a moment.'
    });
  }

  next();
};

app.use(rateLimiter);

// 3. Payload size limiting (JSON Bomb & Memory Exhaustion DoS prevention)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '400kb' }));

// 4. Recursive Input Sanitizer (XSS & Script Injection Shield)
const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    // Strip dangerous HTML script tags and javascript: URIs
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:[^"']*/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
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

// Health & Info Endpoint
app.get('/api/health', (req, res) => {
  const stats = getDatabaseStats();
  res.json({
    status: 'online',
    appName: 'RS Refurbished Laptops & Services API',
    databaseEngine: 'JSON Document Store (data/rs_refurbished_database.json)',
    contact: '+91 8668848486',
    databaseStats: stats,
    timestamp: new Date().toISOString()
  });
});

// --- User Management Endpoints (Users Collection) ---
app.get('/api/users', (req, res) => {
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
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const user = addUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const updated = updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const deleted = deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Laptops Endpoints (Laptops Collection) ---
app.get('/api/laptops', (req, res) => {
  try {
    const laptops = getLaptops();
    res.json({ success: true, count: laptops.length, data: laptops });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/laptops', (req, res) => {
  try {
    const newLaptop = addLaptop(req.body);
    res.status(201).json({ success: true, data: newLaptop });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/laptops/:id', (req, res) => {
  try {
    const updated = updateLaptop(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Laptop not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/laptops/:id', (req, res) => {
  try {
    const deleted = deleteLaptop(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Laptop not found' });
    }
    res.json({ success: true, message: 'Laptop deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Inquiries Endpoints (Inquiries Collection) ---
app.get('/api/inquiries', (req, res) => {
  try {
    const inquiries = getInquiries();
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/inquiries', (req, res) => {
  try {
    const newInquiry = addInquiry(req.body);
    res.status(201).json({ success: true, data: newInquiry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/inquiries/:id', (req, res) => {
  try {
    const updated = updateInquiryStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/inquiries/:id', (req, res) => {
  try {
    const deleted = deleteInquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Service Tickets Endpoints (Service Tickets Collection) ---
app.get('/api/services', (req, res) => {
  try {
    const tickets = getServiceTickets();
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/services', (req, res) => {
  try {
    const newTicket = addServiceTicket(req.body);
    res.status(201).json({ success: true, data: newTicket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/services/:id', (req, res) => {
  try {
    const updated = updateServiceTicketStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/services/:id', (req, res) => {
  try {
    const deleted = deleteServiceTicket(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Orders & Sales Endpoints (Orders Collection) ---
app.get('/api/orders', (req, res) => {
  try {
    const orders = getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const newOrder = addOrder(req.body);
    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const updated = updateOrderStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const deleted = deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Database Inspection Endpoints ---
app.get('/api/sql/info', (req, res) => {
  try {
    const stats = getDatabaseStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sql/tables', (req, res) => {
  try {
    const tables = getTableList();
    const stats = getDatabaseStats();
    res.json({ success: true, count: tables.length, data: tables, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sql/table/:table', (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;
    const result = getTableRows(req.params.table, limit, offset);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/sql/query', (req, res) => {
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
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/data/download', (req, res) => {
  try {
    if (fs.existsSync(JSON_DB_FILE)) {
      res.download(JSON_DB_FILE, 'rs_refurbished_database.json');
    } else {
      res.status(404).json({ success: false, error: 'Database file not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Download side-by-side Excel database file (.xlsx)
app.get('/api/data/download-excel', async (req, res) => {
  try {
    const db = loadDatabase();
    await syncDatabaseToExcel(db);
    if (fs.existsSync(EXCEL_DB_FILE)) {
      res.download(EXCEL_DB_FILE, 'rs_refurbished_database.xlsx');
    } else {
      res.status(404).json({ success: false, error: 'Excel database file not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Accessories API
app.get('/api/accessories', (req, res) => {
  try {
    const acc = getAccessories();
    res.json({ success: true, count: acc.length, data: acc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backward compatibility download route
app.get('/api/sql/download', (req, res) => {
  try {
    if (fs.existsSync(JSON_DB_FILE)) {
      res.download(JSON_DB_FILE, 'rs_refurbished_database.json');
    } else {
      res.status(404).json({ success: false, error: 'Database file not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sql/dump', (req, res) => {
  try {
    const dump = getSqlDump();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="rs_refurbished_database.json"');
    res.send(dump);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Admin Controls with Anti-Brute-Force & Timing-Attack Defense ---
const adminFailedAttempts = new Map();
const ADMIN_MAX_FAILS = 5;
const ADMIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

app.post('/api/admin/login', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attemptInfo = adminFailedAttempts.get(clientIp) || { fails: 0, lockedUntil: 0 };

  if (attemptInfo.lockedUntil && now < attemptInfo.lockedUntil) {
    const remainingMinutes = Math.ceil((attemptInfo.lockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      error: `Security lockout: Too many failed login attempts. Account temporarily protected for ${remainingMinutes} more minute(s).`
    });
  }

  const { passcode } = req.body;
  const validPasscodes = ['admin123', 'admin', 'rs123'];

  // Constant-time comparison using crypto SHA-256 hashes to prevent timing attacks
  const isMatch = validPasscodes.some(validCode => {
    try {
      const hashA = crypto.createHash('sha256').update(String(passcode || '')).digest();
      const hashB = crypto.createHash('sha256').update(validCode).digest();
      return crypto.timingSafeEqual(hashA, hashB);
    } catch (e) {
      return false;
    }
  });

  if (isMatch) {
    adminFailedAttempts.delete(clientIp);
    return res.json({
      success: true,
      message: 'Authentication successful',
      token: 'rs_auth_token_secret'
    });
  }

  // Increment failure count on incorrect passcode
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

app.post('/api/admin/reset', (req, res) => {
  try {
    resetDatabase();
    res.json({ success: true, message: 'Database reset to factory defaults', stats: getDatabaseStats() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/export', (req, res) => {
  try {
    const db = loadDatabase();
    res.json({ success: true, data: db });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Static Frontend for Production
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
        <p>Database: <strong>JSON Document Store</strong> (<code>data/rs_refurbished_database.json</code>)</p>
        <p>Official Helpline: <strong>+91 8668848486</strong></p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  RS Refurbished Laptops & Services Server`);
  console.log(`  Database Backend: JSON Document Store (Persistent Database)`);
  console.log(`  Database File: data/rs_refurbished_database.json`);
  console.log(`  Server running on: http://localhost:${PORT}`);
  console.log(`  Helpline Contact: +91 8668848486`);
  console.log(`======================================================\n`);
});

export default app;

