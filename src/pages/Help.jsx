import { useState } from 'react';
import { 
  HelpCircle, MessageCircle, Phone, Volume2, ChevronDown, 
  Send, Sparkles, Mic, FileQuestion, ArrowRight, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Help() {
  const { showToast } = useApp();
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState('artisan');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaskara! Welcome to CraftConnect Artisan Support. How can we assist you today?', time: 'Just now' },
    { sender: 'bot', text: 'You can ask about recording your product voice note, tracking order payouts, or packaging your handicrafts.', time: 'Just now' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const faqs = {
    artisan: [
      {
        q: 'How does Speak & Sell work for listing products?',
        a: 'Simply tap the microphone icon in "Add Product", choose Kannada, Hindi, or English, and describe your item naturally — mention its name, materials used, size, and your price. Our system automatically organizes your description into a professional digital listing.'
      },
      {
        q: 'Do I need digital banking or a smartphone app?',
        a: 'No app is required! CraftConnect works directly inside any mobile browser. Order alerts and delivery coordination can be sent directly to your WhatsApp or SMS.'
      },
      {
        q: 'How and when do I receive payment for sold items?',
        a: 'Funds are transferred directly via UPI or direct bank transfer within 48 hours of product delivery confirmation. We do not hold your money.'
      },
      {
        q: 'Who arranges the parcel pickup and shipping?',
        a: 'CraftConnect partners with local coastal logistics services. Once an order is placed, a local pickup agent will visit your home or workshop with safety packaging.'
      }
    ],
    buyer: [
      {
        q: 'Are all products authentic handcrafted items?',
        a: 'Yes, 100%. Every item is crafted by verified traditional artisans from Udupi, Kumta, Mangaluru, and surrounding Karnataka regions. No mass factory duplicates are allowed.'
      },
      {
        q: 'What is the typical shipping timeline?',
        a: 'Since each piece is hand-finished with meticulous care, domestic deliveries within Karnataka usually take 3 to 5 business days, while pan-India shipping takes 5 to 7 days.'
      },
      {
        q: 'Can I request customized dimensions or patterns?',
        a: 'Yes! You can use the "WhatsApp Artisan" button on any artisan profile or product page to discuss custom color schemes, Kasuti borders, or personalized measurements.'
      }
    ]
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newChat = [...chatMessages, { sender: 'user', text: userText, time: 'Just now' }];
    setChatMessages(newChat);
    setInputMsg('');

    // Simulate smart bot response
    setTimeout(() => {
      let reply = 'Thank you for reaching out! Our Karnataka artisan coordinator will review this and assist you promptly.';
      const lower = userText.toLowerCase();
      if (lower.includes('voice') || lower.includes('speak') || lower.includes('mic')) {
        reply = 'To use voice recording, make sure microphone access is granted in your mobile browser. You can speak in conversational Kannada!';
      } else if (lower.includes('payment') || lower.includes('money') || lower.includes('upi')) {
        reply = 'Payments are settled to your linked UPI number or bank account within 48 hours of customer delivery.';
      } else if (lower.includes('ship') || lower.includes('pickup') || lower.includes('courier')) {
        reply = 'Local courier partners will pick up parcels directly from your doorstep in coastal Karnataka.';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
    }, 800);
  };

  const handlePlayVoiceGuide = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const text = "Namaskara! Welcome to CraftConnect. To sell your handmade craft, tap Add Product in your menu, click the green microphone, and speak naturally about your craft. We will turn your voice into an online store.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
      showToast('Playing voice-guided tutorial');
    } else {
      showToast('Audio synthesis not supported on this browser', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Support & Knowledge Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            How can we support you today?
          </h1>
          <p className="text-charcoal/70 text-base sm:text-lg">
            Whether you are an artisan listing your first Kasuti saree or a buyer looking for handmade heritage treasures, we are here to assist.
          </p>
        </div>

        {/* Voice-First Assistance Banner */}
        <div className="bg-forest text-cream rounded-3xl p-6 sm:p-8 mb-14 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-cream/10 flex items-center justify-center shrink-0 border border-cream/20">
              <Volume2 className={`w-7 h-7 text-sand ${isPlayingAudio ? 'animate-bounce text-amber-300' : ''}`} />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta text-white uppercase tracking-wider">
                Voice-First Help (ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ)
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
                Prefer listening instead of reading?
              </h2>
              <p className="text-sm text-sand/80 mt-1">
                Listen to our quick spoken tutorial on how to list products and sell crafts using just your voice.
              </p>
            </div>
          </div>
          <button
            onClick={handlePlayVoiceGuide}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md shrink-0 flex items-center gap-2 ${
              isPlayingAudio
                ? 'bg-amber-400 text-charcoal'
                : 'bg-sand hover:bg-sand/90 text-forest'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {isPlayingAudio ? 'Stop Spoken Audio' : 'Play Spoken Guide'}
          </button>
        </div>

        {/* 2-Column: FAQs + Interactive WhatsApp Support Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-charcoal">Frequently Asked Questions</h2>
              
              {/* Category selector */}
              <div className="flex items-center bg-white p-1 rounded-full border border-sage shadow-sm">
                <button
                  onClick={() => { setActiveFaqCategory('artisan'); setActiveFaq(0); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFaqCategory === 'artisan'
                      ? 'bg-forest text-cream shadow-sm'
                      : 'text-charcoal/70'
                  }`}
                >
                  For Artisans
                </button>
                <button
                  onClick={() => { setActiveFaqCategory('buyer'); setActiveFaq(0); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFaqCategory === 'buyer'
                      ? 'bg-forest text-cream shadow-sm'
                      : 'text-charcoal/70'
                  }`}
                >
                  For Buyers
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {faqs[activeFaqCategory].map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-sage/40 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-sage/10 transition-colors"
                    >
                      <span className="font-serif font-bold text-base text-charcoal">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-charcoal/50 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-forest' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-charcoal/80 leading-relaxed border-t border-sage/20 bg-cream/20 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Safety guarantee */}
            <div className="bg-sage/20 rounded-2xl p-5 border border-sage/30 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-forest shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-charcoal text-sm">Artisan Guarantee & Fair Return Policy</h4>
                <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
                  Every artisan is guaranteed 100% of their set price. We do not extract hefty marketplace commissions from traditional coastal craftspeople.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive WhatsApp Help Simulator (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-sage shadow-xl overflow-hidden flex flex-col h-[520px]">
              {/* WhatsApp header */}
              <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
                      CC
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">CraftConnect Saathi</h3>
                    <p className="text-xs text-emerald-200">Online • Coastal Support Team</p>
                  </div>
                </div>
                <MessageCircle className="w-5 h-5 text-white/80" />
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]/30">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-white text-charcoal rounded-tl-none border border-black/5'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`block text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-emerald-200' : 'text-charcoal/40'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-sage/30 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question in English or Kannada…"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 text-xs sm:text-sm p-2.5 rounded-full bg-sage/20 border border-transparent focus:border-emerald-600 focus:outline-none focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-sage/40 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base">Toll-Free Helpline</h3>
            <p className="text-xs text-charcoal/60 mt-1">Available 9 AM to 7 PM IST</p>
            <p className="text-sm font-bold text-forest mt-2">1800-425-CRAFT (27238)</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sage/40 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base">WhatsApp Community</h3>
            <p className="text-xs text-charcoal/60 mt-1">Get instant answers on WhatsApp</p>
            <p className="text-sm font-bold text-emerald-700 mt-2">+91 94812 34567</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sage/40 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base">Local Craft Centers</h3>
            <p className="text-xs text-charcoal/60 mt-1">Udupi • Kumta • Mangaluru</p>
            <p className="text-sm font-bold text-terracotta mt-2">Visit nearest Kendra</p>
          </div>
        </div>
      </div>
    </div>
  );
}
