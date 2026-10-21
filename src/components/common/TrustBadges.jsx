import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  Cpu, 
  RotateCcw, 
  Check, 
  BadgeCheck,
  FileCheck2,
  Zap
} from 'lucide-react';
import { QUALITY_INSPECTION_POINTS } from '../../data/servicesData';

export default function TrustBadges() {
  const [activeCategory, setActiveCategory] = useState(0);

  const comparisonData = [
    { feature: "32-Point Deep Diagnostic Test", normal: false, rs: true },
    { feature: "Motherboard Ultrasonic Cleaning & Repaste", normal: false, rs: true },
    { feature: "Original Battery Health Guaranteed (>85-95%)", normal: false, rs: true },
    { feature: "Genuine Activated Windows 11 / macOS", normal: false, rs: true },
    { feature: "1-Month Testing Warranty with Complete Functional Coverage", normal: false, rs: true },
    { feature: "Transparent Direct Pricing with Zero Hidden Costs", normal: false, rs: true },
    { feature: "Doorstep Insured Delivery Across PAN India", normal: false, rs: true },
    { feature: "Dedicated Corporate Fleet SLA Support", normal: false, rs: true },
  ];

  return (
    <section id="trust" className="py-16 bg-white border-b border-slate-200/80">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> The RS Refurbished Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Certified Refurbished Beats Ordinary Second-Hand
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            We don't simply resell used laptops. Every machine undergoes our proprietary 6-stage refurbishment protocol in cleanroom labs before receiving the RS Quality Seal.
          </p>
        </div>

        {/* Comparison Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Comparison Table Left */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Direct Value Comparison
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-3 text-slate-700">Quality Checkpoint</th>
                    <th className="pb-3 text-center text-slate-400">Regular Second-Hand</th>
                    <th className="pb-3 text-center text-brand-600 font-bold bg-brand-50/80 rounded-t-xl px-2">RS Certified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/50 transition-colors">
                      <td className="py-3 text-slate-800 font-medium">{row.feature}</td>
                      <td className="py-3 text-center text-slate-400">
                        <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                      </td>
                      <td className="py-3 text-center bg-brand-50/80 px-2 font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Showcase Right */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-brand-600 to-cyanAccent-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">32-Point Quality Diagnostic</h4>
              <p className="text-xs sm:text-sm text-brand-50 leading-relaxed mb-4">
                Tested across CPU load, memory integrity, thermal curves, GPU rendering, display uniformity, port bandwidth, and battery degradation.
              </p>

              {/* Category Pills */}
              <div className="space-y-2">
                {QUALITY_INSPECTION_POINTS.map((cat, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveCategory(idx)}
                    className={`p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      activeCategory === idx 
                        ? 'bg-white text-slate-900 shadow-md' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>{cat.group} ({cat.points.length} Tests)</span>
                    <Check className={`w-3.5 h-3.5 ${activeCategory === idx ? 'text-brand-600' : 'text-cyanAccent-200'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Selected category preview */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">
                {QUALITY_INSPECTION_POINTS[activeCategory].group} Protocol:
              </span>
              <ul className="space-y-1">
                {QUALITY_INSPECTION_POINTS[activeCategory].points.map((pt, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
