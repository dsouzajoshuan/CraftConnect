import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, ClipboardList,
  Users, HelpCircle, Settings, Leaf, ChevronLeft, ChevronRight, LogOut,
  Mic, Bell, Store
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const links = [
  { to: '/artisan/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/artisan/products', icon: Package, label: 'My Products' },
  { to: '/artisan/add-product', icon: PlusCircle, label: 'Speak & Sell', highlight: true },
  { to: '/artisan/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/artisan/settings', icon: Settings, label: 'Store Settings' },
  { to: '/craft-circle', icon: Users, label: 'Craft Circle' },
  { to: '/help', icon: HelpCircle, label: 'Help & Voice Guide' },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useApp();

  const pendingCount = orders.filter(o => o.artisanId === 'a1' && o.status === 'pending').length;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-deep-green text-white transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } min-h-screen sticky top-0 z-40 border-r border-white/5 shadow-2xl`}
        aria-label="Artisan dashboard navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <Leaf className="w-5 h-5 text-sand" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-serif font-bold text-white text-lg tracking-tight">
                  Craft<span className="text-sand">Connect</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-sand/70 font-sans">
                  Artisan Studio
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Artisan profile badge */}
        {!collapsed ? (
          <div className="p-4 mx-3 my-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=80&h=80&fit=crop&crop=face"
                alt="Savitha Naik"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-sand/40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-deep-green" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">Savitha Naik</p>
              <p className="text-xs text-sand/70 truncate">Udupi, Karnataka</p>
            </div>
          </div>
        ) : (
          <div className="py-3 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=80&h=80&fit=crop&crop=face"
              alt="Savitha Naik"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-sand/40"
            />
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 py-3 px-3 space-y-1.5" aria-label="Dashboard navigation">
          {links.map(({ to, icon: Icon, label, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/artisan/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-forest text-sand shadow-sm font-semibold'
                    : highlight
                    ? 'bg-terracotta/20 text-white hover:bg-terracotta/30 border border-terracotta/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${highlight ? 'text-sand' : ''}`} />
              {!collapsed && (
                <span className="flex-1 truncate">{label}</span>
              )}
              {to === '/artisan/orders' && pendingCount > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold bg-terracotta text-white ${collapsed ? 'absolute top-1 right-1' : ''}`}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-sand/80 hover:bg-white/10 hover:text-white transition-all"
            title={collapsed ? 'Buyer Store' : undefined}
          >
            <Store className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>View Marketplace Store</span>}
          </button>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-white/50 hover:bg-white/5 hover:text-white transition-all"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Mobile Top App Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-deep-green text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-sand" />
          </div>
          <div>
            <span className="font-serif font-bold text-base text-white">CraftConnect</span>
            <span className="block text-[10px] text-sand/70">Artisan Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/artisan/orders')}
            className="relative p-2 text-white/80 hover:text-white"
            aria-label="Orders notifications"
          >
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-terracotta" />
            )}
          </button>
          <img
            src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=80&h=80&fit=crop&crop=face"
            alt="Savitha Naik"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-sand/40"
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sage/40 shadow-lg px-2 py-2 flex items-center justify-around">
        <NavLink
          to="/artisan/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-forest font-bold' : 'text-charcoal/60 hover:text-charcoal'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/artisan/products"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-forest font-bold' : 'text-charcoal/60 hover:text-charcoal'
            }`
          }
        >
          <Package className="w-5 h-5" />
          <span>Products</span>
        </NavLink>

        {/* Prominent Speak & Sell Button in Center */}
        <NavLink
          to="/artisan/add-product"
          className="-mt-5 w-13 h-13 rounded-full bg-forest text-cream p-3 shadow-xl ring-4 ring-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Speak and Sell"
        >
          <Mic className="w-6 h-6 text-sand" />
        </NavLink>

        <NavLink
          to="/artisan/orders"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-forest font-bold' : 'text-charcoal/60 hover:text-charcoal'
            }`
          }
        >
          <ClipboardList className="w-5 h-5" />
          <span>Orders</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-terracotta text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/artisan/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-forest font-bold' : 'text-charcoal/60 hover:text-charcoal'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </>
  );
}
