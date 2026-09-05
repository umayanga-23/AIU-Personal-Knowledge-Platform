import React from 'react';

export function LoadingState({ message = "Loading technical assets..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-teal-500/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-mono text-slate-400 animate-pulse">{message}</p>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse space-y-4">
          <div className="h-48 rounded-xl bg-slate-800/60 w-full"></div>
          <div className="h-5 bg-slate-800/80 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-800/50 rounded-md w-full"></div>
          <div className="h-4 bg-slate-800/50 rounded-md w-2/3"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 bg-slate-800 rounded-lg"></div>
            <div className="h-6 w-16 bg-slate-800 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
