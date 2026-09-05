import React, { useState } from 'react';
import { Download, ExternalLink, FileText, Maximize2 } from 'lucide-react';

export function PdfViewer({ url, fileName, fileSize, onDownload }) {
  const [fullscreen, setFullscreen] = useState(false);

  // Format Google Drive link to /preview for seamless iframe rendering
  const getEmbedUrl = (rawUrl) => {
    if (!rawUrl) return '';
    if (rawUrl.includes('drive.google.com') && !rawUrl.includes('/preview')) {
      return rawUrl.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
    }
    return rawUrl;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
      fullscreen ? 'fixed inset-4 z-50 rounded-2xl border-teal-500/50' : 'w-full'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">{fileName || 'Document.pdf'}</h4>
            {fileSize && <p className="text-xs text-slate-400">{fileSize}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
            title="Toggle fullscreen view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {onDownload && (
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          )}
        </div>
      </div>

      {/* PDF Container View */}
      <div className="relative w-full h-[550px] bg-slate-950/60 flex items-center justify-center">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={fileName || 'PDF Document Viewer'}
            className="w-full h-full border-none"
          />
        ) : (
          <div className="text-center p-8 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <p className="text-sm">No PDF document loaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
