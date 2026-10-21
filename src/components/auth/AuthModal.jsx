import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  ShieldCheck, 
  Mail, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createUserApi } from '../../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenAdminDashboard
}) {
  const [authMode, setAuthMode] = useState('customer'); // 'customer' | 'admin'
  const [customerTab, setCustomerTab] = useState('signin'); // 'signin' | 'signup'

  // Customer Form States
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Admin Form State
  const [adminPasscode, setAdminPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Google Login Simulation
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    const demoGoogleUser = {
      id: `google-${Date.now().toString().slice(-4)}`,
      name: 'Rahul Sharma',
      email: 'rahul.sharma.rs@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      provider: 'google'
    };

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    // Persist to Database
    try {
      await createUserApi(demoGoogleUser);
    } catch (e) {}

    setSuccessMessage('Successfully signed in with Google!');
    setTimeout(() => {
      onLoginSuccess(demoGoogleUser);
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  // Customer Email Sign In
  const handleCustomerSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerEmail.trim() || !customerPassword.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const displayName = customerEmail.split('@')[0];
    const user = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: customerEmail.trim(),
      role: 'customer',
      provider: 'email'
    };

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    // Persist to Database
    try {
      await createUserApi(user);
    } catch (e) {}

    setSuccessMessage(`Welcome back, ${user.name}!`);
    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  // Customer Sign Up
  const handleCustomerSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPassword.trim()) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    const newUser = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: customerName.trim(),
      email: customerEmail.trim(),
      phone: customerPhone.trim(),
      role: 'customer',
      provider: 'email'
    };

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    } catch (e) {}

    // Persist to Database
    try {
      await createUserApi(newUser);
    } catch (e) {}

    setSuccessMessage(`Account created! Welcome, ${newUser.name}!`);
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  // Admin / Store Owner Login ("which mean I")
  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPass = adminPasscode.trim().toLowerCase();
    if (cleanPass === 'admin123' || cleanPass === 'admin' || cleanPass === 'rs123') {
      const adminUser = {
        id: 'admin-owner',
        name: 'Store Owner',
        email: 'admin@rsrefurbished.com',
        role: 'admin',
        provider: 'owner_portal'
      };

      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}

      // Persist to Database
      try {
        await createUserApi(adminUser);
      } catch (e) {}

      setSuccessMessage('Owner Access Verified! Unlocking Dashboard...');
      setTimeout(() => {
        onLoginSuccess(adminUser);
        onClose();
        setSuccessMessage('');
        setAdminPasscode('');
        if (onOpenAdminDashboard) {
          onOpenAdminDashboard();
        }
      }, 500);
    } else {
      setErrorMessage('Invalid passcode. Please use "admin123" to access owner controls.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scaleUp">
        
        {/* Modal Top Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 p-6 text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${
              authMode === 'admin' 
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950' 
                : 'bg-gradient-to-br from-brand-500 to-cyanAccent-500 text-white'
            }`}>
              {authMode === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {authMode === 'admin' ? 'Owner / Admin Portal' : 'Customer Account'}
              </h3>
              <p className="text-xs text-slate-300">
                {authMode === 'admin' 
                  ? 'Store management, inventory & inquiries' 
                  : 'Track inquiries, warranty & fast checkout'}
              </p>
            </div>
          </div>

          {/* Role Switcher Tabs (Customer vs Admin) */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-white/10 backdrop-blur-md rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('customer');
                setErrorMessage('');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('admin');
                setErrorMessage('');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'admin'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Store Owner / Admin</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Status Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. CUSTOMER MODE */}
          {authMode === 'customer' && (
            <div>
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition-all hover:shadow hover:border-slate-400 active:scale-[0.99] group"
              >
                {/* Official Google 'G' SVG Logo */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="group-hover:text-slate-900">Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-medium">or use email</span>
                </div>
              </div>

              {/* Sub-tab: Sign In vs Sign Up */}
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('signin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-colors text-center border-b-2 ${
                    customerTab === 'signin'
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Customer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('signup');
                    setErrorMessage('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-colors text-center border-b-2 ${
                    customerTab === 'signup'
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Sign In Form */}
              {customerTab === 'signin' ? (
                <form onSubmit={handleCustomerSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={customerPassword}
                        onChange={(e) => setCustomerPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleCustomerSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="For inquiry updates"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="Create strong password"
                        value={customerPassword}
                        onChange={(e) => setCustomerPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Create Account</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 2. ADMIN / STORE OWNER ACCESS ("which mean I") */}
          {authMode === 'admin' && (
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Store Owner Authentication</span>
                </div>
                <span>
                  Log in as the RS Store Owner to add/edit laptops, inspect leads, review repair tickets, and export data.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner Admin Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    autoFocus
                    required
                    placeholder="Enter Admin Passcode (e.g. admin123)"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Default access passcode: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">admin123</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Unlock Owner Dashboard</span>
              </button>
            </form>
          )}

          {/* Already logged in view */}
          {currentUser && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[200px]">
                Active: <strong className="text-slate-700">{currentUser.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setSuccessMessage('Signed out successfully.');
                  setTimeout(() => setSuccessMessage(''), 1500);
                }}
                className="text-rose-600 hover:text-rose-700 font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
