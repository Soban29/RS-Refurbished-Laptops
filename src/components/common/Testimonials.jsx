import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2,
  Building,
  Sparkles
} from 'lucide-react';
import { TESTIMONIALS, FAQ_LIST } from '../../data/b2bFeatures';

export default function Testimonials() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="contact" className="py-16 bg-slate-50 bg-dot-pattern">
      <div className="site-container">
        
        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-3 border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9/5 Rated by 1,200+ Clients
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Freelancers, Startups & Enterprises
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Hear from companies that cut their IT hardware costs by 65% and individuals who found their dream work machine.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.content}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                  }}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {t.role}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.2 rounded mt-0.5">
                    {t.company}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Have Questions? We Have Answers.
            </h3>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
