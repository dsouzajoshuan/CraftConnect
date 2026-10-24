import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Edit2, Trash2, Package } from 'lucide-react';
import DashboardSidebar from '../components/artisan/DashboardSidebar';
import { useApp } from '../context/AppContext';
import { StatusBadge, EmptyState } from '../components/common/UI';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { categories } from '../data/categories';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

export default function MyProducts() {
  const { products, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const myProducts = products.filter(p => p.artisanId === 'a1');

  const filtered = myProducts.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q);
    const matchesCat = !filterCat || p.category === filterCat;
    const matchesStatus = !filterStatus || p.status === filterStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const toggleStatus = (product) => {
    updateProduct(product.id, { status: product.status === 'published' ? 'draft' : 'published' });
  };

  return (
    <div className="artisan-layout bg-cream min-h-screen">
      <DashboardSidebar />
      <div className="artisan-content">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-serif font-bold text-3xl text-charcoal">My Products</h1>
            <p className="text-charcoal/60 text-sm mt-1">{myProducts.length} products in your store</p>
          </div>
          <Link to="/artisan/add-product" className="btn-primary">
            <PlusCircle className="w-5 h-5" /> Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input type="search" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" aria-label="Search your products" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input w-auto" aria-label="Filter by category">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input w-auto" aria-label="Filter by status">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={myProducts.length === 0 ? 'No products yet' : 'No products match your filters'}
            message={myProducts.length === 0 ? 'Start by adding your first handmade product.' : 'Try changing your filters.'}
            action={<Link to="/artisan/add-product" className="btn-primary">Add Your First Product</Link>}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-sage/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="My products">
                <thead className="bg-sage/30">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/30">
                  {filtered.map(product => (
                    <tr key={product.id} className="hover:bg-sage/10 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-sage/30 flex-shrink-0" />
                          <span className="font-medium text-charcoal truncate max-w-[160px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-charcoal/70">{product.categoryLabel}</td>
                      <td className="px-4 py-3 font-semibold text-charcoal">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${product.stock <= 3 ? 'text-red-500' : 'text-charcoal'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(product)} className="group" aria-label={`Toggle status for ${product.name}`}>
                          <StatusBadge status={product.status} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(product)}
                            className="p-2 text-forest hover:bg-forest/10 rounded-lg transition-colors"
                            title={product.status === 'published' ? 'Set to Draft' : 'Publish'}
                            aria-label={product.status === 'published' ? 'Set to Draft' : 'Publish'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete product"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteId}
          onConfirm={() => { deleteProduct(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
          title="Delete Product?"
          message="This will permanently remove this product from your store. This action cannot be undone."
          confirmLabel="Delete"
          danger
        />
      </div>
    </div>
  );
}
