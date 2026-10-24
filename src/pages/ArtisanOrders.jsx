import { useState } from 'react';
import { 
  Search, ClipboardList, CheckCircle2, Truck, Package, 
  Clock, XCircle, MessageCircle, Eye, Printer, Phone, MapPin, ChevronRight
} from 'lucide-react';
import DashboardSidebar from '../components/artisan/DashboardSidebar';
import { useApp } from '../context/AppContext';
import { StatusBadge, EmptyState } from '../components/common/UI';
import ConfirmDialog from '../components/common/ConfirmDialog';

const STATUS_OPTIONS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

export default function ArtisanOrders() {
  const { orders, updateOrderStatus, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmAction, setConfirmAction] = useState(null); // { orderId, newStatus }
  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [whatsappModalOrder, setWhatsappModalOrder] = useState(null);

  const myOrders = orders.filter(o => o.artisanId === 'a1');

  const filtered = myOrders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const getNextStatus = (status) => {
    const flow = { pending: 'processing', processing: 'shipped', shipped: 'delivered' };
    return flow[status] || null;
  };

  const handlePrintSlip = (order) => {
    showToast(`Generating packing slip for Order #${order.id.slice(0, 10)}...`);
    window.print();
  };

  const handleSendWhatsAppNotification = (e) => {
    e.preventDefault();
    showToast(`WhatsApp dispatch alert simulated to ${whatsappModalOrder.buyerName}!`);
    setWhatsappModalOrder(null);
  };

  return (
    <div className="artisan-layout bg-cream min-h-screen">
      <DashboardSidebar />
      
      <div className="artisan-content pb-24 md:pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl text-charcoal">Artisan Orders</h1>
            <p className="text-charcoal/60 text-sm mt-1">Manage buyer orders, prepare courier pickups, and send WhatsApp updates</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-sage/60 shadow-sm text-xs font-semibold text-charcoal">
            <Package className="w-4 h-4 text-forest" />
            <span>{myOrders.length} Total Orders</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="search"
              placeholder="Search by order ID, buyer, or craft name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-sm rounded-2xl border border-sage focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-sm"
              aria-label="Search orders"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-full transition-all capitalize whitespace-nowrap ${
                  statusFilter === s
                    ? 'bg-forest text-sand shadow-sm'
                    : 'bg-white border border-sage/60 text-charcoal/70 hover:border-forest'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards / Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders found"
            message={myOrders.length === 0 ? "You don't have any customer orders yet. They will appear here once buyers place orders." : "No orders match your search criteria."}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-sage/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left" aria-label="Artisan orders">
                <thead className="bg-sage/20 border-b border-sage/40 text-charcoal/70 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-5">Order ID</th>
                    <th className="py-4 px-5">Craft Item</th>
                    <th className="py-4 px-5">Customer</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Amount</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/30">
                  {filtered.map(order => {
                    const next = getNextStatus(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-sage/10 transition-colors">
                        <td className="py-4 px-5 font-mono text-xs font-bold text-forest">
                          #{order.id.slice(0, 10)}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.productImage}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover bg-sage/30 shrink-0 border border-sage/40"
                            />
                            <div>
                              <p className="font-semibold text-charcoal text-sm truncate max-w-[160px]">{order.productName}</p>
                              <p className="text-xs text-charcoal/50">Qty: {order.quantity}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-semibold text-charcoal text-sm">{order.buyerName}</p>
                          <p className="text-xs text-charcoal/50 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-terracotta" /> {order.buyerCity || 'Karnataka'}
                          </p>
                        </td>
                        <td className="py-4 px-5 text-xs text-charcoal/60 whitespace-nowrap">
                          {order.date}
                        </td>
                        <td className="py-4 px-5 font-bold text-charcoal text-sm">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-4 px-5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View details */}
                            <button
                              onClick={() => setActiveOrderModal(order)}
                              className="p-2 rounded-xl text-charcoal/70 hover:text-charcoal hover:bg-sage/30 transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* WhatsApp customer update */}
                            <button
                              onClick={() => setWhatsappModalOrder(order)}
                              className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Send WhatsApp Update to Buyer"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Advance status */}
                            {next && (
                              <button
                                onClick={() => setConfirmAction({ orderId: order.id, newStatus: next })}
                                className="px-3 py-1.5 bg-forest text-sand text-xs font-semibold rounded-full hover:bg-deep-green transition-all shadow-sm capitalize whitespace-nowrap"
                              >
                                Mark {next}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {activeOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sage relative">
              <div className="flex items-center justify-between pb-4 border-b border-sage/40">
                <div>
                  <span className="text-xs text-charcoal/50 font-mono">Order Details</span>
                  <h3 className="font-serif font-bold text-xl text-charcoal">#{activeOrderModal.id.slice(0, 12)}</h3>
                </div>
                <StatusBadge status={activeOrderModal.status} />
              </div>

              <div className="py-5 space-y-4">
                <div className="flex items-center gap-4 bg-cream/40 p-3 rounded-2xl border border-sage/30">
                  <img
                    src={activeOrderModal.productImage}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-charcoal text-sm">{activeOrderModal.productName}</h4>
                    <p className="text-xs text-charcoal/60 mt-0.5">Quantity: {activeOrderModal.quantity} item(s)</p>
                    <p className="text-sm font-bold text-terracotta mt-1">{formatPrice(activeOrderModal.total)}</p>
                  </div>
                </div>

                <div className="bg-sage/10 p-4 rounded-2xl border border-sage/30 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Buyer Name:</span>
                    <span className="font-bold text-charcoal">{activeOrderModal.buyerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Delivery Destination:</span>
                    <span className="font-semibold text-charcoal">{activeOrderModal.buyerCity || 'Bengaluru, Karnataka'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Order Date:</span>
                    <span className="font-semibold text-charcoal">{activeOrderModal.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Payout Settlement:</span>
                    <span className="font-semibold text-emerald-700">UPI Linked (Savitha Naik)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sage/40">
                <button
                  type="button"
                  onClick={() => handlePrintSlip(activeOrderModal)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-sage text-xs font-semibold text-charcoal hover:bg-sage/20"
                >
                  <Printer className="w-4 h-4" /> Print Packing Slip
                </button>

                <button
                  type="button"
                  onClick={() => setActiveOrderModal(null)}
                  className="px-5 py-2 rounded-full bg-forest text-sand text-xs font-semibold hover:bg-deep-green"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Customer Update Modal */}
        {whatsappModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sage">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-base">Send WhatsApp Customer Dispatch</h3>
                  <p className="text-xs text-charcoal/60">To: {whatsappModalOrder.buyerName}</p>
                </div>
              </div>

              <p className="text-xs text-charcoal/70 mb-4 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                Artisans in Karnataka communicate directly with buyers via WhatsApp for parcel tracking and delivery satisfaction.
              </p>

              <form onSubmit={handleSendWhatsAppNotification} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Message Preview:</label>
                  <textarea
                    rows={4}
                    defaultValue={`Namaskara ${whatsappModalOrder.buyerName}! Your order for "${whatsappModalOrder.productName}" has been packed with care and is being picked up by coastal logistics today. Thank you for supporting our traditional craft! 🙏`}
                    className="w-full text-xs p-3 rounded-xl border border-sage focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none bg-cream/30"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setWhatsappModalOrder(null)}
                    className="px-4 py-2 text-xs font-medium text-charcoal/70 hover:text-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md"
                  >
                    Simulate WhatsApp Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!confirmAction}
          onConfirm={() => {
            if (confirmAction) updateOrderStatus(confirmAction.orderId, confirmAction.newStatus);
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
          title={`Update Order Status?`}
          message={`Change order status to "${confirmAction?.newStatus}"?`}
          confirmLabel="Update Status"
          danger={confirmAction?.newStatus === 'cancelled'}
        />
      </div>
    </div>
  );
}
