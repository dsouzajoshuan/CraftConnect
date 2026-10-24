import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [imgError, setImgError] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-sage/50 flex flex-col">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-sage/30">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop' : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.isHandmade && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-forest px-2 py-0.5 rounded-full">
            Handmade
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 right-10 bg-terracotta/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-charcoal/50 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-terracotta font-medium mb-1">{product.categoryLabel}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif font-semibold text-charcoal text-base leading-snug mb-1 hover:text-forest transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <Link to={`/artisan/${product.artisanId}`} className="flex items-center gap-1 text-xs text-charcoal/60 hover:text-forest transition-colors mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{product.artisanName} · {product.artisanLocation}</span>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
            <span className="text-xs font-semibold text-charcoal">{product.rating}</span>
            <span className="text-xs text-charcoal/50">({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-charcoal">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 bg-forest text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-deep-green active:scale-95 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
