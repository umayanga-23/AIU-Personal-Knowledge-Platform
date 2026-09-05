import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Wrench, GraduationCap, Award, Users, Code2, FileText, BookOpen, Layers, Video, Milestone, FileCheck, LayoutTemplate, Palette, LogOut, Terminal } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profile & About', path: '/admin/profile', icon: User },
    { label: 'Technical Skills', path: '/admin/skills', icon: Wrench },
    { label: 'Education Path', path: '/admin/education', icon: GraduationCap },
    { label: 'Certifications & Awards', path: '/admin/awards', icon: Award },
    { label: 'Leadership', path: '/admin/leadership', icon: Users },
    { label: 'Projects', path: '/admin/projects', icon: Code2 },
    { label: 'Research Papers', path: '/admin/research', icon: FileText },
    { label: 'Technical Articles', path: '/admin/articles', icon: BookOpen },
    { label: 'Technologies', path: '/admin/technologies', icon: Layers },
    { label: 'Learning Journey', path: '/admin/journey', icon: Milestone },
    { label: 'CV Manager', path: '/admin/cv', icon: FileCheck },
    { label: 'Footer Manager', path: '/admin/footer', icon: LayoutTemplate },
    { label: 'Theme Studio', path: '/admin/theme', icon: Palette },
  ];

  const handleLogout = () => {
    authService.logout();
    addToast('Logged out successfully', 'info');
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-obsidian-secondary/90 border-r border-obsidian-border min-h-screen flex flex-col backdrop-blur-xl">
      {/* Admin Brand */}
      <div className="p-6 border-b border-obsidian-border">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20 group-hover:scale-105 transition-transform shadow-glow-cyan">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-typo-primary tracking-tight group-hover:text-cyan transition-colors">Admin Portal</h2>
            <p className="text-[10px] font-mono text-cyan">Knowledge Control Center</p>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-cyan-500/10 text-cyan border border-cyan-500/30 shadow-glow-cyan'
                  : 'text-typo-muted hover:text-typo-primary hover:bg-obsidian-elevated'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer & Logout */}
      <div className="p-4 border-t border-obsidian-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold font-mono transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
