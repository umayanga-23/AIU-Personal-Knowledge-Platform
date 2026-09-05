import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { isValidUrl, getLengthStatus } from '../../utils/formValidation';

// 1. Live Character Counter Badge Component
export function CharCounter({ text = '', maxLength = 250 }) {
  const { count, isOver, isWarning } = getLengthStatus(text, maxLength);

  return (
    <div className="flex items-center justify-between text-[11px] font-mono mt-1">
      <span className={isOver ? 'text-rose-400 font-bold' : isWarning ? 'text-amber-400 font-medium' : 'text-typo-muted'}>
        {count} / {maxLength} characters
      </span>
      {isOver && (
        <span className="text-rose-400 flex items-center gap-1 font-bold animate-pulse">
          <AlertTriangle className="w-3 h-3" /> Exceeds maximum recommended limit!
        </span>
      )}
    </div>
  );
}

// 2. Real-time URL Validator Feedback Component
export function UrlValidator({ url = '' }) {
  if (!url || !url.trim()) return null;

  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-mono mt-1 transition-all">
        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Direct Local Image File Attached
        </span>
      </div>
    );
  }

  const valid = isValidUrl(url);

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-mono mt-1 transition-all">
      {valid ? (
        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Valid URL format
        </span>
      ) : (
        <span className="text-rose-400 flex items-center gap-1 font-bold animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" /> Invalid URL format (must start with http:// or https://)
        </span>
      )}
    </div>
  );
}

// 3. Real-time Image Preview Thumbnail Component for Admin Forms
export function ImagePreviewCard({ url = '', label = 'Image Preview' }) {
  const [hasError, setHasError] = useState(false);

  if (!url || !url.trim()) return null;

  const valid = isValidUrl(url);

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-obsidian-elevated/80 border border-obsidian-border space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-cyan">
        <span className="flex items-center gap-1.5 font-bold">
          <ImageIcon className="w-3.5 h-3.5" /> Live {label}
        </span>
        {valid && !hasError && (
          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Image Loaded
          </span>
        )}
      </div>

      {valid ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-cyan/30 bg-black/50">
          <img
            src={url}
            alt={label}
            onError={() => setHasError(true)}
            onLoad={() => setHasError(false)}
            className="w-full h-full object-cover"
          />
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian-surface/90 text-rose-400 p-2 text-center text-xs font-mono">
              <AlertTriangle className="w-5 h-5 mb-1" />
              <span>Failed to load image from URL</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 text-center text-rose-400 text-xs font-mono bg-rose-500/10 rounded-lg border border-rose-500/20">
          Enter a valid image URL to preview
        </div>
      )}
    </div>
  );
}
