import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorState({ title = "Unable to load content", message = "An error occurred while connecting to the platform services. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-950/20 border border-rose-500/20 rounded-2xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-rose-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
