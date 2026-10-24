import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/UI';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

const DELIVERY_FEE = 99;

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, cartTotal } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="page-container py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Explore our handmade crafts and add something beautiful to your cart."
          action={<Link to="/marketplace" className="btn-primary">Browse Crafts</Link>}
        />
      </div>
    );
  }

  const total = cartTotal + DELIVERY_FEE;

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8">Your Cart <span className="text-charcoal/40 text-2xl font-sans font-normal">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <article key={item.id} className="bg-white rounded-2xl p-5 flex gap-5 border border-sage/50 shadow-sm">
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover bg-sage/30" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-serif font-semibold text-charcoal hover:text-forest transition-colors line-clamp-2">{item.name}</Link>
                <p className="text-xs text-charcoal/50 mt-1">{item.artisanName}</p>
                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <div className="flex items-center border border-sage rounded-xl overflow-hidden">
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} disabled={item.qty <= 1} className="px-3 py-2 hover:bg-sage transition-colors disabled:opacity-40" aria-label="Decrease quantity">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-2 text-sm font-semibold min-w-[36px] text-center">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="px-3 py-2 hover:bg-sage transition-colors" aria-label="Increase quantity">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-lg text-charcoal">{formatPrice(item.price * item.qty)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors" aria-label={`Remove ${item.name} from cart`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          <Link to="/marketplace" className="flex items-center gap-2 text-sm text-forest font-semibold hover:underline mt-4">
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-sage/50 shadow-sm sticky top-20">
            <h2 className="font-serif font-bold text-xl text-charcoal mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-charcoal/70">
                <span>Subtotal ({cart.length} items)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Delivery fee</span>
                <span>{formatPrice(DELIVERY_FEE)}</span>
              </div>
              <div className="border-t border-sage pt-3 flex justify-between font-bold text-charcoal text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary justify-center text-base">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-center text-charcoal/40 mt-3">
              🔒 This is a demo. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
