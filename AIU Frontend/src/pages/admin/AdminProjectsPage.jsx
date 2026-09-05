import React, { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, ExternalLink, Github, Video, Image, FileText, CheckSquare, UserCheck } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CharCounter, UrlValidator, ImagePreviewCard } from '../../components/common/FormValidationFeedback';
import { generateUniqueSlug } from '../../utils/slugUtils';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { LoadingState } from '../../components/common/LoadingState';
import { FileUpload } from '../../components/common/FileUpload';
import { formatImageUrl } from '../../utils/formValidation';

export function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    problem: '',
    solution: '',
    featuresStr: '',
    myContribution: '',
    technologiesStr: '',
    status: 'PUBLISHED',
    featured: false,
    thumbnail: '',
    videoId: '',
    githubUrl: '',
    liveUrl: '',
    relatedResearchStr: '',
    relatedArticlesStr: ''
  });

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllAdmin();
      setProjects(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      shortDescription: '',
      problem: '',
      solution: '',
      featuresStr: '',
      myContribution: '',
      technologiesStr: 'spring-boot, react, postgresql',
      status: 'PUBLISHED',
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      videoId: '',
      githubUrl: '',
      liveUrl: '',
      relatedResearchStr: '',
      relatedArticlesStr: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingId(proj.id);
    setForm({
      title: proj.title || '',
      slug: proj.slug || '',
      shortDescription: proj.shortDescription || '',
      problem: proj.problem || '',
      solution: proj.solution || '',
      featuresStr: proj.features ? proj.features.join('\n') : '',
      myContribution: proj.myContribution || '',
      technologiesStr: proj.technologies?.join(', ') || '',
      status: proj.status || 'DRAFT',
      featured: !!proj.featured,
      thumbnail: proj.thumbnail || '',
      videoId: proj.videoId || '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      relatedResearchStr: proj.relatedResearch?.join(', ') || '',
      relatedArticlesStr: proj.relatedArticles?.join(', ') || ''
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
      technologies: form.technologiesStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      features: form.featuresStr.split('\n').map(s => s.trim()).filter(Boolean),
      relatedResearch: form.relatedResearchStr.split(',').map(s => s.trim()).filter(Boolean),
      relatedArticles: form.relatedArticlesStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await projectService.update(editingId, payload);
        addToast('Project updated successfully', 'success');
      } else {
        await projectService.create(payload);
        addToast('New project created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleTogglePublish = async (proj) => {
    try {
      await projectService.togglePublish(proj.id, proj.status);
      addToast(`Project status toggled to ${proj.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'}`, 'info');
      fetchProjects();
    } catch (err) {
      addToast('Status update failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await projectService.delete(deleteId);
      addToast('Project deleted successfully', 'success');
      setDeleteId(null);
      fetchProjects();
    } catch (err) {
      addToast('Failed to delete project', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading project management table..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans">Project Management</h1>
          <p className="text-xs text-typo-secondary font-mono">Create, edit, publish, or delete portfolio projects and full detail fields.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Create New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-obsidian-surface text-typo-secondary font-mono uppercase tracking-wider border-b border-obsidian-border">
            <tr>
              <th className="p-4">Project Title</th>
              <th className="p-4">Technologies</th>
              <th className="p-4">Video Walkthrough</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border text-typo-primary">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-obsidian-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-typo-primary">{proj.title}</td>
                <td className="p-4 font-mono text-cyan">{proj.technologies?.join(', ')}</td>
                <td className="p-4 font-mono text-typo-muted">{proj.videoId ? `ID: ${proj.videoId}` : 'No Video'}</td>
                <td className="p-4"><StatusBadge status={proj.status} /></td>
                <td className="p-4">{proj.featured ? <span className="text-cyan font-bold font-mono">Yes</span> : 'No'}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleTogglePublish(proj)}
                    className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-cyan border border-obsidian-border"
                    title={proj.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  >
                    {proj.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-cyan border border-obsidian-border"
                    title="Edit Project Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(proj.id)}
                    className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-rose-400 border border-obsidian-border"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comprehensive Modal Form with ALL Fields */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Project Details' : 'Create New Project'} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({
                    ...form,
                    title: val,
                    slug: generateUniqueSlug(val, projects, editingId)
                  });
                }}
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

          {/* Short Description */}
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Short Description (Card Summary)</label>
            <textarea
              rows={2}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
            <CharCounter text={form.shortDescription} maxLength={250} />
          </div>

          {/* Thumbnail & YouTube Video URL / ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 p-3 rounded-xl bg-obsidian-surface/60 border border-obsidian-border">
              <label className="block text-xs font-mono text-cyan font-bold flex items-center gap-1.5 uppercase">
                <Image className="w-3.5 h-3.5 text-cyan" /> Project Thumbnail Image
              </label>
              
              <FileUpload
                label="Option 1: Upload Image File from Computer"
                accept="image/*"
                maxSizeMB={5}
                onFileSelect={async (file) => {
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setForm(prev => ({ ...prev, thumbnail: reader.result }));
                    addToast(`Selected thumbnail: ${file.name}`, 'info');
                  };
                  reader.readAsDataURL(file);
                }}
              />

              <div>
                <label className="block text-[11px] font-mono text-typo-muted mb-1">Option 2: Or Paste Google Drive / Web Image URL</label>
                <input
                  type="text"
                  value={form.thumbnail && form.thumbnail.startsWith('data:') ? '' : form.thumbnail}
                  onChange={(e) => {
                    const formatted = formatImageUrl(e.target.value);
                    setForm({ ...form, thumbnail: formatted });
                  }}
                  placeholder={form.thumbnail && form.thumbnail.startsWith('data:') ? "[Direct Image File Uploaded from Computer]" : "Paste Google Drive link or web image URL..."}
                  className="w-full px-3 py-2 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
                />
              </div>
              <UrlValidator url={form.thumbnail} />
              <ImagePreviewCard url={form.thumbnail} label="Thumbnail Preview" />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-cyan" /> YouTube Video Link or ID (for Walkthrough Player)
              </label>
              <input
                type="text"
                value={form.videoId}
                onChange={(e) => {
                  const val = e.target.value;
                  const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                  const extracted = match ? match[1] : val;
                  setForm({ ...form, videoId: extracted });
                }}
                placeholder="https://www.youtube.com/watch?v=... or dQw4w9WgXcQ"
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
              />
              {form.videoId && (
                <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden bg-black border border-obsidian-border flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${form.videoId}/hqdefault.jpg`}
                    alt="YouTube Video Walkthrough Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-cyan text-[10px] font-mono font-bold text-obsidian-base">
                    Video Walkthrough Attached
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-indigo mb-1 font-bold">Problem Statement (Indigo Box)</label>
              <textarea
                rows={3}
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                placeholder="Describe the business/technical problem..."
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan mb-1 font-bold">Architecture Solution (Cyan Box)</label>
              <textarea
                rows={3}
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                placeholder="Describe the architecture solution..."
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          {/* Key Engineering Features Checklist */}
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan" /> Key Engineering Features (One per line)
            </label>
            <textarea
              rows={3}
              value={form.featuresStr}
              onChange={(e) => setForm({ ...form, featuresStr: e.target.value })}
              placeholder="Multi-tenant authentication&#10;Supabase RLS database row security&#10;PDF Vector search integration"
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
            />
          </div>

          {/* Individual Contribution */}
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan" /> My Individual Contribution
            </label>
            <textarea
              rows={2}
              value={form.myContribution}
              onChange={(e) => setForm({ ...form, myContribution: e.target.value })}
              placeholder="Architected Spring Boot 3 REST controllers, Supabase PostgreSQL schema, and Next.js frontend components..."
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Technologies Used (comma separated slugs)</label>
            <input
              type="text"
              value={form.technologiesStr}
              onChange={(e) => setForm({ ...form, technologiesStr: e.target.value })}
              placeholder="spring-boot, react, postgresql, docker"
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
            />
          </div>

          {/* GitHub & Live Demo Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-cyan" /> GitHub Repository URL
              </label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-cyan" /> Live Demo URL
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
          </div>

          {/* Connected Knowledge Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo" /> Connected Research IDs (comma separated)
              </label>
              <input
                type="text"
                value={form.relatedResearchStr}
                onChange={(e) => setForm({ ...form, relatedResearchStr: e.target.value })}
                placeholder="res-1, res-2"
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Connected Article IDs (comma separated)
              </label>
              <input
                type="text"
                value={form.relatedArticlesStr}
                onChange={(e) => setForm({ ...form, relatedArticlesStr: e.target.value })}
                placeholder="art-1, art-2"
                className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              />
            </div>
          </div>

          {/* Featured & Status Controls */}
          <div className="flex items-center gap-6 pt-2 border-t border-obsidian-border">
            <label className="flex items-center gap-2 text-xs text-typo-primary cursor-pointer font-mono">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-obsidian-border bg-obsidian-surface text-cyan focus:ring-0"
              />
              <span>Mark as Featured Project</span>
            </label>

            <div className="flex items-center gap-2 font-mono">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-obsidian-surface text-typo-secondary text-xs rounded-xl border border-obsidian-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan"
            >
              {editingId ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
}
