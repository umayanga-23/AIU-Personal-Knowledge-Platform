import React, { useEffect, useState } from 'react';
import { cvService } from '../../services/cvService';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { ShieldCheck, Download, Calendar, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { analyticsService } from '../../services/analyticsService';

export function CvPage() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const loadCv = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cvService.getCurrentPublic();
      setCv(data);
    } catch (err) {
      console.error('Failed to load CV:', err);
      setError(err.message || 'Unable to retrieve published Curriculum Vitae.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCv();
  }, []);

  const handleDirectDownload = async () => {
    const cvUrl = cv?.fileUrl;

    if (!cvUrl) {
      addToast('No active CV file URL available for download', 'error');
      return;
    }

    const fileName = cv?.fileName || 'Induwara_Umayanga_Alukirthi_CV.pdf';
    analyticsService.recordCvDownload();

    // Trigger download
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Opening ${fileName}...`, 'success');
  };

  if (loading) return <LoadingState message="Loading Curriculum Vitae..." />;
  if (error) return <ErrorState message={error} onRetry={loadCv} />;
  if (!cv) return (
    <div className="py-20">
      <EmptyState
        title="No Published CV"
        message="A verified Curriculum Vitae document has not been published yet."
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 font-sans">
      {/* Official Verified CV Showcase Header Card */}
      <div className="p-8 sm:p-10 glass-card rounded-3xl space-y-6 relative overflow-hidden border-t-4 border-t-cyan">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow-emerald">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Current Curriculum Vitae
          </div>
          {cv && (
            <div className="flex items-center gap-3 text-xs font-mono text-typo-secondary">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cyan" /> Updated: {cv.lastUpdated || '2026-09-01'}</span>
              <span>•</span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan font-bold">Version: {cv.version || 'v2.5'}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-typo-primary tracking-tight font-sans">
            Curriculum Vitae
          </h1>
          <p className="text-sm sm:text-base text-typo-secondary leading-relaxed max-w-2xl font-sans">
            {cv?.summary || "Full-Stack IT Undergraduate at University of Moratuwa specializing in Next.js, Spring Boot microservices, PostgreSQL databases, and IoT embedded systems."}
          </p>
        </div>

        {/* Document Details Metadata Box */}
        <div className="p-5 rounded-2xl bg-obsidian-surface/80 border border-obsidian-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-typo-primary">{cv?.fileName || 'Induwara_Umayanga_Alukirthi_CV.pdf'}</p>
              <p className="text-typo-muted text-[11px]">PDF Document • {cv?.fileSize || '280 KB'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Ready for Instant Download
          </div>
        </div>

        {/* Instant Direct PDF Download Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDirectDownload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-cyan to-indigo hover:from-cyan-dark hover:to-indigo text-slate-950 font-extrabold text-sm font-mono rounded-2xl shadow-glow-cyan transition-all hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-5 h-5 text-slate-950" />
            <span>Download Induwara's Official CV (PDF)</span>
            <Sparkles className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
}
