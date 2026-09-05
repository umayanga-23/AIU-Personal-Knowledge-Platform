import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

export function AdminLayout() {
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.includes('profile')) return 'Profile & About Me Management';
    if (path.includes('skills')) return 'Technical Skills Management';
    if (path.includes('education')) return 'Education Path Management';
    if (path.includes('awards')) return 'Certifications & Awards Management';
    if (path.includes('leadership')) return 'Leadership Experience Management';
    if (path.includes('projects')) return 'Projects Management';
    if (path.includes('research')) return 'Research Papers Management';
    if (path.includes('articles')) return 'Technical Articles Management';
    if (path.includes('technologies')) return 'Technology Matrix Management';
    if (path.includes('videos')) return 'YouTube Video Management';
    if (path.includes('journey')) return 'Learning Journey Management';
    if (path.includes('cv')) return 'CV Management';
    if (path.includes('footer')) return 'Footer Management';
    if (path.includes('theme')) return 'Theme Studio & Customizer';
    return 'Dashboard Telemetry';
  };

  return (
    <div className="flex min-h-screen bg-obsidian-base text-typo-primary selection:bg-cyan-500/30 selection:text-cyan-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={getPageTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
