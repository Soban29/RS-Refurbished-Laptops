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
    `Hello RS Refurbished! I am interested in purchasing/getting the best price for this accessory:\n\n` +
    `*${accessory.name}*\n` +
    `Category: ${accessory.category}\n` +
    `Compatibility: ${accessory.compatibility || 'Universal'}\n\n` +
    `Please share the best price and shipping details!`
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
        <div className="flex items-center justify-between mb-3 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
          <div className="text-xs font-bold text-slate-900">
            Wholesale Price on Request
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded shadow-2xs">
            In Stock
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>DM on WhatsApp</span>
        </a>
      </div>

    </div>
  );
}
