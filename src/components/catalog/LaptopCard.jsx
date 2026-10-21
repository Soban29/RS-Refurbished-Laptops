import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Battery, 
  Sparkles, 
  Plus, 
  Check, 
  Eye, 
  CheckCircle,
  TrendingDown,
  Layers,
  ShoppingCart,
  Zap,
  Clock,
  Phone
} from 'lucide-react';
import { formatINR } from '../../utils/storage';

export default function LaptopCard({ 
  laptop, 
  onViewDetails, 
  onAddToCart, 
  onBuyNow,
  isInCart,
  isCompared,
  onToggleCompare
}) {
  const discountPercent = Math.round(((laptop.originalPrice - laptop.price) / laptop.originalPrice) * 100);
  const isAvailable = laptop.inStock && (laptop.stockCount > 0 || laptop.stockCount === undefined);

  const whatsappMessage = encodeURIComponent(
    `Hello RS Refurbished! I am inquiring about *${laptop.name}* (ID: ${laptop.id}, Price: ${formatINR(laptop.price)}).\n\nIt is currently marked as Temporarily Unavailable. Could you let me know when this unit will be back in stock or suggest similar available options?`
  );
  const whatsappInquireUrl = `https://wa.me/918668848486?text=${whatsappMessage}`;

  return (
    <div className={`glass-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-card-hover border transition-all duration-300 relative ${
      isAvailable ? 'border-slate-200/80 bg-white' : 'border-amber-200/80 bg-slate-50/50'
    }`}>
      
      {/* Top Badges */}
      <div className="relative p-4 pb-0">
        
        {/* Condition Grade & Stock/Discount Pill */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full badge-certified">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {laptop.conditionGrade}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              <Clock className="w-3 h-3 text-amber-600" />
              Temporarily Unavailable
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
            <TrendingDown className="w-3 h-3" /> Save {discountPercent}%
          </span>
        </div>

        {/* Laptop Thumbnail Image */}
        <div 
          onClick={() => onViewDetails(laptop)}
          className="relative h-48 sm:h-52 w-full rounded-xl overflow-hidden bg-slate-100 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center p-2"
        >
          <img
            src={laptop.image}
            alt={laptop.name}
            loading="lazy"
            className={`w-full h-full object-cover object-center rounded-lg mix-blend-multiply transition-opacity ${
              isAvailable ? 'group-hover:opacity-95' : 'opacity-70 grayscale-[20%]'
            }`}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80";
            }}
          />
          
          {/* Out of Stock Overlay Banner */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
              <span className="bg-slate-900/95 text-amber-400 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/40 shadow-xl flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Temporarily Unavailable
              </span>
            </div>
          )}

          {/* Quick Hover Eye Overlay */}
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-white/95 text-slate-900 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5 text-brand-600" /> Quick Spec Sheet
            </span>
          </div>

          {/* Inspection Passed Tag */}
          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" /> 32-Pt Quality Verified
          </div>
        </div>

      </div>

      {/* Card Details Body */}
      <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-brand-600 uppercase tracking-wider">{laptop.brand}</span>
            {isAvailable ? (
              <span className="font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {laptop.stockCount} in stock
              </span>
            ) : (
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Model Name */}
          <h4 
            onClick={() => onViewDetails(laptop)}
            className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-brand-600 cursor-pointer transition-colors leading-snug mb-3"
            title={laptop.name}
          >
            {laptop.name}
          </h4>

          {/* Key Tech Specs Grid */}
          <div className="grid grid-cols-2 gap-1.5 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate" title={laptop.processor}>
              <Cpu className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">{laptop.processorFamily || laptop.processor.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate" title={laptop.ram}>
              <Layers className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">{laptop.ram}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate" title={laptop.storage}>
              <HardDrive className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
              <span className="truncate">{laptop.storage}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate" title={laptop.batteryHealth}>
              <Battery className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{laptop.batteryHealth.split(' ')[0]} Health</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100">
          
          {/* Price Block */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-xl font-extrabold text-slate-900">
                {formatINR(laptop.price)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="line-through">{formatINR(laptop.originalPrice)}</span>
                <span className="text-slate-500 font-medium">Verified A+</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
              1-Mo Testing Warranty
            </span>
          </div>

          {/* Action Buttons: Add to Cart / Buy Now OR Temporarily Unavailable Inquiry */}
          {isAvailable ? (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => onAddToCart(laptop)}
                className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  isInCart
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
                title="Add to Shopping Cart"
              >
                {isInCart ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onBuyNow ? onBuyNow(laptop) : onAddToCart(laptop)}
                className="px-2.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                title="Instant Checkout with UPI, Cards, or NetBanking"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Buy Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                disabled
                className="px-2 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1"
                title="This laptop is temporarily out of stock"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Unavailable</span>
              </button>

              <a
                href={whatsappInquireUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center justify-center gap-1"
                title="Inquire via WhatsApp regarding restock dates"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Inquire Restock</span>
              </a>
            </div>
          )}

          {/* Secondary Action: Specs & Compare */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <button
              onClick={() => onViewDetails(laptop)}
              className="text-brand-600 hover:text-brand-700 font-bold hover:underline flex items-center gap-1"
            >
              <Eye className="w-3 h-3" /> View Specs
            </button>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-brand-600 select-none">
              <input
                type="checkbox"
                checked={isCompared}
                onChange={() => onToggleCompare(laptop)}
                className="rounded text-brand-600 focus:ring-brand-500 h-3.5 w-3.5 border-slate-300 cursor-pointer"
              />
              <span>Compare</span>
            </label>
          </div>

        </div>

      </div>

    </div>
  );
}
