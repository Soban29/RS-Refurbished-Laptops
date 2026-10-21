import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import LaptopCatalog from './components/catalog/LaptopCatalog';
import CorporateSolutions from './components/b2b/CorporateSolutions';
import RepairServices from './components/services/RepairServices';
import TrustBadges from './components/common/TrustBadges';
import Testimonials from './components/common/Testimonials';
import QuoteCartDrawer from './components/cart/QuoteCartDrawer';
import AdminModal from './components/admin/AdminModal';
import AuthModal from './components/auth/AuthModal';
import { Phone, Laptop, ShoppingCart, Sparkles } from 'lucide-react';

import {
  fetchLaptops,
  createLaptop,
  updateLaptopApi,
  deleteLaptopApi,
  fetchInquiries,
  createInquiryApi,
  updateInquiryStatusApi,
  fetchServiceTickets,
  createServiceTicketApi,
  updateServiceStatusApi,
  fetchUsers,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  fetchOrders,
  createOrderApi,
  updateOrderStatusApi,
  resetDatabaseApi
} from './services/api';

import {
  getStoredLaptops,
  getStoredInquiries,
  getStoredServiceTickets,
  getStoredCart,
  saveStoredCart,
  getStoredUsers,
  getStoredOrders
} from './utils/storage';

export default function App() {
  // Global States
  const [laptops, setLaptops] = useState(getStoredLaptops);
  const [inquiries, setInquiries] = useState(getStoredInquiries);
  const [serviceTickets, setServiceTickets] = useState(getStoredServiceTickets);
  const [users, setUsers] = useState(getStoredUsers);
  const [orders, setOrders] = useState(getStoredOrders);
  const [cart, setCart] = useState(getStoredCart);

  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.role === 'admin';
      }
    } catch {}
    return false;
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('rs_current_user', JSON.stringify(user));
    } catch (e) {}
    if (user?.role === 'admin') {
      setIsAdminLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('rs_current_user');
    } catch (e) {}
  };

  // Load from backend DB on mount
  useEffect(() => {
    fetchLaptops().then(data => {
      if (data && data.length > 0) setLaptops(data);
    });
    fetchInquiries().then(data => {
      if (data && data.length > 0) setInquiries(data);
    });
    fetchServiceTickets().then(data => {
      if (data && data.length > 0) setServiceTickets(data);
    });
    fetchUsers().then(data => {
      if (data && data.length > 0) setUsers(data);
    });
    fetchOrders().then(data => {
      if (data && data.length > 0) setOrders(data);
    });
  }, []);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  // Cart operations
  const handleAddToCart = (laptop) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === laptop.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === laptop.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...laptop, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCart(prevCart =>
      prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Inquiry / Lead Handlers with Database Sync
  const handleInquirySubmit = async (newInquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
    await createInquiryApi(newInquiry);
  };

  const handleUpdateInquiryStatus = async (id, newStatus) => {
    setInquiries(prev =>
      prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    await updateInquiryStatusApi(id, newStatus);
  };

  // Service Ticket Handlers with Database Sync
  const handleServiceTicketSubmit = async (newTicket) => {
    setServiceTickets(prev => [newTicket, ...prev]);
    await createServiceTicketApi(newTicket);
  };

  const handleUpdateServiceStatus = async (id, newStatus) => {
    setServiceTickets(prev =>
      prev.map(srv => (srv.id === id ? { ...srv, status: newStatus } : srv))
    );
    await updateServiceStatusApi(id, newStatus);
  };

  // Laptop Inventory CRUD with Database Sync
  const handleAddLaptop = async (newLaptop) => {
    setLaptops(prev => [newLaptop, ...prev]);
    await createLaptop(newLaptop);
  };

  const handleUpdateLaptop = async (updatedLaptop) => {
    setLaptops(prev =>
      prev.map(lap => (lap.id === updatedLaptop.id ? updatedLaptop : lap))
    );
    await updateLaptopApi(updatedLaptop);
  };

  const handleDeleteLaptop = async (id) => {
    setLaptops(prev => prev.filter(lap => lap.id !== id));
    await deleteLaptopApi(id);
  };

  // User Management with Database Sync
  const handleAddUser = async (newUser) => {
    const saved = await createUserApi(newUser);
    setUsers(prev => [saved, ...prev.filter(u => u.email !== saved.email)]);
  };

  const handleUpdateUser = async (updatedUser) => {
    const saved = await updateUserApi(updatedUser);
    setUsers(prev => prev.map(u => u.id === saved.id ? saved : u));
  };

  const handleDeleteUser = async (id) => {
    await deleteUserApi(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Orders Management with Database Sync
  const handleUpdateOrderStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await updateOrderStatusApi(id, status);
  };

  const handleResetFactory = async () => {
    const fresh = await resetDatabaseApi();
    if (fresh) {
      setLaptops(fresh.laptops || []);
      setInquiries(fresh.inquiries || []);
      setServiceTickets(fresh.serviceTickets || []);
      setUsers(fresh.users || []);
      setOrders(fresh.orders || []);
    }
    setCart([]);
    alert("Database and store inventory reset to factory defaults!");
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const elem = document.getElementById(id);
    if (elem) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = elem.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-brand-500 selection:text-white pb-16 md:pb-0">
      
      {/* 1. Header with WhatsApp Chat & Customer/Admin Account Portal */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <Hero
          onExploreCatalog={() => scrollToSection('catalog')}
          onExploreB2B={() => scrollToSection('b2b')}
          onExploreServices={() => scrollToSection('services')}
        />

        {/* 3. Laptops Catalog with Dynamic Multi-Filter Sidebar */}
        <LaptopCatalog
          laptops={laptops}
          cart={cart}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 4. Corporate & B2B Solutions Section */}
        <CorporateSolutions
          onInquirySubmit={handleInquirySubmit}
        />

        {/* 5. Laptop Repair & Upgrade Services Section */}
        <RepairServices
          onServiceTicketSubmit={handleServiceTicketSubmit}
        />

        {/* 6. 32-Point Quality Inspection & Trust Comparison */}
        <TrustBadges />

        {/* 7. Testimonials, Ratings & FAQs */}
        <Testimonials />

      </main>

      {/* 8. Footer */}
      <Footer onNavClick={scrollToSection} />

      {/* Quote / Cart Inquiry Drawer */}
      <QuoteCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onInquirySubmit={handleInquirySubmit}
      />

      {/* Unified Auth Modal (Google Sign In, Customer Sign Up, Store Owner Admin Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onOpenAdminDashboard={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Management Modal Portal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        laptops={laptops}
        onAddLaptop={handleAddLaptop}
        onUpdateLaptop={handleUpdateLaptop}
        onDeleteLaptop={handleDeleteLaptop}
        inquiries={inquiries}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        serviceTickets={serviceTickets}
        onUpdateServiceStatus={handleUpdateServiceStatus}
        users={users}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onResetFactoryData={handleResetFactory}
      />

      {/* Mobile Sticky Bottom Quick Action Bar (Designed specifically for Mobile Users) */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <button
          onClick={() => scrollToSection('home')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] py-1 text-[11px] font-bold transition-colors ${
            activeTab === 'home' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => scrollToSection('catalog')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] py-1 text-[11px] font-bold transition-colors ${
            activeTab === 'catalog' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Laptops</span>
        </button>

        <a
          href="tel:+918668848486"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] py-1 text-[11px] font-bold text-slate-700 hover:text-brand-600 transition-colors"
          title="Direct Phone Call"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm -mt-2.5 ring-2 ring-white">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] text-slate-800 font-extrabold mt-0.5">Call Us</span>
        </a>

        <a
          href="https://wa.me/918668848486?text=Hi%20RS%20Refurbished%2C%20I%20am%20browsing%20from%20mobile%20and%20need%20laptop%20assistance"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] py-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          title="WhatsApp Instant Support"
        >
          <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] py-1 text-[11px] font-bold text-slate-700 hover:text-brand-600 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4 text-brand-600" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[8.5px] font-black text-white bg-rose-600 rounded-full ring-2 ring-white animate-pulse">
                {cart.length}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </nav>

    </div>
  );
}
