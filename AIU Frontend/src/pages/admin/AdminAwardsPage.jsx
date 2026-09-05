import React, { useState, useEffect } from 'react';
import { getStore, updateStore } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { Award, Plus, Trash2, Edit2, Image, ExternalLink, Building2, FileText, Eye, X } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { UrlValidator, ImagePreviewCard } from '../../components/common/FormValidationFeedback';
import { FileUpload } from '../../components/common/FileUpload';
import { formatImageUrl } from '../../utils/formValidation';
import { pdfStorage } from '../../utils/pdfStorage';

export function AdminAwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null); // { url, title, isPdf }
  const { addToast } = useToast();

  const initialFormData = {
    title: '',
    issuer: '',
    year: '',
    imageUrl: '',
    credentialUrl: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const store = getStore();
      let awardsList = store.awards || [];

      // Hydrate heavy PDF/Image Base64 files from IndexedDB
      const hydrated = await Promise.all(
        awardsList.map(async (item) => {
          let img = item.imageUrl;
          let cred = item.credentialUrl;

          if (img === 'PERSISTED_IN_INDEXEDDB') {
            const dbImg = await pdfStorage.getPdf('award_img_' + item.id);
            if (dbImg) img = dbImg;
          }
          if (cred === 'PERSISTED_IN_INDEXEDDB') {
            const dbCred = await pdfStorage.getPdf('award_cred_' + item.id);
            if (dbCred) cred = dbCred;
          }

          return { ...item, imageUrl: img, credentialUrl: cred };
        })
      );

      setAwards(hydrated);
    } catch (err) {
      console.warn('Failed to hydrate awards from IndexedDB:', err);
      const store = getStore();
      setAwards(store.awards || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const isPdf = (url = '') => {
    return url && (url.startsWith('data:application/pdf') || url.toLowerCase().includes('.pdf'));
  };

  const createBlobUrl = (dataUrl) => {
    if (!dataUrl) return '';
    if (dataUrl.startsWith('http') || dataUrl.startsWith('blob:')) return dataUrl;
    try {
      const parts = dataUrl.split(';base64,');
      const type = parts[0].replace('data:', '') || 'application/pdf';
      const base64Str = parts[1] || parts[0];
      const binaryStr = atob(base64Str);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type });
      return URL.createObjectURL(blob);
    } catch (e) {
      return dataUrl;
    }
  };

  const handleOpenPreview = (url, title) => {
    if (!url) return;
    const pdfCheck = isPdf(url);
    const viewUrl = pdfCheck ? createBlobUrl(url) : url;
    setSelectedMedia({ url: viewUrl, title, isPdf: pdfCheck });
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      issuer: '',
      year: new Date().getFullYear().toString(),
      imageUrl: '',
      credentialUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (item) => {
    setEditingId(item.id);

    let img = item.imageUrl;
    let cred = item.credentialUrl;

    if (img === 'PERSISTED_IN_INDEXEDDB') {
      const dbImg = await pdfStorage.getPdf('award_img_' + item.id);
      if (dbImg) img = dbImg;
    }
    if (cred === 'PERSISTED_IN_INDEXEDDB') {
      const dbCred = await pdfStorage.getPdf('award_cred_' + item.id);
      if (dbCred) cred = dbCred;
    }

    setFormData({
      title: item.title || '',
      issuer: item.issuer || '',
      year: item.year || '',
      imageUrl: img || '',
      credentialUrl: cred || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this award entry?')) {
      const updated = awards.filter(item => item.id !== id);
      setAwards(updated);
      updateStore(s => ({ ...s, awards: updated }));
      addToast('Award entry deleted successfully.', 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemId = editingId || ('award-' + Date.now());

      if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
        await pdfStorage.savePdf('award_img_' + itemId, formData.imageUrl);
      }
      if (formData.credentialUrl && formData.credentialUrl.startsWith('data:')) {
        await pdfStorage.savePdf('award_cred_' + itemId, formData.credentialUrl);
      }

      const payload = {
        id: itemId,
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        year: formData.year.trim(),
        imageUrl: formData.imageUrl,
        credentialUrl: formData.credentialUrl
      };

      let updated;
      if (editingId) {
        updated = awards.map(item => item.id === editingId ? { ...item, ...payload } : item);
        addToast('Award entry updated successfully!', 'success');
      } else {
        updated = [payload, ...awards];
        addToast('New award entry added successfully!', 'success');
      }

      setAwards(updated);
      updateStore(s => ({ ...s, awards: updated }));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving award entry:', err);
      addToast('Failed to save award entry. Please try again.', 'error');
    }
  };

  if (loading) return <LoadingState message="Loading Awards & Certifications..." />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary flex items-center gap-2 font-sans">
            <Award className="w-6 h-6 text-cyan" /> Manage Certifications & Awards
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">
            Update hackathon achievements, IEEE awards, certificate images, and PDF documents.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Award Entry
        </button>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {awards.map((item, idx) => {
          const isPdfFile = isPdf(item.imageUrl) || isPdf(item.credentialUrl);
          const targetUrl = item.credentialUrl || item.imageUrl;

          return (
            <div key={item.id || idx} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {isPdfFile ? (
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold flex-col gap-1">
                    <FileText className="w-6 h-6 text-emerald-400" />
                    <span>PDF Doc</span>
                  </div>
                ) : item.imageUrl && !item.imageUrl.startsWith('data:application/pdf') ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan/30 shrink-0 bg-black">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-cyan" />
                  </div>
                )}

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-typo-primary font-sans">{item.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan border border-cyan-500/20">
                      {item.year}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-typo-secondary flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan" /> {item.issuer}
                  </p>

                  {targetUrl && (
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(targetUrl, item.title)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan hover:underline cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan" /> 👁️ View Certificate {isPdfFile ? 'PDF' : ''}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary hover:text-cyan hover:border-cyan/30 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-cyan" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {awards.length === 0 && (
          <div className="p-8 text-center glass-card rounded-2xl text-typo-muted text-xs font-mono">
            No awards or certifications found. Click "+ Add Award Entry" to create one.
          </div>
        )}
      </div>

      {/* Modal Form Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Award Entry' : 'Add Award Entry'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Award / Certificate Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Hackathon 1st Place Winner"
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-typo-secondary mb-1">Issuer / Organization *</label>
              <input
                type="text"
                required
                value={formData.issuer}
                onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. IEEE Student Branch / HackerRank"
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Year *</label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2026"
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-obsidian-surface/60 border border-obsidian-border">
            <label className="block text-xs font-mono text-cyan font-bold flex items-center gap-1.5 uppercase">
              <Image className="w-3.5 h-3.5 text-cyan" /> Certificate Image or PDF Document
            </label>
            <FileUpload
              label="Option 1: Upload Certificate File (PDF or Image) from Computer"
              accept="image/*,.pdf"
              maxSizeMB={10}
              onFileSelect={async (file) => {
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const base64Data = reader.result;
                  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    setFormData(prev => ({ ...prev, credentialUrl: base64Data, imageUrl: base64Data }));
                    addToast(`Selected PDF Certificate: ${file.name}`, 'info');
                  } else {
                    setFormData(prev => ({ ...prev, imageUrl: base64Data }));
                    addToast(`Selected Certificate Image: ${file.name}`, 'info');
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
            <div>
              <label className="block text-[11px] font-mono text-typo-muted mb-1">Option 2: Or Paste Google Drive / Web Link (PDF or Image)</label>
              <input
                type="text"
                value={(formData.imageUrl?.startsWith('data:') || formData.credentialUrl?.startsWith('data:')) ? '' : (formData.imageUrl || formData.credentialUrl || '')}
                onChange={e => {
                  const val = e.target.value;
                  const formatted = formatImageUrl(val);
                  setFormData({ ...formData, imageUrl: formatted, credentialUrl: val });
                }}
                placeholder={(formData.imageUrl?.startsWith('data:') || formData.credentialUrl?.startsWith('data:')) ? "[Direct Certificate File Uploaded from Computer]" : "Paste Google Drive PDF link or web URL..."}
                className="w-full px-3 py-2 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>

            {/* Check if PDF file is attached */}
            {((formData.imageUrl && formData.imageUrl.startsWith('data:application/pdf')) || (formData.credentialUrl && formData.credentialUrl.includes('.pdf'))) && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>📜 Certificate PDF Document Attached Successfully!</span>
              </div>
            )}

            {formData.imageUrl && !formData.imageUrl.startsWith('data:application/pdf') && (
              <>
                <UrlValidator url={formData.imageUrl} />
                <ImagePreviewCard url={formData.imageUrl} label="Certificate Image Preview" />
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-cyan" /> Verification / Credential Link
            </label>
            <input
              type="url"
              value={formData.credentialUrl}
              onChange={e => setFormData({ ...formData, credentialUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
            />
            <UrlValidator url={formData.credentialUrl} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary hover:text-typo-primary text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 cursor-pointer"
            >
              {editingId ? 'Save Changes' : 'Create Award Entry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Certificate Viewer Lightbox Modal (For Images & PDF Documents) */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-5xl w-full glass-card p-4 sm:p-6 rounded-3xl border border-cyan/40 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-2 shrink-0">
              <h3 className="text-base font-bold text-typo-primary font-mono flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan" /> {selectedMedia.title}
              </h3>
              <button
                onClick={() => {
                  if (selectedMedia.isPdf && selectedMedia.url.startsWith('blob:')) {
                    URL.revokeObjectURL(selectedMedia.url);
                  }
                  setSelectedMedia(null);
                }}
                className="p-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary hover:text-cyan transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full flex-1 min-h-[60vh] max-h-[75vh] overflow-hidden rounded-2xl bg-black/90 border border-obsidian-border flex items-center justify-center">
              {selectedMedia.isPdf ? (
                <iframe
                  src={selectedMedia.url}
                  title={selectedMedia.title}
                  className="w-full h-full min-h-[60vh] rounded-2xl border-none"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
