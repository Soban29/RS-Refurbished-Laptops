import { 
  INITIAL_LAPTOPS, 
  INITIAL_INQUIRIES, 
  INITIAL_SERVICE_TICKETS, 
  INITIAL_ORDERS,
  INITIAL_USERS 
} from '../data/initialLaptops';

const KEYS = {
  LAPTOPS: 'rs_laptops_inventory_v2',
  INQUIRIES: 'rs_b2b_inquiries_v1',
  SERVICES: 'rs_service_tickets_v1',
  CART: 'rs_quote_cart_v1',
  ORDERS: 'rs_customer_orders_v1',
  USERS: 'rs_users_accounts_v1',
  ADMIN_AUTH: 'rs_admin_auth_v1'
};

// Users Storage (fallback / offline sync)
export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users from storage:', err);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to storage:', err);
  }
};

export const addStoredUser = (user) => {
  const current = getStoredUsers();
  const existingIdx = current.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  let updated;
  if (existingIdx !== -1) {
    updated = [...current];
    updated[existingIdx] = {
      ...updated[existingIdx],
      ...user,
      lastLogin: new Date().toISOString()
    };
  } else {
    const newUser = {
      ...user,
      id: user.id || `usr-${Date.now().toString().slice(-6)}`,
      createdAt: user.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    updated = [newUser, ...current];
  }
  saveStoredUsers(updated);
  return user;
};

// Laptops Storage
export const getStoredLaptops = () => {
  try {
    const data = localStorage.getItem(KEYS.LAPTOPS);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading laptops from storage:', err);
  }
  localStorage.setItem(KEYS.LAPTOPS, JSON.stringify(INITIAL_LAPTOPS));
  return INITIAL_LAPTOPS;
};

export const saveStoredLaptops = (laptops) => {
  try {
    localStorage.setItem(KEYS.LAPTOPS, JSON.stringify(laptops));
  } catch (err) {
    console.error('Error saving laptops to storage:', err);
  }
};

// Inquiries Storage
export const getStoredInquiries = () => {
  try {
    const data = localStorage.getItem(KEYS.INQUIRIES);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading inquiries:', err);
  }
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
  return INITIAL_INQUIRIES;
};

export const saveStoredInquiries = (inquiries) => {
  try {
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Error saving inquiries:', err);
  }
};

// Service Tickets Storage
export const getStoredServiceTickets = () => {
  try {
    const data = localStorage.getItem(KEYS.SERVICES);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading service tickets:', err);
  }
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICE_TICKETS));
  return INITIAL_SERVICE_TICKETS;
};

export const saveStoredServiceTickets = (tickets) => {
  try {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(tickets));
  } catch (err) {
    console.error('Error saving service tickets:', err);
  }
};

// Cart Storage
export const getStoredCart = () => {
  try {
    const data = localStorage.getItem(KEYS.CART);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading cart:', err);
  }
  return [];
};

export const saveStoredCart = (cart) => {
  try {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  } catch (err) {
    console.error('Error saving cart:', err);
  }
};

// Orders Storage
export const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(KEYS.ORDERS);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders:', err);
  }
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving orders:', err);
  }
};

export const addStoredOrder = (order) => {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveStoredOrders(updated);
  return order;
};

// Reset to Factory Default
export const resetToFactoryData = () => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(KEYS.LAPTOPS, JSON.stringify(INITIAL_LAPTOPS));
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICE_TICKETS));
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  return {
    users: INITIAL_USERS,
    laptops: INITIAL_LAPTOPS,
    inquiries: INITIAL_INQUIRIES,
    services: INITIAL_SERVICE_TICKETS,
    orders: INITIAL_ORDERS
  };
};

// Export all data as JSON
export const exportDataAsJSON = () => {
  const exportPayload = {
    exportDate: new Date().toISOString(),
    appName: "RS Refurbished Laptops & Services",
    databaseEngine: "JSON Document Store",
    users: getStoredUsers(),
    laptops: getStoredLaptops(),
    inquiries: getStoredInquiries(),
    services: getStoredServiceTickets(),
    orders: getStoredOrders()
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `rs_refurbished_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Format currency
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
