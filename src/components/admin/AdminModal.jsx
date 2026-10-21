import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  Laptop, 
  Users, 
  Wrench, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Phone, 
  DollarSign, 
  Eye, 
  Check, 
  Layers,
  Sparkles,
  Search,
  Database,
  Terminal,
  ShoppingBag,
  UserCheck,
  Play,
  FileCode,
  HardDrive,
  Filter,
  ExternalLink,
  Shield,
  Mail,
  Calendar,
  AlertCircle,
  Copy
} from 'lucide-react';
import { formatINR, exportDataAsJSON } from '../../utils/storage';
import { 
  fetchSqlInfo, 
  fetchSqlTables, 
  fetchSqlTableRows, 
  runSqlQueryApi, 
  getDownloadDatabaseUrl, 
  getDownloadSqlDumpUrl 
} from '../../services/api';

export default function AdminModal({
  isOpen,
  onClose,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  laptops = [],
  onAddLaptop,
  onUpdateLaptop,
  onDeleteLaptop,
  inquiries = [],
  onUpdateInquiryStatus,
  serviceTickets = [],
  onUpdateServiceStatus,
  users = [],
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  orders = [],
  onUpdateOrderStatus,
  onResetFactoryData
}) {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  // Active Tabs: 'inventory' | 'users' | 'orders' | 'sql' | 'inquiries' | 'services' | 'data'
  const [activeTab, setActiveTab] = useState('inventory');

  // Inventory Management State
  const [searchFilter, setSearchFilter] = useState('');
  const [isAddingLaptop, setIsAddingLaptop] = useState(false);
  const [editingLaptopId, setEditingLaptopId] = useState(null);

  // Users Management State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer'
  });

  // Orders Management State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Database Inspector State
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users;');
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlViewMode, setSqlViewMode] = useState('tables'); // 'tables' | 'console'
  const [activeSqlTable, setActiveSqlTable] = useState('users');
  const [tableData, setTableData] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [dbStats, setDbStats] = useState(null);
  const [dbTables, setDbTables] = useState([]);
  const [tableSearchFilter, setTableSearchFilter] = useState('');

  // New/Edit Laptop Form
  const initialLaptopForm = {
    name: '',
    brand: 'Lenovo',
    model: '',
    price: 24999,
    originalPrice: 75000,
    category: 'Business',
    conditionGrade: 'Grade A+ (Like New)',
    processor: 'Intel Core i5-1135G7',
    processorFamily: 'Intel Core i5',
    ram: '16 GB DDR4',
    ramSize: 16,
    storage: '512 GB NVMe SSD',
    storageSize: 512,
    display: '14.0" FHD IPS Anti-Glare',
    screenSize: 14,
    gpu: 'Intel Iris Xe Graphics',
    os: 'Windows 11 Pro Genuine',
    warrantyMonths: 1,
    batteryHealth: '95% Health',
    stockCount: 10,
    inStock: true,
    inspectionScore: '32/32 Passed',
    featured: true,
    tags: ['New Arrival', 'Certified A+'],
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    description: 'High performance enterprise laptop verified with 32-point diagnostics.'
  };

  const [laptopFormData, setLaptopFormData] = useState(initialLaptopForm);

  // Load Database Stats and Collections when opening database tab
  useEffect(() => {
    if (isOpen && isAdminLoggedIn && activeTab === 'sql') {
      loadDatabaseDetails();
    }
  }, [isOpen, isAdminLoggedIn, activeTab]);

  // Load Table rows when table changes in table view
  useEffect(() => {
    if (activeTab === 'sql' && sqlViewMode === 'tables') {
      loadTableRows(activeSqlTable);
    }
  }, [activeSqlTable, sqlViewMode, activeTab]);

  const loadDatabaseDetails = async () => {
    const stats = await fetchSqlInfo();
    if (stats) setDbStats(stats);
    const tables = await fetchSqlTables();
    if (tables) setDbTables(tables);
  };

  const loadTableRows = async (tableName) => {
    setTableLoading(true);
    const res = await fetchSqlTableRows(tableName);
    setTableData(res);
    setTableLoading(false);
  };

  // Run Custom SQL Query
  const handleExecuteSql = async (overrideQuery) => {
    const queryToRun = overrideQuery || sqlQuery;
    if (!queryToRun.trim()) return;

    setSqlLoading(true);
    setSqlResult(null);
    try {
      const res = await runSqlQueryApi(queryToRun);
      setSqlResult(res);
      // Refresh stats in case tables/rows were updated
      loadDatabaseDetails();
    } catch (err) {
      setSqlResult({ success: false, error: err.message });
    }
    setSqlLoading(false);
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin' || password === 'rs123') {
      setIsAdminLoggedIn(true);
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('Invalid Admin Passcode! Use "admin123" for access.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('inventory');
  };

  // Handle Add Laptop Submission
  const handleSaveNewLaptop = (e) => {
    e.preventDefault();
    if (!laptopFormData.name || !laptopFormData.model) {
      alert('Please fill in the laptop name and model.');
      return;
    }

    const newLaptop = {
      ...laptopFormData,
      id: `lap-${Date.now().toString().slice(-4)}`,
      price: Number(laptopFormData.price),
      originalPrice: Number(laptopFormData.originalPrice),
      ramSize: Number(laptopFormData.ramSize),
      storageSize: Number(laptopFormData.storageSize),
      screenSize: Number(laptopFormData.screenSize),
      stockCount: Number(laptopFormData.stockCount),
      inStock: Number(laptopFormData.stockCount) > 0
    };

    onAddLaptop(newLaptop);
    setIsAddingLaptop(false);
    setLaptopFormData(initialLaptopForm);
  };

  // Handle Edit Laptop Save
  const handleSaveEditLaptop = (laptop) => {
    onUpdateLaptop(laptop);
    setEditingLaptopId(null);
  };

  // Handle Add User Submission
  const handleSaveNewUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      alert('Please provide name and email.');
      return;
    }
    onAddUser({
      ...newUserForm,
      id: `usr-${Date.now().toString().slice(-4)}`,
      provider: 'admin_portal',
      createdAt: new Date().toISOString()
    });
    setIsAddingUser(false);
    setNewUserForm({ name: '', email: '', phone: '', role: 'customer' });
  };

  if (!isOpen) return null;

  const filteredLaptops = laptops.filter(l => 
    l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.model.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone || '').includes(userSearch);
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.id || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.companyName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.paymentRef || '').toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || (o.status || o.paymentStatus) === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrderRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden border border-slate-200 animate-scaleUp max-h-[95vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-500 to-cyan-500 rounded-xl text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  RS Refurbished Database & Admin Portal
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Database (JSON)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Access Users, Live Database, Stock Inventory, Quotes & Repair Tickets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* If NOT Authenticated -> Show Passcode Login */}
          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-brand-100">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Protected Store Management Portal</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Please enter your passcode to view and access registered user data, live database, and inventory controls.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Passcode..."
                    className="w-full text-center px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-rose-600 font-semibold mt-2">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all"
                >
                  Unlock Admin Dashboard
                </button>

                <div className="pt-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Demo Passcode: <strong className="font-mono text-slate-900">admin123</strong></span>
                  <button
                    type="button"
                    onClick={() => { setPassword('admin123'); }}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    Auto-Fill
                  </button>
                </div>
              </form>
            </div>
          ) : (
            
            /* Admin Logged In -> Navigation Tabs & Views */
            <div className="space-y-6">
              
              {/* Navigation Tabs Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  
                  {/* TAB: Laptops Inventory */}
                  <button
                    onClick={() => { setActiveTab('inventory'); setIsAddingLaptop(false); }}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'inventory'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Inventory ({laptops.length})</span>
                  </button>

                  {/* TAB: Users & Accounts (User Data Access) */}
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'users'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Users & Accounts ({users.length})</span>
                  </button>

                  {/* TAB: Orders & Sales */}
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'orders'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Orders ({orders.length})</span>
                  </button>

                  {/* TAB: Live Database Inspector */}
                  <button
                    onClick={() => setActiveTab('sql')}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'sql'
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-extrabold text-emerald-700">⚡ Live Database</span>
                  </button>

                  {/* TAB: Quote Leads */}
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'inquiries'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Quotes ({inquiries.length})</span>
                  </button>

                  {/* TAB: Service Tickets */}
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'services'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Services ({serviceTickets.length})</span>
                  </button>

                  {/* TAB: Backup & Reset */}
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'data'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Backup & Reset</span>
                  </button>
                </div>

                {activeTab === 'inventory' && (
                  <button
                    onClick={() => setIsAddingLaptop(!isAddingLaptop)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isAddingLaptop ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAddingLaptop ? 'Cancel Form' : 'Add New Laptop'}</span>
                  </button>
                )}

                {activeTab === 'users' && (
                  <button
                    onClick={() => setIsAddingUser(!isAddingUser)}
                    className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isAddingUser ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAddingUser ? 'Cancel Form' : 'Add User'}</span>
                  </button>
                )}
              </div>

              {/* ======================================================== */}
              {/* TAB 1: USERS & CUSTOMER ACCOUNTS (Access User Data)      */}
              {/* ======================================================== */}
              {activeTab === 'users' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Header Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered Users</p>
                        <p className="text-xl font-extrabold text-slate-900">{users.length}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Accounts</p>
                        <p className="text-xl font-extrabold text-slate-900">
                          {users.filter(u => u.role === 'customer').length}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Store Administrators</p>
                        <p className="text-xl font-extrabold text-slate-900">
                          {users.filter(u => u.role === 'admin').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add New User Form */}
                  {isAddingUser && (
                    <form onSubmit={handleSaveNewUser} className="bg-white p-5 rounded-2xl border border-brand-200 shadow-sm space-y-4 animate-scaleUp">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Plus className="w-4 h-4 text-brand-600" /> Add New User
                        </h4>
                        <span className="text-xs text-brand-600 font-semibold">Instant Database Insert</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={newUserForm.name}
                            onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                            placeholder="e.g. John Doe"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={newUserForm.email}
                            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                            placeholder="e.g. john@example.com"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={newUserForm.phone}
                            onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                          <select
                            value={newUserForm.role}
                            onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Store Admin</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingUser(false)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Save User
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Search & Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search users by name, email, or phone..."
                        className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
                      >
                        <option value="all">All Roles ({users.length})</option>
                        <option value="customer">Customers Only</option>
                        <option value="admin">Admins Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Sign-In Provider</th>
                            <th className="p-3">Registered / Active</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="p-8 text-center text-slate-400">
                                No users found matching your search.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-3">
                                  <div className="flex items-center gap-2.5">
                                    {user.avatar ? (
                                      <img
                                        src={user.avatar}
                                        alt=""
                                        className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                                      />
                                    ) : (
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                        user.role === 'admin' 
                                          ? 'bg-amber-100 text-amber-800' 
                                          : 'bg-brand-100 text-brand-700'
                                      }`}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-bold text-slate-900">{user.name || 'Unnamed User'}</div>
                                      <div className="text-[11px] text-slate-500 font-mono">{user.id}</div>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3">
                                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <span>{user.email}</span>
                                  </div>
                                  {user.phone && (
                                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                      <span>{user.phone}</span>
                                    </div>
                                  )}
                                </td>

                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                    user.role === 'admin'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                                  }`}>
                                    {user.role}
                                  </span>
                                </td>

                                <td className="p-3">
                                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                    {user.provider === 'google' ? 'Google SSO' : user.provider === 'owner_portal' ? 'Owner Portal' : 'Email'}
                                  </span>
                                </td>

                                <td className="p-3 text-[11px] text-slate-500">
                                  <div>Joined: {user.createdAt ? user.createdAt.slice(0, 10) : 'Recent'}</div>
                                  {user.lastLogin && (
                                    <div className="text-[10px] text-slate-400">
                                      Active: {user.lastLogin.slice(0, 10)}
                                    </div>
                                  )}
                                </td>

                                <td className="p-3 text-right">
                                  {user.role !== 'admin' && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete user "${user.name}" (${user.email}) from database?`)) {
                                          onDeleteUser(user.id);
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                      title="Delete User"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: ORDERS & SALES (Access Customer Order Data)       */}
              {/* ======================================================== */}
              {activeTab === 'orders' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Revenue Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Sales Invoiced</p>
                        <p className="text-xl font-extrabold text-slate-900">{formatINR(totalOrderRevenue)}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Customer Orders</p>
                        <p className="text-xl font-extrabold text-slate-900">{orders.length}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paid / Confirmed</p>
                        <p className="text-xl font-extrabold text-slate-900">
                          {orders.filter(o => o.paymentStatus === 'Paid' || o.status === 'Payment Confirmed').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search orders by customer name, company, order ID, or reference..."
                        className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
                    >
                      <option value="all">All Statuses ({orders.length})</option>
                      <option value="Paid">Paid Only</option>
                      <option value="Pending">Pending Only</option>
                      <option value="Payment Confirmed">Payment Confirmed</option>
                    </select>
                  </div>

                  {/* Orders List Table */}
                  <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
                        No orders found.
                      </div>
                    ) : (
                      filteredOrders.map((order) => (
                        <div 
                          key={order.id}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{order.id}</span>
                              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {order.customerName}
                              </span>
                              {order.companyName && order.companyName !== 'Individual Buyer' && (
                                <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded font-semibold">
                                  {order.companyName}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">{order.date}</span>
                            </div>

                            {/* Ordered Items Preview */}
                            <div className="text-xs text-slate-600 space-y-0.5">
                              {Array.isArray(order.items) && order.items.map((it, idx) => (
                                <div key={idx} className="font-medium">
                                  • {it.name || it.title} {it.quantity ? `(Qty: ${it.quantity})` : ''}
                                </div>
                              ))}
                            </div>

                            <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                              <span>Mode: <strong>{order.paymentMode || 'Online Gateway'}</strong></span>
                              {order.paymentRef && <span>Ref: <strong className="font-mono">{order.paymentRef}</strong></span>}
                              {order.customerPhone && <span>Phone: <strong>{order.customerPhone}</strong></span>}
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                            <div className="text-right">
                              <div className="text-base font-extrabold text-slate-900">
                                {formatINR(order.totalAmount)}
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.paymentStatus === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {order.paymentStatus || 'Paid'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Status:</span>
                              <select
                                value={order.status || 'Payment Confirmed'}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                                className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50"
                              >
                                <option value="Payment Confirmed">Payment Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: LIVE DATABASE & COLLECTIONS INSPECTOR             */}
              {/* ======================================================== */}
              {activeTab === 'sql' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Database Info Card */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-5 rounded-2xl text-white shadow-lg border border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-extrabold text-base tracking-tight text-white">
                          JSON Document Store (Persistent Database)
                        </h4>
                        <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                          JSON Database Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        Database File: <span className="text-emerald-300">data/rs_refurbished_database.json</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {dbStats ? `${dbStats.fileSizeFormatted} • ${users.length} Users • ${laptops.length} Laptops • ${orders.length} Orders` : 'Persistent Storage Active'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="/api/data/download"
                        download="rs_refurbished_database.json"
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition-all"
                        title="Download JSON database file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Database (.json)</span>
                      </a>
                    </div>
                  </div>

                  {/* Mode Switcher: Collections Browser vs Raw JSON Document */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSqlViewMode('tables'); loadTableRows(activeSqlTable); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          sqlViewMode === 'tables'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Visual Collection Records</span>
                      </button>

                      <button
                        onClick={() => setSqlViewMode('console')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          sqlViewMode === 'console'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Raw JSON Document View</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      JSON Document Store
                    </span>
                  </div>

                  {/* SUB-VIEW 1: RAW JSON DOCUMENT VIEWER */}
                  {sqlViewMode === 'console' && (
                    <div className="space-y-4">
                      <div className="bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" /> data/rs_refurbished_database.json
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Live JSON Document Store</span>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[460px] overflow-auto">
                          <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre selection:bg-emerald-800">
                            {JSON.stringify({
                              version: "1.0.0 (JSON Database)",
                              databaseFile: "rs_refurbished_database.json",
                              lastUpdated: new Date().toISOString(),
                              contactPhone: "+91 8668848486",
                              users,
                              laptops,
                              inquiries,
                              serviceTickets,
                              orders
                            }, null, 2)}
                          </pre>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400">
                            Persistent primary database stored as JSON document
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                navigator.clipboard.writeText(JSON.stringify({
                                  version: "1.0.0 (JSON Database)",
                                  databaseFile: "rs_refurbished_database.json",
                                  users,
                                  laptops,
                                  inquiries,
                                  serviceTickets,
                                  orders
                                }, null, 2));
                                alert("Full JSON Database copied to clipboard!");
                              } catch (e) {
                                alert("Failed to copy JSON");
                              }
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Full JSON to Clipboard</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 2: VISUAL COLLECTION TABLE INSPECTOR */}
                  {sqlViewMode === 'tables' && (
                    <div className="space-y-4">
                      
                      {/* Table Switcher Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {['users', 'laptops', 'inquiries', 'service_tickets', 'orders'].map((tbl) => (
                          <button
                            key={tbl}
                            onClick={() => setActiveSqlTable(tbl)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                              activeSqlTable === tbl
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            <Database className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{tbl}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-sans">
                              {tbl === 'users' ? users.length : tbl === 'laptops' ? laptops.length : tbl === 'orders' ? orders.length : tbl === 'inquiries' ? inquiries.length : serviceTickets.length}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Table Search Filter */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={tableSearchFilter}
                          onChange={(e) => setTableSearchFilter(e.target.value)}
                          placeholder={`Filter records in collection "${activeSqlTable}"...`}
                          className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                        />
                      </div>

                      {/* Table Rows Viewer */}
                      {tableLoading ? (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                          Loading collection records...
                        </div>
                      ) : (
                        tableData && tableData.rows && (
                          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                            <div className="overflow-x-auto max-h-[500px]">
                              <table className="w-full text-xs text-left font-mono">
                                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                                  <tr>
                                    {tableData.rows.length > 0 && Object.keys(tableData.rows[0]).map((col, idx) => (
                                      <th key={idx} className="p-2.5 whitespace-nowrap bg-slate-50">
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {tableData.rows
                                    .filter(row => {
                                      if (!tableSearchFilter.trim()) return true;
                                      return Object.values(row).some(v => 
                                        String(v).toLowerCase().includes(tableSearchFilter.toLowerCase())
                                      );
                                    })
                                    .map((row, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                                        {Object.keys(row).map((col, cIdx) => (
                                          <td key={cIdx} className="p-2.5 text-slate-800 whitespace-nowrap max-w-xs truncate">
                                            {typeof row[col] === 'object' && row[col] !== null
                                              ? JSON.stringify(row[col])
                                              : String(row[col] ?? '')}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: LAPTOPS INVENTORY (Existing Tab)                  */}
              {/* ======================================================== */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  
                  {/* Add New Laptop Form */}
                  {isAddingLaptop && (
                    <form onSubmit={handleSaveNewLaptop} className="bg-white p-6 rounded-2xl border border-brand-200 shadow-sm space-y-4 animate-scaleUp">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Plus className="w-4 h-4 text-emerald-600" /> Add New Refurbished Laptop to Catalog
                        </h4>
                        <span className="text-xs text-brand-600 font-semibold">Changes reflect immediately in database</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Laptop Title *</label>
                          <input
                            type="text"
                            required
                            value={laptopFormData.name}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, name: e.target.value })}
                            placeholder="e.g. Dell Latitude 7490 Core i7"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Brand *</label>
                          <select
                            value={laptopFormData.brand}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, brand: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          >
                            <option value="Lenovo">Lenovo</option>
                            <option value="Dell">Dell</option>
                            <option value="Apple">Apple</option>
                            <option value="HP">HP</option>
                            <option value="Asus">Asus</option>
                            <option value="Acer">Acer</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Model Code *</label>
                          <input
                            type="text"
                            required
                            value={laptopFormData.model}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, model: e.target.value })}
                            placeholder="e.g. Latitude 7490"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Our Price (₹) *</label>
                          <input
                            type="number"
                            required
                            value={laptopFormData.price}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹) *</label>
                          <input
                            type="number"
                            required
                            value={laptopFormData.originalPrice}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, originalPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Condition Grade</label>
                          <select
                            value={laptopFormData.conditionGrade}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, conditionGrade: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          >
                            <option value="Grade A+ (Like New)">Grade A+ (Like New)</option>
                            <option value="Grade A+ (Pristine)">Grade A+ (Pristine)</option>
                            <option value="Grade A (Excellent)">Grade A (Excellent)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Stock Count</label>
                          <input
                            type="number"
                            value={laptopFormData.stockCount}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, stockCount: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Processor</label>
                          <input
                            type="text"
                            value={laptopFormData.processor}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, processor: e.target.value })}
                            placeholder="e.g. Intel Core i7-8650U"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">RAM</label>
                          <input
                            type="text"
                            value={laptopFormData.ram}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, ram: e.target.value, ramSize: parseInt(e.target.value) || 16 })}
                            placeholder="e.g. 16 GB DDR4"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Storage</label>
                          <input
                            type="text"
                            value={laptopFormData.storage}
                            onChange={(e) => setLaptopFormData({ ...laptopFormData, storage: e.target.value, storageSize: parseInt(e.target.value) || 512 })}
                            placeholder="e.g. 512 GB SSD"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingLaptop(false)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm"
                        >
                          Save & Publish to Store
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Search Bar for Inventory */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search inventory by title, brand, or model..."
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  {/* Inventory Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Laptop & Specs</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Grade</th>
                            <th className="p-3">Stock Count</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLaptops.map((laptop) => (
                            <tr key={laptop.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={laptop.image}
                                    alt=""
                                    className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0"
                                    onError={(e) => {
                                      e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80";
                                    }}
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900 line-clamp-1">{laptop.name}</div>
                                    <div className="text-[11px] text-slate-500">
                                      {laptop.processor} | {laptop.ram} | {laptop.storage}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3 font-bold text-slate-900">
                                {editingLaptopId === laptop.id ? (
                                  <input
                                    type="number"
                                    defaultValue={laptop.price}
                                    onBlur={(e) => handleSaveEditLaptop({ ...laptop, price: Number(e.target.value) })}
                                    className="w-24 px-2 py-1 border border-brand-500 rounded text-xs"
                                  />
                                ) : (
                                  formatINR(laptop.price)
                                )}
                              </td>

                              <td className="p-3 font-semibold text-emerald-700">
                                {laptop.conditionGrade}
                              </td>

                              <td className="p-3">
                                {editingLaptopId === laptop.id ? (
                                  <input
                                    type="number"
                                    defaultValue={laptop.stockCount}
                                    onBlur={(e) => handleSaveEditLaptop({ ...laptop, stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                                    className="w-16 px-2 py-1 border border-brand-500 rounded text-xs"
                                  />
                                ) : (
                                  <span className="font-bold text-slate-800">{laptop.stockCount} Units</span>
                                )}
                              </td>

                              <td className="p-3">
                                <button
                                  onClick={() => handleSaveEditLaptop({ ...laptop, inStock: !laptop.inStock })}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    laptop.inStock
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                                  }`}
                                >
                                  {laptop.inStock ? 'In Stock' : 'Out of Stock'}
                                </button>
                              </td>

                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => setEditingLaptopId(editingLaptopId === laptop.id ? null : laptop.id)}
                                  className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg"
                                  title="Edit Price & Stock"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${laptop.name}"?`)) {
                                      onDeleteLaptop(laptop.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                  title="Delete from Catalog"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: INQUIRIES & QUOTE LEADS (Existing Tab)            */}
              {/* ======================================================== */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Customer & Corporate Quote Leads</h4>
                    <span className="text-xs text-slate-500">{inquiries.length} total inquiries logged in database</span>
                  </div>

                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div 
                        key={inq.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{inq.customerName}</span>
                            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.2 rounded">
                              {inq.companyName || inq.clientType}
                            </span>
                            <span className="text-[10px] text-slate-400">Date: {inq.date}</span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">
                            Requirement: <span className="font-semibold text-slate-900">{inq.laptopModel}</span>
                          </p>
                          <p className="text-xs text-slate-500">
                            Service: {inq.serviceType} | Budget: {inq.budgetPerUnit}
                          </p>
                          {inq.notes && (
                            <p className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-600 mt-1 whitespace-pre-line">
                              {inq.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5" /> WhatsApp ({inq.phone})
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Status:</span>
                            <select
                              value={inq.status}
                              onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value)}
                              className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: SERVICE REPAIR TICKETS (Existing Tab)             */}
              {/* ======================================================== */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Laptop Repair & Service Tickets</h4>
                    <span className="text-xs text-slate-500">{serviceTickets.length} active service tickets in database</span>
                  </div>

                  <div className="space-y-3">
                    {serviceTickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{ticket.customerName}</span>
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.2 rounded font-semibold">
                              {ticket.laptopBrandModel}
                            </span>
                            <span className="text-[10px] text-slate-400">{ticket.date}</span>
                          </div>
                          <p className="text-xs text-rose-600 font-semibold">
                            Issue: {ticket.issueType}
                          </p>
                          <p className="text-xs text-slate-500">
                            Mode: {ticket.pickupRequired ? `🚚 Pickup Address: ${ticket.address}` : '🏬 Walk-in Store'}
                          </p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                          <a
                            href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call Customer ({ticket.phone})
                          </a>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Status:</span>
                            <select
                              value={ticket.status}
                              onChange={(e) => onUpdateServiceStatus(ticket.id, e.target.value)}
                              className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white"
                            >
                              <option value="Pending Inspection">Pending Inspection</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 7: DATA MANAGEMENT & BACKUP                         */}
              {/* ======================================================== */}
              {activeTab === 'data' && (
                <div className="space-y-6 max-w-2xl mx-auto py-6">
                  
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Database className="w-5 h-5 text-emerald-600" /> Persistent Database File (rs_refurbished_database.json)
                    </div>
                    <p className="text-xs text-slate-600">
                      Download the live <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">data/rs_refurbished_database.json</code> persistent database file containing all users, laptops, inquiries, services, and orders.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href="/api/data/download"
                        download="rs_refurbished_database.json"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Download rs_refurbished_database.json
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Download className="w-5 h-5 text-brand-600" /> Export JSON Backup Snapshot
                    </div>
                    <p className="text-xs text-slate-600">
                      Download a JSON file containing all laptops, registered users, pricing, quote inquiries, and service tickets.
                    </p>
                    <button
                      onClick={exportDataAsJSON}
                      className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download Backup JSON
                    </button>
                  </div>

                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 space-y-3">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                      <RotateCcw className="w-5 h-5 text-rose-600" /> Reset Database to Factory Defaults
                    </div>
                    <p className="text-xs text-rose-700">
                      Rebuilds the persistent database with the verified default set of 12 enterprise laptops, demo users, sample orders, and quote leads.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm("Reset catalog and database back to initial factory demo state?")) {
                          onResetFactoryData();
                        }
                      }}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset Database to Factory Defaults
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
