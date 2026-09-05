import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Palette, ShieldAlert, Menu, X, Terminal, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { apiClient } from '../../services/apiClient';

export function Navbar() {
  const { theme, activeTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => apiClient.isAuthenticated());

  useEffect(() => {
    const syncAuth = () => {
      setIsAdmin(apiClient.isAuthenticated());
    };
    window.addEventListener('aiu_auth_changed', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('aiu_auth_changed', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/#about' },
    { label: 'Skills', path: '/#skills' },
    { label: 'Education', path: '/#education' },
    { label: 'Projects', path: '/projects' },
    { label: 'Research', path: '/research' },
    { label: 'Articles', path: '/knowledge' },
    { label: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) return location.pathname === '/' && location.hash === path.replace('/', '');
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      const hashId = path.replace('/#', '');
      if (location.pathname === '/') {
        e.preventDefault();
        window.history.pushState(null, '', path);
        const elem = document.getElementById(hashId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-obsidian-secondary/90 backdrop-blur-xl border-b border-obsidian-border shadow-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all shadow-glow-cyan">
              <Terminal className="w-5 h-5 text-cyan" />
            </div>
            <div className="flex items-center gap-1.5 font-sans tracking-tight">
              <span className="text-xl font-extrabold text-cyan">AIU</span>
              <span className="text-xl font-bold text-typo-primary">.DEV</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'text-cyan bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-typo-secondary hover:text-typo-primary hover:bg-obsidian-elevated'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan rounded-full shadow-glow-cyan" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle, Admin */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-muted hover:text-cyan hover:border-cyan/30 transition-all flex items-center gap-1.5"
              aria-label="Toggle Theme"
              title={`Active Theme: ${activeTheme?.name || 'Obsidian Neon'}. Click to switch theme!`}
            >
              <Palette className="w-4 h-4 text-cyan" />
            </button>

            {/* Admin Dashboard Badge Button - ONLY VISIBLE WHEN LOGGED IN AS ADMIN */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan text-xs font-mono font-bold transition-all hover:bg-cyan-500/20 shadow-glow-cyan"
                title="Open Admin Dashboard"
              >
                <ShieldAlert className="w-4 h-4 text-cyan" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-primary hover:border-cyan/30 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-obsidian-border bg-obsidian-secondary/95 backdrop-blur-2xl p-4 space-y-2 shadow-2xl transition-all">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    handleNavClick(e, link.path);
                    setMobileOpen(false);
                  }}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-cyan-500/10 text-cyan font-semibold border border-cyan-500/30'
                      : 'text-typo-secondary hover:bg-obsidian-elevated hover:text-typo-primary'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan bg-cyan-500/10 border border-cyan-500/30 mt-3 text-center font-mono"
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
