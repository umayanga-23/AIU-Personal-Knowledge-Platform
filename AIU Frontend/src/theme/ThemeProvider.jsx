import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  COLOR_THEMES,
  DARK_THEMES,
  LIGHT_THEMES,
  FONT_PRESETS,
  DEFAULT_THEME_ID,
  DEFAULT_FONT_ID,
  DEFAULT_APPEARANCE,
  getThemeById,
  getFontById
} from './themeConfig';
import { getStore, updateStore } from '../services/apiClient';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [savedThemeId, setSavedThemeId] = useState(DEFAULT_THEME_ID);
  const [savedFontId, setSavedFontId] = useState(DEFAULT_FONT_ID);
  const [savedAppearance, setSavedAppearance] = useState(DEFAULT_APPEARANCE);

  const [previewThemeId, setPreviewThemeId] = useState(DEFAULT_THEME_ID);
  const [previewFontId, setPreviewFontId] = useState(DEFAULT_FONT_ID);
  const [previewAppearance, setPreviewAppearance] = useState(DEFAULT_APPEARANCE);

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // System theme preference listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync saved theme configuration from store/localStorage
  const syncFromStore = () => {
    const store = getStore();
    const themeData = store.theme || {};
    const tId = themeData.themeId || DEFAULT_THEME_ID;
    const fId = themeData.fontPresetId || DEFAULT_FONT_ID;
    const app = themeData.appearance || DEFAULT_APPEARANCE;

    setSavedThemeId(tId);
    setSavedFontId(fId);
    setSavedAppearance(app);

    setPreviewThemeId(tId);
    setPreviewFontId(fId);
    setPreviewAppearance(app);
  };

  useEffect(() => {
    syncFromStore();
    window.addEventListener('aiu_store_updated', syncFromStore);
    window.addEventListener('storage', syncFromStore);
    return () => {
      window.removeEventListener('aiu_store_updated', syncFromStore);
      window.removeEventListener('storage', syncFromStore);
    };
  }, []);

  const activeTheme = getThemeById(previewThemeId);
  const activeFont = getFontById(previewFontId);

  const savedTheme = getThemeById(savedThemeId);
  const savedFont = getFontById(savedFontId);

  const hasUnsavedChanges =
    previewThemeId !== savedThemeId ||
    previewFontId !== savedFontId ||
    previewAppearance !== savedAppearance;

  // Determine effective theme mode (dark vs light)
  const isDarkEffective = (() => {
    if (previewAppearance === 'dark') return true;
    if (previewAppearance === 'light') return false;
    // 'system'
    return systemPrefersDark;
  })();

  // Apply CSS Variables dynamically to :root element
  useEffect(() => {
    const root = document.documentElement;

    // Toggle html class
    if (isDarkEffective) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Background colors
    root.style.setProperty('--color-bg-base', activeTheme.background.base);
    root.style.setProperty('--color-bg-secondary', activeTheme.background.secondary);
    root.style.setProperty('--color-surface', activeTheme.background.surface);
    root.style.setProperty('--color-elevated', activeTheme.background.elevated);

    // Borders
    root.style.setProperty('--color-border', activeTheme.border.default);
    root.style.setProperty('--color-border-hover', activeTheme.border.hover);

    // Accents
    root.style.setProperty('--color-primary', activeTheme.accent.primary);
    root.style.setProperty('--color-primary-dark', activeTheme.accent.primaryDark);
    root.style.setProperty('--color-secondary', activeTheme.accent.secondary);
    root.style.setProperty('--color-tertiary', activeTheme.accent.tertiary);

    // Semantics
    root.style.setProperty('--color-success', activeTheme.semantic.success);
    root.style.setProperty('--color-warning', activeTheme.semantic.warning);
    root.style.setProperty('--color-danger', activeTheme.semantic.danger);

    // Text Colors
    const textColors = activeTheme.text || (activeTheme.mode === 'light' ? {
      primary: '#0F172A',
      secondary: '#334155',
      muted: '#64748B',
      veryMuted: '#94A3B8'
    } : {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      muted: '#94A3B8',
      veryMuted: '#64748B'
    });

    root.style.setProperty('--color-text-primary', textColors.primary);
    root.style.setProperty('--color-text-secondary', textColors.secondary);
    root.style.setProperty('--color-text-muted', textColors.muted);
    root.style.setProperty('--color-text-very-muted', textColors.veryMuted);

    // Gradients & Glows
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${activeTheme.gradient.primary} 0%, ${activeTheme.gradient.secondary} 100%)`);
    root.style.setProperty('--glow-primary', activeTheme.glow.primary);
    root.style.setProperty('--glow-secondary', activeTheme.glow.secondary);

    // Fonts
    root.style.setProperty('--font-heading', activeFont.heading);
    root.style.setProperty('--font-body', activeFont.body);
    root.style.setProperty('--font-mono', activeFont.mono);

  }, [activeTheme, activeFont, isDarkEffective]);

  const setPreviewTheme = (themeId) => {
    setPreviewThemeId(themeId);
    const targetTheme = getThemeById(themeId);
    if (targetTheme.mode === 'light') {
      setPreviewAppearance('light');
    } else if (targetTheme.mode === 'dark' || !targetTheme.mode) {
      if (previewAppearance === 'light') {
        setPreviewAppearance('dark');
      }
    }
  };

  const setPreviewFont = (fontId) => {
    setPreviewFontId(fontId);
  };

  const setPreviewAppearanceMode = (appMode) => {
    setPreviewAppearance(appMode);
    if (appMode === 'light' && activeTheme.mode !== 'light') {
      const defaultLight = LIGHT_THEMES[0] || activeTheme;
      setPreviewThemeId(defaultLight.id);
    } else if (appMode === 'dark' && activeTheme.mode === 'light') {
      const defaultDark = DARK_THEMES[0] || activeTheme;
      setPreviewThemeId(defaultDark.id);
    }
  };

  const saveThemeChanges = () => {
    setSavedThemeId(previewThemeId);
    setSavedFontId(previewFontId);
    setSavedAppearance(previewAppearance);

    updateStore(s => ({
      ...s,
      theme: {
        themeId: previewThemeId,
        fontPresetId: previewFontId,
        appearance: previewAppearance,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const resetPreviewTheme = () => {
    setPreviewThemeId(savedThemeId);
    setPreviewFontId(savedFontId);
    setPreviewAppearance(savedAppearance);
  };

  const toggleTheme = () => {
    const currentIndex = COLOR_THEMES.findIndex(t => t.id === previewThemeId);
    const nextIndex = (currentIndex + 1) % COLOR_THEMES.length;
    const nextThemeId = COLOR_THEMES[nextIndex].id;
    const nextTheme = COLOR_THEMES[nextIndex];

    const nextApp = nextTheme.mode === 'light' ? 'light' : 'dark';

    setPreviewThemeId(nextThemeId);
    setSavedThemeId(nextThemeId);
    setPreviewAppearance(nextApp);
    setSavedAppearance(nextApp);

    updateStore(s => ({
      ...s,
      theme: {
        ...(s.theme || {}),
        themeId: nextThemeId,
        fontPresetId: previewFontId,
        appearance: nextApp,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const value = {
    theme: previewThemeId,
    toggleTheme,
    colorThemes: COLOR_THEMES,
    darkThemes: DARK_THEMES,
    lightThemes: LIGHT_THEMES,
    fontPresets: FONT_PRESETS,
    activeTheme,
    activeFont,
    savedTheme,
    savedFont,
    appearance: previewAppearance,
    savedAppearance,
    previewThemeId,
    previewFontId,
    previewAppearance,
    hasUnsavedChanges,
    setPreviewTheme,
    setPreviewFont,
    setPreviewAppearance: setPreviewAppearanceMode,
    saveThemeChanges,
    resetPreviewTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
