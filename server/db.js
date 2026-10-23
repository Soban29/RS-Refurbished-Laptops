import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_LAPTOPS, 
  INITIAL_INQUIRIES, 
  INITIAL_SERVICE_TICKETS, 
  INITIAL_ORDERS,
  INITIAL_USERS 
} from '../src/data/initialLaptops.js';
import { INITIAL_ACCESSORIES } from '../src/data/accessories.js';
import { syncDatabaseToExcel } from './excelSync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const JSON_DB_FILE = path.join(DATA_DIR, 'rs_refurbished_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// CORE DATABASE LOAD & SAVE (JSON Document Store + Side-by-Side Excel)
// -------------------------------------------------------------
export const loadDatabase = () => {
  try {
    if (fs.existsSync(JSON_DB_FILE)) {
      const raw = fs.readFileSync(JSON_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        // Ensure standard collections exist
        parsed.users = Array.isArray(parsed.users) ? parsed.users : [...INITIAL_USERS];
        parsed.laptops = Array.isArray(parsed.laptops) ? parsed.laptops : [...INITIAL_LAPTOPS];
        parsed.accessories = Array.isArray(parsed.accessories) ? parsed.accessories : [...INITIAL_ACCESSORIES];
        parsed.inquiries = Array.isArray(parsed.inquiries) ? parsed.inquiries : [...INITIAL_INQUIRIES];
        parsed.serviceTickets = Array.isArray(parsed.serviceTickets) 
          ? parsed.serviceTickets 
          : (Array.isArray(parsed.services) ? parsed.services : [...INITIAL_SERVICE_TICKETS]);
        parsed.orders = Array.isArray(parsed.orders) ? parsed.orders : [...INITIAL_ORDERS];
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Database] Error reading rs_refurbished_database.json:', err.message);
  }

  // Fallback to fresh initial database
  const freshDb = {
    version: '1.0.0 (JSON Database)',
    databaseFile: 'rs_refurbished_database.json',
    lastUpdated: new Date().toISOString(),
    contactPhone: '+91 8668848486',
    users: [...INITIAL_USERS],
    laptops: [...INITIAL_LAPTOPS],
    accessories: [...INITIAL_ACCESSORIES],
    inquiries: [...INITIAL_INQUIRIES],
    serviceTickets: [...INITIAL_SERVICE_TICKETS],
    orders: [...INITIAL_ORDERS]
  };
  saveDatabase(freshDb);
  return freshDb;
};

export const saveDatabase = (data) => {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(JSON_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Maintain Excel file side-by-side
    syncDatabaseToExcel(data).catch(err => {
      console.warn('[Database] Async Excel sync warning:', err.message);
    });
    return true;
  } catch (err) {
    console.error('[Database] Failed to write database JSON:', err.message);
    return false;
  }
};

export const getAccessories = () => {
  const db = loadDatabase();
  return [...(db.accessories || [])];
};

// -------------------------------------------------------------
// USER CRUD OPERATIONS
// -------------------------------------------------------------
export const getUsers = () => {
  const db = loadDatabase();
  return [...(db.users || [])];
};

export const getUserById = (id) => {
  const db = loadDatabase();
  return (db.users || []).find(u => u.id === id) || null;
};

export const getUserByEmail = (email) => {
  if (!email) return null;
  const db = loadDatabase();
  const cleanEmail = email.trim().toLowerCase();
  return (db.users || []).find(u => u.email && u.email.trim().toLowerCase() === cleanEmail) || null;
};

export const addUser = (user) => {
  const db = loadDatabase();
  db.users = db.users || [];
  const cleanEmail = (user.email || '').trim().toLowerCase();
  const now = new Date().toISOString();

  const existingIdx = db.users.findIndex(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
  if (existingIdx !== -1) {
    // Update existing user
    db.users[existingIdx] = {
      ...db.users[existingIdx],
      name: user.name || db.users[existingIdx].name,
      phone: user.phone || db.users[existingIdx].phone,
      avatar: user.avatar || db.users[existingIdx].avatar,
      lastLogin: now
    };
    saveDatabase(db);
    return db.users[existingIdx];
  }

  const newUser = {
    ...user,
    id: user.id || `usr-${Date.now().toString().slice(-6)}`,
    name: user.name || user.email.split('@')[0],
    email: user.email.trim(),
    phone: user.phone || '',
    role: user.role || 'customer',
    provider: user.provider || 'email',
    avatar: user.avatar || '',
    createdAt: user.createdAt || now,
    lastLogin: now
  };

  db.users.unshift(newUser);
  saveDatabase(db);
  return newUser;
};

export const updateUser = (id, fields) => {
  const db = loadDatabase();
  db.users = db.users || [];
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return null;

  db.users[idx] = {
    ...db.users[idx],
    ...fields,
    lastLogin: fields.lastLogin || db.users[idx].lastLogin || new Date().toISOString()
  };
  saveDatabase(db);
  return db.users[idx];
};

export const deleteUser = (id) => {
  const db = loadDatabase();
  db.users = db.users || [];
  const initialLen = db.users.length;
  db.users = db.users.filter(u => u.id !== id);
  if (db.users.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
};

// -------------------------------------------------------------
// LAPTOPS CRUD OPERATIONS
// -------------------------------------------------------------
export const getLaptops = () => {
  const db = loadDatabase();
  return [...(db.laptops || [])];
};

export const getLaptopById = (id) => {
  const db = loadDatabase();
  return (db.laptops || []).find(l => l.id === id) || null;
};

export const addLaptop = (laptop) => {
  const db = loadDatabase();
  db.laptops = db.laptops || [];
  const now = new Date().toISOString();

  const newLaptop = {
    ...laptop,
    id: laptop.id || `lap-${Date.now().toString().slice(-4)}`,
    name: laptop.name || 'Refurbished Laptop',
    brand: laptop.brand || 'Lenovo',
    model: laptop.model || '',
    price: Number(laptop.price) || 0,
    originalPrice: Number(laptop.originalPrice) || Number(laptop.price) || 0,
    category: laptop.category || 'Business',
    targetAudience: Array.isArray(laptop.targetAudience) ? laptop.targetAudience : [],
    conditionGrade: laptop.conditionGrade || 'Grade A+ (Like New)',
    processor: laptop.processor || '',
    processorFamily: laptop.processorFamily || '',
    ram: laptop.ram || '',
    ramSize: Number(laptop.ramSize) || 16,
    storage: laptop.storage || '',
    storageSize: Number(laptop.storageSize) || 512,
    display: laptop.display || '',
    screenSize: Number(laptop.screenSize) || 14,
    gpu: laptop.gpu || '',
    os: laptop.os || 'Windows 11 Pro Genuine',
    warrantyMonths: Number(laptop.warrantyMonths) || 12,
    batteryHealth: laptop.batteryHealth || '90%+',
    stockCount: Number(laptop.stockCount) || 1,
    inStock: (Number(laptop.stockCount) > 0 && laptop.inStock !== false),
    inspectionScore: laptop.inspectionScore || '32/32 Passed',
    featured: Boolean(laptop.featured),
    tags: Array.isArray(laptop.tags) ? laptop.tags : ['Certified A+'],
    image: laptop.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    description: laptop.description || '',
    specs: laptop.specs || {},
    createdAt: laptop.createdAt || now,
    updatedAt: now
  };

  db.laptops.unshift(newLaptop);
  saveDatabase(db);
  return newLaptop;
};

export const updateLaptop = (id, fields) => {
  const db = loadDatabase();
  db.laptops = db.laptops || [];
  const idx = db.laptops.findIndex(l => l.id === id);
  if (idx === -1) return null;

  const current = db.laptops[idx];
  const updated = {
    ...current,
    ...fields,
    price: fields.price !== undefined ? Number(fields.price) : current.price,
    originalPrice: fields.originalPrice !== undefined ? Number(fields.originalPrice) : current.originalPrice,
    ramSize: fields.ramSize !== undefined ? Number(fields.ramSize) : current.ramSize,
    storageSize: fields.storageSize !== undefined ? Number(fields.storageSize) : current.storageSize,
    screenSize: fields.screenSize !== undefined ? Number(fields.screenSize) : current.screenSize,
    stockCount: fields.stockCount !== undefined ? Number(fields.stockCount) : current.stockCount,
    inStock: fields.inStock !== undefined 
      ? Boolean(fields.inStock) 
      : (fields.stockCount !== undefined ? Number(fields.stockCount) > 0 : current.inStock),
    updatedAt: new Date().toISOString()
  };

  db.laptops[idx] = updated;
  saveDatabase(db);
  return updated;
};

export const deleteLaptop = (id) => {
  const db = loadDatabase();
  db.laptops = db.laptops || [];
  const initialLen = db.laptops.length;
  db.laptops = db.laptops.filter(l => l.id !== id);
  if (db.laptops.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
};

// -------------------------------------------------------------
// INQUIRIES / LEADS CRUD OPERATIONS
// -------------------------------------------------------------
export const getInquiries = () => {
  const db = loadDatabase();
  return [...(db.inquiries || [])];
};

export const addInquiry = (inquiry) => {
  const db = loadDatabase();
  db.inquiries = db.inquiries || [];
  const now = new Date().toISOString();

  const newInquiry = {
    ...inquiry,
    id: inquiry.id || `inq-${Date.now().toString().slice(-4)}`,
    date: inquiry.date || now.slice(0, 10),
    customerName: inquiry.customerName || '',
    companyName: inquiry.companyName || '',
    clientType: inquiry.clientType || 'Corporate',
    email: inquiry.email || '',
    phone: inquiry.phone || '',
    laptopModel: inquiry.laptopModel || '',
    quantity: Number(inquiry.quantity) || 1,
    budgetPerUnit: inquiry.budgetPerUnit || '',
    serviceType: inquiry.serviceType || '',
    status: inquiry.status || 'Pending',
    notes: inquiry.notes || '',
    createdAt: inquiry.createdAt || now,
    updatedAt: now
  };

  db.inquiries.unshift(newInquiry);
  saveDatabase(db);
  return newInquiry;
};

export const updateInquiryStatus = (id, status) => {
  const db = loadDatabase();
  db.inquiries = db.inquiries || [];
  const idx = db.inquiries.findIndex(i => i.id === id);
  if (idx === -1) return null;

  db.inquiries[idx] = {
    ...db.inquiries[idx],
    status,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  return db.inquiries[idx];
};

export const deleteInquiry = (id) => {
  const db = loadDatabase();
  db.inquiries = db.inquiries || [];
  const initialLen = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => i.id !== id);
  if (db.inquiries.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
};

// -------------------------------------------------------------
// SERVICE TICKETS CRUD OPERATIONS
// -------------------------------------------------------------
export const getServiceTickets = () => {
  const db = loadDatabase();
  return [...(db.serviceTickets || [])];
};

export const addServiceTicket = (ticket) => {
  const db = loadDatabase();
  db.serviceTickets = db.serviceTickets || [];
  const now = new Date().toISOString();

  const newTicket = {
    ...ticket,
    id: ticket.id || `srv-${Date.now().toString().slice(-4)}`,
    date: ticket.date || now.slice(0, 10),
    customerName: ticket.customerName || '',
    phone: ticket.phone || '',
    laptopBrandModel: ticket.laptopBrandModel || '',
    issueType: ticket.issueType || '',
    serviceCategory: ticket.serviceCategory || '',
    estimatedCost: ticket.estimatedCost || '',
    status: ticket.status || 'Pending Inspection',
    pickupRequired: ticket.pickupRequired ? 1 : 0,
    address: ticket.address || '',
    createdAt: ticket.createdAt || now,
    updatedAt: now
  };

  db.serviceTickets.unshift(newTicket);
  saveDatabase(db);
  return newTicket;
};

export const updateServiceTicketStatus = (id, status) => {
  const db = loadDatabase();
  db.serviceTickets = db.serviceTickets || [];
  const idx = db.serviceTickets.findIndex(s => s.id === id);
  if (idx === -1) return null;

  db.serviceTickets[idx] = {
    ...db.serviceTickets[idx],
    status,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  return db.serviceTickets[idx];
};

export const deleteServiceTicket = (id) => {
  const db = loadDatabase();
  db.serviceTickets = db.serviceTickets || [];
  const initialLen = db.serviceTickets.length;
  db.serviceTickets = db.serviceTickets.filter(s => s.id !== id);
  if (db.serviceTickets.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
};

// -------------------------------------------------------------
// ORDERS & SALES CRUD OPERATIONS
// -------------------------------------------------------------
export const getOrders = () => {
  const db = loadDatabase();
  return [...(db.orders || [])];
};

export const addOrder = (order) => {
  const db = loadDatabase();
  db.orders = db.orders || [];
  const now = new Date().toISOString();

  const newOrder = {
    ...order,
    id: order.id || `ord-${Date.now().toString().slice(-4)}`,
    quoteNumber: order.quoteNumber || `RS-INV-${Date.now().toString().slice(-6)}`,
    date: order.date || now.slice(0, 10),
    month: order.month || new Date().toLocaleString('default', { month: 'short' }),
    customerName: order.customerName || '',
    customerPhone: order.customerPhone || '',
    customerEmail: order.customerEmail || '',
    companyName: order.companyName || '',
    companyPhone: order.companyPhone || '',
    gstin: order.gstin || '',
    items: Array.isArray(order.items) ? order.items : [],
    quantity: Number(order.quantity) || 1,
    tier: order.tier || 'Individual',
    totalAmount: Number(order.totalAmount) || 0,
    amountPaid: Number(order.amountPaid) || 0,
    paymentStatus: order.paymentStatus || 'Paid',
    paymentMode: order.paymentMode || 'Online',
    paymentRef: order.paymentRef || '',
    status: order.status || 'Payment Confirmed',
    notes: order.notes || '',
    createdAt: order.createdAt || now,
    updatedAt: now
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);
  return newOrder;
};

export const updateOrderStatus = (id, status) => {
  const db = loadDatabase();
  db.orders = db.orders || [];
  const idx = db.orders.findIndex(o => o.id === id);
  if (idx === -1) return null;

  db.orders[idx] = {
    ...db.orders[idx],
    status,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  return db.orders[idx];
};

export const deleteOrder = (id) => {
  const db = loadDatabase();
  db.orders = db.orders || [];
  const initialLen = db.orders.length;
  db.orders = db.orders.filter(o => o.id !== id);
  if (db.orders.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
};

// -------------------------------------------------------------
// DATABASE STATS & COLLECTIONS INSPECTOR
// -------------------------------------------------------------
export const getDatabaseStats = () => {
  let fileSize = 0;
  let lastModified = new Date().toISOString();

  if (fs.existsSync(JSON_DB_FILE)) {
    const stats = fs.statSync(JSON_DB_FILE);
    fileSize = stats.size;
    lastModified = stats.mtime.toISOString();
  }

  const db = loadDatabase();

  return {
    engine: 'JSON Document Store',
    databaseFile: 'rs_refurbished_database.json',
    filePath: 'data/rs_refurbished_database.json',
    fileName: 'rs_refurbished_database.json',
    fileSizeBytes: fileSize,
    fileSizeFormatted: `${(fileSize / 1024).toFixed(1)} KB`,
    lastModified,
    tableCounts: {
      users: (db.users || []).length,
      laptops: (db.laptops || []).length,
      inquiries: (db.inquiries || []).length,
      service_tickets: (db.serviceTickets || []).length,
      orders: (db.orders || []).length
    }
  };
};

export const getTableList = () => {
  const db = loadDatabase();
  return [
    { tableName: 'users', rowCount: (db.users || []).length },
    { tableName: 'laptops', rowCount: (db.laptops || []).length },
    { tableName: 'orders', rowCount: (db.orders || []).length },
    { tableName: 'inquiries', rowCount: (db.inquiries || []).length },
    { tableName: 'service_tickets', rowCount: (db.serviceTickets || []).length }
  ];
};

export const getTableRows = (tableName, limit = 100, offset = 0) => {
  const db = loadDatabase();
  let rows = [];

  if (tableName === 'users') rows = db.users || [];
  else if (tableName === 'laptops') rows = db.laptops || [];
  else if (tableName === 'orders') rows = db.orders || [];
  else if (tableName === 'inquiries') rows = db.inquiries || [];
  else if (tableName === 'service_tickets') rows = db.serviceTickets || [];
  else {
    throw new Error(`Collection "${tableName}" does not exist in JSON database.`);
  }

  return {
    tableName,
    totalRows: rows.length,
    limit,
    offset,
    rows: rows.slice(offset, offset + limit)
  };
};

export const executeCustomSqlQuery = (query) => {
  const startTime = Date.now();
  const db = loadDatabase();
  // Safe JSON collection query helper
  const lower = query.toLowerCase().trim();
  let matchedTable = 'laptops';
  if (lower.includes('users')) matchedTable = 'users';
  else if (lower.includes('orders')) matchedTable = 'orders';
  else if (lower.includes('inquiries')) matchedTable = 'inquiries';
  else if (lower.includes('service')) matchedTable = 'service_tickets';

  const result = getTableRows(matchedTable, 50, 0);

  return {
    success: true,
    type: 'SELECT',
    columns: result.rows.length > 0 ? Object.keys(result.rows[0]) : [],
    rows: result.rows,
    rowCount: result.rows.length,
    executionTimeMs: Date.now() - startTime,
    message: `JSON database query on collection "${matchedTable}"`
  };
};

export const getSqlDump = () => {
  return JSON.stringify(loadDatabase(), null, 2);
};

// -------------------------------------------------------------
// FACTORY RESET
// -------------------------------------------------------------
export const resetDatabase = () => {
  const freshDb = {
    version: '1.0.0 (JSON Database)',
    databaseFile: 'rs_refurbished_database.json',
    lastUpdated: new Date().toISOString(),
    contactPhone: '+91 8668848486',
    users: [...INITIAL_USERS],
    laptops: [...INITIAL_LAPTOPS],
    inquiries: [...INITIAL_INQUIRIES],
    serviceTickets: [...INITIAL_SERVICE_TICKETS],
    orders: [...INITIAL_ORDERS]
  };
  saveDatabase(freshDb);
  return freshDb;
};
