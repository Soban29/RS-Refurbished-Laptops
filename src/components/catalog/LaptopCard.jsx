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
  const isAvailable = laptop.inStock && (laptop.stockCount > 0 || laptop.stockCount === undefined);

  const whatsappOrderMessage = encodeURIComponent(
    `Hello RS Refurbished! I am interested in purchasing/getting the best price for:\n*${laptop.name}*\nBrand: ${laptop.brand} | Model: ${laptop.model}\nProcessor: ${laptop.processor}\nRAM: ${laptop.ram} | Storage: ${laptop.storage}\nCondition: ${laptop.conditionGrade}\nStatus: ${isAvailable ? 'In Stock' : 'Out of Stock'}\n\nPlease share the best price, condition pictures, and delivery details!`
  );
  const whatsappOrderUrl = `https://wa.me/918668848486?text=${whatsappOrderMessage}`;

  const whatsappInquireMessage = encodeURIComponent(
    `Hello RS Refurbished! I am inquiring about *${laptop.name}* (ID: ${laptop.id}).\n\nIt is currently marked as Temporarily Unavailable. Could you let me know when this unit will be back in stock or suggest similar available options?`
  );
  const whatsappInquireUrl = `https://wa.me/918668848486?text=${whatsappInquireMessage}`;

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

          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Certified Refurbished
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
              <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock
              </span>
            ) : (
              <span className="font-bold text-amber-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
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
          
          {/* Price Block Replacement: Inquire for Wholesale Price */}
          <div className="flex items-center justify-between mb-3 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/90">
            <div>
              <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                <span>Best Price on DM</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">Direct</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Verified A+ Refurbished
              </div>
            </div>
            <span className="text-[10px] font-bold text-brand-700 bg-white border border-brand-200 px-2 py-0.5 rounded shadow-2xs">
              1-Mo Testing Warranty
            </span>
          </div>

          {/* Action Buttons: WhatsApp Direct DM (No static cart/checkout prices) */}
          {isAvailable ? (
            <div className="mb-2">
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                title="DM on WhatsApp for best price and instant ordering"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>DM on WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="mb-2">
              <a
                href={whatsappInquireUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                title="Inquire via WhatsApp regarding restock dates"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inquire on WhatsApp</span>
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
