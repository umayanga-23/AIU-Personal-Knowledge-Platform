import React, { useState, useEffect } from 'react';
import { getStore, updateStore } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import { LayoutTemplate, Save, Github, Linkedin, Youtube, Twitter, ShieldAlert } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';

export function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    brandName: '',
    tagline: '',
    statusText: '',
    statusType: 'OPERATIONAL', // OPERATIONAL (Green), DEGRADED (Yellow), OUTAGE (Red)
    copyrightText: '',
    githubUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    twitterUrl: ''
  });

  useEffect(() => {
    const store = getStore();
    const f = store.footer || {};
    const p = store.profile || {};
    setForm({
      brandName: f.brandName || p.name || 'Induwara Umayanga Alukirthi',
      tagline: f.tagline || 'Personal knowledge platform, research showcase, technical notes, and system engineering profile.',
      statusText: f.statusText || 'All systems operational',
      statusType: f.statusType || 'OPERATIONAL',
      copyrightText: f.copyrightText || `© ${new Date().getFullYear()} Induwara Umayanga Alukirthi. All rights reserved.`,
      githubUrl: f.githubUrl || p.github || 'https://github.com/Rjkl003CR',
      linkedinUrl: f.linkedinUrl || p.linkedin || 'https://www.linkedin.com/in/chamathka-ranathunga-a825922aa',
      youtubeUrl: f.youtubeUrl || p.youtube || 'https://youtube.com',
      twitterUrl: f.twitterUrl || p.twitter || 'https://twitter.com'
    });
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateStore(s => ({
      ...s,
      footer: { ...form }
    }));
    addToast('Footer configuration saved successfully!', 'success');
    setSaving(false);
  };

  if (loading) return <LoadingState message="Loading Footer configuration..." />;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-cyan" /> Footer Manager
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">
            Customize bottom footer brand name, bio tagline, system status pill (Green/Yellow/Red), copyright notice, and social links.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* System Status Control Pill */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-cyan/30">
          <h3 className="text-sm font-bold text-cyan font-mono border-b border-obsidian-border pb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan" /> Live System Status Indicator (Pill Color & Warning Controls)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Status Level & Color *</label>
              <select
                value={form.statusType}
                onChange={(e) => {
                  const val = e.target.value;
                  let defaultText = form.statusText;
                  if (val === 'OPERATIONAL') defaultText = 'All systems operational';
                  if (val === 'DEGRADED') defaultText = 'Partial system degradation / Maintenance';
                  if (val === 'OUTAGE') defaultText = 'Critical system error / Server outage';
                  setForm({ ...form, statusType: val, statusText: defaultText });
                }}
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan font-mono"
              >
                <option value="OPERATIONAL">🟢 OPERATIONAL (Green Pill - Normal Operating)</option>
                <option value="DEGRADED">🟡 DEGRADED / MAINTENANCE (Amber Pill - Warning)</option>
                <option value="OUTAGE">🔴 OUTAGE / ERROR (Red Pill - Critical Warning)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Operational Status Message</label>
              <input
                type="text"
                required
                value={form.statusText}
                onChange={(e) => setForm({ ...form, statusText: e.target.value })}
                placeholder="All systems operational"
                className={`w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs font-mono focus:outline-none ${
                  form.statusType === 'OUTAGE' ? 'text-rose-400 font-bold border-rose-500/40' :
                  form.statusType === 'DEGRADED' ? 'text-amber-400 font-bold border-amber-500/40' :
                  'text-emerald-400 font-bold border-emerald-500/40'
                }`}
              />
            </div>
          </div>

          {/* Live Pill Preview */}
          <div className="p-3 bg-obsidian-base rounded-xl border border-obsidian-border flex items-center justify-between">
            <span className="text-xs font-mono text-typo-secondary">Live Footer Pill Preview:</span>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono ${
              form.statusType === 'OUTAGE' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
              form.statusType === 'DEGRADED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                form.statusType === 'OUTAGE' ? 'bg-rose-400 animate-ping' :
                form.statusType === 'DEGRADED' ? 'bg-amber-400 animate-pulse' :
                'bg-emerald-400 animate-pulse'
              }`} />
              <span>{form.statusText}</span>
            </div>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-cyan font-mono border-b border-obsidian-border pb-3">Brand & Platform Summary</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-sm text-typo-primary focus:outline-none focus:border-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1">Copyright Notice</label>
              <input
                type="text"
                value={form.copyrightText}
                onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary font-mono focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-typo-secondary mb-1">Footer Tagline / Bio</label>
            <textarea
              rows={2}
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary focus:outline-none focus:border-cyan"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-cyan font-mono border-b border-obsidian-border pb-3">Social Media Connections</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-cyan" /> GitHub Profile URL
              </label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary font-mono focus:outline-none focus:border-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-indigo" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary font-mono focus:outline-none focus:border-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-rose-400" /> YouTube Channel URL
              </label>
              <input
                type="url"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary font-mono focus:outline-none focus:border-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-typo-secondary mb-1 flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-cyan" /> Twitter / X Profile URL
              </label>
              <input
                type="url"
                value={form.twitterUrl}
                onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-typo-primary font-mono focus:outline-none focus:border-cyan"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-sm shadow-glow-cyan transition-all flex items-center gap-2 font-mono"
        >
          <Save className="w-4 h-4 text-obsidian-base" />
          {saving ? 'Saving...' : 'Save Footer Settings'}
        </button>
      </form>
    </div>
  );
}
