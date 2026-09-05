import React, { useEffect, useState } from 'react';
import { technologyService } from '../../services/technologyService';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { LoadingState } from '../../components/common/LoadingState';

export function AdminTechnologiesPage() {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'Programming',
    icon: 'Code2',
    website: '',
    description: '',
    featured: true
  });

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTech = async () => {
    try {
      setLoading(true);
      const data = await technologyService.getAllAdmin();
      setTechList(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch technologies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTech();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      category: 'Programming',
      icon: 'Code2',
      website: '',
      description: '',
      featured: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      category: item.category || 'Programming',
      icon: item.icon || 'Code2',
      website: item.website || '',
      description: item.description || '',
      featured: !!item.featured
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      addToast('Name and Slug are required', 'error');
      return;
    }

    try {
      if (editingId) {
        await technologyService.update(editingId, form);
        addToast('Technology updated successfully', 'success');
      } else {
        await technologyService.create(form);
        addToast('Technology added successfully', 'success');
      }
      setIsModalOpen(false);
      fetchTech();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await technologyService.delete(deleteId);
      addToast('Technology removed successfully', 'success');
      setDeleteId(null);
      fetchTech();
    } catch (err) {
      addToast('Failed to delete technology', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading technology matrix..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans">Technology Management</h1>
          <p className="text-xs text-typo-secondary font-mono">Add or edit technology stack items and categories for Induwara's portfolio.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Technology
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-obsidian-surface text-typo-secondary font-mono uppercase tracking-wider border-b border-obsidian-border">
            <tr>
              <th className="p-4">Technology Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border text-typo-primary">
            {techList.map((item) => (
              <tr key={item.id} className="hover:bg-obsidian-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-typo-primary">{item.name}</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded bg-obsidian-surface border border-obsidian-border text-cyan font-mono">{item.category}</span></td>
                <td className="p-4 font-mono text-typo-secondary">#{item.slug}</td>
                <td className="p-4">{item.featured ? <span className="text-cyan font-bold font-mono">Yes</span> : 'No'}</td>
                <td className="p-4 text-right space-x-2">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Technology' : 'Add Technology'} maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              >
                <option value="Programming">Programming</option>
                <option value="Frameworks">Frameworks</option>
                <option value="Databases">Databases</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="AI">AI</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Official Website URL</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border font-mono">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-obsidian-surface text-typo-secondary text-xs rounded-xl border border-obsidian-border">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan">
              {editingId ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Technology"
        message="Are you sure you want to delete this technology from the platform stack matrix?"
        loading={deleteLoading}
      />
    </div>
  );
}
