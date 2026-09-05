import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

export function FileUpload({ onFileSelect, accept = ".pdf", maxSizeMB = 10, label = "Upload PDF Document" }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return;
    }

    if (accept) {
      const allowedPatterns = accept.split(',').map(s => s.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      const isValid = allowedPatterns.some(pattern => {
        if (pattern === 'image/*') return fileType.startsWith('image/');
        if (pattern.startsWith('.')) return fileName.endsWith(pattern);
        if (pattern.includes('/')) return fileType === pattern;
        return fileName.endsWith('.' + pattern);
      });

      if (!isValid) {
        setError(`Invalid file type. Only ${accept} files are supported.`);
        return;
      }
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError('');
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full space-y-3">
      <label className="block text-xs font-medium text-slate-300">{label}</label>
      
      {!selectedFile ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-teal-500 rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-900/80 transition-all group">
          <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-400 mb-2 transition-colors" />
          <p className="text-sm font-medium text-slate-200">Click or drag file to upload</p>
          <p className="text-xs text-slate-400 mt-1">Supports {accept.toUpperCase()} (Max {maxSizeMB}MB)</p>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
