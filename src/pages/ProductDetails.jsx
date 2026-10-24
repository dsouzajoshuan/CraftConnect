import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, MapPin, Star, Minus, Plus, ArrowLeft, Package, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { artisans } from '../data/artisans';
import ProductCard from '../components/marketplace/ProductCard';
import { EmptyState } from '../components/common/UI';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isWishlisted } = useApp();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (!product) {
    return (
      <div className="page-container py-20">
        <EmptyState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          action={<Link to="/marketplace" className="btn-primary">Browse Marketplace</Link>}
        />
      </div>
    );
  }

  const artisan = artisans.find(a => a.id === product.artisanId);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => addToCart(product, qty);
  const handleBuyNow = () => { addToCart(product, qty); navigate('/cart'); };

  return (
    <div className="page-container py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-charcoal/50 mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-forest">Home</Link>
        <span>/</span>
        <Link to="/marketplace" className="hover:text-forest">Marketplace</Link>
        <span>/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-sage/20 border border-sage">
            <img
              src={imgError ? product.images?.[0] || product.image : (product.images?.[activeImg] || product.image)}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImg(i); setImgError(false); }}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-forest' : 'border-transparent hover:border-sage'}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">{product.categoryLabel}</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-2 mb-3">{product.name}</h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-charcoal">{product.rating}</span>
              <span className="text-sm text-charcoal/50">({product.reviewCount} reviews)</span>
            </div>
          )}

          <div className="text-3xl font-bold text-charcoal mb-6">{formatPrice(product.price)}</div>

          {/* Artisan */}
          {artisan && (
            <Link to={`/artisan/${artisan.id}`} className="flex items-center gap-3 mb-6 p-4 bg-sage/30 rounded-2xl hover:bg-sage/50 transition-colors">
              <img src={artisan.avatar} alt={artisan.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-forest" />
              <div>
                <p className="font-semibold text-charcoal text-sm">{artisan.name}</p>
                <p className="flex items-center gap-1 text-xs text-charcoal/60">
                  <MapPin className="w-3 h-3" /> {artisan.location}
                </p>
              </div>
              <span className="ml-auto text-xs font-semibold text-forest">View Profile →</span>
            </Link>
          )}

          <p className="text-charcoal/70 text-sm leading-relaxed mb-6">{product.description}</p>

          {product.materials && (
            <div className="mb-6">
              <span className="label">Materials</span>
              <p className="text-sm text-charcoal/70 bg-sage/30 rounded-xl px-4 py-3">{product.materials}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="label mb-0">Quantity</span>
            <div className="flex items-center border border-sage rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-sage transition-colors" aria-label="Decrease quantity">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-semibold min-w-[48px] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 hover:bg-sage transition-colors" aria-label="Increase quantity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-charcoal/50">{product.stock} in stock</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={handleAddToCart} className="flex-1 btn-primary justify-center min-w-[140px]">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 btn-terracotta justify-center min-w-[140px]">
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-full border-2 transition-all ${wishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-sage text-charcoal/60 hover:border-red-300 hover:text-red-500'}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, label: 'Handcrafted & Unique' },
              { icon: Shield, label: 'Secure Demo Checkout' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-charcoal/60 bg-white rounded-xl px-3 py-2 border border-sage/50">
                <Icon className="w-4 h-4 text-forest flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Artisan Story */}
      {artisan && (
        <section className="bg-white rounded-3xl p-8 mb-16 border border-sage/50" aria-labelledby="artisan-story-heading">
          <h2 id="artisan-story-heading" className="font-serif text-2xl font-bold text-charcoal mb-4">About {artisan.name}</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img src={artisan.avatar} alt={artisan.name} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
            <div>
              <p className="text-charcoal/70 text-sm leading-relaxed mb-3">{artisan.bio}</p>
              <blockquote className="border-l-4 border-terracotta pl-4 italic text-charcoal/60 text-sm">"{artisan.story}"</blockquote>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-serif text-2xl font-bold text-charcoal mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
