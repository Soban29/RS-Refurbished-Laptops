
import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  HardDrive,
  Battery,
  Monitor,
  Layers,
  CheckCircle2,
  Phone,
  ShoppingBag,
  Check,
  RotateCcw,
  Truck,
  Sparkles,
  Share2,
  FileCheck,
  ShoppingCart,
  Zap,
  Clock,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { formatINR } from '../../utils/storage';
import { QUALITY_INSPECTION_POINTS } from '../../data/servicesData';

export default function LaptopDetailModal({
  laptop,
  onClose,
  onAddToCart,
  onBuyNow,
  isInCart
}) {
  if (!laptop) return null;

  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'inspection' | 'warranty'
  const [copied, setCopied] = useState(false);

  // Dynamic RAM & Storage Customizer
  const [selectedRam, setSelectedRam] = useState(laptop.ramSize || 16);
  const [selectedStorage, setSelectedStorage] = useState(laptop.storageSize || 512);

  const isLaptopInStock = laptop.inStock && (laptop.stockCount > 0 || laptop.stockCount === undefined);

  // Hardware compatibility rules
  const isConfigAvailable = useMemo(() => {
    if (!isLaptopInStock) return false;

    // MacBook Air M1 cannot be upgraded to 32GB RAM
    if (laptop.brand === 'Apple' && laptop.model.includes('MacBook Air') && selectedRam > 16) {
      return false;
    }
    // MacBook Pro 13 2020 maximum memory is 16GB
    if (laptop.brand === 'Apple' && laptop.model.includes('MacBook Pro 13') && selectedRam > 16) {
      return false;
    }
    // Student/Budget laptops (Dell 3593) cannot support 32GB
    if (laptop.category === 'Student' && selectedRam > 16) {
      return false;
    }
    // Budget models do not have 1TB SSD in stock
    if (laptop.category === 'Student' && selectedStorage > 512) {
      return false;
    }

    return true;
  }, [laptop, isLaptopInStock, selectedRam, selectedStorage]);

  // Dynamic Price Calculation based on configuration
  const configuredPrice = useMemo(() => {
    let price = laptop.price;
    const defaultRam = laptop.ramSize || 16;
    const defaultStorage = laptop.storageSize || 512;

    // RAM adjustment
    if (selectedRam !== defaultRam) {
      if (selectedRam === 8 && defaultRam === 16) price -= 2000;
      else if (selectedRam === 16 && defaultRam === 8) price += 2000;
      else if (selectedRam === 32 && defaultRam === 16) price += 3500;
      else if (selectedRam === 32 && defaultRam === 8) price += 5500;
      else if (selectedRam === 16 && defaultRam === 32) price -= 3500;
      else if (selectedRam === 8 && defaultRam === 32) price -= 5500;
    }

    // Storage adjustment
    if (selectedStorage !== defaultStorage) {
      if (selectedStorage === 256 && defaultStorage === 512) price -= 1500;
      else if (selectedStorage === 512 && defaultStorage === 256) price += 1500;
      else if (selectedStorage === 1024 && defaultStorage === 512) price += 2500;
      else if (selectedStorage === 1024 && defaultStorage === 256) price += 4000;
      else if (selectedStorage === 512 && defaultStorage === 1024) price -= 2500;
      else if (selectedStorage === 256 && defaultStorage === 1024) price -= 4000;
    }

    return Math.max(price, 10000);
  }, [laptop, selectedRam, selectedStorage]);

  const configuredOriginalPrice = useMemo(() => {
    const ratio = laptop.originalPrice / laptop.price;
    return Math.round(configuredPrice * ratio);
  }, [laptop, configuredPrice]);

  const discountPercent = Math.round(((configuredOriginalPrice - configuredPrice) / configuredOriginalPrice) * 100);

  // Customized laptop object to pass to cart/checkout
  const customizedLaptop = useMemo(() => {
    return {
      ...laptop,
      price: configuredPrice,
      originalPrice: configuredOriginalPrice,
      ram: `${selectedRam} GB DDR4`,
      ramSize: selectedRam,
      storage: `${selectedStorage >= 1024 ? '1 TB' : `${selectedStorage} GB`} SSD`,
      storageSize: selectedStorage
    };
  }, [laptop, configuredPrice, configuredOriginalPrice, selectedRam, selectedStorage]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello RS Refurbished! I am interested in inquiring about:\n*${laptop.name}*\nConfig: ${selectedRam}GB RAM | ${selectedStorage >= 1024 ? '1 TB' : `${selectedStorage} GB`} SSD\nPrice: ${formatINR(configuredPrice)}\nStatus: ${isConfigAvailable ? 'Available' : 'Temporarily Unavailable'}\nPlease share batch availability and delivery details.`
  );
  const whatsappDirectUrl = `https://wa.me/918668848486?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-scaleUp max-h-[92vh] flex flex-col">

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-md">
              {laptop.brand} Official Refurbished
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {laptop.conditionGrade}
            </span>
            {!isLaptopInStock && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" /> Temporarily Unavailable
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors text-xs font-medium flex items-center gap-1"
              title="Copy Link"
            >
              <Share2 className="w-4 h-4" />
              {copied && <span className="text-emerald-600 font-bold">Copied!</span>}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Temporarily Unavailable Notice Banner */}
          {!isLaptopInStock ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">
                  This Laptop is Temporarily Unavailable
                </h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  This model is currently out of stock or reserved for enterprise testing. RS Refurbished receives fresh certified consignments every week. Contact our support team below for priority restock notification or similar available models.
                </p>
              </div>
            </div>
          ) : !isConfigAvailable ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">
                  This Configuration is Temporarily Unavailable
                </h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  The selected combination of {selectedRam} GB RAM with {selectedStorage >= 1024 ? '1 TB' : `${selectedStorage} GB`} SSD is currently not available for this specific laptop model. Please select another configuration or message us for custom procurement.
                </p>
              </div>
            </div>
          ) : null}

          {/* Top Hero: Image & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Left: Product Image */}
            <div className="md:col-span-5 bg-slate-100/80 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-200/80 relative">
              <img
                src={laptop.image}
                alt={laptop.name}
                className="w-full h-56 object-cover object-center rounded-xl mix-blend-multiply"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div className="w-full mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="block text-slate-400">Battery Health</span>
                  <span className="font-bold text-emerald-600">{laptop.batteryHealth}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="block text-slate-400">Inspection</span>
                  <span className="font-bold text-brand-600">{laptop.inspectionScore}</span>
                </div>
              </div>
            </div>

            {/* Right: Key Specs & Pricing */}
            <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {laptop.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Model Code: <span className="font-mono font-semibold text-slate-700">{laptop.model}</span> | Category: <span className="font-semibold text-brand-600">{laptop.category}</span>
                </p>

                {/* Price Display with dynamic calculation */}
                <div className="mt-3 bg-brand-50/60 p-3.5 rounded-2xl border border-brand-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        {formatINR(configuredPrice)}
                      </span>
                      <span className="text-sm line-through text-slate-400">
                        {formatINR(configuredOriginalPrice)}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-700 font-medium">
                      Certified Refurbished • 1-Month Testing Warranty Included
                    </span>
                  </div>
                  <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                </div>

                {/* Interactive Hardware Configurator (RAM & SSD) */}
                <div className="mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-brand-600" />
                      Configure Specs (Instant Price Update)
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      RS Certified Upgrades
                    </span>
                  </div>

                  {/* RAM Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium w-16">RAM:</span>
                    <div className="flex gap-1.5 flex-1">
                      {[8, 16, 32].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSelectedRam(r)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${selectedRam === r
                              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          {r} GB
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SSD Storage Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium w-16">Storage:</span>
                    <div className="flex gap-1.5 flex-1">
                      {[256, 512, 1024].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedStorage(s)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${selectedStorage === s
                              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          {s >= 1024 ? '1 TB' : `${s} GB`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-3">
                  {laptop.description}
                </p>
              </div>

              {/* Highlights Pill Row */}
              <div className="flex flex-wrap gap-2 pt-1">
                {laptop.tags?.map((t, i) => (
                  <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                    ✦ {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons: Add to Cart and Buy Now OR Temporarily Unavailable Inquiry */}
              <div className="space-y-2 pt-2">
                {isConfigAvailable ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => onAddToCart(customizedLaptop)}
                      className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${isInCart
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isInCart ? 'Added to Cart (Add More)' : 'Add to Cart'}
                    </button>

                    <button
                      onClick={() => onBuyNow ? onBuyNow(customizedLaptop) : onAddToCart(customizedLaptop)}
                      className="py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      Buy Now (Express Checkout)
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      disabled
                      className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Temporarily Unavailable
                    </button>

                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      Inquire Batch Restock
                    </a>
                  </div>
                )}

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Order / Inquire via WhatsApp (+91 8668848486)
                </a>
              </div>

            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 flex items-center gap-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'specs'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              <Cpu className="w-4 h-4" /> Full Hardware Specifications
            </button>

            <button
              onClick={() => setActiveTab('inspection')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'inspection'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              <ShieldCheck className="w-4 h-4" /> 32-Point Quality Report
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'warranty'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              <ShieldCheck className="w-4 h-4" /> 1-Month Testing Warranty
            </button>
          </div>

          {/* Tab 1: Specs Content */}
          {activeTab === 'specs' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-brand-600">
                    Core Compute & Memory
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Processor:</span>
                      <span className="font-semibold text-slate-900 text-right">{laptop.processor}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Configured RAM:</span>
                      <span className="font-semibold text-slate-900">{selectedRam} GB High-Speed</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Configured Storage:</span>
                      <span className="font-semibold text-slate-900">{selectedStorage >= 1024 ? '1 TB' : `${selectedStorage} GB`} SSD</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Graphics GPU:</span>
                      <span className="font-semibold text-slate-900">{laptop.gpu}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-brand-600">
                    Display, Audio & Chassis
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Display Screen:</span>
                      <span className="font-semibold text-slate-900 text-right">{laptop.display}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Operating System:</span>
                      <span className="font-semibold text-emerald-700 font-mono">{laptop.os}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Chassis Weight:</span>
                      <span className="font-semibold text-slate-900">{laptop.specs?.weight || '1.4 kg'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Keyboard:</span>
                      <span className="font-semibold text-slate-900 text-right">{laptop.specs?.keyboard || 'Precision Backlit'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Extra Port Details */}
              {laptop.specs?.ports && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-brand-600 mb-2">
                    I/O Ports & Connectivity
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {laptop.specs.ports.map((port, i) => (
                      <span key={i} className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                        🔌 {port}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Quality Inspection Report */}
          {activeTab === 'inspection' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">
                    Passed RS 32-Point Diagnostics Checklist
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Tested by senior certified hardware technicians using OEM diagnostic software.
                  </p>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300">
                  32/32 Passed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {QUALITY_INSPECTION_POINTS.map((pt, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{pt.name}</span>
                      <span className="text-[11px] text-slate-500">{pt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Testing Warranty & Assurance */}
          {activeTab === 'warranty' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> 1-Month Testing Warranty
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every laptop comes with our comprehensive 1-Month Testing Warranty covering motherboard, processor, RAM, SSD, display panel, and keyboard. Full support to thoroughly test your laptop.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 pt-1">
                    <li>✓ 1-Month Complete Functional Testing Coverage</li>
                    <li>✓ Doorstep Insured Delivery Across India</li>
                    <li>✓ Dedicated WhatsApp Tech Support (+91 8668848486)</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 32-Point Quality Certification
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All machines undergo 32-point diagnostics including stress testing on CPU, memory, thermal dissipation, battery health, and genuine OS activation.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 pt-1">
                    <li>✓ 100% Genuine Activated Operating System</li>
                    <li>✓ Original Power Adapter & Cable Included</li>
                    <li>✓ Transparent Pricing with Zero Hidden Charges</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
