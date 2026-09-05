import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

export function FilterBar({
  categories = [],
  selectedCategory,
  onCategoryChange,
  sortOptions = [],
  sortBy,
  onSortChange,
  technologies = [],
  selectedTech,
  onTechChange
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          onClick={() => onCategoryChange('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Technology & Sorting Options */}
      <div className="flex items-center gap-3">
        {technologies.length > 0 && (
          <select
            value={selectedTech}
            onChange={(e) => onTechChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/70 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Technologies</option>
            {technologies.map(t => (
              <option key={t.id || t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
        )}

        {sortOptions.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-200"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
