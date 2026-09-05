import React, { useEffect, useState } from 'react';
import { journeyService } from '../../services/journeyService';
import { Plus, Edit2, Trash2, Milestone } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { LoadingState } from '../../components/common/LoadingState';

export function AdminJourneyPage() {
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    date: 'Q1 2024',
    title: '',
    learned: '',
    built: '',
    technologiesStr: 'spring-boot, react'
  });

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJourney = async () => {
    try {
      setLoading(true);
      const data = await journeyService.getAllAdmin();
      setJourney(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch timeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      date: 'Q1 2026',
      title: '',
      learned: '',
      built: '',
      technologiesStr: 'spring-boot, react'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({
      date: item.date || '',
      title: item.title || '',
      learned: item.learned || '',
      built: item.built || '',
      technologiesStr: item.technologies?.join(', ') || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      addToast('Title and Date are required', 'error');
      return;
    }

    const payload = {
      ...form,
      technologies: form.technologiesStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    };

    try {
      if (editingId) {
        await journeyService.update(editingId, payload);
        addToast('Milestone updated successfully', 'success');
      } else {
        await journeyService.create(payload);
        addToast('Timeline milestone added successfully', 'success');
      }
      setIsModalOpen(false);
      fetchJourney();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await journeyService.delete(deleteId);
      addToast('Milestone deleted successfully', 'success');
      setDeleteId(null);
      fetchJourney();
    } catch (err) {
      addToast('Failed to delete milestone', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading learning journey editor..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans flex items-center gap-2">
            <Milestone className="w-6 h-6 text-cyan" /> Learning Journey Timeline
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">Add or edit chronological software engineering growth milestones for Induwara Umayanga Alukirthi.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Milestone
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-obsidian-surface text-typo-secondary font-mono uppercase tracking-wider border-b border-obsidian-border">
            <tr>
              <th className="p-4">Timeframe</th>
              <th className="p-4">Milestone Title</th>
              <th className="p-4">Technologies</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border text-typo-primary">
            {journey.map((item) => (
              <tr key={item.id} className="hover:bg-obsidian-elevated/50 transition-colors">
                <td className="p-4 font-mono text-cyan">{item.date}</td>
                <td className="p-4 font-semibold text-typo-primary">{item.title}</td>
                <td className="p-4 font-mono text-typo-secondary">{item.technologies?.join(', ')}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Milestone' : 'Add Milestone'} maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Timeframe *</label>
              <input
                type="text"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Q1 2026"
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">What I Learned</label>
            <textarea
              rows={2}
              value={form.learned}
              onChange={(e) => setForm({ ...form, learned: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">What I Built</label>
            <textarea
              rows={2}
              value={form.built}
              onChange={(e) => setForm({ ...form, built: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Technologies (comma separated)</label>
            <input
              type="text"
              value={form.technologiesStr}
              onChange={(e) => setForm({ ...form, technologiesStr: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border font-mono">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-obsidian-surface text-typo-secondary text-xs rounded-xl border border-obsidian-border">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan">
              {editingId ? 'Save Changes' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Milestone"
        message="Are you sure you want to remove this milestone?"
        loading={deleteLoading}
      />
    </div>
  );
}
