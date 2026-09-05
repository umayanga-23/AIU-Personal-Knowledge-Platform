import React, { useEffect, useState } from 'react';
import { cvService } from '../../services/cvService';
import { FileUpload } from '../../components/common/FileUpload';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { pdfStorage } from '../../utils/pdfStorage';
import { FileCheck, Upload, CheckCircle2, RefreshCw, Link2, Download, FileText, Info } from 'lucide-react';

export function AdminCvPage() {
  const [currentCv, setCurrentCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [versionInput, setVersionInput] = useState('');
  const [summaryInput, setSummaryInput] = useState('');
  const { addToast } = useToast();

  const fetchCv = async () => {
    try {
      setLoading(true);
      const data = await cvService.getAdminCv();
      let activeCv = data;

      // Hydrate from IndexedDB if base64 file is persisted locally
      if (activeCv && activeCv.fileUrl === 'PERSISTED_IN_INDEXEDDB') {
        const persistedData = await pdfStorage.getPdf('active_cv');
        if (persistedData) {
          activeCv = { ...activeCv, fileUrl: persistedData };
        }
      }

      setCurrentCv(activeCv);
      if (activeCv) {
        setVersionInput(activeCv.version || 'v2.5');
        setUrlInput(activeCv.fileUrl && !activeCv.fileUrl.startsWith('data:') ? activeCv.fileUrl : '');
        setSummaryInput(activeCv.summary || 'Induwara Umayanga Alukirthi CV - IT Undergraduate at University of Moratuwa');
      }
    } catch (err) {
      addToast(err.message || 'Failed to load CV metadata', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCv();
  }, []);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUploadAndPublish = async (e) => {
    e.preventDefault();

    if (!uploadedFile && !urlInput.trim() && !currentCv) {
      addToast('Please select a PDF file to upload or enter a PDF URL', 'error');
      return;
    }

    try {
      setUploading(true);

      let finalFileUrl = currentCv?.fileUrl || '';

      if (uploadedFile) {
        finalFileUrl = await fileToBase64(uploadedFile);
        // Persist large base64 file directly in IndexedDB to prevent LocalStorage quota limits
        await pdfStorage.savePdf('active_cv', finalFileUrl, { fileName: uploadedFile.name });
      } else if (urlInput.trim()) {
        finalFileUrl = urlInput.trim();
        await pdfStorage.savePdf('active_cv', finalFileUrl, { url: finalFileUrl });
      }

      const payload = {
        version: versionInput || 'v2.5',
        fileName: uploadedFile ? uploadedFile.name : (currentCv?.fileName || 'Induwara_Umayanga_Alukirthi_CV.pdf'),
        fileSize: uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : (currentCv?.fileSize || '280 KB'),
        fileUrl: finalFileUrl,
        summary: summaryInput || currentCv?.summary,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: 'PUBLISHED'
      };

      const newCv = await cvService.uploadNewCv(payload);
      setCurrentCv({ ...newCv, fileUrl: finalFileUrl });
      setUploadedFile(null);
      addToast('New CV published successfully! Public site synced in real-time.', 'success');
    } catch (err) {
      addToast(err.message || 'CV publish failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleTestDownload = () => {
    if (!currentCv?.fileUrl) {
      addToast('No active CV file available for download', 'error');
      return;
    }
    pdfStorage.triggerDownload(currentCv.fileUrl, currentCv.fileName);
    addToast(`Downloading ${currentCv.fileName}...`, 'info');
  };

  if (loading) return <LoadingState message="Loading CV management..." />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-typo-primary flex items-center gap-2 font-sans">
          <FileCheck className="w-6 h-6 text-cyan" /> Curriculum Vitae Management
        </h1>
        <p className="text-xs text-typo-secondary font-mono mt-1">
          Upload and publish active CV PDF documents. Instant direct download enabled across public site.
        </p>
      </div>

      {/* Current Active CV Status & Instant Test Download Card */}
      <div className="p-6 glass-card rounded-2xl flex flex-wrap items-center justify-between gap-6 border-l-4 border-l-cyan">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan font-bold uppercase tracking-wider">Current Active Public CV</span>
            <StatusBadge status={currentCv?.status || 'PUBLISHED'} />
          </div>
          <h3 className="text-base font-bold text-typo-primary flex items-center gap-2 font-sans">
            <FileText className="w-4 h-4 text-cyan" />
            <span>{currentCv?.fileName || 'Induwara_Umayanga_Alukirthi_CV.pdf'}</span>
          </h3>
          <p className="text-xs font-mono text-typo-secondary">
            Version: <span className="text-cyan font-bold">{currentCv?.version}</span> • Size: {currentCv?.fileSize} • Last Updated: {currentCv?.lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTestDownload}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-slate-950 font-extrabold text-xs font-mono rounded-xl shadow-glow-cyan transition-all flex items-center gap-2 hover:scale-105"
          >
            <Download className="w-4 h-4 text-slate-950" /> Test Instant Download
          </button>
        </div>
      </div>

      {/* Upload & Update Form */}
      <div className="p-8 glass-card rounded-3xl space-y-6">
        <h2 className="text-lg font-bold text-typo-primary flex items-center gap-2 font-sans">
          <Upload className="w-5 h-5 text-cyan" /> Upload New CV File
        </h2>

        <form onSubmit={handleUploadAndPublish} className="space-y-6">
          {/* Method A: Local PDF Upload */}
          <div className="space-y-2">
            <FileUpload
              label="Option A: Select Local PDF File (Instant Direct Download)"
              accept=".pdf"
              maxSizeMB={15}
              onFileSelect={(file) => setUploadedFile(file)}
            />
            {uploadedFile && (
              <p className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                ✓ Ready to publish: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Method B: Direct Storage / Web URL */}
          <div className="space-y-2 pt-2 border-t border-obsidian-border">
            <label className="block text-xs font-mono text-typo-secondary flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-cyan" /> Option B: Or Paste Supabase Storage / Direct Public PDF URL
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://aiu-portfolio.supabase.co/storage/v1/object/public/cv/my-cv.pdf"
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs font-mono text-cyan focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1.5">CV Version Tag *</label>
              <input
                type="text"
                required
                value={versionInput}
                onChange={(e) => setVersionInput(e.target.value)}
                placeholder="v2.5"
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1.5">Summary / Highlights</label>
              <input
                type="text"
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                placeholder="BSc (Hons) IT Undergraduate CV - University of Moratuwa..."
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end font-mono">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 bg-gradient-to-r from-cyan to-indigo text-slate-950 font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${uploading ? 'animate-spin' : ''}`} />
              {uploading ? 'Publishing & Syncing...' : 'Publish & Replace Active CV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
