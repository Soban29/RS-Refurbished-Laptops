import React from 'react';
import { 
  X, 
  Check, 
  Trash2, 
  ShoppingBag, 
  Cpu, 
  HardDrive, 
  Layers, 
  Monitor, 
  Battery, 
  ShieldCheck, 
  TrendingDown
} from 'lucide-react';
import { formatINR } from '../../utils/storage';

export default function LaptopCompareModal({
  compareList = [],
  onClose,
  onRemoveFromCompare,
  onRemove,
  onClearCompare,
  onAddToCart,
  cart = []
}) {
  const handleRemove = onRemoveFromCompare || onRemove || (() => {});
  const handleClear = onClearCompare || onClose;

  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 animate-scaleUp max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              Side-by-Side Laptop Comparison
            </h3>
            <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
              {compareList.length} Selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-4">
            
            {/* Spec Labels Column */}
            <div className="hidden sm:block space-y-6 pt-48 font-bold text-xs text-slate-500 uppercase tracking-wider">
              <div className="py-2 border-b border-slate-100">Refurbished Price</div>
              <div className="py-2 border-b border-slate-100">Certified Grade</div>
              <div className="py-2 border-b border-slate-100">Processor</div>
              <div className="py-2 border-b border-slate-100">RAM Memory</div>
              <div className="py-2 border-b border-slate-100">Storage SSD</div>
              <div className="py-2 border-b border-slate-100">Display Screen</div>
              <div className="py-2 border-b border-slate-100">Graphics GPU</div>
              <div className="py-2 border-b border-slate-100">Battery Health</div>
              <div className="py-2 border-b border-slate-100">Operating System</div>
              <div className="py-2">Warranty</div>
            </div>

            {/* Laptop Cards Columns */}
            {compareList.map((laptop) => {
              const isInCart = Array.isArray(cart) && cart.some(c => c && c.id === laptop.id);
              const originalPrice = laptop.originalPrice || (laptop.price ? Math.round(laptop.price * 1.35) : 35000);
              const price = laptop.price || 0;
              const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 25;

              const whatsappCompareMsg = encodeURIComponent(
                `Hello RS Refurbished! I am comparing laptops and interested in *${laptop.name}* (${laptop.processor}, ${laptop.ram}, ${laptop.storage}). Could you please share the best price and condition?`
              );
              const whatsappCompareUrl = `https://wa.me/918668848486?text=${whatsappCompareMsg}`;

              return (
                <div key={laptop.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between relative">
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(laptop.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full border border-slate-200 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    {/* Image */}
                    <div className="h-32 w-full bg-white rounded-xl p-2 flex items-center justify-center border border-slate-100 mb-3">
                      <img
                        src={laptop.image}
                        alt={laptop.name}
                        className="max-h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2 leading-snug">
                      {laptop.name}
                    </h4>

                    {/* Compare Rows */}
                    <div className="space-y-6 text-xs text-slate-700">
                      
                      {/* Price */}
                      <div className="py-2 border-b border-slate-200">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">Price:</span>
                        <div className="text-sm font-extrabold text-emerald-700">DM for Best Price</div>
                        <div className="text-[10px] text-slate-400 font-medium">Wholesale Rate on Request</div>
                      </div>

                      {/* Grade */}
                      <div className="py-2 border-b border-slate-200 font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">Grade:</span>
                        <ShieldCheck className="w-3.5 h-3.5" /> {laptop.conditionGrade}
                      </div>

                      {/* Processor */}
                      <div className="py-2 border-b border-slate-200 font-medium">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">Processor:</span>
                        {laptop.processor}
                      </div>

                      {/* RAM */}
                      <div className="py-2 border-b border-slate-200 font-semibold">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">RAM:</span>
                        {laptop.ram}
                      </div>

                      {/* Storage */}
                      <div className="py-2 border-b border-slate-200 font-semibold text-cyanAccent-600">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">Storage:</span>
                        {laptop.storage}
                      </div>

                      {/* Display */}
                      <div className="py-2 border-b border-slate-200">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">Display:</span>
                        {laptop.display}
                      </div>

                      {/* GPU */}
                      <div className="py-2 border-b border-slate-200">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">GPU:</span>
                        {laptop.gpu}
                      </div>

                      {/* Battery */}
                      <div className="py-2 border-b border-slate-200 text-emerald-600 font-medium">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">Battery:</span>
                        {laptop.batteryHealth}
                      </div>

                      {/* OS */}
                      <div className="py-2 border-b border-slate-200 font-mono text-[11px]">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">OS:</span>
                        {laptop.os}
                      </div>

                      {/* Warranty */}
                      <div className="py-2 font-bold text-slate-900">
                        <span className="sm:hidden font-bold text-slate-400 block text-[10px]">Warranty:</span>
                        1-Month Testing Warranty
                      </div>

                    </div>
                  </div>

                  {/* WhatsApp DM Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <a
                      href={whatsappCompareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>DM on WhatsApp</span>
                    </a>
                  </div>

                </div>
              );
            })}

            {/* Empty slot placeholder if less than 3 */}
            {compareList.length < 3 && (
              <div className="hidden sm:flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                <p className="text-xs font-medium">Select another laptop from catalog to compare</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
