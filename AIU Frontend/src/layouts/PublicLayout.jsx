import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { analyticsService } from '../services/analyticsService';

export function PublicLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Record public page visit into live Supabase Analytics
    analyticsService.recordVisit(pathname);
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-base text-typo-primary selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
