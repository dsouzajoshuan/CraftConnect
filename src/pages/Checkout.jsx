import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag } from 'lucide-react';
import { EmptyState } from '../components/common/UI';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

const DELIVERY_FEE = 99;

const FIELDS = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Priya Sharma' },
  { id: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '+91 98765 43210' },
  { id: 'address', label: 'Delivery Address', type: 'text', placeholder: 'House no., Street, Area' },
  { id: 'city', label: 'City', type: 'text', placeholder: 'Bengaluru' },
  { id: 'pincode', label: 'Postal Code', type: 'text', placeholder: '560001' },
];

export default function Checkout() {
  const { cart, cartTotal, placeOrder } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', address: '', city: '', pincode: '' });
  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="page-container py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to checkout"
          message="Add products to your cart before checking out."
          action={<Link to="/marketplace" className="btn-primary">Browse Crafts</Link>}
        />
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.mobile.trim() || !/^[0-9+\s]{10,13}$/.test(form.mobile.replace(/\s/g, ''))) errs.mobile = 'Enter a valid mobile number';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit postal code';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const orderId = placeOrder(form);
    navigate('/order-confirmation', { state: { orderId, total: cartTotal + DELIVERY_FEE, buyer: form.name } });
  };

  const total = cartTotal + DELIVERY_FEE;

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5" noValidate>
          <div className="bg-white rounded-2xl p-6 border border-sage/50 shadow-sm">
            <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">Delivery Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map(({ id, label, type, placeholder }) => (
                <div key={id} className={id === 'address' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={id} className="label">{label} <span className="text-red-500">*</span></label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={form[id]}
                    onChange={e => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: '' })); }}
                    className={`input ${errors[id] ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                    aria-describedby={errors[id] ? `${id}-error` : undefined}
                    aria-invalid={!!errors[id]}
                  />
                  {errors[id] && <p id={`${id}-error`} className="text-xs text-red-500 mt-1" role="alert">{errors[id]}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sage/50 shadow-sm">
            <h2 className="font-serif font-semibold text-lg text-charcoal mb-3">Payment</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-semibold text-amber-800 text-sm">Demo Payment Mode</p>
                <p className="text-xs text-amber-700 mt-1">This is a hackathon prototype. No real payment will be collected. Click "Place Demo Order" to simulate a successful transaction.</p>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary justify-center text-base py-4">
            Place Demo Order →
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-sage/50 shadow-sm sticky top-20">
            <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-sage/30 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-charcoal/50">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold text-charcoal">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-sage pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-charcoal/70"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between text-charcoal/70"><span>Delivery</span><span>{formatPrice(DELIVERY_FEE)}</span></div>
              <div className="flex justify-between font-bold text-charcoal text-base border-t border-sage pt-2 mt-2">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
