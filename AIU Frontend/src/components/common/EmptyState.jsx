import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ title = "No items found", description = "Try adjusting your search query or filters.", actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
