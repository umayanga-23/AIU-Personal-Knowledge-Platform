import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-teal-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100',
    error: 'border-rose-500/30 bg-rose-950/90 text-rose-100',
    info: 'border-teal-500/30 bg-slate-900/90 text-slate-100'
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in ${borders[type] || borders.info}`}>
      {icons[type] || icons.info}
      <p className="text-sm font-medium pr-2">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
