import React from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Check, 
  Phone, 
  Sparkles, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { formatINR } from '../../utils/storage';

export default function AccessoryCard({
  accessory,
  onAddToCart,
  isInCart
}) {
  const discount = accessory.originalPrice > accessory.price
    ? Math.round(((accessory.originalPrice - accessory.price) / accessory.originalPrice) * 100)
    : 0;

  const whatsappMessage = encodeURIComponent(
    `Hello RS Refurbished! I am interested in purchasing this laptop accessory:\n\n` +
    `*${accessory.name}*\n` +
    `Price: ${formatINR(accessory.price)} (MRP: ${formatINR(accessory.originalPrice)})\n` +
    `Category: ${accessory.category}\n` +
    `Compatibility: ${accessory.compatibility}\n\n` +
    `Please confirm stock availability and shipping timeline.`
  );
  const whatsappUrl = `https://wa.me/918668848486?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-brand-300 relative">
      
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {accessory.category}
        </span>
        {accessory.badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-brand-600" />
            {accessory.badge}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="h-44 w-full bg-slate-50/70 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-4 border border-slate-100 group-hover:bg-brand-50/30 transition-colors">
        <img
          src={accessory.image}
          alt={accessory.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80";
          }}
        />
      </div>

      {/* Title & Compatibility */}
      <div className="space-y-2 flex-1">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
          {accessory.name}
        </h3>
        
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {accessory.description}
        </p>

        {accessory.compatibility && (
          <div className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200/60 text-slate-600">
            <span className="font-bold text-slate-800">Fits: </span>
            {accessory.compatibility}
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold pt-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{accessory.warranty || '6-Month RS Warranty'}</span>
        </div>
      </div>

      {/* Pricing & Actions Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatINR(accessory.price)}
            </span>
            {accessory.originalPrice > accessory.price && (
              <span className="ml-2 text-xs text-slate-400 line-through">
                {formatINR(accessory.originalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(accessory)}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
              isInCart
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Quote</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Quote</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>Inquire</span>
          </a>
        </div>
      </div>

    </div>
  );
}
