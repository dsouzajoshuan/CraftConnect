import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Users, Award, Calendar, Heart, Share2, 
  MessageCircle, Sparkles, CheckCircle2, Package, ArrowLeft, ExternalLink
} from 'lucide-react';
import { artisans } from '../data/artisans';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/marketplace/ProductCard';
import { EmptyState } from '../components/common/UI';

export default function ArtisanProfile() {
  const { id } = useParams();
  const { products, showToast } = useApp();
  const [following, setFollowing] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('Namaskara! I am interested in your handcrafted items on CraftConnect.');

  const artisan = artisans.find(a => a.id === id);

  if (!artisan) {
    return (
      <div className="page-container py-24">
        <EmptyState
          title="Artisan not found"
          message="We could not find the artisan profile you are looking for."
          action={<Link to="/marketplace" className="btn-primary">Explore Crafts</Link>}
        />
      </div>
    );
  }

  // Filter products by this artisan
  const artisanProducts = products.filter(p => p.artisanId === artisan.id);

  const handleFollow = () => {
    setFollowing(!following);
    showToast(following ? `Unfollowed ${artisan.name}` : `You are now following ${artisan.name}!`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    setWhatsappModalOpen(false);
    showToast(`WhatsApp message simulated to ${artisan.name}!`);
  };

  return (
    <div className="min-h-screen bg-cream/30 pb-20">
      {/* Cover Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-forest/20">
        <img
          src={artisan.cover}
          alt={`${artisan.name}'s workshop`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
        
        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-charcoal text-sm font-medium hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sage/40">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-sage/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-white shadow-lg"
                />
                <span className="absolute -bottom-2 -right-2 bg-forest text-cream p-1.5 rounded-full shadow-md" title="Verified Artisan">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">{artisan.name}</h1>
                  <span className="px-3 py-1 bg-forest/10 text-forest text-xs font-semibold rounded-full">
                    {artisan.craft}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-charcoal/70 mt-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-terracotta" /> {artisan.location}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Star className="w-4 h-4 fill-amber-500" /> {artisan.rating} (Verified Artisan)
                  </span>
                  <span className="flex items-center gap-1 text-charcoal/60">
                    <Calendar className="w-4 h-4" /> {artisan.yearsActive} Years Crafting
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleFollow}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  following
                    ? 'bg-sage/40 text-charcoal border border-sage hover:bg-sage/60'
                    : 'bg-forest text-cream hover:bg-deep-green shadow-md'
                }`}
              >
                <Heart className={`w-4 h-4 ${following ? 'fill-terracotta text-terracotta' : ''}`} />
                {following ? 'Following' : 'Follow'}
              </button>
              
              <button
                onClick={() => setWhatsappModalOpen(true)}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-full font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full border border-sage text-charcoal/70 hover:text-charcoal hover:bg-sage/20 transition-all"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Artisan Heritage & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-charcoal mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-terracotta" /> The Story Behind the Craft
                </h2>
                <p className="text-charcoal/80 leading-relaxed text-base italic bg-cream/50 p-5 rounded-2xl border border-terracotta/20">
                  "{artisan.story}"
                </p>
                <p className="text-charcoal/70 leading-relaxed mt-4">
                  {artisan.bio}
                </p>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-2">Mastery & Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {artisan.specialization.map((spec, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-sage/30 text-forest font-medium text-xs">
                      ✦ {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="bg-sage/20 rounded-2xl p-6 border border-sage/30 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-charcoal text-lg mb-4">Artisan Heritage Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-sage/30">
                    <span className="text-sm text-charcoal/70 flex items-center gap-2">
                      <Users className="w-4 h-4 text-forest" /> Followers
                    </span>
                    <span className="font-bold text-charcoal">{artisan.followers + (following ? 1 : 0)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-sage/30">
                    <span className="text-sm text-charcoal/70 flex items-center gap-2">
                      <Package className="w-4 h-4 text-forest" /> Active Listings
                    </span>
                    <span className="font-bold text-charcoal">{artisanProducts.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-sage/30">
                    <span className="text-sm text-charcoal/70 flex items-center gap-2">
                      <Award className="w-4 h-4 text-forest" /> Tradition
                    </span>
                    <span className="font-bold text-charcoal">Coastal Karnataka</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-sage/30">
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Every product from this artisan is handmade locally using organic threads, sustainable natural fibers, and timeless heritage techniques.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Artisan's Products Grid */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">Crafts by {artisan.name}</h2>
              <p className="text-charcoal/60 text-sm mt-1">Authentic handcrafted pieces available directly from this artisan</p>
            </div>
            <span className="text-sm text-charcoal/50 font-medium">
              {artisanProducts.length} items
            </span>
          </div>

          {artisanProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artisanProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-sage/30">
              <Package className="w-12 h-12 text-forest/40 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-charcoal">No Products Listed Yet</h3>
              <p className="text-sm text-charcoal/60 mt-1 max-w-md mx-auto">
                {artisan.name} is currently preparing new handcrafted items. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Modal */}
      {whatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sage relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-charcoal text-base">Direct WhatsApp Enquiry</h3>
                <p className="text-xs text-charcoal/60">Connect with {artisan.name}</p>
              </div>
            </div>

            <p className="text-xs text-charcoal/70 mb-4 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              In production, this opens a direct WhatsApp chat on the artisan's mobile device with your prefilled query in English or Kannada.
            </p>

            <form onSubmit={handleSendWhatsApp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal/80 mb-1">Your Message:</label>
                <textarea
                  rows={4}
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWhatsappModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-all shadow-md"
                >
                  Send via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
