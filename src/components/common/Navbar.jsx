import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, Leaf, Search, LayoutDashboard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { cartCount } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/marketplace', label: 'Explore Crafts' },
    { to: '/craft-circle', label: 'Craft Circle' },
    { to: '/help', label: 'Help' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="CraftConnect Home">
            <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center group-hover:bg-deep-green transition-colors">
              <Leaf className="w-5 h-5 text-cream" />
            </div>
            <span className="font-serif font-bold text-xl text-charcoal">
              Craft<span className="text-forest">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-forest ${
                    isActive ? 'text-forest' : 'text-charcoal/70'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Search + Actions */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
              <input
                type="search"
                placeholder="Search crafts…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-sage rounded-full border border-transparent focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 w-48 transition-all"
                aria-label="Search crafts"
              />
            </form>
            <Link
              to="/artisan/dashboard"
              className="p-2 text-charcoal/70 hover:text-forest transition-colors"
              aria-label="Artisan dashboard"
              title="Artisan Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative p-2 text-charcoal/70 hover:text-forest transition-colors" aria-label={`Cart with ${cartCount} items`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/artisan/dashboard"
              className="text-sm font-semibold bg-forest text-white px-4 py-2 rounded-full hover:bg-deep-green transition-colors"
            >
              Start Selling
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/cart" className="relative p-2 text-charcoal/70" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-charcoal"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-sage animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
              <input
                type="search"
                placeholder="Search crafts…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-sage rounded-full border border-transparent focus:border-forest focus:outline-none"
                aria-label="Search crafts"
              />
            </form>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-sage text-forest' : 'text-charcoal hover:bg-sage/50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/artisan/dashboard"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-sage/50"
            >
              Artisan Dashboard
            </Link>
            <Link
              to="/artisan/dashboard"
              onClick={() => setOpen(false)}
              className="block mt-2 text-center text-sm font-semibold bg-forest text-white px-4 py-2 rounded-full hover:bg-deep-green transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
