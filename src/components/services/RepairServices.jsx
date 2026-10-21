import React, { useState } from 'react';
import { 
  Wrench, 
  Cpu, 
  Monitor, 
  HardDrive, 
  BatteryCharging, 
  Wind, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Phone,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { REPAIR_SERVICES } from '../../data/servicesData';
import { formatINR } from '../../utils/storage';

export default function RepairServices({ onServiceTicketSubmit }) {
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    phone: '',
    laptopBrand: 'Dell',
    laptopModel: '',
    issueCategory: 'Screen & Display Replacement',
    pickupRequired: true,
    address: '',
    preferredDate: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-brand-600" />;
      case 'Monitor': return <Monitor className="w-5 h-5 text-cyanAccent-600" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5 text-emerald-600" />;
      case 'BatteryCharging': return <BatteryCharging className="w-5 h-5 text-amber-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-sky-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      default: return <Wrench className="w-5 h-5 text-brand-600" />;
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.customerName || !bookingForm.phone) {
      alert('Please fill in your name and contact phone number.');
      return;
    }

    const newTicket = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      customerName: bookingForm.customerName,
      phone: bookingForm.phone,
      laptopBrandModel: `${bookingForm.laptopBrand} ${bookingForm.laptopModel || 'Laptop'}`,
      issueType: bookingForm.issueCategory,
      serviceCategory: 'Hardware Diagnostics & Repair',
      estimatedCost: 'Inspection & Quote',
      status: 'Pending Inspection',
      pickupRequired: bookingForm.pickupRequired,
      address: bookingForm.pickupRequired ? (bookingForm.address || 'Address provided on call') : 'Walk-in Store'
    };

    onServiceTicketSubmit(newTicket);
    setBookingSuccess(true);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  return (
    <section id="services" className="py-16 bg-slate-50 bg-dot-pattern">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
            <Wrench className="w-3.5 h-3.5 text-emerald-600" /> Authorized Repair & Upgrade Center
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Expert Laptop Repair & Speed Upgrade Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            From chip-level micro-soldering to ultra-fast RAM & NVMe SSD upgrades. 100% OEM genuine parts, zero data-loss guarantee, and quick turnaround.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {REPAIR_SERVICES.map((serv) => (
            <div 
              key={serv.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                    {getServiceIcon(serv.icon)}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {serv.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {serv.title}
                </h3>
                <p className="text-xs text-brand-600 font-semibold mb-2.5">
                  {serv.tagline}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {serv.description}
                </p>

                {/* What is included */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                  {serv.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Price & TAT */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Starting From</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatINR(serv.startingPrice)} {serv.unit && <span className="text-xs text-slate-500 font-normal">/{serv.unit}</span>}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Turnaround</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {serv.turnaround}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Interactive Service & Repair Booking Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Book a Laptop Diagnostic & Doorstep Pickup
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select your laptop issue and schedule an insured pickup or priority store repair slot.
            </p>
          </div>

          {bookingSuccess ? (
            <div className="text-center py-6 space-y-4 animate-scaleUp">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Service Ticket Created Successfully!</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your repair booking for <span className="font-semibold text-slate-900">{bookingForm.laptopBrand} {bookingForm.laptopModel}</span> has been logged. Our lead hardware engineer will call <span className="font-semibold text-slate-900">{bookingForm.phone}</span> within 30 minutes to confirm pickup.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/918668848486?text=Hi%20RS%20Refurbished%20Service%20Desk%2C%20I%20just%20booked%20repair%20for%20my%20${encodeURIComponent(bookingForm.laptopBrand)}%20laptop%20with%20issue%3A%20${encodeURIComponent(bookingForm.issueCategory)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Ping Engineer (+91 8668848486)
                </a>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Book Another Laptop
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    placeholder="e.g. Priya Nair"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Laptop Brand
                  </label>
                  <select
                    value={bookingForm.laptopBrand}
                    onChange={(e) => setBookingForm({ ...bookingForm, laptopBrand: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Dell">Dell</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="HP">HP</option>
                    <option value="Apple MacBook">Apple MacBook</option>
                    <option value="Asus">Asus</option>
                    <option value="Acer">Acer</option>
                    <option value="Other Brand">Other Brand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Model (Optional)
                  </label>
                  <input
                    type="text"
                    value={bookingForm.laptopModel}
                    onChange={(e) => setBookingForm({ ...bookingForm, laptopModel: e.target.value })}
                    placeholder="e.g. Inspiron 15 5000 / ThinkPad E14"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Faced / Upgrade Needed *
                  </label>
                  <select
                    value={bookingForm.issueCategory}
                    onChange={(e) => setBookingForm({ ...bookingForm, issueCategory: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Motherboard No Power / Dead">Dead / No Power / Short Circuit</option>
                    <option value="Screen & Display Replacement">Cracked Screen / Display Flickering</option>
                    <option value="10x SSD & RAM Speed Upgrade">Slow Laptop / RAM & SSD Upgrade</option>
                    <option value="Battery Health & Power Drain">Battery Backup Low / Swollen Battery</option>
                    <option value="Keyboard / Trackpad Defect">Keys Not Working / Spilled Liquid</option>
                    <option value="Overheating & Fan Noise">Overheating / Fan Noise / Thermal Paste</option>
                    <option value="Software / OS / Blue Screen">Windows OS Crash / Blue Screen of Death</option>
                  </select>
                </div>
              </div>

              {/* Pickup Mode Toggle */}
              <div className="pt-2">
                <div className="flex items-center gap-6 text-xs font-bold text-slate-700 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pickupMode"
                      checked={bookingForm.pickupRequired === true}
                      onChange={() => setBookingForm({ ...bookingForm, pickupRequired: true })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>🚚 Doorstep Insured Pickup & Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pickupMode"
                      checked={bookingForm.pickupRequired === false}
                      onChange={() => setBookingForm({ ...bookingForm, pickupRequired: false })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>🏬 Walk-in Store Visit</span>
                  </label>
                </div>

                {bookingForm.pickupRequired && (
                  <div>
                    <input
                      type="text"
                      value={bookingForm.address}
                      onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                      placeholder="Enter your complete pickup address & landmark..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Repair / Diagnostic Slot
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
