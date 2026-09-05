import React, { useState, useEffect } from 'react';
import { getStore, updateStore } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { Users, Plus, Trash2, Edit2, Building2, Calendar } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';

export function AdminLeadershipPage() {
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const initialFormData = {
    title: '',
    organization: '',
    year: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const store = getStore();
    setLeadership(store.leadership || []);
    setLoading(false);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      organization: '',
      year: new Date().getFullYear() + ' - Present',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      organization: item.organization || '',
      year: item.year || '',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this leadership role?')) {
      const updated = leadership.filter(item => item.id !== id);
      setLeadership(updated);
      updateStore(s => ({ ...s, leadership: updated }));
      addToast('Leadership role deleted successfully.', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingId) {
      updated = leadership.map(item => item.id === editingId ? { ...item, ...formData } : item);
      addToast('Leadership role updated successfully!', 'success');
    } else {
      const newItem = {
        id: 'lead-' + Date.now(),
        ...formData
      };
      updated = [newItem, ...leadership];
      addToast('New leadership role added successfully!', 'success');
    }
    setLeadership(updated);
    updateStore(s => ({ ...s, leadership: updated }));
    setIsModalOpen(false);
  };

  if (loading) return <LoadingState message="Loading Leadership Roles..." />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan" /> Manage Leadership Experience
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">
            Update batch representative roles, committee positions, and community leadership.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Leadership Role
        </button>
      </div>

      {/* Leadership Roles Grid */}
      <div className="grid grid-cols-1 gap-4">
        {leadership.map((item, idx) => (
          <div key={item.id || idx} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-typo-primary font-sans">{item.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan border border-cyan-500/20">
                  {item.year}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-typo-secondary">
                <Building2 className="w-3.5 h-3.5 text-cyan" />
                <span className="text-typo-primary font-semibold">{item.organization}</span>
              </div>

              {item.description && (
                <p className="text-xs text-typo-muted line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(item)}
                className="px-3 py-1.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary hover:text-cyan hover:border-cyan/30 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan" /> Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-all"
                title="Delete Role"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {leadership.length === 0 && (
          <div className="p-8 text-center glass-card rounded-2xl text-typo-muted text-xs font-mono">
            No leadership roles found. Click "+ Add Leadership Role" to create one.
          </div>
        )}
      </div>

      {/* Modal Form Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Leadership Role' : 'Add Leadership Role'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Role / Position Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Batch Representative / Committee Member"
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-typo-secondary mb-1">Organization / Society *</label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={e => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. INTECS / University of Moratuwa"
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Year / Period *</label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2024 - Present"
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Description / Key Responsibilities</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Organized national tech events, coordinated batch communications..."
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-secondary focus:outline-none focus:border-cyan resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary text-xs font-mono hover:text-typo-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-obsidian-base font-bold text-xs font-mono shadow-glow-cyan transition-all"
            >
              {editingId ? 'Save Changes' : 'Add Role'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
