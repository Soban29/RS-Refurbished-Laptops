import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Send,
  RotateCcw,
  MessageCircle,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Cpu,
  Layers,
  HardDrive,
  ChevronRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { fetchAiChatReplyApi, fetchAiChatStatusApi } from '../../services/api';

const RS_WHATSAPP_NUMBER = "918668848486";

export default function RsAiAdvisor({ laptops = [], onOpenLaptopDetail, onScrollToSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hi! I'm your **RS AI Laptop Advisor**, powered by **Google Gemini LLM**.\n\nWhether you're browsing on your phone or laptop/PC, I'm here to match you with certified refurbished laptops, diagnose hardware repair issues, or help with corporate bulk orders.\n\nWhat kind of laptop or IT solution are you looking for today?",
      quickChips: [
        "💻 Best for Coding / Dev",
        "💼 Dell Latitude 7420 i7",
        "⚡ HP ProBook Touchscreen",
        "🚀 12th Gen 10-Core i7",
        "🖥️ 15.6\" FHD Big Screen",
        "🔧 Laptop Repair Help",
        "🏢 Corporate Bulk Quote"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [geminiBackendConfigured, setGeminiBackendConfigured] = useState(true);
  const [activeModel, setActiveModel] = useState('gemini-1.5-flash');

  const messagesEndRef = useRef(null);

  // Check backend Gemini status on mount
  useEffect(() => {
    fetchAiChatStatusApi().then(res => {
      if (res?.geminiConfigured) {
        setGeminiBackendConfigured(true);
      }
      if (res?.model) {
        setActiveModel(res.model);
      }
    });
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Dismiss teaser after 9 seconds or when opened
  useEffect(() => {
    const timer = setTimeout(() => setShowTeaser(false), 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTeaser(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: "✨ Chat reset! How can I assist you with certified laptops or repair services today?",
        quickChips: [
          "💻 Best for Coding / Dev",
          "💼 Dell Latitude 7420 i7",
          "⚡ HP ProBook Touchscreen",
          "🚀 12th Gen 10-Core i7",
          "🖥️ 15.6\" FHD Big Screen",
          "🔧 Laptop Repair Help",
          "💬 Chat on WhatsApp"
        ]
      }
    ]);
  };

  // Built-in intelligent domain advisor (used for instant structured responses & graceful offline fallback)
  const generateFallbackResponse = (userText) => {
    const text = userText.toLowerCase();

    // 1. WhatsApp / Human Support Request
    if (text.includes('whatsapp') || text.includes('call') || text.includes('human') || text.includes('speak') || text.includes('phone') || text.includes('number') || text.includes('contact')) {
      return {
        text: "You can connect directly with our **RS Refurbished** store team right now on WhatsApp or phone:\n\n📞 **Helpline & WhatsApp:** [+91 8668848486](https://wa.me/918668848486)\n📍 **Store Location:** Sant Tukaram Nagar, Pimpri, Pune 411018, Maharashtra\n⏰ **Hours:** Mon - Sat, 10:00 AM - 8:30 PM\n\nClick below to open a direct WhatsApp chat:",
        whatsappButton: {
          label: "Open WhatsApp Chat Now",
          message: "Hello RS Refurbished! I am browsing your website and would like direct assistance with laptop recommendations."
        }
      };
    }

    // 2. Warranty / Trust / Quality Testing
    if (text.includes('warranty') || text.includes('guarantee') || text.includes('test') || text.includes('quality') || text.includes('return') || text.includes('inspection') || text.includes('genuine')) {
      return {
        text: "🛡️ **RS Refurbished Quality Assurance Guarantee:**\n\n1. **32-Point Diagnostics:** Motherboard stress testing, CPU thermal dissipation, keyboard switches, ports, display panels, and battery health.\n2. **1-Month Testing Warranty:** Complete functional testing coverage on all internal components.\n3. **100% Genuine OS:** Activated Windows 11/10 Pro or macOS with original OEM power adapter.\n4. **Insured Doorstep Delivery:** Secure shipping across India with live consignment tracking.",
        quickChips: [
          "💻 See Available Laptops",
          "🔧 Book a Hardware Repair",
          "💬 Ask on WhatsApp"
        ]
      };
    }

    // 3. Laptop Repair / Upgrades / Diagnostics
    if (text.includes('repair') || text.includes('broken') || text.includes('screen') || text.includes('battery') || text.includes('hinge') || text.includes('slow') || text.includes('water') || text.includes('liquid') || text.includes('upgrade') || text.includes('keyboard')) {
      let repairDiagnosis = "We run a certified chip-level repair lab in Pimpri, Pune.";
      if (text.includes('screen') || text.includes('display')) {
        repairDiagnosis = "For broken, flickering, or line-filled displays, we provide OEM IPS panel replacements with zero dead-pixel guarantee.";
      } else if (text.includes('battery')) {
        repairDiagnosis = "For fast-draining batteries or 'Plugged in, not charging' issues, we install OEM high-cycle replacement batteries with genuine safety sensors.";
      } else if (text.includes('slow') || text.includes('upgrade') || text.includes('ram') || text.includes('ssd')) {
        repairDiagnosis = "For slow laptops, our most popular speed upgrade is migrating to a high-speed NVMe SSD and expanding to 16GB/32GB RAM (gives up to 5x faster boot and multitasking).";
      } else if (text.includes('water') || text.includes('liquid')) {
        repairDiagnosis = "⚠️ **Urgent:** Immediately disconnect your charger and power off your laptop! Do NOT turn it on. Bring or ship it to our lab for ultrasonic motherboard cleaning and short-circuit protection.";
      }

      return {
        text: `🔧 **RS Hardware & Diagnostic Advice:**\n\n${repairDiagnosis}\n\nOur lab handles motherboard chip-level BGA reballing, RAM/SSD upgrades, and hinge repairs with testing warranty.`,
        whatsappButton: {
          label: "Inquire Repair Cost on WhatsApp",
          message: `Hello RS Refurbished! I need repair assistance for my laptop: "${userText}". Please let me know diagnosis timeline and estimate.`
        },
        quickChips: [
          "💻 Browse Ready Laptops Instead",
          "📍 Store Address & Directions",
          "💬 WhatsApp Lab Desk"
        ]
      };
    }

    // 4. Corporate / Bulk / Rental Solution
    if (text.includes('corporate') || text.includes('bulk') || text.includes('b2b') || text.includes('company') || text.includes('office') || text.includes('rental') || text.includes('gst') || text.includes('invoice') || text.includes('50') || text.includes('100')) {
      return {
        text: "🏢 **RS Corporate B2B Fleet Solutions:**\n\nWe supply corporate fleets of 5 to 100+ matching business laptops (ThinkPads, Latitudes, MacBooks) with:\n\n• **18% GST Input Credit Invoice**\n• Pre-imaged company software & security profiles\n• Replacement standby units under SLA\n• Flexible rental and outright buyback options.",
        whatsappButton: {
          label: "Request B2B Quotation on WhatsApp",
          message: "Hello RS Refurbished! I represent a business and would like to request a bulk corporate quote/rental proposal for laptops."
        },
        quickChips: [
          "💼 View Business Laptops",
          "💬 Chat with Enterprise Team"
        ]
      };
    }

    // 5. Apple MacBook queries
    if (text.includes('macbook') || text.includes('apple') || text.includes('m1') || text.includes('m2') || text.includes('macos')) {
      const appleLaptops = laptops.filter(l => l.brand === 'Apple' || l.name.toLowerCase().includes('macbook'));
      if (appleLaptops.length > 0) {
        return {
          text: "🍏 **Certified Refurbished Apple MacBooks:**\n\nApple MacBooks undergo our specialized diagnostic testing including battery cycle count verification, retina display calibration, and genuine macOS activation. Here are our top certified models:",
          recommendedLaptops: appleLaptops.slice(0, 3),
          quickChips: [
            "💼 Dell Latitude Options",
            "💬 DM for Best MacBook Price"
          ]
        };
      } else {
        return {
          text: "🍏 **Apple MacBook Inquiries:**\n\nOur current consignment of Apple MacBooks is being prepared in our testing lab. We have high-performance **Dell Latitude 7420 Aluminium i7 (16GB)** and **HP ProBook Touch** ready in stock right now!\n\nWould you like us to reserve an incoming MacBook or check custom batch availability on WhatsApp?",
          whatsappButton: {
            label: "Check Upcoming MacBook Restock on WhatsApp",
            message: "Hello RS Refurbished! I am looking for a certified refurbished Apple MacBook. Please let me know upcoming stock or similar available models."
          },
          recommendedLaptops: laptops.filter(l => l.processorFamily === 'Intel Core i7').slice(0, 2),
          quickChips: [
            "💼 Dell Latitude 7420 i7",
            "⚡ HP ProBook Touch",
            "💬 WhatsApp Restock Desk"
          ]
        };
      }
    }

    // 6. Programming / Coding / Software Development
    if (text.includes('cod') || text.includes('programm') || text.includes('developer') || text.includes('python') || text.includes('java') || text.includes('web') || text.includes('react') || text.includes('software')) {
      const codingLaptops = laptops.filter(l => 
        (l.ramSize >= 16 || l.name.includes('ThinkPad') || l.name.includes('MacBook') || l.processor.includes('i7')) &&
        l.inStock
      );
      return {
        text: "💻 **Best Refurbished Laptops for Developers:**\n\nFor coding (VS Code, Docker, Python, Web Dev, Java), you want at least **16GB RAM**, a comfortable keyboard for long typing sessions, and a fast NVMe SSD. Here are the top recommended machines:",
        recommendedLaptops: codingLaptops.slice(0, 3),
        quickChips: [
          "💼 Office Laptops",
          "🍏 Apple MacBooks",
          "💬 Inquire on WhatsApp"
        ]
      };
    }

    // 7. Lenovo ThinkPad queries
    if (text.includes('thinkpad') || text.includes('lenovo') || text.includes('t480') || text.includes('x1')) {
      const thinkpads = laptops.filter(l => l.brand === 'Lenovo' || l.name.toLowerCase().includes('thinkpad'));
      if (thinkpads.length > 0) {
        return {
          text: "💼 **Lenovo ThinkPad Business Workhorses:**\n\nThinkPads are the gold standard for durability, spill-resistant ergonomic keyboards, and dual-battery systems. Here are our certified ThinkPads in stock:",
          recommendedLaptops: thinkpads.slice(0, 3),
          quickChips: [
            "💻 Dell Latitude Options",
            "🚀 Intel Core i7 Models",
            "💬 DM for Best Deal"
          ]
        };
      } else {
        return {
          text: "💼 **Lenovo ThinkPad Inquiries:**\n\nOur next batch of Lenovo ThinkPads is currently being prepared. In the meantime, our **Dell Latitude 7420 Aluminium (i7 / 16GB)** and **Dell Latitude 5430 (12th Gen 10-Core)** offer equivalent military-grade durability, precision backlit keyboards, and high-speed processing in stock today!",
          whatsappButton: {
            label: "Inquire ThinkPad Restock on WhatsApp",
            message: "Hello RS Refurbished! I am looking for a Lenovo ThinkPad. Please let me know upcoming stock dates or available alternatives."
          },
          recommendedLaptops: laptops.filter(l => l.brand === 'Dell').slice(0, 2),
          quickChips: [
            "💼 Dell Latitude 7420 i7",
            "🚀 Dell Latitude 5430 12th Gen",
            "💬 Ask on WhatsApp"
          ]
        };
      }
    }

    // 7.5 HP ProBook & Touchscreen queries
    if (text.includes('hp') || text.includes('probook') || text.includes('touch')) {
      const hpLaptops = laptops.filter(l => l.brand === 'HP' || l.name.toLowerCase().includes('probook') || l.display?.toLowerCase().includes('touch'));
      return {
        text: "⚡ **HP ProBook Touchscreen Ultrabook:**\n\nThe HP ProBook 630-G8 features an in-built 13.3\" Full HD Touch display, Intel Core i5 quad-core processor, fingerprint reader, and HP Sure Start self-healing BIOS protection. Ultra-portable and perfect for presentations and traveling professionals:",
        recommendedLaptops: hpLaptops.length > 0 ? hpLaptops : laptops.slice(0, 2),
        quickChips: [
          "💼 Dell Latitude Models",
          "🚀 16GB RAM i7 Options",
          "💬 DM on WhatsApp for Price"
        ]
      };
    }

    // 8. Dell Latitude / XPS queries
    if (text.includes('dell') || text.includes('latitude') || text.includes('xps') || text.includes('inspiron')) {
      const dells = laptops.filter(l => l.brand === 'Dell' || l.name.toLowerCase().includes('dell'));
      return {
        text: "🏢 **Dell Business & Latitude Laptops:**\n\nDell Latitudes offer military-grade magnesium alloy chassis, reliable Intel Core processors, and exceptional battery endurance for business travelers. Check out these certified units:",
        recommendedLaptops: dells.slice(0, 3),
        quickChips: [
          "⚡ HP ProBook Touch",
          "🚀 12th Gen 10-Core i7",
          "💬 DM on WhatsApp for Price"
        ]
      };
    }

    // 9. Intel Core i7 / High Performance / Video Editing / CAD
    if (text.includes('i7') || text.includes('gaming') || text.includes('edit') || text.includes('cad') || text.includes('graphic') || text.includes('32gb') || text.includes('power')) {
      const highPerf = laptops.filter(l => l.processor.includes('i7') || l.ramSize >= 16 || l.processor.includes('M1'));
      return {
        text: "🚀 **High-Performance Powerhouses (i7 & High-RAM):**\n\nFor multitasking, virtual machines, coding, and business management, these high-spec machines offer fast multi-core processing and expandable memory:",
        recommendedLaptops: highPerf.slice(0, 3),
        quickChips: [
          "💻 Dell Latitude 7420 i7",
          "⚡ Dell Latitude 5430 10-Core",
          "💬 Chat with Us on WhatsApp"
        ]
      };
    }

    // 10. General / Budget Recommendation Fallback
    const featuredLaptops = laptops.filter(l => l.featured && l.inStock);
    const displayLaptops = featuredLaptops.length > 0 ? featuredLaptops.slice(0, 3) : laptops.slice(0, 3);

    return {
      text: "✨ Here are our **top certified refurbished laptops** currently in stock. Each comes with a 1-Month Testing Warranty, genuine activated OS, and 32-point inspection certification:",
      recommendedLaptops: displayLaptops,
      quickChips: [
        "💻 Coding / Developer Laptops",
        "💼 Dell Latitude 7420 i7",
        "⚡ HP ProBook Touchscreen",
        "🖥️ 15.6\" FHD Big Screen",
        "🔧 Laptop Repair Lab",
        "💬 DM on WhatsApp"
      ]
    };
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      // 1. Attempt to call Google Gemini LLM API (securely configured on server backend)
      const geminiRes = await fetchAiChatReplyApi(query, messages);

      if (geminiRes && geminiRes.success && geminiRes.reply) {
        // Find matching laptops to attach as visual cards
        const textLower = query.toLowerCase();
        let matchedCards = [];
        if (textLower.includes('thinkpad') || textLower.includes('lenovo')) {
          matchedCards = laptops.filter(l => l.brand === 'Lenovo').slice(0, 2);
        } else if (textLower.includes('macbook') || textLower.includes('apple')) {
          matchedCards = laptops.filter(l => l.brand === 'Apple').slice(0, 2);
        } else if (textLower.includes('dell')) {
          matchedCards = laptops.filter(l => l.brand === 'Dell').slice(0, 2);
        } else if (textLower.includes('i7') || textLower.includes('coding')) {
          matchedCards = laptops.filter(l => l.processor.includes('i7') || l.ramSize >= 16).slice(0, 2);
        }

        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: geminiRes.reply,
          isGemini: true,
          model: geminiRes.model || activeModel,
          recommendedLaptops: matchedCards.length > 0 ? matchedCards : undefined,
          quickChips: [
            "💬 DM on WhatsApp for Deal",
            "💻 View Specifications",
            "🔧 Repair Consultation"
          ]
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Gemini LLM call skipped, using local expert engine:', err);
    }

    // 2. Fallback to smart local domain engine if Gemini is not yet keyed or network is offline
    const responseData = generateFallbackResponse(query);
    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      ...responseData,
      isGemini: false
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* FLOATING LAUNCHER: Positioned cleanly on both PC/Laptop & Mobile */}
      {/* ============================================================== */}
      <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end">
        
        {/* Responsive Teaser Bubble (Dismissible) */}
        {showTeaser && !isOpen && (
          <div 
            onClick={handleOpen}
            className="mb-2.5 max-w-[280px] sm:max-w-xs bg-white text-slate-900 px-3.5 py-2 rounded-2xl shadow-xl border border-brand-200 text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
            <span className="truncate">👋 Need laptop help? Ask RS Gemini AI!</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowTeaser(false); }}
              className="text-slate-400 hover:text-slate-600 ml-1 p-0.5 flex-shrink-0"
              aria-label="Dismiss Teaser"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* The Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 ${
            isOpen 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : 'bg-gradient-to-r from-brand-600 via-brand-500 to-cyanAccent-500 hover:from-brand-700 hover:to-cyanAccent-600 text-white hover:shadow-glow-md hover:scale-105'
          }`}
          title="RS AI Laptop Advisor & Assistant (Desktop & Mobile)"
          aria-label="Toggle AI Advisor"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs font-bold">Close</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-brand-600 animate-pulse"></span>
              </div>
              <span className="text-xs font-extrabold tracking-wide">RS Gemini AI</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* CHAT MODAL: Full bottom-sheet on Mobile, Floating card on PC */}
      {/* ============================================================== */}
      {isOpen && (
        <div 
          className="fixed inset-x-0 bottom-0 sm:bottom-20 sm:right-6 sm:left-auto z-50 w-full sm:w-[420px] h-[86vh] sm:h-[600px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-slideUp sm:animate-scaleUp"
        >
          {/* Mobile Pull Handle Bar */}
          <div className="sm:hidden w-full pt-2 pb-1 bg-slate-900 flex justify-center">
            <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-3.5 sm:p-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-cyanAccent-500 flex items-center justify-center shadow-md flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight">RS AI Laptop Advisor</h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 tracking-wider">
                    Gemini
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">
                  {geminiBackendConfigured ? '⚡ Powered by Google Gemini LLM' : 'Refurbished Tech & Repair Expert'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Restart Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-brand-50/80 px-3 py-1.5 border-b border-brand-100 flex items-center justify-between text-[11px] text-brand-900">
            <span className="flex items-center gap-1 font-semibold truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              1-Mo Testing Warranty on All Units
            </span>
            <a
              href={`https://wa.me/${RS_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors flex-shrink-0"
            >
              <Phone className="w-2.5 h-2.5" /> WhatsApp
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                {/* Text Bubble */}
                <div
                  className={`max-w-[90%] sm:max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-xs shadow-sm font-medium'
                      : 'bg-white text-slate-800 rounded-bl-xs shadow-xs border border-slate-200/90'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional WhatsApp Button Attachment */}
                {msg.whatsappButton && (
                  <div className="mt-2 w-[90%] sm:w-[85%]">
                    <a
                      href={`https://wa.me/${RS_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.whatsappButton.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>{msg.whatsappButton.label}</span>
                    </a>
                  </div>
                )}

                {/* Recommended Laptops Mini Cards */}
                {msg.recommendedLaptops && msg.recommendedLaptops.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    {msg.recommendedLaptops.map((laptop) => {
                      const whatsappMsg = encodeURIComponent(
                        `Hi RS Refurbished! Your AI Advisor recommended *${laptop.name}* (${laptop.processor}, ${laptop.ram}, ${laptop.storage}). Could you please share the best price and live condition pictures?`
                      );
                      const whatsappUrl = `https://wa.me/${RS_WHATSAPP_NUMBER}?text=${whatsappMsg}`;

                      return (
                        <div
                          key={laptop.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-brand-300 transition-all flex items-center justify-between gap-2.5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={laptop.image}
                              alt={laptop.name}
                              className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80";
                              }}
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-[11px] sm:text-xs truncate" title={laptop.name}>
                                {laptop.name}
                              </h4>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {laptop.processor.split(' ')[0]} • {laptop.ram} • {laptop.storage}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  ● In Stock
                                </span>
                                <span className="text-[9px] font-semibold text-slate-400">
                                  {laptop.conditionGrade?.split(' ')[0] || 'Grade A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 sm:px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center gap-1 shadow-2xs"
                              title="DM on WhatsApp for Best Price"
                            >
                              <span>DM Price</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                            {onOpenLaptopDetail && (
                              <button
                                onClick={() => {
                                  onOpenLaptopDetail(laptop);
                                  setIsOpen(false);
                                }}
                                className="px-2 py-0.5 text-[9px] font-semibold text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded text-center transition-colors"
                              >
                                View Specs
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Quick Chips Suggestions */}
                {msg.quickChips && msg.quickChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.quickChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-[11px] font-medium bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2.5 bg-white/80 rounded-xl max-w-[140px] animate-pulse shadow-2xs border border-slate-100">
                <Bot className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                <span>Gemini thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Action Bar */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini about laptops, specs, repair..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim()}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  inputQuery.trim()
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Google Gemini AI • Desktop & Mobile</span>
              <a
                href={`https://wa.me/${RS_WHATSAPP_NUMBER}?text=Hi%20RS%20Refurbished%2C%20I%20have%20an%20inquiry`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 font-bold hover:underline flex items-center gap-0.5"
              >
                WhatsApp Desk (+91 8668848486)
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
