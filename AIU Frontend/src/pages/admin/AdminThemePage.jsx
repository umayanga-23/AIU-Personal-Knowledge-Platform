import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastContext';
import { Palette, Type, Check, Save, RotateCcw, Sparkles, Eye, Sun, Moon, Monitor, SunMoon } from 'lucide-react';
import { DARK_THEMES, LIGHT_THEMES, EXISTING_FONT_PRESETS, NEW_FONT_PRESETS } from '../../theme/themeConfig';

export function AdminThemePage() {
  const {
    activeTheme,
    activeFont,
    savedTheme,
    savedFont,
    previewThemeId,
    previewFontId,
    previewAppearance,
    savedAppearance,
    hasUnsavedChanges,
    setPreviewTheme,
    setPreviewFont,
    setPreviewAppearance,
    saveThemeChanges,
    resetPreviewTheme
  } = useTheme();

  const { addToast } = useToast();

  const handleSave = () => {
    saveThemeChanges();
    addToast('Global theme, typography, and appearance configuration saved successfully!', 'success');
  };

  const handleReset = () => {
    resetPreviewTheme();
    addToast('Preview reset to saved configuration.', 'info');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 font-sans">
      {/* Header & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans flex items-center gap-2.5">
            <Palette className="w-7 h-7 text-cyan" /> Global Theme Engine & Studio
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">
            Centralized Theme Engine: Customize color palette presets, appearance mode (Dark/Light/System), typography fonts, and live preview across the platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary hover:text-typo-primary text-xs font-mono transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Preview
            </button>
          )}

          <button
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl text-obsidian-base font-bold text-xs font-mono transition-all flex items-center gap-2 ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-cyan to-indigo shadow-glow-cyan animate-pulse'
                : 'bg-cyan hover:bg-cyan-dark shadow-glow-cyan'
            }`}
          >
            <Save className="w-4 h-4 text-obsidian-base" />
            {hasUnsavedChanges ? 'Save Changes *' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Live Preview Alert Banner */}
      {hasUnsavedChanges ? (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan text-xs font-mono flex items-center justify-between shadow-glow-cyan">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-cyan animate-bounce" />
            <span>
              <strong>LIVE PREVIEW ACTIVE:</strong> Theme <code className="px-1.5 py-0.5 rounded bg-cyan/20">{activeTheme.name}</code> • Mode <code className="px-1.5 py-0.5 rounded bg-cyan/20 uppercase">{previewAppearance}</code> • Font <code className="px-1.5 py-0.5 rounded bg-cyan/20">{activeFont.name}</code>. Click <strong>Save Changes</strong> to apply globally.
            </span>
          </div>
          <button onClick={handleReset} className="underline text-[11px] hover:text-white">Discard</button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-obsidian-surface/60 border border-obsidian-border text-typo-secondary text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>
              Active Saved Theme: <strong className="text-typo-primary">{savedTheme.name}</strong> • Appearance: <strong className="text-typo-primary uppercase">{savedAppearance}</strong> • Font Preset: <strong className="text-typo-primary">{savedFont.name}</strong>
            </span>
          </div>
        </div>
      )}

      {/* 1. Appearance Mode Selector (Dark, Light, System) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-typo-primary flex items-center gap-2">
          <SunMoon className="w-5 h-5 text-amber-400" /> 1. Select Appearance Mode
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setPreviewAppearance('dark')}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between font-mono text-xs ${
              previewAppearance === 'dark'
                ? 'bg-obsidian-elevated border-cyan text-cyan shadow-glow-cyan ring-1 ring-cyan'
                : 'bg-obsidian-surface border-obsidian-border text-typo-secondary hover:text-typo-primary hover:border-obsidian-borderHover'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-cyan" />
              <div className="text-left">
                <div className="font-bold">Dark Mode</div>
                <div className="text-[10px] text-typo-muted font-sans">Obsidian Dark Cyberpunk Aesthetic</div>
              </div>
            </div>
            {previewAppearance === 'dark' && <Check className="w-4 h-4 text-cyan" />}
          </button>

          <button
            onClick={() => setPreviewAppearance('light')}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between font-mono text-xs ${
              previewAppearance === 'light'
                ? 'bg-obsidian-elevated border-cyan text-cyan shadow-glow-cyan ring-1 ring-cyan'
                : 'bg-obsidian-surface border-obsidian-border text-typo-secondary hover:text-typo-primary hover:border-obsidian-borderHover'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="font-bold">Light Mode</div>
                <div className="text-[10px] text-typo-muted font-sans">Clean Glass Minimal Light Themes</div>
              </div>
            </div>
            {previewAppearance === 'light' && <Check className="w-4 h-4 text-cyan" />}
          </button>

          <button
            onClick={() => setPreviewAppearance('system')}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between font-mono text-xs ${
              previewAppearance === 'system'
                ? 'bg-obsidian-elevated border-cyan text-cyan shadow-glow-cyan ring-1 ring-cyan'
                : 'bg-obsidian-surface border-obsidian-border text-typo-secondary hover:text-typo-primary hover:border-obsidian-borderHover'
            }`}
          >
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <div className="font-bold">System Preference</div>
                <div className="text-[10px] text-typo-muted font-sans">Follows Operating System Color Scheme</div>
              </div>
            </div>
            {previewAppearance === 'system' && <Check className="w-4 h-4 text-cyan" />}
          </button>
        </div>
      </div>

      {/* 2. Light Color Themes Section */}
      <div className="space-y-6 pt-6 border-t border-obsidian-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-typo-primary flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" /> 2. New Light Color Themes (5 Presets)
          </h2>
          <span className="text-xs font-mono text-typo-muted">Light themes for clean modern presentation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LIGHT_THEMES.map((theme) => {
            const isSelected = previewThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setPreviewTheme(theme.id)}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-obsidian-elevated border-cyan shadow-glow-cyan ring-1 ring-cyan'
                    : 'bg-obsidian-surface hover:bg-obsidian-elevated border-obsidian-border hover:border-obsidian-borderHover'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-typo-primary font-sans flex items-center gap-2">
                      {theme.name}
                    </h3>
                    <p className="text-[11px] text-typo-muted mt-0.5">{theme.description}</p>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-cyan text-obsidian-base shadow-glow-cyan shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 py-2">
                  <div className="w-6 h-6 rounded-lg border border-black/10 shadow-sm" style={{ backgroundColor: theme.accent.primary }} title={`Primary Accent: ${theme.accent.primary}`} />
                  <div className="w-6 h-6 rounded-lg border border-black/10 shadow-sm" style={{ backgroundColor: theme.accent.secondary }} title={`Secondary Accent: ${theme.accent.secondary}`} />
                  <div className="w-6 h-6 rounded-lg border border-black/10 shadow-sm" style={{ backgroundColor: theme.background.surface }} title={`Surface: ${theme.background.surface}`} />
                  <div className="w-6 h-6 rounded-lg border border-black/10 shadow-sm" style={{ backgroundColor: theme.background.base }} title={`Base: ${theme.background.base}`} />
                </div>

                {/* Miniature UI Card Preview */}
                <div
                  className="mt-3 p-3 rounded-xl border text-[11px] font-sans space-y-2 transition-all"
                  style={{
                    backgroundColor: theme.background.surface,
                    borderColor: theme.border.default
                  }}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
                    <span className="font-bold text-xs" style={{ color: theme.accent.primary }}>
                      AIU.DEV
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold"
                      style={{ backgroundColor: `${theme.accent.primary}20`, color: theme.accent.primary }}
                    >
                      Light Preset
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: theme.accent.primary }} />
                  <div className="h-1.5 rounded-full w-1/2 opacity-60" style={{ backgroundColor: theme.accent.secondary }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Existing Dark Color Themes Section */}
      <div className="space-y-6 pt-6 border-t border-obsidian-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-typo-primary flex items-center gap-2">
            <Moon className="w-5 h-5 text-cyan" /> 3. Existing Dark Color Themes (10 Presets)
          </h2>
          <span className="text-xs font-mono text-typo-muted">Obsidian Cyberpunk & Dark Glass Presets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DARK_THEMES.map((theme) => {
            const isSelected = previewThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setPreviewTheme(theme.id)}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-obsidian-elevated border-cyan shadow-glow-cyan ring-1 ring-cyan'
                    : 'bg-obsidian-surface hover:bg-obsidian-elevated border-obsidian-border hover:border-obsidian-borderHover'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-typo-primary font-sans flex items-center gap-2">
                      {theme.name}
                    </h3>
                    <p className="text-[11px] text-typo-muted mt-0.5">{theme.description}</p>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-cyan text-obsidian-base shadow-glow-cyan shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 py-2">
                  <div className="w-6 h-6 rounded-lg border border-white/10 shadow-sm" style={{ backgroundColor: theme.accent.primary }} title={`Primary Accent: ${theme.accent.primary}`} />
                  <div className="w-6 h-6 rounded-lg border border-white/10 shadow-sm" style={{ backgroundColor: theme.accent.secondary }} title={`Secondary Accent: ${theme.accent.secondary}`} />
                  <div className="w-6 h-6 rounded-lg border border-white/10 shadow-sm" style={{ backgroundColor: theme.background.surface }} title={`Surface: ${theme.background.surface}`} />
                  <div className="w-6 h-6 rounded-lg border border-white/10 shadow-sm" style={{ backgroundColor: theme.background.base }} title={`Base: ${theme.background.base}`} />
                </div>

                {/* Miniature UI Card Preview */}
                <div
                  className="mt-3 p-3 rounded-xl border text-[11px] font-sans space-y-2 transition-all"
                  style={{
                    backgroundColor: theme.background.surface,
                    borderColor: theme.border.default
                  }}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="font-bold text-xs" style={{ color: theme.accent.primary }}>
                      AIU.DEV
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold"
                      style={{ backgroundColor: `${theme.accent.primary}20`, color: theme.accent.primary }}
                    >
                      Dark Preset
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: theme.accent.primary }} />
                  <div className="h-1.5 rounded-full w-1/2 opacity-60" style={{ backgroundColor: theme.accent.secondary }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Typography Presets Section (Existing & New) */}
      <div className="space-y-8 pt-6 border-t border-obsidian-border">
        {/* Existing Fonts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-typo-primary flex items-center gap-2">
              <Type className="w-5 h-5 text-indigo-400" /> 4. Existing Typography Presets (5 Presets)
            </h2>
            <span className="text-xs font-mono text-typo-muted font-normal">Original Developer & Minimal Typography</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXISTING_FONT_PRESETS.map((font) => {
              const isSelected = previewFontId === font.id;
              return (
                <div
                  key={font.id}
                  onClick={() => setPreviewFont(font.id)}
                  className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-obsidian-elevated border-cyan shadow-glow-cyan ring-1 ring-cyan'
                      : 'bg-obsidian-surface hover:bg-obsidian-elevated border-obsidian-border hover:border-obsidian-borderHover'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-2xl font-black text-cyan" style={{ fontFamily: font.heading }}>
                        Aa
                      </span>
                      <h3 className="text-sm font-bold text-typo-primary mt-1 font-sans">
                        {font.name}
                      </h3>
                      <p className="text-[11px] font-mono text-typo-muted mt-0.5">{font.description}</p>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-cyan text-obsidian-base shadow-glow-cyan shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 p-3.5 rounded-xl bg-obsidian-base border border-obsidian-border space-y-2">
                    <p className="text-xs font-bold text-typo-primary" style={{ fontFamily: font.heading }}>
                      Architecting Enterprise Systems
                    </p>
                    <p className="text-[11px] text-typo-secondary leading-relaxed" style={{ fontFamily: font.body }}>
                      Induwara Umayanga Alukirthi • Full-Stack Software Engineering
                    </p>
                    <div className="pt-1.5 border-t border-obsidian-border">
                      <code className="text-[10px] text-cyan font-mono" style={{ fontFamily: font.mono }}>
                        #spring-boot #react #aiu-platform
                      </code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Font Presets */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-typo-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan" /> 5. New Typography Presets (8 Presets)
            </h3>
            <span className="text-xs font-mono text-typo-muted">Inter, Sora, Manrope, Syne, Orbitron & IBM Plex</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEW_FONT_PRESETS.map((font) => {
              const isSelected = previewFontId === font.id;
              return (
                <div
                  key={font.id}
                  onClick={() => setPreviewFont(font.id)}
                  className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-obsidian-elevated border-cyan shadow-glow-cyan ring-1 ring-cyan'
                      : 'bg-obsidian-surface hover:bg-obsidian-elevated border-obsidian-border hover:border-obsidian-borderHover'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-2xl font-black text-cyan" style={{ fontFamily: font.heading }}>
                        Aa
                      </span>
                      <h3 className="text-sm font-bold text-typo-primary mt-1 font-sans">
                        {font.name}
                      </h3>
                      <p className="text-[11px] font-mono text-typo-muted mt-0.5">{font.description}</p>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-cyan text-obsidian-base shadow-glow-cyan shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 p-3.5 rounded-xl bg-obsidian-base border border-obsidian-border space-y-2">
                    <p className="text-xs font-bold text-typo-primary" style={{ fontFamily: font.heading }}>
                      Building Next-Gen Intelligence
                    </p>
                    <p className="text-[11px] text-typo-secondary leading-relaxed" style={{ fontFamily: font.body }}>
                      Creating modern software solutions with clean architecture.
                    </p>
                    <div className="pt-1.5 border-t border-obsidian-border">
                      <code className="text-[10px] text-cyan font-mono" style={{ fontFamily: font.mono }}>
                        system.predict(input) // 200 OK
                      </code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
