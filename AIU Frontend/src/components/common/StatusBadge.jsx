import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || 'DRAFT').toUpperCase();

  const styles = {
    PUBLISHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    DRAFT: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    PRIVATE: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[normalized] || styles.DRAFT}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {normalized}
    </span>
  );
}
