import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      ref.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size] || 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto animate-fade-in`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-sage sticky top-0 bg-white rounded-t-2xl">
            <h2 className="font-serif font-semibold text-lg text-charcoal">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-sage transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-charcoal/60" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
