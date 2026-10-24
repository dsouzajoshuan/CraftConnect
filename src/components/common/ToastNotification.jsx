import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-forest" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-terracotta" />,
};

const colours = {
  success: 'border-l-forest bg-white',
  error: 'border-l-red-500 bg-white',
  info: 'border-l-terracotta bg-white',
};

export default function ToastNotification() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border-l-4 min-w-[260px] max-w-sm animate-slide-up ${colours[toast.type] || colours.success}`}
    >
      {icons[toast.type] || icons.success}
      <span className="text-sm font-medium text-charcoal flex-1">{toast.message}</span>
    </div>
  );
}
