import React, { useState, useEffect } from 'react';
import { getStore, updateStore } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import {
  Wrench,
  Plus,
  Trash2,
  X,
  Tag,
  Save,
  Code2,
  Database,
  BookOpen,
  Cloud,
  Cpu,
  ShieldCheck,
  Globe,
  BrainCircuit
} from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';

const ICON_OPTIONS = [
  { id: 'Code2', label: 'Code & Dev', icon: Code2 },
  { id: 'Database', label: 'Database & SQL', icon: Database },
  { id: 'Wrench', label: 'Tools & DevOps', icon: Wrench },
  { id: 'BookOpen', label: 'Analytical', icon: BookOpen },
  { id: 'Cloud', label: 'Cloud & Infra', icon: Cloud },
  { id: 'Cpu', label: 'IoT & Hardware', icon: Cpu },
  { id: 'ShieldCheck', label: 'Security & Auth', icon: ShieldCheck },
  { id: 'Globe', label: 'Web & Services', icon: Globe },
  { id: 'BrainCircuit', label: 'AI & ML', icon: BrainCircuit }
];

export function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Code2');
  const [newCategorySkills, setNewCategorySkills] = useState('');

  const { addToast } = useToast();

  useEffect(() => {
    const store = getStore();
    setSkills(store.skills || []);
    setLoading(false);
  }, []);

  const handleOpenCreateCategory = () => {
    setNewCategoryName('');
    setNewCategoryIcon('Code2');
    setNewCategorySkills('');
    setIsModalOpen(true);
  };

  const handleCreateCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const items = newCategorySkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newGroup = {
      category: newCategoryName.trim(),
      icon: newCategoryIcon,
      items: items.length > 0 ? items : ['Skill 1']
    };

    const updated = [...skills, newGroup];
    setSkills(updated);
    updateStore(s => ({ ...s, skills: updated }));
    addToast(`Skill Category "${newCategoryName}" added successfully!`, 'success');
    setIsModalOpen(false);
  };

  const handleCategoryChange = (idx, field, value) => {
    const updated = [...skills];
    updated[idx][field] = value;
    setSkills(updated);
  };

  const handleAddSkillTag = (categoryIdx) => {
    const text = (newSkillInput[categoryIdx] || '').trim();
    if (!text) return;

    const updated = [...skills];
    if (!updated[categoryIdx].items.includes(text)) {
      updated[categoryIdx].items.push(text);
      setSkills(updated);
    }
    setNewSkillInput({ ...newSkillInput, [categoryIdx]: '' });
  };

  const handleRemoveSkillTag = (categoryIdx, skillIdx) => {
    const updated = [...skills];
    updated[categoryIdx].items.splice(skillIdx, 1);
    setSkills(updated);
  };

  const handleDeleteGroup = (idx) => {
    if (window.confirm('Are you sure you want to delete this skill category?')) {
      const updated = skills.filter((_, i) => i !== idx);
      setSkills(updated);
      updateStore(s => ({ ...s, skills: updated }));
      addToast('Skill category deleted successfully.', 'info');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateStore(s => ({ ...s, skills }));
    addToast('Technical Skills updated successfully!', 'success');
  };

  if (loading) return <LoadingState message="Loading Technical Skills..." />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan" /> Manage Technical Skills
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">
            Add new skills to categories, select custom category icons, or add new categories.
          </p>
        </div>

        <button
          onClick={handleOpenCreateCategory}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Skill Category
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-6">
          {skills.map((group, categoryIdx) => (
            <div key={categoryIdx} className="glass-card p-6 rounded-2xl space-y-5 relative">
              {/* Category Header & Icon Selector */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-7">
                  <label className="block text-xs font-mono text-typo-secondary mb-1">Category Title *</label>
                  <input
                    type="text"
                    required
                    value={group.category}
                    onChange={e => handleCategoryChange(categoryIdx, 'category', e.target.value)}
                    className="w-full px-4 py-2 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm font-bold text-typo-primary focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-mono text-typo-secondary mb-1">Category Icon *</label>
                  <select
                    value={group.icon || 'Code2'}
                    onChange={e => handleCategoryChange(categoryIdx, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs font-mono text-cyan focus:outline-none focus:border-cyan"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} ({opt.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteGroup(categoryIdx)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-all w-full md:w-auto flex items-center justify-center"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Existing Skills Tags List */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-typo-secondary">Skills Tags in this Category</label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-obsidian-surface/60 border border-obsidian-border min-h-[50px] items-center">
                  {group.items.map((skill, skillIdx) => (
                    <span
                      key={skillIdx}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan flex items-center gap-1.5 group"
                    >
                      <Tag className="w-3 h-3 text-cyan" />
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillTag(categoryIdx, skillIdx)}
                        className="hover:text-rose-400 p-0.5 rounded transition-colors"
                        title={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {group.items.length === 0 && (
                    <span className="text-xs font-mono text-typo-muted">No skill tags added yet.</span>
                  )}
                </div>
              </div>

              {/* Add New Skill Tag to Category Input */}
              <div className="pt-1">
                <label className="block text-xs font-mono text-typo-secondary mb-1">Add New Skill Tag to "{group.category}"</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Docker, TypeScript, GraphQL..."
                    value={newSkillInput[categoryIdx] || ''}
                    onChange={e => setNewSkillInput({ ...newSkillInput, [categoryIdx]: e.target.value })}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkillTag(categoryIdx);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs font-mono text-typo-primary focus:outline-none focus:border-cyan"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkillTag(categoryIdx)}
                    className="px-4 py-2 bg-cyan hover:bg-cyan-dark text-obsidian-base font-mono text-xs font-bold rounded-xl shadow-glow-cyan transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Tag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-sm shadow-glow-cyan transition-all flex items-center gap-2 font-mono"
        >
          <Save className="w-4 h-4 text-obsidian-base" /> Save Technical Skills
        </button>
      </form>

      {/* Modal Form Dialog for Adding New Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Skill Category"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCategorySubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Category Title *</label>
            <input
              type="text"
              required
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="e.g. AI & Data Engineering"
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">Select Category Icon *</label>
            <div className="grid grid-cols-3 gap-2">
              {ICON_OPTIONS.map(opt => {
                const IconComponent = opt.icon;
                const isSelected = newCategoryIcon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setNewCategoryIcon(opt.id)}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col items-center gap-1.5 text-center ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan text-cyan shadow-glow-cyan font-bold'
                        : 'bg-obsidian-surface border-obsidian-border text-typo-secondary hover:border-cyan/40 hover:text-typo-primary'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-cyan" />
                    <span className="text-[10px] font-mono leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Skills Tags (Comma-separated)</label>
            <input
              type="text"
              value={newCategorySkills}
              onChange={e => setNewCategorySkills(e.target.value)}
              placeholder="e.g. PyTorch, TensorFlow, LangChain..."
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs font-mono text-cyan focus:outline-none focus:border-cyan"
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
              Add Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
