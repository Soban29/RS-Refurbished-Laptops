import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, 
  ShieldCheck, 
  Wrench, 
  Building2, 
  Menu, 
  X, 
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  CheckCircle2,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart, 
  onOpenAdmin,
  isAdminLoggedIn,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'catalog', label: 'Laptops Catalog', icon: Laptop, badge: 'Deals' },
    { id: 'b2b', label: 'Corporate & B2B', icon: Building2, badge: 'Bulk' },
    { id: 'services', label: 'Repair & Upgrades', icon: Wrench },
    { id: 'trust', label: '32-Point Quality', icon: ShieldCheck },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    
    // Smooth scroll to relevant section if on one-page layout
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-2.5' 
        : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5'
    }`}>
      <div className="site-container">
        {/* Single-line sorted header */}
        <div className="flex items-center justify-between gap-2 lg:gap-3 flex-nowrap">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0 whitespace-nowrap"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyanAccent-500 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors whitespace-nowrap">
                  RS <span className="text-brand-600">Refurbished</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Certified
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide whitespace-nowrap">
                Laptops & IT Solutions
              </p>
            </div>
          </div>

          {/* Sorted Horizontal Navigation - Desktop (Strictly One Line) */}
          <nav className="hidden lg:flex items-center flex-nowrap space-x-1 xl:space-x-1.5 bg-slate-50/80 p-1 rounded-full border border-slate-200/70 flex-shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] xl:text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-brand-100 text-brand-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 flex-nowrap">
            
            {/* WhatsApp Quick Chat Icon (Phone number text hidden) */}
            <a
              href="https://wa.me/918668848486?text=Hi%20RS%20Refurbished%2C%20I%20am%20interested%20in%20laptop%20deals%20and%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              title="Chat with us on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>

            {/* Add Cart / Shopping Cart Icon Button (styled just like WhatsApp & Login icon) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-200 shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 group"
              title="View Shopping Cart & Quote Tray"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-brand-600 group-hover:text-brand-700 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-rose-600 rounded-full shadow-md animate-bounce ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Login / Profile / Owner Portal Icon (No explicit "Admin Panel" button) */}
            <div className="relative" ref={userMenuRef}>
              {!currentUser ? (
                /* When NOT logged in: sleek User Icon for Customer Login / Admin Login */
                <button
                  onClick={onOpenAuth}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 group"
                  title="Sign In / Register / Owner Portal"
                  aria-label="Account Login"
                >
                  <User className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                </button>
              ) : currentUser.role === 'admin' ? (
                /* When STORE OWNER ("I") is logged in */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-md hover:bg-slate-800 transition-all"
                    title="Store Owner (Admin)"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-sm">
                      👑
                    </div>
                    <span className="hidden md:inline text-xs font-bold text-amber-300">Owner</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-fadeIn">
                      <div className="p-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <span>👑 Store Owner (You)</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full mt-1.5 flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 rounded-xl transition-colors text-left"
                      >
                        <Laptop className="w-4 h-4 text-brand-600" />
                        <span>Inventory & Leads Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out of Admin</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* When CUSTOMER is logged in */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 shadow-sm hover:bg-brand-100 transition-all"
                    title={`Signed in as ${currentUser.name}`}
                  >
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="w-7 h-7 rounded-lg object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                    )}
                    <span className="hidden md:inline text-xs font-bold max-w-[80px] truncate">{currentUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-brand-600" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-fadeIn">
                      <div className="p-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                        <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenCart();
                        }}
                        className="w-full mt-1.5 flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <ShoppingBag className="w-4 h-4 text-brand-600" />
                        <span>My Quote Tray</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 pb-2 space-y-1.5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive 
                      ? 'bg-brand-600 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Mobile Quick Actions */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-brand-800 bg-brand-50 border border-brand-200 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-brand-600" />
                  <span>Shopping Cart / Quote Tray</span>
                </div>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-rose-600 text-white rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <a
                href="https://wa.me/918668848486?text=Hi%20RS%20Refurbished%2C%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-sm transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat with Us on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser?.role === 'admin') {
                    onOpenAdmin();
                  } else if (currentUser) {
                    onLogout();
                  } else {
                    onOpenAuth();
                  }
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-xl"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>
                  {currentUser ? `Sign Out (${currentUser.name})` : 'Customer Sign In / Owner Portal'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
