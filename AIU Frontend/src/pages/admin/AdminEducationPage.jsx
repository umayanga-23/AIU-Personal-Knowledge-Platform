import React, { useState, useEffect } from 'react';
import { getStore, updateStore } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Plus, Trash2, Edit2, MapPin, Calendar, Building2 } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';

export function AdminEducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const initialFormData = {
    degree: '',
    institution: '',
    year: '',
    location: '',
    details: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const store = getStore();
    setEducation(store.education || []);
    setLoading(false);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      degree: '',
      institution: 'University of Moratuwa',
      year: new Date().getFullYear() + ' - Present',
      location: 'Moratuwa, Sri Lanka',
      details: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      degree: item.degree || '',
      institution: item.institution || '',
      year: item.year || '',
      location: item.location || '',
      details: item.details || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      const updated = education.filter(item => item.id !== id);
      setEducation(updated);
      updateStore(s => ({ ...s, education: updated }));
      addToast('Education entry deleted successfully.', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingId) {
      updated = education.map(item => item.id === editingId ? { ...item, ...formData } : item);
      addToast('Academic entry updated successfully!', 'success');
    } else {
      const newItem = {
        id: 'edu-' + Date.now(),
        ...formData
      };
      updated = [newItem, ...education];
      addToast('New academic entry added successfully!', 'success');
    }
    setEducation(updated);
    updateStore(s => ({ ...s, education: updated }));
    setIsModalOpen(false);
  };

  if (loading) return <LoadingState message="Loading Education Path..." />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-cyan" /> Manage Education Path
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">
            Update degrees, A/L, O/L, institutions, and academic milestones.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Academic Entry
        </button>
      </div>

      {/* Education Entries List */}
      <div className="grid grid-cols-1 gap-4">
        {education.map((item, idx) => (
          <div key={item.id || idx} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-typo-primary font-sans">{item.degree}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan border border-cyan-500/20">
                  {item.year}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-typo-secondary">
                <span className="flex items-center gap-1.5 text-typo-primary font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-cyan" /> {item.institution}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1.5 text-typo-muted">
                    <MapPin className="w-3.5 h-3.5 text-cyan" /> {item.location}
                  </span>
                )}
              </div>

              {item.details && (
                <p className="text-xs text-typo-muted line-clamp-2 mt-1">{item.details}</p>
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
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <div className="p-8 text-center glass-card rounded-2xl text-typo-muted text-xs font-mono">
            No education entries found. Click "+ Add Academic Entry" to create one.
          </div>
        )}
      </div>

      {/* Modal Form Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Academic Entry' : 'Add Academic Entry'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Degree / Qualification Title *</label>
            <input
              type="text"
              required
              value={formData.degree}
              onChange={e => setFormData({ ...formData, degree: e.target.value })}
              placeholder="e.g. BSc (Hons) in Information Technology"
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Institution Name *</label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={e => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. University of Moratuwa"
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Year / Period *</label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2022 - Present"
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Moratuwa, Sri Lanka"
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Details / Subjects / GPA / Achievements</label>
            <textarea
              rows="3"
              value={formData.details}
              onChange={e => setFormData({ ...formData, details: e.target.value })}
              placeholder="e.g. Specializing in Software Engineering & Information Systems..."
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
              {editingId ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
