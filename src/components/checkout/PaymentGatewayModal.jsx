import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Building, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Phone,
  Printer,
  Download,
  Clock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../../utils/storage';

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  items = [],
  currentUser,
  onOrderSuccess,
  onClearCart
}) {
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  
  // Shipping & Contact Details
  const [shippingInfo, setShippingInfo] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    landmark: ''
  });

  // UPI State
  const [upiId, setUpiId] = useState('');
  
  // Card State
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: currentUser?.name || '',
    expiry: '',
    cvv: ''
  });

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Processing Progress
  const [processStatus, setProcessStatus] = useState('Connecting to payment gateway...');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setShippingInfo(prev => ({
        ...prev,
        name: prev.name || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  if (!isOpen || !items || items.length === 0) return null;

  const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const originalTotal = items.reduce((sum, item) => sum + ((item.originalPrice || item.price * 1.3) * (item.quantity || 1)), 0);
  const totalSavings = originalTotal - totalAmount;

  const handlePayNow = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!shippingInfo.name.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim() || !shippingInfo.pincode.trim()) {
      setErrorMessage('Please fill in complete shipping details (Name, Phone, Address, and Pincode).');
      return;
    }

    if (paymentMethod === 'card') {
      if (cardInfo.number.replace(/\s/g, '').length < 15 || !cardInfo.expiry || !cardInfo.cvv) {
        setErrorMessage('Please enter valid card details.');
        return;
      }
    }

    // Begin Simulated Gateway Processing
    setStep('processing');
    setProcessStatus('Securing 256-bit bank encrypted connection...');

    setTimeout(() => {
      setProcessStatus(
        paymentMethod === 'upi'
          ? 'Authorizing UPI payment with bank...'
          : paymentMethod === 'card'
          ? 'Verifying 3D Secure / OTP with card network...'
          : paymentMethod === 'netbanking'
          ? `Connecting to ${selectedBank} NetBanking gateway...`
          : 'Confirming Cash on Delivery booking...'
      );
    }, 1200);

    setTimeout(() => {
      setProcessStatus('Payment verified! Generating official order receipt...');
    }, 2400);

    setTimeout(() => {
      const orderId = `ORD-RS-${Date.now().toString().slice(-6)}`;
      const transactionId = `pay_RS_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const newOrder = {
        id: orderId,
        transactionId,
        date: new Date().toISOString(),
        customer: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address: `${shippingInfo.address}, ${shippingInfo.landmark ? shippingInfo.landmark + ', ' : ''}${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
          processor: item.processor,
          ram: item.ram,
          storage: item.storage
        })),
        totalAmount,
        savings: totalSavings,
        paymentMethod: 
          paymentMethod === 'upi' ? `UPI (${upiId || 'Direct QR'})` :
          paymentMethod === 'card' ? `Card (ending in ${cardInfo.number.slice(-4) || '4242'})` :
          paymentMethod === 'netbanking' ? `NetBanking (${selectedBank})` : 'Cash on Delivery',
        status: paymentMethod === 'cod' ? 'Order Confirmed (COD)' : 'Payment Verified (Paid)',
        warranty: '1-Year Comprehensive On-Site Warranty Included'
      };

      setConfirmedOrder(newOrder);
      setStep('success');

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (err) {}

      if (onOrderSuccess) {
        onOrderSuccess(newOrder);
      }
      if (onClearCart) {
        onClearCart();
      }
    }, 3600);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">

        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyanAccent-500 flex items-center justify-center text-white shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {step === 'success' ? 'Payment Confirmed' : 'RS Refurbished Express Checkout'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> 256-Bit SSL Secure
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Helpline: +91 8668848486 • 1-Month Testing Warranty Included
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. CHECKOUT STEP */}
          {step === 'checkout' && (
            <form onSubmit={handlePayNow} className="space-y-6">
              
              {/* Order Items Preview Banner */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Purchasing Items ({items.reduce((s, i) => s + (i.quantity || 1), 0)})
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    You Save {formatINR(totalSavings)}
                  </span>
                </div>
                <div className="divide-y divide-slate-200/60 max-h-36 overflow-y-auto pr-1 space-y-1.5">
                  {items.map((item, idx) => (
                    <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        {item.image && (
                          <img src={item.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 border border-slate-200" />
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                          <div className="text-[11px] text-slate-500">Qty: {item.quantity || 1} • {item.ram} / {item.storage}</div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 whitespace-nowrap">
                        {formatINR(item.price * (item.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Shipping Information & Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Left Column: Shipping Address */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-brand-600" />
                    <span>Shipping & Delivery Details</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Receiver's Name"
                      value={shippingInfo.name}
                      onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={shippingInfo.phone}
                        onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="For GST invoice"
                        value={shippingInfo.email}
                        onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address</label>
                    <textarea
                      required
                      rows="2"
                      placeholder="Flat / House No., Street, Area"
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        placeholder="6 digits"
                        value={shippingInfo.pincode}
                        onChange={e => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={shippingInfo.city}
                        onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Payment Method Selection */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Select Payment Gateway</span>
                  </h4>

                  {/* Payment Options Radio Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* UPI Option */}
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                          UPI
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Instant UPI</div>
                          <div className="text-[10px] text-slate-500">GPay, PhonePe, QR</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Option */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Credit / Debit</div>
                          <div className="text-[10px] text-slate-500">Visa, Master, RuPay</div>
                        </div>
                      </div>
                    </div>

                    {/* Net Banking */}
                    <div
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-cyan-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Net Banking</div>
                          <div className="text-[10px] text-slate-500">All Major Banks</div>
                        </div>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-amber-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Pay on Delivery</div>
                          <div className="text-[10px] text-slate-500">Inspect & Pay</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Sub-Form */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {paymentMethod === 'upi' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">Scan & Pay with any UPI App:</span>
                          <span className="text-[11px] font-bold text-emerald-600">0% Extra Fee</span>
                        </div>
                        
                        {/* Interactive QR Code Simulator */}
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                          <div className="w-16 h-16 bg-slate-900 text-white rounded flex items-center justify-center p-1 flex-shrink-0">
                            <QrCode className="w-14 h-14" />
                          </div>
                          <div className="text-[11px] text-slate-600 space-y-0.5">
                            <div className="font-bold text-slate-900">RS Refurbished UPI Desk</div>
                            <div>UPI ID: <code className="bg-slate-100 px-1 rounded text-brand-600 font-mono">8668848486@upi</code></div>
                            <div className="text-slate-400 text-[10px]">Google Pay • PhonePe • Paytm • BHIM</div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Or enter your VPA / UPI ID:</label>
                          <input
                            type="text"
                            placeholder="e.g. yourname@okhdfcbank"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                          <input
                            type="text"
                            maxLength="19"
                            placeholder="4532 •••• •••• ••••"
                            value={cardInfo.number}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                              const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                              setCardInfo({ ...cardInfo, number: formatted });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              maxLength="5"
                              placeholder="12/28"
                              value={cardInfo.expiry}
                              onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength="4"
                              placeholder="•••"
                              value={cardInfo.cvv}
                              onChange={e => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Bank</label>
                        <select
                          value={selectedBank}
                          onChange={e => setSelectedBank(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                        >
                          <option value="HDFC">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="Axis">Axis Bank</option>
                          <option value="Kotak">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                        </select>
                        <p className="text-[10px] text-slate-500">You will be redirected to your bank's secure netbanking interface.</p>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="font-semibold text-slate-900">Cash on Delivery Available:</div>
                        <p className="text-[11px]">Inspect laptop serial number & seal upon courier arrival before making payment.</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500">Total Payable Amount (Incl. 18% GST):</div>
                  <div className="text-2xl font-black text-slate-900">{formatINR(totalAmount)}</div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay {formatINR(totalAmount)} & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* 2. GATEWAY PROCESSING SIMULATION STEP */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-brand-600">
                  <Lock className="w-7 h-7 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900">Processing Payment Securely</h4>
                <p className="text-xs text-slate-500 font-medium">{processStatus}</p>
                <div className="text-[11px] text-slate-400">Do not refresh or close this window</div>
              </div>
            </div>
          )}

          {/* 3. ORDER SUCCESS & TAX INVOICE RECEIPT */}
          {step === 'success' && confirmedOrder && (
            <div className="space-y-6 animate-scaleUp">
              
              {/* Header Badge */}
              <div className="text-center space-y-2 pb-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">Payment Successful & Order Confirmed!</h4>
                <p className="text-xs text-slate-500">
                  Transaction Verified: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700 font-bold">{confirmedOrder.transactionId}</code>
                </p>
              </div>

              {/* Order Invoice Card */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                  <div>
                    <span className="text-slate-400 font-medium">Order Reference:</span>
                    <div className="text-sm font-bold text-brand-600 font-mono">{confirmedOrder.id}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Payment Mode:</span>
                    <div className="font-bold text-slate-800">{confirmedOrder.paymentMethod}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Estimated Delivery:</span>
                    <div className="font-bold text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 2 - 4 Business Days
                    </div>
                  </div>
                </div>

                {/* Purchased Items List */}
                <div>
                  <div className="font-bold text-slate-700 mb-2">Items Purchased:</div>
                  <div className="space-y-2">
                    {confirmedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <div className="text-[11px] text-slate-500">Qty: {item.quantity} • {item.processor} • {item.ram} / {item.storage}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-slate-900">{formatINR(item.price * item.quantity)}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">1-Yr Warranty Active</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-700 mb-0.5">Shipping Destination:</div>
                  <div className="text-slate-600 leading-relaxed">
                    <strong>{confirmedOrder.customer.name}</strong> • {confirmedOrder.customer.phone}<br/>
                    {confirmedOrder.customer.address}
                  </div>
                </div>

                {/* Summary Totals */}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold">
                  <span>Grand Total Paid:</span>
                  <span className="text-base font-black text-brand-700">{formatINR(confirmedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print / Save Order Receipt
                </button>

                <a
                  href={`https://wa.me/918668848486?text=Hi%20RS%20Refurbished%2C%20I%20have%20just%20completed%20payment%20for%20Order%20${confirmedOrder.id}%20(${formatINR(confirmedOrder.totalAmount)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Phone className="w-4 h-4" /> Track on WhatsApp (+91 8668848486)
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setStep('checkout');
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
