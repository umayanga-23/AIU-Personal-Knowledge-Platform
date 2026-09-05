import React, { useEffect, useState } from 'react';
import { videoService } from '../../services/videoService';
import { Plus, Edit2, Trash2, Youtube } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { LoadingState } from '../../components/common/LoadingState';

export function AdminVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    publishDate: '',
    relatedProject: ''
  });

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await videoService.getAllAdmin();
      setVideos(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      youtubeUrl: '',
      description: '',
      publishDate: new Date().toISOString().split('T')[0],
      relatedProject: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingId(v.id);
    setForm({
      title: v.title || '',
      youtubeUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
      description: v.description || '',
      publishDate: v.publishDate || '',
      relatedProject: v.relatedProject || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.youtubeUrl) {
      addToast('Title and YouTube URL are required', 'error');
      return;
    }

    try {
      if (editingId) {
        await videoService.update(editingId, form);
        addToast('Video record updated successfully', 'success');
      } else {
        await videoService.create(form);
        addToast('YouTube video added successfully', 'success');
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await videoService.delete(deleteId);
      addToast('Video deleted successfully', 'success');
      setDeleteId(null);
      fetchVideos();
    } catch (err) {
      addToast('Failed to delete video', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading video manager..." />;

  const extractedId = videoService.extractYouTubeId(form.youtubeUrl);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans">YouTube Video Management</h1>
          <p className="text-xs text-typo-secondary font-mono">Manage project walkthrough videos and video embeds for Induwara's portfolio.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add YouTube Video
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-obsidian-surface text-typo-secondary font-mono uppercase tracking-wider border-b border-obsidian-border">
            <tr>
              <th className="p-4">Video Title</th>
              <th className="p-4">YouTube ID</th>
              <th className="p-4">Publish Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border text-typo-primary">
            {videos.map((vid) => (
              <tr key={vid.id} className="hover:bg-obsidian-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-typo-primary flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-cyan flex-shrink-0" /> {vid.title}
                </td>
                <td className="p-4 font-mono text-cyan">{vid.youtubeId}</td>
                <td className="p-4 font-mono text-typo-secondary">{vid.publishDate}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(vid)} className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-cyan border border-obsidian-border">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(vid.id)} className="p-2 rounded-xl bg-obsidian-surface text-typo-secondary hover:text-rose-400 border border-obsidian-border">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Video' : 'Add YouTube Video'} maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Video Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">YouTube Video Link or ID *</label>
            <input
              type="text"
              required
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-cyan font-mono focus:outline-none focus:border-cyan"
            />
            {extractedId && (
              <p className="text-[11px] font-mono text-cyan mt-1">Extracted Video ID: {extractedId}</p>
            )}
          </div>

          {extractedId && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-obsidian-base border border-obsidian-border">
              <img
                src={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-cyan text-[10px] font-bold text-obsidian-base font-mono">Preview</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-border font-mono">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-obsidian-surface text-typo-secondary text-xs rounded-xl border border-obsidian-border">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan">
              {editingId ? 'Save Changes' : 'Add Video'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Video"
        message="Are you sure you want to remove this video?"
        loading={deleteLoading}
      />
    </div>
  );
}
