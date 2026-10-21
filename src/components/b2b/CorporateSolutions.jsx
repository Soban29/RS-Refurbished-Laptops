import React, { useState } from 'react';
import { 
  Building2, 
  Factory, 
  CalendarCheck2, 
  RefreshCw, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  FileText, 
  Percent, 
  Phone,
  Sparkles,
  Users,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { B2B_SOLUTIONS } from '../../data/b2bFeatures';

export default function CorporateSolutions({ onInquirySubmit }) {
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    quantity: 10,
    laptopModel: 'Lenovo ThinkPad T-Series or Dell Latitude',
    serviceType: 'Corporate Bulk Purchase',
    budgetPerUnit: '₹20,000 - ₹30,000',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.companyName) {
      alert('Please fill in your name, company name, and phone number.');
      return;
    }

    const newInquiry = {
      id: `inq-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      customerName: formData.customerName,
      companyName: formData.companyName,
      clientType: 'Corporate',
      email: formData.email,
      phone: formData.phone,
      laptopModel: `${formData.laptopModel} (Qty: ${formData.quantity})`,
      quantity: Number(formData.quantity),
      budgetPerUnit: formData.budgetPerUnit,
      serviceType: formData.serviceType,
      status: 'Pending',
      notes: formData.notes || `Corporate inquiry for ${formData.quantity} units under ${formData.serviceType}.`
    };

    onInquirySubmit(newInquiry);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-6 h-6 text-brand-600" />;
      case 'CalendarCheck2': return <CalendarCheck2 className="w-6 h-6 text-brand-600" />;
      case 'Factory': return <Factory className="w-6 h-6 text-cyanAccent-600" />;
      case 'RefreshCw': return <RefreshCw className="w-6 h-6 text-emerald-600" />;
      default: return <Briefcase className="w-6 h-6 text-brand-600" />;
    }
  };

  return (
    <section id="b2b" className="py-16 bg-white border-y border-slate-200/80">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-3 border border-brand-200">
            <Building2 className="w-3.5 h-3.5 text-brand-600" /> B2B, Startups & Industrial Fleets
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Corporate IT & Enterprise Laptop Solutions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Equip your enterprise, development team, or industrial plant with Grade-A certified laptops at 60-70% lower CAPEX. Full 18% GST invoice credit, custom OS deployment, and guaranteed maintenance SLA.
          </p>
        </div>

        {/* 4 Pillars of B2B Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {B2B_SOLUTIONS.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-4">
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <ul className="space-y-2 pt-3 border-t border-slate-200/70 text-xs text-slate-700">
                {item.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Corporate Quote Request Form Card */}
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Background Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyanAccent-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Value Pitch */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Direct Enterprise Desk
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Request an Instant Corporate Bulk Quote or Rental Plan
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Need 5, 25, or 100+ laptops for your office, factory floor, or call center? Submit your requirements and receive a customized quotation with volume discounts within 2 hours.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Percent className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-200 font-medium">Special Tiered Volume Discounts on bulk quantities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-200 font-medium">1-Month Testing Warranty with Direct Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-200 font-medium">Pre-imaged custom OS, software & security profiles</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              {submitted ? (
                <div className="text-center py-8 space-y-4 animate-scaleUp">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Quotation Request Received!</h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-slate-900">{formData.customerName}</span> from <span className="font-semibold text-slate-900">{formData.companyName}</span>. Our Enterprise Solutions Manager will reach out to you at <span className="font-semibold text-slate-900">{formData.phone}</span> shortly.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/918668848486?text=Hi%20RS%20Refurbished%2C%20I%20just%20submitted%20a%20corporate%20quote%20request%20for%20${formData.quantity}%20laptops%20for%20${encodeURIComponent(formData.companyName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" /> Follow-up on WhatsApp (+91 8668848486)
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Submit Another Requirement
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Apex Tech Ltd / Startup"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Work Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@company.com"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Quantity Needed
                      </label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value={3}>3 - 5 Units (Small Team)</option>
                        <option value={10}>10 - 20 Units (Growing)</option>
                        <option value={30}>20 - 50 Units (Enterprise)</option>
                        <option value={100}>50+ to 200 Units (Bulk)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Service Required
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="Corporate Bulk Purchase">Bulk Purchase</option>
                        <option value="Monthly Rental Plan">Monthly Laptop Rental</option>
                        <option value="Annual Maintenance AMC">Corporate IT AMC</option>
                        <option value="Old IT Asset Buyback">Old IT Asset Buyback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Budget / Unit
                      </label>
                      <select
                        value={formData.budgetPerUnit}
                        onChange={(e) => setFormData({ ...formData, budgetPerUnit: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="Under ₹20,000">Under ₹20,000</option>
                        <option value="₹20,000 - ₹30,000">₹20,000 - ₹30,000</option>
                        <option value="₹30,000 - ₹50,000">₹30,000 - ₹50,000</option>
                        <option value="High-End / Workstation">High-End / CAD</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Config / Additional Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Need 16GB RAM, SSD, Ubuntu/Windows 11 pre-loaded, deliver by next week."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Corporate Inquiry
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
