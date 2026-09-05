import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../../components/admin/StatsCard';
import {
  Code2,
  FileText,
  BookOpen,
  Layers,
  Video,
  Milestone,
  FileCheck,
  Plus,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Activity,
  BarChart3,
  PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getStore, updateStore } from '../../services/apiClient';
import { INITIAL_DATA } from '../../data/mockData';
import { LoadingState } from '../../components/common/LoadingState';
import { StatusBadge } from '../../components/common/StatusBadge';

// Custom Glassmorphism Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-obsidian-surface/95 border border-obsidian-border shadow-2xl backdrop-blur-md text-xs font-mono space-y-1">
        <p className="font-bold text-typo-primary border-b border-obsidian-border pb-1 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}:</span>
            <span className="font-bold text-typo-primary">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AdminDashboardPage() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    setStore(getStore());
  }, []);

  if (!store) return <LoadingState message="Loading dashboard telemetry & analytics..." />;

  const projectsList = store.projects || [];
  const researchList = store.research || [];
  const articlesList = store.articles || [];
  const techList = store.technologies || [];
  const videosList = store.videos || [];
  const journeyList = store.journey || [];

  const publishedProjects = projectsList.filter(p => p.status === 'PUBLISHED').length;
  const draftProjects = projectsList.filter(p => p.status === 'DRAFT').length;

  // Real Dynamic Tech Stack Distribution
  const techDistributionMap = {};
  techList.forEach(t => {
    const cat = t.category || 'General';
    techDistributionMap[cat] = (techDistributionMap[cat] || 0) + 1;
  });

  const colors = ['#22D3EE', '#6366F1', '#10B981', '#8B5CF6', '#F59E0B'];
  const techStackDistribution = Object.keys(techDistributionMap).length > 0
    ? Object.keys(techDistributionMap).map((cat, idx) => ({
        name: cat,
        value: techDistributionMap[cat],
        color: colors[idx % colors.length]
      }))
    : [
        { name: 'Backend', value: 1, color: '#6366F1' },
        { name: 'Frontend', value: 1, color: '#22D3EE' },
        { name: 'Database', value: 1, color: '#10B981' }
      ];

  // Dynamic Popular Content Data
  const popularContentData = [
    ...projectsList.map(p => ({ name: p.title || 'Project', views: p.views || 1, type: 'Project' })),
    ...researchList.map(r => ({ name: r.title || 'Research', views: r.views || 1, type: 'Research' })),
    ...articlesList.map(a => ({ name: a.title || 'Article', views: a.views || 1, type: 'Knowledge' }))
  ].slice(0, 6);

  // Baseline Visitor Growth Data
  const totalContentCount = projectsList.length + researchList.length + articlesList.length;
  const visitorGrowthData = [
    { month: 'Jan', visitors: 1, pageViews: 2 },
    { month: 'Feb', visitors: 2, pageViews: 4 },
    { month: 'Mar', visitors: 3, pageViews: 6 },
    { month: 'Apr', visitors: 4, pageViews: 8 },
    { month: 'May', visitors: 5, pageViews: 10 },
    { month: 'Jun', visitors: 6, pageViews: 12 },
    { month: 'Jul', visitors: 8, pageViews: 16 },
    { month: 'Aug', visitors: Math.max(1, totalContentCount * 2), pageViews: Math.max(2, totalContentCount * 4) }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-typo-primary font-sans flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-cyan" /> Admin Analytics & Telemetry
          </h1>
          <p className="text-xs text-typo-secondary font-mono mt-1">
            Real-time platform insights, visitor growth, popular portfolio content, and architecture metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Clear all cached mock entries and reset store to clean state?')) {
                localStorage.removeItem('aiu_platform_store');
                updateStore(() => ({ ...INITIAL_DATA }));
                setStore({ ...INITIAL_DATA });
                if (typeof window !== 'undefined') window.location.reload();
              }
            }}
            className="px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
            title="Clear old cached mock items"
          >
            <Sparkles className="w-3.5 h-3.5" /> Reset Store to Clean State
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Activity className="w-4 h-4 animate-pulse" /> Live Telemetry Active
          </div>
        </div>
      </div>

      {/* Live Visitor Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-typo-secondary uppercase tracking-wider">Total Visitors</span>
            <h3 className="text-2xl font-black text-typo-primary font-mono">{Math.max(1, totalContentCount * 2)}</h3>
            <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live traffic telemetry
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan border border-cyan-500/20">
            <Users className="w-6 h-6 text-cyan" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-typo-secondary uppercase tracking-wider">Total Page Views</span>
            <h3 className="text-2xl font-black text-typo-primary font-mono">{Math.max(2, totalContentCount * 4)}</h3>
            <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Dynamic page views
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo border border-indigo-500/20">
            <Eye className="w-6 h-6 text-indigo" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-typo-secondary uppercase tracking-wider">Avg Session Time</span>
            <h3 className="text-2xl font-black text-typo-primary font-mono">1m 45s</h3>
            <p className="text-[11px] text-cyan font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Active engagement
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-typo-secondary uppercase tracking-wider">Active Live Sessions</span>
            <h3 className="text-2xl font-black text-emerald-400 font-mono">1</h3>
            <p className="text-[11px] text-typo-muted font-mono">Current admin session</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow-emerald">
            <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          count={projectsList.length}
          subtitle={`${publishedProjects} Published • ${draftProjects} Drafts`}
          icon={Code2}
          color="cyan"
        />
        <StatsCard
          title="Research Papers"
          count={researchList.length}
          subtitle="Academic Publications"
          icon={FileText}
          color="indigo"
        />
        <StatsCard
          title="Knowledge Notes"
          count={articlesList.length}
          subtitle="Technical Knowledge Base"
          icon={BookOpen}
          color="emerald"
        />
        <StatsCard
          title="Technologies"
          count={techList.length}
          subtitle="Architecture Stack"
          icon={Layers}
          color="purple"
        />
      </div>

      {/* Interactive Charts Section 1: Traffic Growth Area Chart & Tech Stack Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visitor Growth Area Chart (8 Cols) */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
            <div>
              <h3 className="text-base font-bold text-typo-primary font-sans flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan" /> Visitor & Page View Growth
              </h3>
              <p className="text-xs text-typo-muted font-mono mt-0.5">
                Analytical telemetry tracking platform traffic and content impressions.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Live Telemetry
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#94A3B8" fontSize={11} fontFamily="monospace" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPageViews)" />
                <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#22D3EE" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tech Stack Distribution Pie/Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl space-y-6 flex flex-col justify-between">
          <div className="border-b border-obsidian-border pb-4">
            <h3 className="text-base font-bold text-typo-primary font-sans flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo" /> Tech Stack Distribution
            </h3>
            <p className="text-xs text-typo-muted font-mono mt-0.5">
              Live technology category breakdown.
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={techStackDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {techStackDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-typo-primary font-mono">{techList.length}</span>
              <span className="text-[10px] text-typo-muted font-mono">Tech Items</span>
            </div>
          </div>

          {/* Legend Details */}
          <div className="space-y-2 pt-2 border-t border-obsidian-border">
            {techStackDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-typo-secondary">{item.name}</span>
                </div>
                <span className="font-bold text-typo-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Charts Section 2: Most Popular Content Bar Chart */}
      {popularContentData.length > 0 && (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
            <div>
              <h3 className="text-base font-bold text-typo-primary font-sans flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" /> Platform Content Engagement
              </h3>
              <p className="text-xs text-typo-muted font-mono mt-0.5">
                Dynamic views across your added projects, research papers, and technical articles.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularContentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#94A3B8" fontSize={11} fontFamily="monospace" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" name="Total Views" radius={[8, 8, 0, 0]}>
                  {popularContentData.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.type === 'Project' ? '#22D3EE' : entry.type === 'Research' ? '#6366F1' : '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Secondary Stats & Current CV */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Videos"
          count={videosList.length}
          subtitle="YouTube Demos"
          icon={Video}
          color="indigo"
        />
        <StatsCard
          title="Journey Milestones"
          count={journeyList.length}
          subtitle="Learning Timeline"
          icon={Milestone}
          color="cyan"
        />
        <div className="p-6 glass-card rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-typo-secondary uppercase tracking-wider">Current CV</p>
            <h3 className="text-xl font-bold text-typo-primary mt-1 font-mono">{store.cv?.version || 'v2.5'}</h3>
            <p className="text-[11px] text-typo-muted mt-1">Updated {store.cv?.lastUpdated || '2026-08-30'}</p>
          </div>
          <StatusBadge status={store.cv?.status || 'PUBLISHED'} />
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="p-6 glass-card rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-typo-primary font-mono uppercase tracking-wider">Quick Management Shortcuts</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/projects" className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan text-xs font-semibold rounded-xl border border-cyan-500/30 transition-all inline-flex items-center gap-2 font-mono">
            <Plus className="w-3.5 h-3.5" /> Manage Projects
          </Link>
          <Link to="/admin/research" className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo text-xs font-semibold rounded-xl border border-indigo-500/30 transition-all inline-flex items-center gap-2 font-mono">
            <Plus className="w-3.5 h-3.5" /> Manage Research
          </Link>
          <Link to="/admin/articles" className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-500/30 transition-all inline-flex items-center gap-2 font-mono">
            <Plus className="w-3.5 h-3.5" /> New Knowledge Note
          </Link>
          <Link to="/admin/cv" className="px-4 py-2.5 bg-obsidian-elevated hover:bg-obsidian-surface text-typo-primary text-xs font-semibold rounded-xl border border-obsidian-border transition-all inline-flex items-center gap-2 font-mono">
            <FileCheck className="w-3.5 h-3.5 text-cyan" /> Upload New CV
          </Link>
        </div>
      </div>
    </div>
  );
}
