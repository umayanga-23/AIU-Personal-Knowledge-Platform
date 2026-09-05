import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to proceed?", loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20 shadow-glow-rose">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </div>
        <p className="text-sm text-typo-secondary mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3 w-full font-mono">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary hover:text-typo-primary text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-glow-rose transition-all flex items-center gap-2"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
