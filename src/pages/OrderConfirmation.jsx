import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, LayoutDashboard, Package } from 'lucide-react';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

export default function OrderConfirmation() {
  const { state } = useLocation();
  const orderId = state?.orderId || `ORD-${Date.now()}`;
  const total = state?.total || 0;
  const buyer = state?.buyer || 'Dear Customer';

  return (
    <div className="page-container py-20 text-center max-w-2xl">
      <div className="bg-white rounded-3xl p-12 shadow-sm border border-sage/50 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">Order Placed! 🎉</h1>
        <p className="text-charcoal/60 mb-6">
          Thank you, <span className="font-semibold text-charcoal">{buyer}</span>! Your demo order has been confirmed.
        </p>

        <div className="bg-sage/40 rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Order ID</span>
            <span className="font-mono font-semibold text-charcoal">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Total Paid</span>
            <span className="font-bold text-charcoal">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Estimated Delivery</span>
            <span className="text-charcoal">5–7 business days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Status</span>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">Pending</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-700 text-left flex gap-3">
          <span className="text-2xl">🎓</span>
          <p>This is a <strong>hackathon demo</strong>. No real payment has been processed and no actual order will be fulfilled.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/marketplace" className="btn-secondary">
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
          <Link to="/artisan/orders" className="btn-primary">
            <Package className="w-4 h-4" /> View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
