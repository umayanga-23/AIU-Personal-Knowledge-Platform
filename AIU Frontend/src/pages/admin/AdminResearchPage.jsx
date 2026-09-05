import React, { useEffect, useState } from 'react';
import { researchService } from '../../services/researchService';
import { Plus, Edit2, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CharCounter, UrlValidator } from '../../components/common/FormValidationFeedback';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { LoadingState } from '../../components/common/LoadingState';

export function AdminResearchPage() {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    abstract: '',
    publishDate: '',
    authorsStr: '',
    publicationInfo: '',
    documentUrl: '',
    tagsStr: '',
    status: 'PUBLISHED',
    featured: false
  });

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchResearch = async () => {
    try {
      setLoading(true);
      const data = await researchService.getAllAdmin();
      setResearchList(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch research papers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      abstract: '',
      publishDate: new Date().toISOString().split('T')[0],
      authorsStr: 'Induwara Umayanga Alukirthi',
      publicationInfo: '',
      documentUrl: '',
      tagsStr: 'Vector Search, RAG, PostgreSQL',
      status: 'PUBLISHED',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      abstract: item.abstract || '',
      publishDate: item.publishDate || '',
      authorsStr: item.authors?.join(', ') || '',
      publicationInfo: item.publicationInfo || '',
      documentUrl: item.documentUrl || '',
      tagsStr: item.tags?.join(', ') || '',
      status: item.status || 'DRAFT',
      featured: !!item.featured
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
      authors: form.authorsStr.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tagsStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await researchService.update(editingId, payload);
        addToast('Research paper updated successfully', 'success');
      } else {
        await researchService.create(payload);
        addToast('New research paper added successfully', 'success');
      }
      setIsModalOpen(false);
      fetchResearch();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      await researchService.togglePublish(item.id, item.status);
      addToast(`Status toggled to ${item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'}`, 'info');
      fetchResearch();
    } catch (err) {
      addToast('Status update failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await researchService.delete(deleteId);
      addToast('Research paper deleted successfully', 'success');
      setDeleteId(null);
      fetchResearch();
    } catch (err) {
      addToast('Failed to delete research paper', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading research management table..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans">Research Management</h1>
          <p className="text-xs text-typo-secondary font-mono">Manage academic publications, whitepapers, and document links for Induwara Umayanga Alukirthi.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Research Paper
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-obsidian-surface text-typo-secondary font-mono uppercase tracking-wider border-b border-obsidian-border">
            <tr>
              <th className="p-4">Paper Title</th>
              <th className="p-4">Publish Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border text-typo-primary">
            {researchList.map((item) => (
              <tr key={item.id} className="hover:bg-obsidian-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-typo-primary">{item.title}</td>
                <td className="p-4 font-mono text-cyan">{item.publishDate}</td>
                <td className="p-4"><StatusBadge status={item.status} /></td>
                <td className="p-4">{item.featured ? <span className="text-cyan font-bold font-mono">Yes</span> : 'No'}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-cyan border border-obsidian-border"
                  >
                    {item.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button onClick={() => handleOpenEdit(item)} className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-cyan border border-obsidian-border">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-rose-400 border border-obsidian-border">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Research Paper' : 'Add Research Paper'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Paper Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Abstract *</label>
            <textarea
              rows={3}
              required
              value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
            <CharCounter text={form.abstract} maxLength={500} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Publish Date</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Authors (comma separated)</label>
              <input
                type="text"
                value={form.authorsStr}
                onChange={(e) => setForm({ ...form, authorsStr: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Publication Venue Info</label>
            <input
              type="text"
              value={form.publicationInfo}
              onChange={(e) => setForm({ ...form, publicationInfo: e.target.value })}
              placeholder="IEEE International Conference on Cloud Data Engineering (ICCDE 2024)"
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Document PDF URL</label>
            <input
              type="url"
              value={form.documentUrl}
              onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
            />
            <UrlValidator url={form.documentUrl} />
          </div>

          <div className="flex items-center gap-6 pt-2 font-mono">
            <label className="flex items-center gap-2 text-xs text-typo-primary cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-obsidian-border bg-obsidian-surface text-cyan"
              />
              <span>Mark as Featured Paper</span>
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-obsidian-surface text-typo-secondary text-xs rounded-xl border border-obsidian-border">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan">
              {editingId ? 'Save Changes' : 'Add Paper'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Research Paper"
        message="Are you sure you want to delete this publication record?"
        loading={deleteLoading}
      />
    </div>
  );
}
