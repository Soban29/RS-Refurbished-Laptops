import {
  getStoredUsers,
  saveStoredUsers,
  addStoredUser,
  getStoredLaptops,
  saveStoredLaptops,
  getStoredInquiries,
  saveStoredInquiries,
  getStoredServiceTickets,
  saveStoredServiceTickets,
  getStoredOrders,
  saveStoredOrders,
  addStoredOrder,
  resetToFactoryData
} from '../utils/storage';

const API_BASE = '/api';

// Helper for fetch with timeout and error fallback
async function fetchWithFallback(url, options = {}, fallbackFn) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    }
  } catch (err) {
    // Graceful fallback to client storage
  }
  return fallbackFn ? fallbackFn() : null;
}

// -------------------------------------------------------------
// USERS API (Users Collection)
// -------------------------------------------------------------
export const fetchUsers = async () => {
  return fetchWithFallback(`${API_BASE}/users`, {}, () => getStoredUsers());
};

export const createUserApi = async (user) => {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        addStoredUser(json.data);
        return json.data;
      }
    }
  } catch (err) {}
  return addStoredUser(user);
};

export const updateUserApi = async (user) => {
  try {
    const res = await fetch(`${API_BASE}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {}
  const current = getStoredUsers();
  const updated = current.map(u => u.id === user.id ? { ...u, ...user } : u);
  saveStoredUsers(updated);
  return user;
};

export const deleteUserApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {}
  const current = getStoredUsers();
  saveStoredUsers(current.filter(u => u.id !== id));
  return true;
};

// -------------------------------------------------------------
// LAPTOPS API (Laptops Collection)
// -------------------------------------------------------------
export const fetchLaptops = async () => {
  return fetchWithFallback(`${API_BASE}/laptops`, {}, () => getStoredLaptops());
};

export const createLaptop = async (laptop) => {
  try {
    const res = await fetch(`${API_BASE}/laptops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laptop)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  const current = getStoredLaptops();
  const newLap = { ...laptop, id: laptop.id || `lap-${Date.now().toString().slice(-4)}` };
  const updated = [newLap, ...current];
  saveStoredLaptops(updated);
  return newLap;
};

export const updateLaptopApi = async (laptop) => {
  try {
    const res = await fetch(`${API_BASE}/laptops/${laptop.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laptop)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  const current = getStoredLaptops();
  const updated = current.map(l => l.id === laptop.id ? laptop : l);
  saveStoredLaptops(updated);
  return laptop;
};

export const deleteLaptopApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/laptops/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {}
  const current = getStoredLaptops();
  saveStoredLaptops(current.filter(l => l.id !== id));
  return true;
};

// -------------------------------------------------------------
// INQUIRIES API (Inquiries Collection)
// -------------------------------------------------------------
export const fetchInquiries = async () => {
  return fetchWithFallback(`${API_BASE}/inquiries`, {}, () => getStoredInquiries());
};

export const createInquiryApi = async (inquiry) => {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  const current = getStoredInquiries();
  const updated = [inquiry, ...current];
  saveStoredInquiries(updated);
  return inquiry;
};

export const updateInquiryStatusApi = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  const current = getStoredInquiries();
  const updated = current.map(i => i.id === id ? { ...i, status } : i);
  saveStoredInquiries(updated);
  return { id, status };
};

export const deleteInquiryApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {}
  const current = getStoredInquiries();
  saveStoredInquiries(current.filter(i => i.id !== id));
  return true;
};

// -------------------------------------------------------------
// SERVICE TICKETS API (Service Tickets Collection)
// -------------------------------------------------------------
export const fetchServiceTickets = async () => {
  return fetchWithFallback(`${API_BASE}/services`, {}, () => getStoredServiceTickets());
};

export const createServiceTicketApi = async (ticket) => {
  try {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  const current = getStoredServiceTickets();
  const updated = [ticket, ...current];
  saveStoredServiceTickets(updated);
  return ticket;
};

export const updateServiceStatusApi = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  const current = getStoredServiceTickets();
  const updated = current.map(s => s.id === id ? { ...s, status } : s);
  saveStoredServiceTickets(updated);
  return { id, status };
};

export const deleteServiceTicketApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {}
  const current = getStoredServiceTickets();
  saveStoredServiceTickets(current.filter(s => s.id !== id));
  return true;
};

// -------------------------------------------------------------
// ORDERS & SALES API (Orders Collection)
// -------------------------------------------------------------
export const fetchOrders = async () => {
  return fetchWithFallback(`${API_BASE}/orders`, {}, () => getStoredOrders());
};

export const createOrderApi = async (order) => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  return addStoredOrder(order);
};

export const updateOrderStatusApi = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {}
  const current = getStoredOrders();
  const updated = current.map(o => o.id === id ? { ...o, status } : o);
  saveStoredOrders(updated);
  return { id, status };
};

// -------------------------------------------------------------
// DATABASE INSPECTION & METADATA API
// -------------------------------------------------------------
export const fetchSqlInfo = async () => {
  try {
    const res = await fetch(`${API_BASE}/sql/info`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {}
  return {
    engine: 'JSON Document Store',
    databaseFile: 'rs_refurbished_database.json',
    filePath: 'data/rs_refurbished_database.json',
    fileName: 'rs_refurbished_database.json',
    fileSizeFormatted: '36.7 KB',
    tableCounts: {
      users: getStoredUsers().length,
      laptops: getStoredLaptops().length,
      inquiries: getStoredInquiries().length,
      service_tickets: getStoredServiceTickets().length,
      orders: getStoredOrders().length
    }
  };
};

export const fetchSqlTables = async () => {
  try {
    const res = await fetch(`${API_BASE}/sql/tables`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {}
  return [
    { tableName: 'users', rowCount: getStoredUsers().length },
    { tableName: 'laptops', rowCount: getStoredLaptops().length },
    { tableName: 'inquiries', rowCount: getStoredInquiries().length },
    { tableName: 'service_tickets', rowCount: getStoredServiceTickets().length },
    { tableName: 'orders', rowCount: getStoredOrders().length }
  ];
};

export const fetchSqlTableRows = async (tableName, limit = 100, offset = 0) => {
  try {
    const res = await fetch(`${API_BASE}/sql/table/${encodeURIComponent(tableName)}?limit=${limit}&offset=${offset}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {}
  // Offline fallback
  let data = [];
  if (tableName === 'users') data = getStoredUsers();
  else if (tableName === 'laptops') data = getStoredLaptops();
  else if (tableName === 'inquiries') data = getStoredInquiries();
  else if (tableName === 'service_tickets') data = getStoredServiceTickets();
  else if (tableName === 'orders') data = getStoredOrders();

  return {
    tableName,
    totalRows: data.length,
    limit,
    offset,
    rows: data.slice(offset, offset + limit)
  };
};

export const runSqlQueryApi = async (sqlQuery) => {
  try {
    const res = await fetch(`${API_BASE}/sql/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sqlQuery })
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return {
      success: false,
      error: `Network error or server offline: ${err.message}`
    };
  }
};

export const getDownloadDatabaseUrl = () => `${API_BASE}/data/download`;
export const getDownloadSqliteUrl = () => `${API_BASE}/data/download`;
export const getDownloadSqlDumpUrl = () => `${API_BASE}/data/download`;

// Reset Database API
export const resetDatabaseApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/reset`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {}
  return resetToFactoryData();
};
