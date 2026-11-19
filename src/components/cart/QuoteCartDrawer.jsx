import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Heart,
  Phone, 
  CheckCircle2, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export default function QuoteCartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onInquirySubmit,
  onProceedToCheckout
}) {
  const [whatsappSent, setWhatsappSent] = useState(false);

  if (!isOpen) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendWhatsApp = () => {
    const itemLines = cart.map(
      (item) => `• ${item.name} (Qty: ${item.quantity})`
    ).join('\n');

    const message =
      `Hi RS Refurbished! I'm interested in these laptops:\n` +
      `${itemLines}\n` +
      `Please share pricing and availability. Thanks!`;

    const url = `https://wa.me/918668848486?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setWhatsappSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">My Shortlist</h3>
              <span className="text-xs text-slate-500">
                {cart.length} {cart.length === 1 ? 'Model' : 'Models'} ({totalQuantity} {totalQuantity === 1 ? 'Unit' : 'Units'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {whatsappSent ? (
            /* ── Success State ── */
            <div className="text-center py-14 space-y-5 animate-scaleUp">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Opening WhatsApp…</h4>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                Our team will respond within minutes! We'll share pricing, availability, and any deals for your shortlisted laptops.
              </p>
              <button
                onClick={() => {
                  setWhatsappSent(false);
                  onClearCart();
                  onClose();
                }}
                className="mt-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
              >
                Back to Store
              </button>
            </div>

          ) : cart.length === 0 ? (
            /* ── Empty State ── */
            <div className="text-center py-16 space-y-3 text-slate-400">
              <Heart className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Your shortlist is empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Browse our catalog and tap ❤️ to add laptops you like.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition-colors"
              >
                Browse Catalog
              </button>
            </div>

          ) : (
            /* ── Items List ── */
            <div className="space-y-3">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl bg-white p-1 border border-slate-200 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {item.ram 
                        ? `${item.ram} | ${item.storage} | ${item.conditionGrade || 'Grade A+'}` 
                        : `${item.category || 'Genuine Accessory'} | ${item.compatibility || 'Universal'}`}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Action — WhatsApp Button */}
        {!whatsappSent && cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5"
            >
              <Phone className="w-5 h-5" />
              Send Shortlist via WhatsApp
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Opens WhatsApp with your shortlisted laptops • +91 86688 48486
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
