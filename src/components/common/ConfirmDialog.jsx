import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Confirm', danger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-sage'}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? 'text-red-600' : 'text-forest'}`} />
        </div>
        <h3 className="font-serif font-bold text-lg text-charcoal text-center mb-2">{title}</h3>
        <p className="text-sm text-charcoal/70 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-full border border-sage text-charcoal/70 text-sm font-medium hover:bg-sage transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-forest hover:bg-deep-green'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
