import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Grid2X2, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';
import ProductCard from '../components/marketplace/ProductCard';
import { EmptyState } from '../components/common/UI';
import { ShoppingBag } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Marketplace() {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 10000);

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalMin(0);
    setLocalMax(10000);
  };

  const publishedProducts = products.filter(p => p.status === 'published');

  const filtered = useMemo(() => {
    let list = publishedProducts;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.artisanName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter(p => p.category === category);
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      default: return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [publishedProducts, query, category, minPrice, maxPrice, sort]);

  const hasFilters = query || category || minPrice > 0 || maxPrice < 10000;

  const applyPriceFilter = () => {
    const p = new URLSearchParams(searchParams);
    if (localMin > 0) p.set('minPrice', localMin); else p.delete('minPrice');
    if (localMax < 10000) p.set('maxPrice', localMax); else p.delete('maxPrice');
    setSearchParams(p);
  };

  return (
    <div className="page-container py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="section-title mb-2">Explore Handmade Crafts</h1>
        <p className="section-subtitle">Discover authentic creations from artisans of coastal Karnataka</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            type="search"
            placeholder="Search products, artisans…"
            value={query}
            onChange={e => updateParam('q', e.target.value)}
            className="input pl-9"
            aria-label="Search products"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-forest text-white border-forest' : 'bg-white border-sage text-charcoal hover:border-forest'}`}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <div className="relative">
          <select
            value={sort}
            onChange={e => updateParam('sort', e.target.value)}
            className="input pr-10 appearance-none cursor-pointer"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
            <X className="w-4 h-4" /> Clear Filters
          </button>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className="w-56 flex-shrink-0 space-y-6 animate-fade-in" aria-label="Product filters">
            {/* Category */}
            <div>
              <h3 className="font-semibold text-charcoal text-sm mb-3">Category</h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!category ? 'bg-forest text-white' : 'hover:bg-sage text-charcoal/70'}`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${category === cat.id ? 'bg-forest text-white' : 'hover:bg-sage text-charcoal/70'}`}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-semibold text-charcoal text-sm mb-3">Price Range (₹)</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={localMin}
                  onChange={e => setLocalMin(Number(e.target.value))}
                  className="input text-sm py-2"
                  min={0}
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={localMax}
                  onChange={e => setLocalMax(Number(e.target.value))}
                  className="input text-sm py-2"
                  max={10000}
                  aria-label="Maximum price"
                />
              </div>
              <button onClick={applyPriceFilter} className="w-full btn-primary py-2 text-sm justify-center">Apply</button>
            </div>
          </aside>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-charcoal/60">
              Showing <span className="font-semibold text-charcoal">{filtered.length}</span> products
              {query && <> for "<span className="text-forest">{query}</span>"</>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No crafts found"
              message="Try different keywords or clear your filters to explore all products."
              action={
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
