import React from 'react';
import { 
  Laptop, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowUp
} from 'lucide-react';

export default function Footer({ onNavClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="site-container">
        
        {/* Top Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">32-Point Quality Inspected</h4>
              <p className="text-xs text-slate-400">Strict diagnostic & stress testing</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">1-Month Testing Warranty</h4>
              <p className="text-xs text-slate-400">Complete functional testing coverage</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Insured Shipping</h4>
              <p className="text-xs text-slate-400">Doorstep delivery across PAN India</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct IT Support</h4>
              <p className="text-xs text-slate-400">Dedicated technician assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyanAccent-500 flex items-center justify-center">
                <Laptop className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">
                RS <span className="text-brand-400">Refurbished</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              India's premier certified refurbished laptops and corporate IT solutions provider. 
              Supplying high-performance business laptops for students, professionals, startups, 
              and industrial fleets with rigorous quality assurance and warranty.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold rounded-md">
                1-Month Testing Warranty
              </span>
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-md">
                32-Point Diagnostic Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Shop & Catalog</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavClick('catalog')} className="hover:text-brand-400 transition-colors">
                  All Refurbished Laptops
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('catalog')} className="hover:text-brand-400 transition-colors">
                  Lenovo ThinkPads
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('catalog')} className="hover:text-brand-400 transition-colors">
                  Dell Latitude & XPS
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('catalog')} className="hover:text-brand-400 transition-colors">
                  Apple MacBooks (M1/Pro)
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('catalog')} className="hover:text-brand-400 transition-colors">
                  Heavy CAD Workstations
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate & Services */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Services & B2B</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavClick('b2b')} className="hover:text-brand-400 transition-colors">
                  Corporate Bulk Procurement
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('b2b')} className="hover:text-brand-400 transition-colors">
                  Laptop Rental Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services')} className="hover:text-brand-400 transition-colors">
                  Chip-Level Motherboard Repair
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services')} className="hover:text-brand-400 transition-colors">
                  RAM & SSD Upgrades
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services')} className="hover:text-brand-400 transition-colors">
                  Screen & Battery Replacement
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Store & Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-1" />
                <span>Sant Tukaram Nagar, Pimpri, Pune 411018, Maharashtra</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="tel:+918668848486" className="hover:text-white transition-colors font-bold text-slate-200">
                  +91 8668848486
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:sales@rsrefurbishedlaptops.com" className="hover:text-white transition-colors">
                  sales@rsrefurbishedlaptops.com
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href="https://wa.me/918668848486" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Support: 8668848486
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RS Refurbished Laptops & Services. All Rights Reserved. Call: +91 8668848486</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Testing Warranty Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Quality Guarantee</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-brand-400 hover:text-brand-300 font-semibold ml-2"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Back to Top
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
