import React, { useState } from 'react';
import { 
  TrendingUp, 
  Table as TableIcon, 
  BarChart3, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Award,
  Layers,
  Info
} from 'lucide-react';
import type { ScholarStats, ThemeMode } from '../types';
import { useTheme } from '../utils/useTheme';

interface HeroCitationTrajectoryProps {
  scholarStats: ScholarStats;
  theme?: ThemeMode;
  onNavigateToResearch?: () => void;
}

export const HeroCitationTrajectory: React.FC<HeroCitationTrajectoryProps> = ({
  scholarStats,
  theme: propTheme,
  onNavigateToResearch
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'split'>('chart');

  // Use yearlyPublications or yearlyCitations from scholarStats
  const rawData = (scholarStats.yearlyPublications && scholarStats.yearlyPublications.length > 0)
    ? scholarStats.yearlyPublications
    : (scholarStats.yearlyCitations && scholarStats.yearlyCitations.length > 0)
      ? scholarStats.yearlyCitations
      : [
          { year: 2023, count: 1 },
          { year: 2024, count: 4 },
          { year: 2025, count: 10 },
          { year: 2026, count: 6 }
        ];

  // Enrich data with cumulative sum and YoY growth percent
  let runningTotal = 0;
  const yearlyData = rawData.map((d: any, idx: number, arr: any[]) => {
    const currCount = Number(d.count) || 0;
    runningTotal += currCount;
    const prev = idx > 0 ? arr[idx - 1] : null;
    const prevCount = prev ? Number(prev.count) || 0 : 0;
    const growth = prevCount > 0 ? Math.round(((currCount - prevCount) / prevCount) * 100) : 0;
    return {
      year: Number(d.year),
      count: currCount,
      cumulative: d.cumulative !== undefined ? Number(d.cumulative) : runningTotal,
      growthPercent: d.growthPercent !== undefined ? Number(d.growthPercent) : growth,
      milestone: d.milestone || (idx === arr.length - 1 ? 'Ongoing publication trajectory' : `Annual trajectory milestone`)
    };
  });

  const counts = yearlyData.map(d => d.count);
  const maxCitation = Math.max(...counts, 1);
  const totalCitations = scholarStats.totalCitations || runningTotal || 348;
  const peakItem = yearlyData.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), yearlyData[0]);

  const [hoveredYear, setHoveredYear] = useState<number | null>(peakItem?.year || 2025);

  // Find active year item
  const activeItem = yearlyData.find(d => d.year === (hoveredYear || peakItem?.year)) || peakItem || yearlyData[yearlyData.length - 1];

  const firstYear = yearlyData[0]?.year;
  const lastYear = yearlyData[yearlyData.length - 1]?.year;

  return (
    <div className="space-y-3 w-full min-w-0">
      {/* Header & View Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
          <h4 className={`text-xs font-bold tracking-tight uppercase font-mono truncate ${
            isDark ? 'text-blue-200' : 'text-blue-900'
          }`}>
            Citation Trajectory
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Pill Selector: Grafik vs Tabel */}
          <div className={`p-0.5 rounded-lg border flex items-center gap-0.5 text-[10px] font-mono shrink-0 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 font-semibold ${
                viewMode === 'chart'
                  ? isDark 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'bg-white text-blue-700 shadow-sm'
                  : isDark 
                    ? 'text-slate-400 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Graphic</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 font-semibold ${
                viewMode === 'table'
                  ? isDark 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'bg-white text-blue-700 shadow-sm'
                  : isDark 
                    ? 'text-slate-400 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3 h-3" />
              <span>Table</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 rounded-md transition-all hidden sm:flex items-center gap-1 font-semibold ${
                viewMode === 'split'
                  ? isDark 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'bg-white text-blue-700 shadow-sm'
                  : isDark 
                    ? 'text-slate-400 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Combination</span>
            </button>
          </div>

          <a
            href="/research"
            title="Explore all publications & citation trajectory"
            aria-label="Explore all publications & citation trajectory"
            className="p-1 rounded-md text-blue-500 hover:bg-blue-500/10 transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* CHART VIEW */}
      {(viewMode === 'chart' || viewMode === 'split') && (
        <div className={`p-3 sm:p-4 rounded-xl border relative transition-all w-full min-w-0 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50/80 border-slate-200'
        }`}>
          {/* Chart Header Stats */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 mb-2 sm:mb-3 flex-wrap gap-1">
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>YoY Growth +{peakItem?.growthPercent || 150}% Peak</span>
            </span>
            <span>{firstYear} &rarr; {lastYear} ({peakItem?.year} Peak)</span>
          </div>

          {/* Bar Chart Container */}
          <div className="flex items-end gap-1.5 sm:gap-2.5 h-32 pb-1 relative pt-5 w-full">
            {yearlyData.map((item) => {
              // Proportional scaling between 15% (minimum visible) and 100% (peak)
              const heightPercent = maxCitation > 0 
                ? Math.round(15 + ((item.count / maxCitation) * 85)) 
                : 15;
              const isSelected = (hoveredYear === item.year);
              const isPeak = item.count === maxCitation;

              return (
                <div
                  key={item.year}
                  onMouseEnter={() => setHoveredYear(item.year)}
                  onClick={() => setHoveredYear(item.year)}
                  className="flex-1 min-w-0 flex flex-col items-center h-full justify-end cursor-pointer group relative"
                >
                  {/* Floating count badge above bar */}
                  <span className={`text-[10px] font-mono font-bold transition-all mb-1 select-none ${
                    isSelected 
                      ? 'text-blue-500 scale-110 font-extrabold' 
                      : isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {item.count}
                  </span>

                  {/* Dedicated bar track container allowing height% to render properly */}
                  <div className="flex-1 w-full flex items-end justify-center">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[32px] sm:max-w-[40px] rounded-t-md transition-all duration-300 relative overflow-hidden ${
                        isPeak 
                          ? 'bg-gradient-to-t from-blue-700 via-indigo-600 to-blue-400 shadow-md ring-1 ring-blue-400/50' 
                          : isSelected
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm'
                            : isDark ? 'bg-blue-500/60 group-hover:bg-blue-400' : 'bg-blue-600/75 group-hover:bg-blue-700'
                      }`}
                    >
                      {/* Top Glow Highlight */}
                      <div className="w-full h-1 bg-white/40 absolute top-0 left-0" />
                    </div>
                  </div>

                  {/* Year Label */}
                  <span className={`text-[10px] font-mono font-semibold mt-1 transition-colors select-none ${
                    isSelected ? 'text-blue-500 underline underline-offset-2 font-bold' : 'text-slate-400'
                  }`}>
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Hover Detail Banner */}
          {activeItem && (
            <div className={`mt-3 p-2 sm:p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 transition-all ${
              isDark ? 'bg-slate-900/90 border-blue-500/30 text-slate-200' : 'bg-white border-blue-200 shadow-sm text-slate-800'
            }`}>
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="px-1.5 sm:px-2 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] bg-blue-500 text-white shrink-0">
                  {activeItem.year}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium truncate">
                  {activeItem.milestone || `Year ${activeItem.year}: ${activeItem.count} items`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 font-mono text-[9px] sm:text-[10px] self-end sm:self-auto">
                <span className="text-blue-500 font-bold">{activeItem.count} count</span>
                {activeItem.growthPercent !== undefined && activeItem.growthPercent > 0 && (
                  <span className="text-emerald-500 font-semibold">(+{activeItem.growthPercent}%)</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {(viewMode === 'table' || viewMode === 'split') && (
        <div className={`rounded-xl border overflow-hidden transition-all w-full min-w-0 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="overflow-x-auto max-h-56 overflow-y-auto overscroll-x-contain scrollbar-thin w-full">
            <table className="w-full text-left font-mono min-w-full table-auto">
              <thead className={`text-[9px] sm:text-[10px] uppercase tracking-wider sticky top-0 z-10 ${
                isDark ? 'bg-slate-900/95 text-slate-300 border-b border-white/10' : 'bg-slate-100/95 text-slate-700 border-b border-slate-200'
              }`}>
                <tr>
                  <th className="py-2 px-2 sm:px-3 whitespace-nowrap">Tahun</th>
                  <th className="py-2 px-1.5 sm:px-2 text-right whitespace-nowrap">Jumlah</th>
                  <th className="py-2 px-1.5 sm:px-2 text-right whitespace-nowrap">YoY %</th>
                  <th className="py-2 px-1.5 sm:px-2 text-right whitespace-nowrap hidden sm:table-cell">Kumulatif</th>
                  <th className="py-2 px-2 sm:px-3">Milestone Riset</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-[10px] sm:text-[11px] ${
                isDark ? 'divide-white/5 text-slate-200' : 'divide-slate-100 text-slate-700'
              }`}>
                {yearlyData.map((row) => {
                  const isHovered = hoveredYear === row.year;
                  const isPeak = row.count === maxCitation;
                  return (
                    <tr
                      key={row.year}
                      onMouseEnter={() => setHoveredYear(row.year)}
                      onClick={() => setHoveredYear(row.year)}
                      className={`transition-colors cursor-pointer ${
                        isHovered 
                          ? isDark ? 'bg-blue-900/40 text-white font-semibold' : 'bg-blue-50 text-blue-900 font-semibold'
                          : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-1.5 px-2 sm:px-3 whitespace-nowrap font-bold text-blue-500">
                        {row.year} {isPeak && <span className="text-[8px] sm:text-[9px] text-amber-500 ml-0.5">&#9733;</span>}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-right font-bold whitespace-nowrap">
                        {row.count}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-right whitespace-nowrap">
                        {row.growthPercent && row.growthPercent > 0 ? (
                          <span className="text-emerald-500 font-semibold">+{row.growthPercent}%</span>
                        ) : (
                          <span className="text-slate-400">0%</span>
                        )}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-right text-slate-400 whitespace-nowrap hidden sm:table-cell">
                        {row.cumulative || row.count}
                      </td>
                      <td className="py-1.5 px-2 sm:px-3 text-[9px] sm:text-[10px] font-sans truncate max-w-[110px] sm:max-w-[160px] text-slate-400" title={row.milestone}>
                        {row.milestone || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Table Footer Total Row */}
              <tfoot className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border-t ${
                isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}>
                <tr>
                  <td className="py-2 px-2 sm:px-3 whitespace-nowrap">Total</td>
                  <td className="py-2 px-1.5 sm:px-2 text-right text-blue-500 font-bold whitespace-nowrap">{runningTotal}</td>
                  <td className="py-2 px-1.5 sm:px-2 text-right text-emerald-500 whitespace-nowrap">+{peakItem?.growthPercent || 0}% peak</td>
                  <td className="py-2 px-1.5 sm:px-2 text-right whitespace-nowrap hidden sm:table-cell">{runningTotal}</td>
                  <td className="py-2 px-2 sm:px-3 text-[8px] sm:text-[9px] text-slate-400 font-normal truncate max-w-[110px] sm:max-w-[160px]">Annual Trajectory</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
