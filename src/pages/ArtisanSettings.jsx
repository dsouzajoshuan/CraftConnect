import { useState } from 'react';
import { 
  Settings, User, Landmark, Globe, Bell, 
  Save, RotateCcw, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import DashboardSidebar from '../components/artisan/DashboardSidebar';
import { useApp } from '../context/AppContext';

export default function ArtisanSettings() {
  const { showToast, resetDemoData } = useApp();

  const [profile, setProfile] = useState({
    name: 'Savitha Naik',
    craft: 'Kasuti Embroidery & Textile Arts',
    location: 'Udupi, Karnataka',
    phone: '+91 94812 34567',
    bio: 'Practicing Kasuti embroidery for over 20 years, learned from my grandmother. Specialising in traditional temple and geometric motifs that tell stories of coastal Karnataka.',
    upiId: 'savitha.naik@oksbi',
    bankName: 'Canara Bank - Udupi Main Branch',
    accNumber: '••••••••4829',
    language: 'kn-IN',
    whatsappAlerts: true,
    smsAlerts: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Artisan profile and settlement details saved!');
  };

  return (
    <div className="artisan-layout bg-cream min-h-screen">
      <DashboardSidebar />

      <div className="artisan-content max-w-4xl pb-24 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl text-charcoal">Artisan Studio Settings</h1>
          <p className="text-charcoal/60 text-sm mt-1">Manage your public artisan profile, direct bank UPI payouts, and communication preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Public Profile */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage/60 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-sage/40 mb-6">
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-charcoal">Artisan Profile & Bio</h2>
                <p className="text-xs text-charcoal/50">Displayed to buyers on your craft listings and profile page</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Artisan Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Craft Specialization</label>
                <input
                  type="text"
                  value={profile.craft}
                  onChange={e => setProfile({ ...profile, craft: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Village & Region</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">WhatsApp Mobile Contact</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal mb-1">Artisan Heritage Story & Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  className="input resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payout & UPI Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage/60 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-sage/40 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-charcoal">Direct UPI Payout Account</h2>
                <p className="text-xs text-charcoal/50">Where earnings are transferred within 48h of customer delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">UPI ID (Google Pay / PhonePe / Paytm)</label>
                <input
                  type="text"
                  value={profile.upiId}
                  onChange={e => setProfile({ ...profile, upiId: e.target.value })}
                  className="input font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Linked Bank Branch</label>
                <input
                  type="text"
                  value={profile.bankName}
                  onChange={e => setProfile({ ...profile, bankName: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Language & Notifications */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage/60 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-sage/40 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-charcoal">Voice Recognition & Alerts</h2>
                <p className="text-xs text-charcoal/50">Personalize speech-to-text accuracy and order SMS updates</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-2">Default Voice Language</label>
                <select
                  value={profile.language}
                  onChange={e => setProfile({ ...profile, language: e.target.value })}
                  className="input max-w-xs"
                >
                  <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
                  <option value="en-IN">English</option>
                  <option value="hi-IN">Hindi (हिंदी)</option>
                </select>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.whatsappAlerts}
                    onChange={e => setProfile({ ...profile, whatsappAlerts: e.target.checked })}
                    className="w-4 h-4 text-forest rounded focus:ring-forest"
                  />
                  <span className="text-xs font-medium text-charcoal">Receive instant buyer order updates via WhatsApp</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.smsAlerts}
                    onChange={e => setProfile({ ...profile, smsAlerts: e.target.checked })}
                    className="w-4 h-4 text-forest rounded focus:ring-forest"
                  />
                  <span className="text-xs font-medium text-charcoal">Receive daily morning SMS briefing with pickup schedule</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions & Demo Reset */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={resetDemoData}
              className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-700 p-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Hackathon Demo Data
            </button>

            <button
              type="submit"
              className="btn-primary text-sm py-3 px-8 shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-sand" /> Save Studio Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
