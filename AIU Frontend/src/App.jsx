import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { CollectionPage } from './pages/public/CollectionPage';
import { ResearchPage } from './pages/public/ResearchPage';
import { ResearchDetailPage } from './pages/public/ResearchDetailPage';
import { KnowledgePage } from './pages/public/KnowledgePage';
import { ArticleDetailPage } from './pages/public/ArticleDetailPage';
import { TechnologiesPage } from './pages/public/TechnologiesPage';
import { TechnologyDetailPage } from './pages/public/TechnologyDetailPage';
import { VideosPage } from './pages/public/VideosPage';
import { JourneyPage } from './pages/public/JourneyPage';
import { CvPage } from './pages/public/CvPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminEducationPage } from './pages/admin/AdminEducationPage';
import { AdminAwardsPage } from './pages/admin/AdminAwardsPage';
import { AdminLeadershipPage } from './pages/admin/AdminLeadershipPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminResearchPage } from './pages/admin/AdminResearchPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminTechnologiesPage } from './pages/admin/AdminTechnologiesPage';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import { AdminJourneyPage } from './pages/admin/AdminJourneyPage';
import { AdminCvPage } from './pages/admin/AdminCvPage';
import { AdminFooterPage } from './pages/admin/AdminFooterPage';
import { AdminThemePage } from './pages/admin/AdminThemePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="research/:slug" element={<ResearchDetailPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="knowledge/:slug" element={<ArticleDetailPage />} />
          <Route path="technologies" element={<TechnologiesPage />} />
          <Route path="technologies/:slug" element={<TechnologyDetailPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="journey" element={<JourneyPage />} />
          <Route path="cv" element={<CvPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* ADMIN AUTHENTICATION */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
            <Route path="education" element={<AdminEducationPage />} />
            <Route path="awards" element={<AdminAwardsPage />} />
            <Route path="leadership" element={<AdminLeadershipPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="research" element={<AdminResearchPage />} />
            <Route path="articles" element={<AdminArticlesPage />} />
            <Route path="technologies" element={<AdminTechnologiesPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="journey" element={<AdminJourneyPage />} />
            <Route path="cv" element={<AdminCvPage />} />
            <Route path="footer" element={<AdminFooterPage />} />
            <Route path="theme" element={<AdminThemePage />} />
          </Route>
        </Route>

        {/* CATCH ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
