import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Building2, 
  Wrench, 
  Laptop,
  TrendingDown,
  Star,
  Award
} from 'lucide-react';

export default function Hero({ onExploreCatalog, onExploreB2B, onExploreServices }) {
  return (
    <section id="home" className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 bg-grid-pattern">
      
      {/* Decorative Glow Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-brand-400/15 via-cyanAccent-400/20 to-emerald-400/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="site-container relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Quality Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 shadow-sm border border-brand-200 text-xs font-bold text-slate-800 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-brand-700 font-extrabold">RS Certified Refurbished</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 32-Pt Quality Verified
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              High-Performance <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-cyanAccent-500 bg-clip-text text-transparent">
                Refurbished Laptops
              </span> <br />
              For You & Your Business.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Save up to <strong className="text-slate-900 font-bold">70%</strong> on certified business-class <span className="font-semibold text-slate-800">Dell, Lenovo ThinkPad, HP, and Apple MacBooks</span>. Backed by 1-Month Testing Warranty, genuine OS licenses, and dedicated chip-level repair lab.
            </p>

            {/* Quick Guarantees Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1-Month Testing Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>32-Point Inspected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyanAccent-600 flex-shrink-0" />
                <span>Doorstep Insured Delivery</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-glow-md transition-all flex items-center justify-center gap-2 group"
              >
                <Laptop className="w-4 h-4" />
                <span>Browse Refurbished Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreB2B}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>Corporate & Bulk Inquiries</span>
              </button>

              <button
                onClick={onExploreServices}
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm rounded-2xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5"
              >
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Book Repair</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-center sm:text-left">
              <div>
                <div className="text-2xl font-black text-slate-900">5,000+</div>
                <div className="text-xs text-slate-500 font-medium">Laptops Delivered</div>
              </div>
              <div>
                <div className="text-2xl font-black text-brand-600">32-Point</div>
                <div className="text-xs text-slate-500 font-medium">Diagnostic Check</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">4.9 ★</div>
                <div className="text-xs text-slate-500 font-medium">Customer Rating</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with Float Badges */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Showcase Device Card */}
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 backdrop-blur-md">
              
              {/* Product Badge Top */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Grade A+ Certified
                </span>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ⚡ Tested 95% Battery
                </span>
              </div>

              {/* High-res Laptop Image */}
              <div className="relative h-60 w-full rounded-2xl bg-gradient-to-tr from-slate-100 to-brand-50 flex items-center justify-center p-3 overflow-hidden border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
                  alt="ThinkPad T480s Refurbished"
                  className="w-full h-full object-cover object-center rounded-xl mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold">
                  Lenovo ThinkPad T480s i7
                </div>
              </div>

              {/* Hardware Highlights Row */}
              <div className="grid grid-cols-3 gap-2 my-4 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="block text-slate-400 text-[10px]">CPU</span>
                  <span className="font-bold text-slate-800">Intel i7 vPro</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="block text-slate-400 text-[10px]">RAM</span>
                  <span className="font-bold text-slate-800">16 GB DDR4</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="block text-slate-400 text-[10px]">SSD</span>
                  <span className="font-bold text-cyanAccent-600">512 GB NVMe</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-black text-slate-900">₹24,999</div>
                  <div className="text-xs text-slate-400 line-through">MRP: ₹89,990 (Save 72%)</div>
                </div>
                <button
                  onClick={onExploreCatalog}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  View Details
                </button>
              </div>

            </div>

            {/* Floating Trust Badge 1: Savings */}
            <div className="hidden sm:flex absolute -bottom-4 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200 items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Save 60% to 70%</div>
                <div className="text-[10px] text-slate-500">Compared to new laptops</div>
              </div>
            </div>

            {/* Floating Trust Badge 2: Warranty */}
            <div className="hidden sm:flex absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200 items-center gap-3 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">1-Month Testing Warranty</div>
                <div className="text-[10px] text-slate-500">100% Component Tested</div>
              </div>
            </div>

          </div>

        </div>

        {/* Brand Logos Strip */}
        <div className="mt-16 pt-8 border-t border-slate-200/80">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Certified Refurbishment Across Global Leading Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-extrabold text-lg sm:text-xl text-slate-700 tracking-wider">DELL</span>
            <span className="font-extrabold text-lg sm:text-xl text-slate-700 tracking-wider">Lenovo.</span>
            <span className="font-extrabold text-lg sm:text-xl text-slate-700 tracking-wider">hp</span>
            <span className="font-extrabold text-lg sm:text-xl text-slate-700 tracking-wider">Apple MacBook</span>
            <span className="font-extrabold text-lg sm:text-xl text-slate-700 tracking-wider">ASUS</span>
            <span className="font-extrabold text-lg sm:text-xl text-slate-700 tracking-wider">acer</span>
          </div>
        </div>

      </div>
    </section>
  );
}
