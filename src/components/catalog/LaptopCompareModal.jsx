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
  compareList,
  onClose,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  cart
}) {
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
              onClick={onClearCompare}
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
              const isInCart = cart.some(c => c.id === laptop.id);
              const discount = Math.round(((laptop.originalPrice - laptop.price) / laptop.originalPrice) * 100);

              return (
                <div key={laptop.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between relative">
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFromCompare(laptop.id)}
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
                        <div className="text-base font-extrabold text-brand-600">{formatINR(laptop.price)}</div>
                        <div className="text-[10px] text-slate-400 line-through">{formatINR(laptop.originalPrice)} (-{discount}%)</div>
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

                  {/* Add to Quote Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => onAddToCart(laptop)}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                        isInCart
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-600 text-white hover:bg-brand-700'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {isInCart ? 'In Quote' : 'Add to Quote'}
                    </button>
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
