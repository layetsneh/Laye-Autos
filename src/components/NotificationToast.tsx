import React, { useEffect } from 'react';
import { BellRing, CheckCircle, X } from 'lucide-react';

interface NotificationToastProps {
  toast: { title: string; message: string } | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in">
      <div className="rounded-xl border border-amber-500/30 bg-neutral-900/95 backdrop-blur-md p-4 shadow-2xl shadow-black/80 flex items-start gap-3 text-left">
        <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
          <BellRing className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-xs font-bold text-white">{toast.title}</div>
          <div className="text-[11px] text-neutral-300 leading-snug font-sans">{toast.message}</div>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
