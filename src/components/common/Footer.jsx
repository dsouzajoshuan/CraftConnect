import { Link } from 'react-router-dom';
import { Leaf, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-cream" />
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Craft<span className="text-terracotta">Connect</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Empowering traditional artisans from coastal Karnataka with a voice-first digital marketplace.
            </p>
            <div className="flex gap-4 mt-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-forest transition-colors" aria-label="Social media">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/marketplace', label: 'Explore Crafts' },
                { to: '/marketplace?category=kasuti', label: 'Kasuti Embroidery' },
                { to: '/marketplace?category=beedu', label: 'Beedu Crafts' },
                { to: '/marketplace?category=jewelry', label: 'Jewelry' },
                { to: '/cart', label: 'My Cart' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-terracotta transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Artisan */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Artisans</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/artisan/dashboard', label: 'My Dashboard' },
                { to: '/artisan/add-product', label: 'Speak & Sell' },
                { to: '/artisan/products', label: 'My Products' },
                { to: '/artisan/orders', label: 'My Orders' },
                { to: '/craft-circle', label: 'Craft Circle' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-terracotta transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-sm mb-5">
              {[
                { to: '/help', label: 'Help Centre' },
                { to: '/help#faq', label: 'FAQs' },
                { to: '/#how-it-works', label: 'How It Works' },
                { to: '/help#privacy', label: 'Privacy Policy' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-terracotta transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm">
              <a href="mailto:hello@craftconnect.in" className="flex items-center gap-2 hover:text-terracotta transition-colors">
                <Mail className="w-4 h-4" /> hello@craftconnect.in
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-terracotta transition-colors">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2024 CraftConnect. Crafted with ❤️ for artisans of Karnataka.</p>
          <p className="bg-forest/20 text-forest/80 px-3 py-1 rounded-full">
            🎓 Hackathon Prototype — Demo Data Only
          </p>
        </div>
      </div>
    </footer>
  );
}
