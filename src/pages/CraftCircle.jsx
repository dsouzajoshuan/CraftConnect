import { useState } from 'react';
import { 
  Users, Video, BookOpen, Calendar, MessageSquare, ThumbsUp, 
  Plus, Play, Clock, Eye, Globe, Sparkles, Filter, X, Send, CheckCircle2
} from 'lucide-react';
import { resources, discussions } from '../data/resources';
import { useApp } from '../context/AppContext';

export default function CraftCircle() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [discussionList, setDiscussionList] = useState(discussions);
  const [likedPosts, setLikedPosts] = useState({});
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('craft');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [workshopRegistered, setWorkshopRegistered] = useState(false);

  // Filter resources
  const filteredResources = resources.filter(res => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'videos' && res.type === 'video') ||
      (activeTab === 'guides' && res.type === 'guide') ||
      (activeTab === 'workshops' && res.type === 'live');
    const matchesLang = selectedLanguage === 'all' || res.language.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesTab && matchesLang;
  });

  const handleLike = (id) => {
    setLikedPosts(prev => {
      const isLiked = prev[id];
      const updated = { ...prev, [id]: !isLiked };
      setDiscussionList(cur => cur.map(d => {
        if (d.id === id) {
          return { ...d, likes: d.likes + (isLiked ? -1 : 1) };
        }
        return d;
      }));
      return updated;
    });
  };

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    const newEntry = {
      id: `d-${Date.now()}`,
      author: 'Savitha Naik (You)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
      time: 'Just now',
      question: newQuestion.trim(),
      replies: 0,
      likes: 0,
      category: newCategory,
    };

    setDiscussionList([newEntry, ...discussionList]);
    setNewQuestion('');
    setAskModalOpen(false);
    showToast('Your question was posted to the Craft Circle!');
  };

  const handleRegisterWorkshop = () => {
    setWorkshopRegistered(true);
    showToast('Registered! A WhatsApp reminder has been scheduled.');
  };

  return (
    <div className="min-h-screen bg-cream/30 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-forest text-cream p-8 sm:p-12 mb-12 shadow-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-deep-green/60 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/10 text-sand text-xs font-semibold mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-sand" /> Artisan Community Hub
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Craft Circle
            </h1>
            <p className="text-sand/90 text-base sm:text-lg leading-relaxed mb-6">
              A peer-learning space for coastal Karnataka artisans. Watch masterclasses, share photography tips, discuss fair pricing, and preserve traditional craftsmanship together.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setAskModalOpen(true)}
                className="btn-terracotta text-sm py-2.5 px-6 flex items-center gap-2 shadow-lg hover:shadow-terracotta/30"
              >
                <Plus className="w-4 h-4" /> Ask a Question
              </button>
              <a
                href="#discussions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream/10 hover:bg-cream/20 text-cream text-sm font-semibold transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Browse Discussions
              </a>
            </div>
          </div>
        </div>

        {/* Live Workshop Banner */}
        <div className="bg-gradient-to-r from-terracotta/10 via-amber-50 to-sage/20 border border-terracotta/30 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-terracotta text-white flex items-center justify-center shrink-0 shadow-md">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-terracotta text-white uppercase tracking-wider animate-pulse">
                  Live Workshop
                </span>
                <span className="text-xs text-charcoal/60 font-medium">Coming this Friday, 3:00 PM</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-1">
                Live Kasuti Embroidery Masterclass with Savitha Naik
              </h2>
              <p className="text-sm text-charcoal/70 mt-1">
                Interactive pattern drafting and needlework session in Kannada with live Q&A. 18 spots remaining.
              </p>
            </div>
          </div>
          <button
            onClick={handleRegisterWorkshop}
            disabled={workshopRegistered}
            className={`whitespace-nowrap px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md shrink-0 flex items-center gap-2 ${
              workshopRegistered
                ? 'bg-forest text-cream cursor-default'
                : 'bg-terracotta hover:bg-terracotta/90 text-white'
            }`}
          >
            {workshopRegistered ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Registered
              </>
            ) : (
              'Reserve Free Spot'
            )}
          </button>
        </div>

        {/* Resources & Masterclasses Section */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">Learning Resources & Guides</h2>
              <p className="text-sm text-charcoal/60 mt-1">Practical tutorials crafted specifically for rural artisans</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center bg-white p-1 rounded-full border border-sage shadow-sm">
                {[
                  { id: 'all', label: 'All', icon: Sparkles },
                  { id: 'videos', label: 'Videos', icon: Video },
                  { id: 'guides', label: 'Guides', icon: BookOpen },
                  { id: 'workshops', label: 'Live', icon: Calendar },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeTab === t.id
                          ? 'bg-forest text-cream shadow-sm'
                          : 'text-charcoal/70 hover:text-charcoal'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sage text-xs font-medium text-charcoal/70 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-forest" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent focus:outline-none text-charcoal font-semibold cursor-pointer"
                >
                  <option value="all">All Languages</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(res => (
              <div
                key={res.id}
                className="bg-white rounded-3xl overflow-hidden border border-sage/50 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-video overflow-hidden bg-charcoal/5">
                  <img
                    src={res.thumbnail}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors" />
                  
                  {res.type === 'video' && (
                    <button
                      onClick={() => setActiveVideoModal(res)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-forest/90 text-cream flex items-center justify-center hover:bg-forest hover:scale-110 transition-all shadow-lg"
                      aria-label={`Play ${res.title}`}
                    >
                      <Play className="w-5 h-5 fill-cream ml-0.5" />
                    </button>
                  )}

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-charcoal/80 text-white backdrop-blur-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {res.duration}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-forest/90 text-white backdrop-blur-sm">
                      {res.language}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-terracotta">
                      {res.category}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-charcoal mt-1 group-hover:text-forest transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-sm text-charcoal/70 mt-2 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-sage/30 flex items-center justify-between text-xs text-charcoal/60">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {res.views > 0 ? `${res.views} views` : 'Upcoming'}
                    </span>
                    {res.type === 'video' ? (
                      <button
                        onClick={() => setActiveVideoModal(res)}
                        className="font-semibold text-forest hover:underline"
                      >
                        Watch Video →
                      </button>
                    ) : (
                      <span className="font-semibold text-forest">Read Article →</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artisan Discussion Forum */}
        <div id="discussions" className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">Artisan Q&A & Discussions</h2>
              <p className="text-sm text-charcoal/60 mt-1">Ask questions, share advice, and connect with fellow creators</p>
            </div>
            <button
              onClick={() => setAskModalOpen(true)}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Start a Discussion
            </button>
          </div>

          <div className="space-y-4">
            {discussionList.map(item => {
              const liked = likedPosts[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-sage/40 shadow-sm hover:border-forest/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-sage shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-charcoal text-sm">{item.author}</span>
                          <span className="text-xs text-charcoal/40">• {item.time}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage/30 text-forest capitalize">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-base font-medium text-charcoal/90 mt-2 leading-relaxed">
                        {item.question}
                      </p>

                      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-sage/20 text-xs text-charcoal/60">
                        <button
                          onClick={() => handleLike(item.id)}
                          className={`flex items-center gap-1.5 transition-colors font-semibold ${
                            liked ? 'text-terracotta' : 'hover:text-charcoal'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-terracotta' : ''}`} />
                          <span>{item.likes} {item.likes === 1 ? 'Helpful' : 'Helpful'}</span>
                        </button>

                        <span className="flex items-center gap-1.5 font-semibold text-charcoal/70">
                          <MessageSquare className="w-4 h-4 text-forest" />
                          <span>{item.replies} Replies</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ask Question Modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sage relative">
            <button
              onClick={() => setAskModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-sage/20 text-charcoal/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-charcoal mb-1">Ask the Artisan Community</h3>
            <p className="text-xs text-charcoal/60 mb-5">
              Need advice on materials, pricing, smartphone photos, or packaging? Ask here!
            </p>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal/80 mb-1">Topic Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20 bg-white"
                >
                  <option value="craft">Traditional Craft Techniques</option>
                  <option value="photography">Product Photography</option>
                  <option value="pricing">Fair Pricing & Margins</option>
                  <option value="shipping">Packaging & Shipping</option>
                  <option value="orders">Customer Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal/80 mb-1">Your Question or Thought</label>
                <textarea
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. How do you store natural dye powders during the coastal monsoon season?"
                  className="w-full text-sm p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAskModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-sm py-2 px-6 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-sage">
            <div className="flex items-center justify-between p-4 border-b border-sage/30 bg-sage/10">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-forest" />
                <h3 className="font-serif font-bold text-charcoal text-base">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-full hover:bg-sage/30 text-charcoal/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-charcoal relative">
              <iframe
                src={activeVideoModal.videoUrl}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-5">
              <p className="text-sm text-charcoal/80 leading-relaxed">
                {activeVideoModal.description}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-charcoal/50">
                <span>Language: <strong>{activeVideoModal.language}</strong></span>
                <span>Duration: <strong>{activeVideoModal.duration}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
