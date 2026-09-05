import React, { useEffect, useState } from 'react';
import { articleService } from '../../services/articleService';
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen, ExternalLink, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CharCounter, UrlValidator, ImagePreviewCard } from '../../components/common/FormValidationFeedback';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { LoadingState } from '../../components/common/LoadingState';
import { FileUpload } from '../../components/common/FileUpload';
import { formatImageUrl } from '../../utils/formValidation';

export function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    documentUrl: '',
    content: '',
    coverImage: '',
    readingTime: '5 min read',
    publishDate: '',
    technology: 'spring-boot',
    tagsStr: 'Java, Architecture',
    status: 'PUBLISHED',
    featured: false
  });

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleService.getAllAdmin();
      setArticles(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch technical articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      documentUrl: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      readingTime: '5 min read',
      publishDate: new Date().toISOString().split('T')[0],
      technology: 'spring-boot',
      tagsStr: 'Spring Boot, Java, PostgreSQL',
      status: 'PUBLISHED',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingId(art.id);
    setForm({
      title: art.title || '',
      slug: art.slug || '',
      excerpt: art.excerpt || '',
      documentUrl: art.documentUrl || art.pdfUrl || '',
      content: art.content || '',
      coverImage: art.coverImage || '',
      readingTime: art.readingTime || '5 min read',
      publishDate: art.publishDate || '',
      technology: art.technology || 'spring-boot',
      tagsStr: art.tags?.join(', ') || '',
      status: art.status || 'DRAFT',
      featured: !!art.featured
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      addToast('Title and Slug are required', 'error');
      return;
    }

    const payload = {
      ...form,
      pdfUrl: form.documentUrl,
      tags: form.tagsStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await articleService.update(editingId, payload);
        addToast('Technical article updated successfully', 'success');
      } else {
        await articleService.create(payload);
        addToast('New technical article created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleTogglePublish = async (art) => {
    try {
      await articleService.togglePublish(art.id, art.status);
      addToast(`Status toggled to ${art.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'}`, 'info');
      fetchArticles();
    } catch (err) {
      addToast('Status update failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await articleService.delete(deleteId);
      addToast('Technical article deleted successfully', 'success');
      setDeleteId(null);
      fetchArticles();
    } catch (err) {
      addToast('Failed to delete article', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading technical articles table..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans">Technical Articles Management</h1>
          <p className="text-xs text-typo-secondary font-mono">Create, edit, and publish Part 2 Technical Articles with short summary and PDF document links.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Create Technical Article
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-obsidian-surface text-typo-secondary font-mono uppercase tracking-wider border-b border-obsidian-border">
            <tr>
              <th className="p-4">Article Title</th>
              <th className="p-4">Technology</th>
              <th className="p-4">Document Link</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border text-typo-primary">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-obsidian-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-typo-primary">{art.title}</td>
                <td className="p-4 font-mono text-cyan">#{art.technology}</td>
                <td className="p-4 font-mono text-typo-secondary">
                  {art.documentUrl || art.pdfUrl ? (
                    <a href={art.documentUrl || art.pdfUrl} target="_blank" rel="noreferrer" className="text-cyan hover:underline flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> PDF Attached
                    </a>
                  ) : 'No Link'}
                </td>
                <td className="p-4"><StatusBadge status={art.status} /></td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleTogglePublish(art)} className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-cyan border border-obsidian-border">
                    {art.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button onClick={() => handleOpenEdit(art)} className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-cyan border border-obsidian-border">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(art.id)} className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-rose-400 border border-obsidian-border">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Technical Article' : 'Create Technical Article'} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          {/* Excerpt / Summary */}
          <div>
            <label className="block text-xs font-mono text-cyan mb-1 font-bold">Article Summary / Short Overview *</label>
            <textarea
              rows={3}
              required
              placeholder="Enter a short summary or abstract describing this article..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
            <CharCounter text={form.excerpt} maxLength={300} />
          </div>

          {/* PDF Document URL Link */}
          <div>
            <label className="block text-xs font-mono text-cyan mb-1 font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan" /> Full PDF Document / Article Link URL (Google Drive / IEEE / Medium Link)
            </label>
            <input
              type="url"
              value={form.documentUrl}
              onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/... or https://domain.com/article.pdf"
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
            />
            <UrlValidator url={form.documentUrl} />
          </div>

          {/* Optional Content Notes */}
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Additional Content / Notes (Optional)</label>
            <textarea
              rows={3}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Optional additional bullet points or notes..."
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary font-mono focus:outline-none focus:border-cyan"
            />
          </div>

          {/* Meta: Cover Image, Technology, Reading Time, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Technology Tag</label>
              <input
                type="text"
                value={form.technology}
                onChange={(e) => setForm({ ...form, technology: e.target.value })}
                placeholder="spring-boot"
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Reading Time</label>
              <input
                type="text"
                value={form.readingTime}
                onChange={(e) => setForm({ ...form, readingTime: e.target.value })}
                placeholder="5 min read"
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Publish Date</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-obsidian-surface/60 border border-obsidian-border">
            <label className="block text-xs font-mono text-cyan font-bold uppercase tracking-wider">Cover Banner Image</label>
            <FileUpload
              label="Option 1: Upload Image File from Computer"
              accept="image/*"
              maxSizeMB={5}
              onFileSelect={async (file) => {
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setForm(prev => ({ ...prev, coverImage: reader.result }));
                  addToast(`Selected cover banner: ${file.name}`, 'info');
                };
                reader.readAsDataURL(file);
              }}
            />
            <div>
              <label className="block text-[11px] font-mono text-typo-muted mb-1">Option 2: Or Paste Google Drive / Web Image URL</label>
              <input
                type="text"
                value={form.coverImage && form.coverImage.startsWith('data:') ? '' : form.coverImage}
                onChange={(e) => {
                  const formatted = formatImageUrl(e.target.value);
                  setForm({ ...form, coverImage: formatted });
                }}
                placeholder={form.coverImage && form.coverImage.startsWith('data:') ? "[Direct Image File Uploaded from Computer]" : "Paste Google Drive link or web image URL..."}
                className="w-full px-3 py-2 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
            <UrlValidator url={form.coverImage} />
            <ImagePreviewCard url={form.coverImage} label="Cover Image Preview" />
          </div>

          {/* Featured & Status Controls */}
          <div className="flex items-center gap-6 pt-2 font-mono">
            <label className="flex items-center gap-2 text-xs text-typo-primary cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-obsidian-border bg-obsidian-surface text-cyan"
              />
              <span>Mark as Featured Article</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs text-typo-secondary">Status:</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="px-3 py-1 bg-obsidian-surface border border-obsidian-border rounded-lg text-xs text-typo-primary focus:outline-none focus:border-cyan"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="PRIVATE">PRIVATE</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border font-mono">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-obsidian-surface text-typo-secondary text-xs rounded-xl border border-obsidian-border">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan">
              {editingId ? 'Save Changes' : 'Create Article'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Technical Article"
        message="Are you sure you want to delete this article?"
        loading={deleteLoading}
      />
    </div>
  );
}
