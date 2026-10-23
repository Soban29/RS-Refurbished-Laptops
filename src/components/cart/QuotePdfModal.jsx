import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Laptop, 
  CreditCard,
  Building2,
  Calendar,
  Zap,
  Award,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatINR } from '../../utils/storage';
import { getOrderTier } from '../../utils/orderTiers';

export default function QuotePdfModal({
  isOpen,
  onClose,
  quoteNumber,
  cart = [],
  customerInfo = {},
  onPlaceOrder
}) {
  const quoteRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const tierInfo = getOrderTier(totalQuantity);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price * 1.3) * (item.quantity || 1)), 0);
  const totalSavings = originalTotal - subtotal;

  const quoteDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!quoteRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const canvas = await html2canvas(quoteRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 mm
      const pageHeight = 297; // A4 mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`RS_Refurbished_Quotation_${quoteNumber || 'Document'}.pdf`);
    } catch (err) {
      console.error('PDF generation error, falling back to window.print():', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const whatsappOrderMessage = encodeURIComponent(
    `Hello RS Refurbished! I would like to place an order against Quotation *${quoteNumber}*:\n` +
    `Client: ${customerInfo.name || 'Customer'}\n` +
    `Company: ${customerInfo.companyName || 'Individual'}\n` +
    `Tier: ${tierInfo.label} (${totalQuantity} Units)\n` +
    `Amount: ${formatINR(subtotal)} (1-Month Testing Warranty Included)\n\n` +
    `Please confirm delivery timeline and dispatch slot.`
  );
  const whatsappQuoteOrderUrl = `https://wa.me/918668848486?text=${whatsappOrderMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-scaleUp max-h-[94vh] flex flex-col">
        
        {/* Top Action Header Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-100 text-brand-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Official Quotation Document
              </h3>
              <p className="text-xs text-slate-500">
                Quote Ref: <span className="font-mono font-bold text-brand-700">{quoteNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-60"
              title="Download Official PDF file"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Quote (PDF)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Print or Save via Browser dialog"
            >
              <Printer className="w-3.5 h-3.5 text-brand-600" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Sheet Body */}
        <div ref={quoteRef} className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6 print-area bg-white text-slate-900">
          
          {/* 1. Official Letterhead Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                  RS
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    RS REFURBISHED LAPTOPS
                  </h1>
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    Enterprise IT & Certified Refurbishment Solutions
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Hub Address: Sant Tukaram Nagar, Pimpri, Pune 411018, Maharashtra<br />
                Official Helpline & WhatsApp: <span className="font-semibold text-slate-800">+91 8668848486</span> | Email: sales@rsrefurbishedlaptops.com
              </p>
            </div>

            <div className="sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[220px]">
              <span className="text-[10px] uppercase tracking-widest font-black text-brand-600 block mb-1">
                Official Estimate / Quote
              </span>
              <div className="text-lg sm:text-xl font-black font-mono text-slate-900">
                {quoteNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                <div>Date: <span className="font-semibold text-slate-800">{quoteDate}</span></div>
                <div>Valid Until: <span className="font-semibold text-slate-800">{validUntilDate}</span></div>
              </div>
            </div>
          </div>

          {/* 2. Customer & Order Tier Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Quotation Issued To:
              </span>
              <h4 className="text-base font-extrabold text-slate-900">
                {customerInfo.name || 'Valued Client'}
              </h4>
              {customerInfo.companyName && (
                <p className="text-xs font-bold text-brand-700 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-600" />
                  {customerInfo.companyName}
                </p>
              )}
              <div className="text-xs text-slate-600 mt-1.5 space-y-0.5">
                <div>Phone / WhatsApp: <span className="font-semibold text-slate-900">{customerInfo.phone || 'Provided upon order'}</span></div>
                {customerInfo.email && <div>Email: <span className="font-semibold text-slate-900">{customerInfo.email}</span></div>}
              </div>
            </div>

            <div className="sm:text-right flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  Order Tier Classification:
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${tierInfo.badgeClass}`}>
                  <Award className="w-3.5 h-3.5" />
                  {tierInfo.badge}
                </span>
                <p className="text-[11px] text-slate-500 mt-1.5 max-w-xs sm:ml-auto">
                  {tierInfo.description}
                </p>
              </div>

              <div className="text-[11px] font-bold text-emerald-700 mt-2">
                ✓ {tierInfo.gstBenefit}
              </div>
            </div>
          </div>

          {/* 3. Itemized Quotation Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Model & Certified Hardware Specs</th>
                  <th className="py-3 px-4 text-center">Grade & Warranty</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price (₹)</th>
                  <th className="py-3 px-4 text-right">Line Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cart.map((item, idx) => {
                  const qty = item.quantity || 1;
                  const lineTotal = item.price * qty;

                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          {item.processor} | {item.ram} | {item.storage} | Screen: {item.screenSize || 14}"
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          ✓ 32-Pt Quality Verified | Genuine OS License
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800 block text-xs">
                          {item.conditionGrade || 'Grade A+'}
                        </span>
                        <span className="text-[10px] text-brand-600 font-semibold block">
                          1-Month Testing Warranty
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-sm text-slate-900">
                        {qty}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                        {formatINR(item.price)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        {formatINR(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 4. Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            <div className="space-y-2 max-w-sm text-xs text-slate-600">
              <h5 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                Standard Assurances & Terms:
              </h5>
              <ul className="space-y-1 text-[11px]">
                <li>• <strong>1-Month Testing Warranty:</strong> Comprehensive testing coverage across motherboard, display panel, RAM, SSD, and keyboard.</li>
                <li>• <strong>Transit Insurance:</strong> 100% insured courier doorstep delivery across India.</li>
                <li>• <strong>Diagnostic Protocol:</strong> 32-point hardware and thermal diagnostics verified.</li>
              </ul>
            </div>

            <div className="w-full sm:w-80 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Original Equipment List Price:</span>
                <span className="line-through">{formatINR(originalTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Certified Refurbished Savings:</span>
                <span>- {formatINR(totalSavings)}</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2.5 flex justify-between items-baseline">
                <span className="font-black text-slate-900 text-sm">Grand Net Total:</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatINR(subtotal)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                All prices final with 1-Month Testing Warranty and insured shipping.
              </p>
            </div>
          </div>

          {/* 5. Authorization Stamp & Signature */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
            <div className="text-[11px] text-slate-400">
              System-generated electronic quotation.<br />
              Generated on RS Refurbished Enterprise Cloud Portal.
            </div>
            <div className="text-right">
              <div className="font-bold text-xs text-slate-800">For RS Refurbished Laptops</div>
              <div className="text-[10px] text-slate-500 mt-1">Authorized Signatory / Enterprise Division</div>
            </div>
          </div>

        </div>

        {/* Bottom Sticky Action Bar (Hidden on print) */}
        <div className="no-print p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span className="font-bold text-slate-900">Ready to confirm order?</span>
            <span>Place order with Quote <strong className="text-brand-700 font-mono">#{quoteNumber}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <a
              href={whatsappQuoteOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Phone className="w-4 h-4" /> Order via WhatsApp
            </a>

            <button
              onClick={() => {
                onClose();
                if (onPlaceOrder) onPlaceOrder({ quoteNumber, cart, totalQuantity, totalAmount: subtotal, customerInfo });
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-brand-600 to-cyanAccent-600 hover:from-brand-700 hover:to-cyanAccent-700 text-white flex items-center justify-center gap-2 shadow-md shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 fill-white" /> Place Order with This Quote
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
