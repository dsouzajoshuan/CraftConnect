import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, TrendingUp, Package, ShoppingCart, IndianRupee, 
  AlertCircle, Mic, Sparkles, ArrowRight, CheckCircle2, 
  Clock, ShieldCheck, RefreshCw, Volume2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/UI';
import DashboardSidebar from '../components/artisan/DashboardSidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Oct', sales: 1200 },
  { month: 'Nov', sales: 2100 },
  { month: 'Dec', sales: 3400 },
  { month: 'Jan', sales: 1800 },
  { month: 'Feb', sales: 2900 },
  { month: 'Mar', sales: 4500 },
];

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

export default function ArtisanDashboard() {
  const { products, orders, updateProduct, showToast } = useApp();
  const [playingGreeting, setPlayingGreeting] = useState(false);

  const myProducts = products.filter(p => p.artisanId === 'a1');
  const myOrders = orders.filter(o => o.artisanId === 'a1');
  const earnings = myOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0) + 4800;
  const pendingOrders = myOrders.filter(o => o.status === 'pending').length;
  const lowStockItems = myProducts.filter(p => p.stock <= 3);

  const stats = [
    { label: 'Active Crafts', value: myProducts.length || 14, icon: Package, color: 'bg-forest/10 text-forest' },
    { label: 'Total Orders', value: myOrders.length || 7, icon: ShoppingCart, color: 'bg-terracotta/10 text-terracotta' },
    { label: 'Next UPI Payout', value: '₹3,450', icon: IndianRupee, color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Pending Shipments', value: pendingOrders, icon: Clock, color: 'bg-amber-100 text-amber-800' },
  ];

  const bestSellers = myProducts.slice(0, 3);
  const recentOrders = [...myOrders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const handleRestock = (product) => {
    updateProduct(product.id, { stock: (product.stock || 0) + 5 });
    showToast(`Added 5 units of stock to ${product.name}!`);
  };

  const handlePlayVoiceSummary = () => {
    if ('speechSynthesis' in window) {
      if (playingGreeting) {
        window.speechSynthesis.cancel();
        setPlayingGreeting(false);
        return;
      }
      const text = `Namaskara Savitha! You have ${pendingOrders} pending customer orders today and 3 active listings. Next payout of 3,450 rupees is scheduled for Friday.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setPlayingGreeting(false);
      utterance.onerror = () => setPlayingGreeting(false);
      setPlayingGreeting(true);
      window.speechSynthesis.speak(utterance);
      showToast('Playing spoken daily audio briefing');
    }
  };

  return (
    <div className="artisan-layout bg-cream min-h-screen">
      <DashboardSidebar />
      
      <div className="artisan-content pb-24 md:pb-12 max-w-7xl">
        {/* Welcome Banner */}
        <div className="bg-forest text-cream rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cream/10 text-sand text-xs font-semibold backdrop-blur-sm">
                Savitha Naik • Kasuti Artisan Studio
              </span>
              <button
                onClick={handlePlayVoiceSummary}
                className={`p-1.5 rounded-full transition-colors ${
                  playingGreeting ? 'bg-amber-400 text-charcoal' : 'bg-cream/10 text-sand hover:bg-cream/20'
                }`}
                title="Play Spoken Daily Summary"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Namaskara, Savitha! 🙏
            </h1>
            <p className="text-sand/80 text-sm sm:text-base mt-2">
              You have <strong className="text-white">{pendingOrders} orders to pack</strong> today. Your next earnings payout will reach your linked Canara Bank UPI account on Friday.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
            <Link
              to="/artisan/add-product"
              className="flex-1 sm:flex-none btn-terracotta text-sm py-3 px-6 shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Mic className="w-4 h-4 text-sand" /> Speak & Sell
            </Link>
            <Link
              to="/artisan/orders"
              className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-cream/10 hover:bg-cream/20 text-cream text-sm font-semibold transition-all border border-cream/20 text-center whitespace-nowrap"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-3xl p-5 border border-sage/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-charcoal/60">{label}</span>
                <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">{value}</p>
            </div>
          ))}
        </div>

        {/* Sales Chart + Best Sellers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recharts Sales Overview */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-sage/60 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif font-bold text-lg text-charcoal">Monthly Craft Sales (₹)</h2>
                <p className="text-xs text-charcoal/50 mt-0.5">Verified sales revenue from authentic orders</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +28% this month
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7EEE5" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#262626' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#262626' }} tickFormatter={v => `₹${v}`} axisLine={false} />
                  <Tooltip
                    formatter={v => [`₹${v}`, 'Revenue']}
                    contentStyle={{ borderRadius: 16, border: '1px solid #D4DDD4', backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="sales" fill="#1C3F3A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="bg-white rounded-3xl p-6 border border-sage/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif font-bold text-lg text-charcoal">Best Sellers</h2>
                <Link to="/artisan/products" className="text-xs font-semibold text-forest hover:underline">
                  All ({myProducts.length})
                </Link>
              </div>

              <div className="space-y-4">
                {bestSellers.map(product => (
                  <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-sage/20 transition-colors">
                    <img
                      src={product.image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover bg-sage/30 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-charcoal text-xs truncate">{product.name}</p>
                      <p className="text-[11px] text-charcoal/50 mt-0.5">{product.categoryLabel}</p>
                      <p className="text-xs font-bold text-forest mt-0.5">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-sage/40">
              <Link
                to="/artisan/add-product"
                className="w-full btn-primary text-xs py-2.5 justify-center"
              >
                <PlusCircle className="w-4 h-4" /> Add Another Craft
              </Link>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-3xl p-6 border border-sage/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h2 className="font-serif font-bold text-lg text-charcoal">Inventory Restock Reminders</h2>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {lowStockItems.length} items low
              </span>
            </div>

            <div className="space-y-3">
              {lowStockItems.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-charcoal text-xs truncate max-w-[150px]">{p.name}</p>
                      <p className="text-[10px] text-amber-800 font-semibold">Only {p.stock} units remaining</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestock(p)}
                    className="px-3 py-1 bg-white hover:bg-forest hover:text-white text-forest text-xs font-bold rounded-xl border border-forest/30 shadow-sm transition-all"
                  >
                    + Add 5
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white rounded-3xl p-6 border border-sage/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg text-charcoal">Recent Customer Orders</h2>
              <Link to="/artisan/orders" className="text-xs font-semibold text-forest hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-2xl border border-sage/30 hover:bg-sage/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={o.productImage} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-charcoal text-xs truncate max-w-[150px]">{o.productName}</p>
                      <p className="text-[10px] text-charcoal/50">Buyer: {o.buyerName} • {o.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-charcoal">{formatPrice(o.total)}</p>
                    <div className="mt-0.5">
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
