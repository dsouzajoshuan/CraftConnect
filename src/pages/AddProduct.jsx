import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera, Mic, MicOff, CheckCircle, Upload, X, Sparkles,
  ChevronRight, ChevronLeft, Globe, FileText, RefreshCw,
  Volume2, Image as ImageIcon, Wand2, Info
} from 'lucide-react';
import DashboardSidebar from '../components/artisan/DashboardSidebar';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';

const STEPS = [
  { id: 1, label: '1. Photo', icon: Camera },
  { id: 2, label: '2. Speak Description', icon: Mic },
  { id: 3, label: '3. Review & Sell', icon: CheckCircle },
];

const SAMPLE_PHOTOS = [
  {
    name: 'Kasuti Embroidery',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
    title: 'Kasuti Hand-Embroidered Tote',
    category: 'kasuti',
    price: '1450',
    materials: 'Pure Khadi Cotton, Resham Silk Thread',
    sampleVoice: 'This is a handcrafted Kasuti tote bag with sacred gopuram and peacock geometric patterns. Hand-stitched using traditional Ilkal thread count. Takes four days of needlework. Asking fourteen hundred and fifty rupees.',
  },
  {
    name: 'Beedu Craft',
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&h=800&fit=crop',
    title: 'Beedu Woven Storage Basket',
    category: 'beedu',
    price: '950',
    materials: 'Coastal Wild Bamboo, Natural Reed',
    sampleVoice: 'Handwoven cylindrical Beedu storage basket made from seasoned Kumta village bamboo. Tightly braided rim with natural water-resistant polish. Great for fruits or laundry. Nine hundred and fifty rupees.',
  },
  {
    name: 'Temple Jewelry',
    url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&h=800&fit=crop',
    title: 'Silver Filigree Lotus Jhumkas',
    category: 'jewelry',
    price: '2200',
    materials: '92.5 Sterling Silver, Kemp Stones',
    sampleVoice: 'Traditional coastal temple style earrings with handcrafted silver wire filigree and ruby kemp stones. Inspired by Udupi temple carvings. Two thousand two hundred rupees.',
  },
];

const LANGUAGES = [
  { id: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)' },
  { id: 'en-IN', label: 'English' },
  { id: 'hi-IN', label: 'Hindi (हिंदी)' },
];

export default function AddProduct() {
  const { addProduct, setDraftProduct, draftProduct, showToast } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [image, setImage] = useState(draftProduct?.image || null);
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState(draftProduct?.description || '');
  const [langCode, setLangCode] = useState('kn-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  
  const [form, setForm] = useState({
    name: draftProduct?.name || '',
    description: draftProduct?.description || '',
    category: draftProduct?.category || 'kasuti',
    price: draftProduct?.price || '',
    materials: draftProduct?.materials || '',
    stock: draftProduct?.stock || 3,
    location: draftProduct?.location || 'Udupi, Karnataka',
  });
  
  const [improving, setImproving] = useState(false);
  const [improved, setImproved] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setSpeechSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }, []);

  const handleImageFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WebP).', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      showToast('Photo uploaded!');
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  }, [handleImageFile]);

  const selectSampleItem = (sample) => {
    setImage(sample.url);
    setDescription(sample.sampleVoice);
    setForm(f => ({
      ...f,
      name: sample.title,
      category: sample.category,
      price: sample.price,
      materials: sample.materials,
      description: sample.sampleVoice,
    }));
    showToast(`Loaded sample "${sample.name}" for instant demonstration!`);
  };

  const startRecording = () => {
    setRecordingError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordingError('Speech recognition is not supported in this browser. Please use keyboard or sample demo audio.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langCode;
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setDescription(transcript);
        
        // Auto-extract numbers as suggested price if detected
        const priceMatch = transcript.match(/\b(\d{3,5})\b/);
        if (priceMatch) {
          setForm(f => ({ ...f, price: priceMatch[1] }));
        }
      };
      
      recognition.onerror = (e) => {
        setIsRecording(false);
        if (e.error === 'not-allowed') {
          setRecordingError('Microphone permission denied. Allow mic access in browser address bar or use sample voice button.');
        } else {
          setRecordingError(`Voice note paused (${e.error}). You can type or use sample voice.`);
        }
      };
      
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setRecordingError('Microphone could not be started. Please type or use sample audio.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleImproveWithAI = () => {
    if (!description.trim()) return;
    setImproving(true);

    setTimeout(() => {
      const cleaned = description.trim();
      const polished = `Authentic Handcrafted Karnataka Heritage Piece: ${cleaned}\n\nHandmade with dedication by an artisan master from coastal Karnataka. Crafted using time-honored techniques passed through generations. Each intricate detail reflects sustainable, organic materials and centuries of traditional cultural pride. Perfect as an heirloom keepsake or meaningful gift.`;
      
      setDescription(polished);
      setForm(f => ({
        ...f,
        description: polished,
        name: f.name || 'Traditional Handcrafted Artisan Masterpiece',
      }));
      setImproving(false);
      setImproved(true);
      showToast('Spoken voice description enhanced with AI!');
    }, 1200);
  };

  const canGoNext = () => {
    if (step === 1) return !!image;
    if (step === 2) return description.trim().length > 5;
    return true;
  };

  const goNext = () => {
    if (step === 2) {
      setForm(f => ({
        ...f,
        description: description || f.description,
        name: f.name || 'Handmade Coastal Craft',
      }));
    }
    if (step < 3) setStep(s => s + 1);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      showToast('Please complete required fields (Name, Price, Category).', 'info');
      return;
    }
    const catObj = categories.find(c => c.id === form.category);
    addProduct({
      ...form,
      image: image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
      images: [image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop'],
      price: Number(form.price),
      stock: Number(form.stock) || 1,
      status: 'published',
      categoryLabel: catObj?.name || 'Kasuti Embroidery',
    });
    navigate('/artisan/products');
  };

  return (
    <div className="artisan-layout bg-cream min-h-screen">
      <DashboardSidebar />
      
      <div className="artisan-content max-w-4xl pb-24 md:pb-12">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-charcoal/60">
            <Link to="/artisan/dashboard" className="hover:text-forest">Dashboard</Link>
            <span>/</span>
            <span className="font-semibold text-charcoal">Speak & Sell (Voice Listing)</span>
          </div>
          <span className="text-xs bg-forest/10 text-forest font-semibold px-3 py-1 rounded-full">
            🎙️ Voice-First Digitalization
          </span>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-sage/60 overflow-hidden">
          {/* Stepper Tabs */}
          <div className="grid grid-cols-3 border-b border-sage/40">
            {STEPS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => id < step && setStep(id)}
                className={`py-4 px-3 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all ${
                  step === id
                    ? 'bg-forest text-sand border-b-2 border-sand shadow-sm'
                    : id < step
                    ? 'bg-sage/20 text-forest hover:bg-sage/40 cursor-pointer'
                    : 'text-charcoal/40 cursor-not-allowed bg-white'
                }`}
                disabled={id > step}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">
            {/* STEP 1: PHOTO */}
            {step === 1 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Step 1: Add a Photo of Your Craft</h2>
                  <p className="text-charcoal/60 text-sm mt-1">
                    Upload an image or choose one of our coastal Karnataka craft presets for an instant demonstration.
                  </p>
                </div>

                {/* Upload or Drop Area */}
                {!image ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                      isDragging ? 'border-forest bg-forest/5' : 'border-sage hover:border-forest hover:bg-sage/10'
                    }`}
                  >
                    <div className="w-16 h-16 bg-forest/10 text-forest rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-charcoal text-base">Drag and drop your photo here</h3>
                    <p className="text-xs text-charcoal/50 mt-1 mb-4">Take a phone photo or pick from files (JPG, PNG, WebP)</p>
                    <button
                      type="button"
                      className="btn-primary text-sm py-2 px-6 shadow-md"
                    >
                      Browse Device Files
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden border border-sage shadow-md">
                    <img src={image} alt="Craft preview" className="w-full h-80 object-cover" />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-charcoal hover:bg-white shadow"
                      >
                        Change Photo
                      </button>
                      <button
                        onClick={() => setImage(null)}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 shadow"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageFile(e.target.files[0])}
                />

                {/* Quick Presets for Demo */}
                <div className="bg-sage/20 rounded-2xl p-4 border border-sage/40">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      Demo Shortcut: Pick a Coastal Karnataka Craft Preset
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SAMPLE_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSampleItem(sample)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-sage/60 hover:border-forest text-left transition-all shadow-sm group"
                      >
                        <img src={sample.url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-charcoal group-hover:text-forest truncate">{sample.title}</p>
                          <p className="text-[10px] text-charcoal/50">₹{sample.price} • {sample.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: VOICE DESCRIPTION */}
            {step === 2 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Step 2: Speak About Your Craft</h2>
                  <p className="text-charcoal/60 text-sm mt-1">
                    Artisans don't need to type! Select your mother tongue, tap the microphone, and describe your item.
                  </p>
                </div>

                {/* Language Picker */}
                <div className="flex items-center gap-3 bg-sage/20 p-3 rounded-2xl border border-sage/40 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal">
                    <Globe className="w-4 h-4 text-forest" />
                    <span>Spoken Language:</span>
                  </div>
                  <div className="flex gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setLangCode(lang.id)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                          langCode === lang.id
                            ? 'bg-forest text-sand shadow-sm'
                            : 'bg-white text-charcoal/70 border border-sage hover:bg-sage/30'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Interactive Microphone */}
                <div className="flex flex-col items-center justify-center py-8 bg-cream/40 rounded-3xl border border-sage/40 relative overflow-hidden">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200 scale-110'
                        : 'bg-forest text-sand hover:bg-deep-green hover:scale-105 active:scale-95'
                    }`}
                    aria-label={isRecording ? 'Stop recording voice note' : 'Start recording voice note'}
                  >
                    {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                  </button>

                  <p className="font-bold text-sm text-charcoal mt-4">
                    {isRecording ? '🔴 Listening… Speak freely now (Tap to Finish)' : 'Tap to Start Speaking'}
                  </p>
                  <p className="text-xs text-charcoal/50 mt-1">
                    Mention what it is, threads/woods used, days taken, and your expected price.
                  </p>

                  {/* Audio wave indicator */}
                  {isRecording && (
                    <div className="flex items-center gap-1.5 mt-3">
                      {[16, 28, 40, 24, 34, 18, 30].map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 bg-terracotta rounded-full animate-bounce"
                          style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                        />
                      ))}
                    </div>
                  )}

                  {recordingError && (
                    <div className="mt-3 text-xs text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                      {recordingError}
                    </div>
                  )}
                </div>

                {/* Spoken Text Transcript & AI Polisher */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-forest" /> Spoken Transcript
                    </label>
                    <span className="text-xs text-charcoal/50">{description.length} chars</span>
                  </div>

                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Your spoken words appear here in real-time. You can also edit or type manually…"
                    className="w-full text-sm p-4 rounded-2xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none bg-white shadow-inner"
                  />

                  {/* AI Polishing Button */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleImproveWithAI}
                      disabled={!description.trim() || improving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all border border-amber-300 shadow-sm disabled:opacity-50"
                    >
                      {improving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-terracotta" />}
                      {improving ? 'AI Polishing Story…' : improved ? 'Polish Again with AI' : '✨ Enhance Description with AI'}
                    </button>

                    {/* Pre-fill Voice Sample button for quick testing */}
                    <button
                      type="button"
                      onClick={() => {
                        const sample = SAMPLE_PHOTOS[0];
                        selectSampleItem(sample);
                      }}
                      className="text-xs font-semibold text-forest hover:underline"
                    >
                      Or load demo voice sample →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & PUBLISH */}
            {step === 3 && (
              <form onSubmit={handlePublish} className="animate-fade-in space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Step 3: Review & Publish Listing</h2>
                  <p className="text-charcoal/60 text-sm mt-1">
                    Details extracted from your voice note. Verify or tweak before your craft goes live to buyers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 p-4 bg-cream/30 rounded-2xl border border-sage/40">
                  {image && (
                    <img
                      src={image}
                      alt="Listing preview"
                      className="w-32 h-32 rounded-xl object-cover shrink-0 ring-2 ring-sage shadow-sm"
                    />
                  )}
                  <div className="space-y-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest text-cream font-semibold">
                      Ready to Publish
                    </span>
                    <h3 className="font-serif font-bold text-lg text-charcoal">{form.name || 'Handmade Craft'}</h3>
                    <p className="text-xs text-charcoal/60">Craftsperson: Savitha Naik • Udupi, Karnataka</p>
                    <p className="text-sm font-bold text-terracotta">₹{form.price || '0'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-charcoal mb-1">Product Title *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Craft Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20 bg-white"
                      required
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Materials Used</label>
                    <input
                      type="text"
                      value={form.materials}
                      onChange={(e) => setForm(f => ({ ...f, materials: e.target.value }))}
                      placeholder="e.g. Khadi cotton, organic vegetable dye"
                      className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Available Stock Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={form.stock}
                      onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))}
                      className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-charcoal mb-1">Published Story & Description *</label>
                    <textarea
                      rows={4}
                      value={form.description || description}
                      onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4 border-t border-sage/40">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-full border border-sage text-charcoal text-sm font-semibold hover:bg-sage/20"
                  >
                    ← Back to Voice
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-sm py-3 px-8 shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-sand" /> Publish to Live Store
                  </button>
                </div>
              </form>
            )}

            {/* Stepper Navigation Buttons */}
            {step < 3 && (
              <div className="flex items-center justify-between pt-8 border-t border-sage/40 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 1}
                  className="flex items-center gap-1.5 text-sm font-semibold text-charcoal/60 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
