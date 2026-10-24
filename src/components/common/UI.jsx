export function StatusBadge({ status }) {
  const map = {
    pending:    { label: 'Pending',    cls: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', cls: 'bg-blue-100 text-blue-800' },
    shipped:    { label: 'Shipped',    cls: 'bg-purple-100 text-purple-800' },
    delivered:  { label: 'Delivered',  cls: 'bg-green-100 text-green-800' },
    cancelled:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-800' },
    published:  { label: 'Published',  cls: 'bg-green-100 text-green-800' },
    draft:      { label: 'Draft',      cls: 'bg-gray-100 text-gray-600' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      <span className="sr-only">Status: </span>
      {label}
    </span>
  );
}

export function LoadingState({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-charcoal/50">
      <div className="w-10 h-10 border-4 border-sage border-t-forest rounded-full animate-spin mb-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && (
        <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-forest/60" />
        </div>
      )}
      <h3 className="font-serif font-semibold text-lg text-charcoal mb-2">{title}</h3>
      {message && <p className="text-sm text-charcoal/60 max-w-xs mb-6">{message}</p>}
      {action}
    </div>
  );
}
