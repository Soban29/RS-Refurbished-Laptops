import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShoppingCart,
  Phone, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Lock,
  CreditCard,
  Award,
  Zap,
  Printer,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../../utils/storage';
import { getOrderTier, generateQuoteNumber } from '../../utils/orderTiers';
import QuotePdfModal from './QuotePdfModal';

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
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    companyName: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isQuotePdfOpen, setIsQuotePdfOpen] = useState(false);
  const [quoteNumber] = useState(() => generateQuoteNumber());

  if (!isOpen) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const tierInfo = getOrderTier(totalQuantity);

  const totalEstimate = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalSavings = totalOriginal - totalEstimate;

  const handleCheckoutInquiry = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please enter your name and phone number to submit quote.');
      return;
    }

    const itemsSummary = cart.map(item => `${item.name} (Qty: ${item.quantity}) - ${formatINR(item.price * item.quantity)}`).join('\n');

    const newInquiry = {
      id: `inq-${Date.now().toString().slice(-4)}`,
      quoteNumber: quoteNumber,
      date: new Date().toISOString().slice(0, 10),
      customerName: customerInfo.name,
      companyName: customerInfo.companyName || 'Individual Buyer',
      clientType: tierInfo.tier, // 'Individual' | 'Corporate' | 'Bulk'
      email: customerInfo.email,
      phone: customerInfo.phone,
      laptopModel: cart.map(c => `${c.name} x${c.quantity}`).join(', '),
      quantity: totalQuantity,
      budgetPerUnit: formatINR(totalEstimate),
      serviceType: `${tierInfo.label} (${quoteNumber})`,
      status: 'Pending',
      paymentStatus: 'Pending',
      notes: `Quote Number: ${quoteNumber} | Order Tier: ${tierInfo.label}\n\nCustomer Order Summary:\n${itemsSummary}\nTotal: ${formatINR(totalEstimate)}\nNotes: ${customerInfo.notes || 'None'}`
    };

    onInquirySubmit(newInquiry);
    setSubmitted(true);

    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const handlePlaceOrderWithQuote = (quoteData) => {
    if (onProceedToCheckout) {
      onProceedToCheckout({
        ...quoteData,
        quoteNumber,
        tierInfo,
        cart,
        customerInfo
      });
    } else {
      // Direct WhatsApp Order fallback
      window.open(`https://wa.me/918668848486?text=${encodeURIComponent(
        `Hello RS Refurbished! I want to confirm my order for Quote *#${quoteNumber}*:\n` +
        `Client: ${customerInfo.name || 'Customer'}\n` +
        `Phone: ${customerInfo.phone || 'N/A'}\n` +
        `Tier: ${tierInfo.label} (${totalQuantity} Units)\n` +
        `Total: ${formatINR(totalEstimate)} (Incl. GST)\n` +
        `Please initiate payment dispatch.`
      )}`, '_blank');
    }
  };

  const whatsappCheckoutText = encodeURIComponent(
    `*RS Refurbished Official Order Quote: #${quoteNumber}*\n` +
    `Client Name: ${customerInfo.name || 'Customer'}\n` +
    `Company: ${customerInfo.companyName || 'Individual'}\n` +
    `Tier: ${tierInfo.label} (${totalQuantity} Units)\n\n` +
    `*Itemized Models:*\n` +
    cart.map(c => `• ${c.name} (x${c.quantity}) = ${formatINR(c.price * c.quantity)}`).join('\n') +
    `\n\n*Total Amount:* ${formatINR(totalEstimate)} (1-Month Testing Warranty Included)` +
    (customerInfo.notes ? `\nNotes: ${customerInfo.notes}` : '') +
    `\n\nPlease confirm availability and delivery schedule.`
  );

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
        
        <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
          
          {/* Top Drawer Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-100 text-brand-700 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Shopping Cart & Quote Tray</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{cart.length} Models ({totalQuantity} Units)</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-brand-700">#{quoteNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Clear
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

          {/* Drawer Scrollable Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Quotation Submitted!</h4>
                <div className="inline-block px-3 py-1 bg-brand-50 border border-brand-200 rounded-lg text-xs font-mono font-bold text-brand-800">
                  Quote Ref: #{quoteNumber}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <span className="font-bold text-slate-900">{customerInfo.name}</span>. Our sales specialist has generated your quote request and will contact you directly on <span className="font-bold text-slate-900">{customerInfo.phone}</span>.
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setIsQuotePdfOpen(true)}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download Official Quote PDF
                  </button>

                  <a
                    href={`https://wa.me/918668848486?text=${whatsappCheckoutText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Send directly via WhatsApp (+91 8668848486)
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      onClearCart();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                  >
                    Back to Store
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">Your Quote Tray is empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore our certified refurbished laptops and click "Add to Cart" to build your custom invoice.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Order Tier Banner */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${tierInfo.badgeClass}`}>
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold">{tierInfo.badge}</span>
                        <span className="text-[10px] font-bold bg-white/80 px-1.5 py-0.2 rounded border">
                          {totalQuantity} Units
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5 leading-tight">
                        {tierInfo.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
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
                          {item.ram} | {item.storage} | {item.conditionGrade}
                        </p>
                        <div className="text-xs font-extrabold text-brand-600 mt-1">
                          {formatINR(item.price)}
                        </div>
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

                {/* Total & Savings Banner */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>List Total:</span>
                    <span className="line-through">{formatINR(totalOriginal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-800 text-sm sm:text-base">
                    <span>Estimated Net Total:</span>
                    <span>{formatINR(totalEstimate)}</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> You are saving {formatINR(totalSavings)} with 1-Month Testing Warranty!
                  </div>
                </div>

                {/* Quote PDF Preview Button */}
                <div className="bg-brand-50/70 p-3.5 rounded-2xl border border-brand-200/80 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-extrabold text-slate-900 block">Need an Official Quotation Sheet?</span>
                    <span className="text-[11px] text-slate-500">Includes Quote #{quoteNumber}, specs & 1-Month Testing Warranty</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuotePdfOpen(true)}
                    className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View / PDF</span>
                  </button>
                </div>

                {/* Checkout / Contact Form */}
                <form onSubmit={handleCheckoutInquiry} className="space-y-3 pt-1">
                  <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Client & Delivery Details:
                  </h5>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Full Name *"
                      className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="Phone / WhatsApp *"
                      className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="Official Email Address (for quote delivery)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />

                  <input
                    type="text"
                    value={customerInfo.companyName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, companyName: e.target.value })}
                    placeholder="Company / Organization Name (Optional)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    placeholder="Special RAM/SSD upgrade requests or delivery instructions..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  ></textarea>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsQuotePdfOpen(true)}
                      className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Generate Official Quote PDF
                    </button>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> Submit Inquiry with Quote #{quoteNumber}
                    </button>

                    <a
                      href={`https://wa.me/918668848486?text=${whatsappCheckoutText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Phone className="w-4 h-4" /> Place Order via WhatsApp (+91 8668848486)
                    </a>
                  </div>
                </form>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Quote PDF Modal */}
      {isQuotePdfOpen && (
        <QuotePdfModal
          isOpen={isQuotePdfOpen}
          onClose={() => setIsQuotePdfOpen(false)}
          quoteNumber={quoteNumber}
          cart={cart}
          customerInfo={customerInfo}
          onPlaceOrder={handlePlaceOrderWithQuote}
        />
      )}
    </>
  );
}
