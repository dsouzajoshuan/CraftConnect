import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Mic, Camera, CheckCircle, Play, ChevronRight } from 'lucide-react';
import { categories } from '../data/categories';
import { initialProducts } from '../data/products';
import { artisans } from '../data/artisans';
import ProductCard from '../components/marketplace/ProductCard';
import { AppProvider } from '../context/AppContext';

const trustBadges = [
  { icon: '🤝', label: 'Made by Artisans' },
  { icon: '🌿', label: 'Traditional Crafts' },
  { icon: '📖', label: 'Stories Behind Every Creation' },
];

const steps = [
  {
    step: 1,
    icon: Camera,
    title: 'Take a Photo',
    description: 'Use your phone camera to photograph your handmade craft. Natural daylight works best.',
    color: 'bg-terracotta/10 text-terracotta',
  },
  {
    step: 2,
    icon: Mic,
    title: 'Describe in Your Voice',
    description: 'Tap the microphone and speak about your craft in any language. We handle the rest.',
    color: 'bg-forest/10 text-forest',
  },
  {
    step: 3,
    icon: CheckCircle,
    title: 'Review & Publish',
    description: 'Review your listing, set your price, and publish it to thousands of buyers.',
    color: 'bg-terracotta/10 text-terracotta',
  },
];

const featuredProducts = initialProducts.filter(p => p.featured).slice(0, 4);

export default function Home() {
  const [imgError, setImgError] = useState({});

  return (
    <div className="bg-cream">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-deep-green text-white" aria-labelledby="hero-heading">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&fit=crop')] bg-cover bg-center" />
        <div className="relative page-container py-24 md:py-36 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="inline-block bg-terracotta/20 text-terracotta text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              🌿 Voice-First Artisan Marketplace
            </span>
            <h1 id="hero-heading" className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
              Every Craft<br />Has a{' '}
              <span className="text-terracotta italic">Story.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg">
              CraftConnect empowers artisans from coastal Karnataka to bring handmade creations to buyers everywhere — using just a photo and their voice.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/marketplace" className="btn-terracotta text-base">
                Explore Handmade Crafts <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/artisan/dashboard" className="border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all text-base flex items-center gap-2">
                Start Selling
              </Link>
            </div>
            <div className="flex flex-wrap gap-5">
              {trustBadges.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-base">{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-deep-green via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&h=700&fit=crop"
              alt="Artisan working on Kasuti embroidery"
              className="rounded-3xl shadow-2xl w-full h-[480px] object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&h=700&fit=crop'; }}
            />
            <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex -space-x-1">
                  {artisans.slice(0, 3).map(a => (
                    <img key={a.id} src={a.avatar} alt={a.name} className="w-7 h-7 rounded-full ring-2 ring-white object-cover" />
                  ))}
                </div>
                <span className="text-xs font-bold text-charcoal">4+ Artisans</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                <span className="text-xs text-charcoal/70 ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-white border-b border-sage">
        <div className="page-container py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '120+', label: 'Handmade Products' },
            { value: '4', label: 'Master Artisans' },
            { value: '5', label: 'Craft Categories' },
            { value: '4.9', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif font-bold text-2xl text-forest">{value}</p>
              <p className="text-sm text-charcoal/60">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="page-container py-20" aria-labelledby="categories-heading">
        <div className="text-center mb-12">
          <h2 id="categories-heading" className="section-title mb-3">Shop by Craft</h2>
          <p className="section-subtitle max-w-xl mx-auto">Each category preserves a unique tradition from the artisan communities of coastal Karnataka.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/marketplace?category=${cat.id}`}
              className="group flex flex-col items-center text-center bg-white rounded-2xl p-5 border border-sage/50 hover:border-forest hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center mb-3 text-2xl group-hover:bg-forest/10 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-xs font-semibold text-charcoal leading-tight mb-1">{cat.name}</h3>
              <p className="text-xs text-charcoal/50">{cat.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-white py-20" aria-labelledby="featured-heading">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 id="featured-heading" className="section-title mb-2">Featured Crafts</h2>
              <p className="section-subtitle">Hand-picked by our community of artisans</p>
            </div>
            <Link to="/marketplace" className="flex items-center gap-1 text-forest font-semibold text-sm hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 page-container" aria-labelledby="how-heading">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">For Artisans</span>
          <h2 id="how-heading" className="section-title mt-2 mb-3">Sell in Three Simple Steps</h2>
          <p className="section-subtitle max-w-lg mx-auto">No typing required. No digital experience needed. Just you and your craft.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ step, icon: Icon, title, description, color }) => (
            <div key={step} className="relative text-center bg-white rounded-2xl p-8 border border-sage/50 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-deep-green text-white text-sm font-bold rounded-full flex items-center justify-center">
                {step}
              </div>
              <h3 className="font-serif font-semibold text-xl text-charcoal mb-3">{title}</h3>
              <p className="text-charcoal/60 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/artisan/add-product" className="btn-primary text-base">
            <Mic className="w-5 h-5" /> Try Speak & Sell
          </Link>
        </div>
      </section>

      {/* ── Artisan Stories ── */}
      <section className="bg-sage/40 py-20" aria-labelledby="artisans-heading">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 id="artisans-heading" className="section-title mb-3">Meet the Artisans</h2>
            <p className="section-subtitle">Real people, real stories, real crafts from coastal Karnataka.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisans.map(artisan => (
              <Link
                key={artisan.id}
                to={`/artisan/${artisan.id}`}
                className="group bg-white rounded-2xl p-6 border border-sage/50 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-sage group-hover:ring-forest transition-all mb-4"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop'; }}
                />
                <h3 className="font-serif font-semibold text-charcoal mb-1">{artisan.name}</h3>
                <p className="text-xs text-terracotta font-medium mb-2">{artisan.craft}</p>
                <p className="text-xs text-charcoal/60 mb-3">{artisan.location}</p>
                <p className="text-xs text-charcoal/70 line-clamp-3 italic">"{artisan.story.slice(0, 100)}…"</p>
                <span className="mt-4 text-xs font-semibold text-forest group-hover:underline">View Profile →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Craft Circle Preview ── */}
      <section className="py-20 page-container" aria-labelledby="cc-heading">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">Community</span>
            <h2 id="cc-heading" className="section-title mt-2 mb-4">Join the Craft Circle</h2>
            <p className="section-subtitle mb-6">
              Learn, share, and grow with a community of artisans. Watch tutorials, ask questions, join live sessions — all in your language.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                '📹 Video tutorials in Kannada, Hindi & English',
                '🙋 Q&A with experienced artisans',
                '📅 Live workshops and craft sessions',
                '💰 Pricing, packaging & marketing guides',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-charcoal/70">
                  <span className="mt-0.5 flex-shrink-0">{item.split(' ')[0]}</span>
                  <span>{item.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>
            <Link to="/craft-circle" className="btn-primary">
              Explore Craft Circle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1596280459345-316279f06e6e?w=700&h=450&fit=crop"
              alt="Artisans in community craft session"
              className="rounded-3xl w-full h-72 object-cover shadow-xl"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&h=450&fit=crop'; }}
            />
            <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-forest" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Latest Tutorial</p>
                <p className="text-xs text-charcoal/60">Photography for Artisans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-deep-green text-white py-20 text-center" aria-labelledby="cta-heading">
        <div className="page-container">
          <h2 id="cta-heading" className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Your craft deserves<br />to be seen.
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Join CraftConnect today and bring your handmade creations to buyers across India — using just your voice.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/artisan/add-product" className="btn-terracotta text-base">
              <Mic className="w-5 h-5" /> Start Selling Now
            </Link>
            <Link to="/marketplace" className="border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all text-base">
              Browse Crafts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
