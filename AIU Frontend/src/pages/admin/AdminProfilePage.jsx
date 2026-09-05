import React, { useState, useEffect } from 'react';
import { getStore, updateStore } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { Save, User, Mail, Phone, MapPin, Github, Linkedin, Camera, Image } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { FileUpload } from '../../components/common/FileUpload';
import { ImagePreviewCard } from '../../components/common/FormValidationFeedback';
import { formatImageUrl } from '../../utils/formValidation';

export function AdminProfilePage() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const store = getStore();
    setFormData(store.profile || {});
    setLoading(false);
  }, []);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageFileSelect = async (file) => {
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, profileImage: base64 }));
      addToast(`Selected profile photo: ${file.name}`, 'info');
    } catch (e) {
      addToast('Failed to process image file', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      profileImage: formatImageUrl(formData.profileImage)
    };
    updateStore(s => ({
      ...s,
      profile: { ...s.profile, ...formattedData }
    }));
    setFormData(formattedData);
    addToast('Profile & About Me details updated successfully!', 'success');
  };

  if (loading || !formData) return <LoadingState message="Loading Profile Data..." />;

  const activeImageUrl = formatImageUrl(formData.profileImage);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-typo-primary flex items-center gap-2 font-sans">
          <User className="w-6 h-6 text-cyan" /> Edit Profile & About Me Details
        </h1>
        <p className="text-xs text-typo-secondary font-mono mt-1">
          Update Induwara Umayanga Alukirthi's personal identity, bio, contact details, and profile photo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6">
        {/* Profile Image Section with Live Preview & Google Drive Auto-Format */}
        <div className="p-6 rounded-2xl bg-obsidian-surface border border-obsidian-border space-y-4">
          <label className="block text-xs font-mono text-cyan font-bold uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan" /> Profile Photo Management
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Live Image Preview Thumbnail */}
            <div className="sm:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan/40 shadow-glow-cyan bg-obsidian-base">
                <img
                  src={activeImageUrl || "/induwara-profile.png"}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/induwara-profile.png";
                  }}
                />
              </div>
              <span className="text-[11px] font-mono text-typo-muted mt-2">Active Photo Preview</span>
            </div>

            {/* Inputs: Local Upload & URL Input */}
            <div className="sm:col-span-8 space-y-4">
              <div>
                <FileUpload
                  label="Option 1: Upload Photo from Computer"
                  accept="image/*"
                  maxSizeMB={5}
                  onFileSelect={handleImageFileSelect}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-typo-secondary mb-1">Option 2: Or Paste Google Drive / Web Image URL</label>
                <input
                  type="text"
                  value={formData.profileImage && formData.profileImage.startsWith('data:') ? '' : (formData.profileImage || '')}
                  onChange={e => {
                    const rawVal = e.target.value;
                    const formatted = formatImageUrl(rawVal);
                    setFormData({ ...formData, profileImage: formatted });
                  }}
                  placeholder={formData.profileImage && formData.profileImage.startsWith('data:') ? "[Direct Photo File Uploaded from Computer]" : "Paste Google Drive link or image URL..."}
                  className="w-full px-4 py-2 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs font-mono text-cyan focus:outline-none focus:border-cyan"
                />
                <p className="text-[10px] font-mono text-typo-muted mt-1">
                  💡 Google Drive links (e.g. <span className="text-cyan">https://drive.google.com/file/d/...</span>) auto-format to direct image streams!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">Role / Headline Title *</label>
            <input
              type="text"
              required
              value={formData.role || ''}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-typo-secondary mb-2">Tagline Sub-header</label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={e => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-typo-secondary mb-2">Hero Sub-description (Homepage Header Summary)</label>
          <textarea
            rows="2"
            placeholder="BSc (Hons) in Information Technology Undergraduate at University of Moratuwa. Translating complex business problems..."
            value={formData.heroDescription || ''}
            onChange={e => setFormData({ ...formData, heroDescription: e.target.value })}
            className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-typo-secondary mb-2">Bio & About Paragraphs</label>
          <textarea
            rows="5"
            value={formData.bio || ''}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">Phone Number</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">Location</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.github || ''}
              onChange={e => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin || ''}
              onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-indigo text-slate-950 font-extrabold text-sm shadow-glow-cyan transition-all flex items-center gap-2 font-mono"
        >
          <Save className="w-4 h-4 text-slate-950" /> Save Profile Details
        </button>
      </form>
    </div>
  );
}
