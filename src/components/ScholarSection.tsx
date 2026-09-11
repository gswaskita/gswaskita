import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ExternalLink, 
  ArrowUpRight, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Quote, 
  Check, 
  Copy, 
  Tag, 
  X, 
  Network 
} from 'lucide-react';
import type { ResearchArticle, ThemeMode, PageId, ScholarStats, PageContentData } from '../types';
import { useTheme } from '../utils/useTheme';
import { VosViewerNetwork } from './VosViewerNetwork';

// SINTA Garuda Curved Line Chart Component (Grafik Garis Melengkung SINTA Garuda)
export const GarudaCurvedChart: React.FC<{
  data: { year: number; count: number }[];
  selectedYear: number | 'all';
  onSelectYear: (year: number | 'all') => void;
  isDark: boolean;
  totalDocs?: number;
  citationsCount?: number;
  sintaGarudaUrl?: string;
  chartLatestBadge?: string;
  chartIndexBadge?: string;
  chartTitle?: string;
  chartSubtitle?: string;
}> = ({
  data,
  selectedYear,
  onSelectYear,
  isDark,
  totalDocs = 21,
  citationsCount,
  sintaGarudaUrl,
  chartLatestBadge,
  chartIndexBadge,
  chartTitle,
  chartSubtitle
}) => {
  // Mobile responsiveness: Tidak perlu geser/scroll horizontal kecuali tahun > 6
  const needsScroll = data.length > 6;
  const svgWidth = needsScroll ? Math.max(560, data.length * 80) : 520;
  const svgHeight = 190;
  const padLeft = 32;
  const padRight = 24;
  const padTop = 30;
  const padBottom = 32;
  const width = svgWidth - padLeft - padRight;
  const height = svgHeight - padTop - padBottom;

  const maxCount = Math.max(...data.map(d => d.count), 10);
  const yMax = Math.ceil(maxCount * 1.18);

  const points = data.map((d, i) => ({
    year: d.year,
    count: d.count,
    x: padLeft + (i / Math.max(data.length - 1, 1)) * width,
    y: padTop + height - (d.count / yMax) * height,
  }));

  // Build cubic Bezier curve path string for smooth Garuda trajectory
  const curvePath = points.length > 0 
    ? points.reduce((acc, curr, i, arr) => {
        if (i === 0) return `M ${curr.x} ${curr.y}`;
        const prev = arr[i - 1];
        const cp1x = prev.x + (curr.x - prev.x) * 0.45;
        const cp1y = prev.y;
        const cp2x = prev.x + (curr.x - prev.x) * 0.55;
        const cp2y = curr.y;
        return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }, '')
    : '';

  const baseline = padTop + height;

  // Gradient area path under the curve
  const areaPath = points.length > 1 && curvePath
    ? `${curvePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
    : '';

  const gridLevels = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

  return (
    <div className={`p-4 sm:p-7 rounded-2xl border shadow-xl transition-all ${
      isDark ? 'bg-slate-900/80 backdrop-blur-md border-white/15' : 'bg-white border-slate-200 shadow-md'
    }`}>
      {/* Header matching SINTA Garuda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6A00]">
              {chartLatestBadge || "Latest number of publications"}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30 font-semibold">
              {chartIndexBadge || "SINTA Garuda Index"}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight">
            {chartTitle || "Garuda Annual Publication Trajectory"}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {chartSubtitle || "Grafik garis melengkung (curved line chart) publikasi terindeks Garba Rujukan Digital Kemdiktisaintek"}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-mono text-slate-400 block">Total Garuda Documents</span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#FF6A00]">
              {totalDocs} Documents
            </span>
          </div>
          {citationsCount !== undefined && citationsCount !== null && (
            <div className="text-left sm:text-right border-l border-slate-200 dark:border-white/10 pl-3 sm:pl-4">
              <span className="text-[11px] font-mono text-slate-400 block">Total Citations</span>
              <span className="text-base sm:text-lg font-bold font-mono text-blue-500">
                {citationsCount} Citations
              </span>
            </div>
          )}
          {sintaGarudaUrl && (
            <a
              href={sintaGarudaUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka profil resmi SINTA Garuda"
              aria-label="Buka profil resmi SINTA Garuda"
              className="p-2 rounded-xl border border-orange-200 dark:border-white/10 hover:bg-orange-500/10 text-[#FF6A00] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Swipe hint on mobile device only when data exceeds 6 years */}
      {needsScroll && (
        <div className="flex sm:hidden items-center justify-end gap-1 text-[10px] font-mono text-slate-400 pt-2">
          <span>Geser grafik untuk melihat tahun lainnya &rarr;</span>
        </div>
      )}

      {/* Responsive SVG Curved Line Chart: tidak perlu geser jika <= 6 tahun */}
      <div className={`w-full py-2 ${needsScroll ? 'overflow-x-auto scrollbar-thin' : 'overflow-hidden'}`}>
        <div style={{ minWidth: needsScroll ? `${Math.max(540, data.length * 80)}px` : '100%' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible block">
            <defs>
              <linearGradient id="garudaAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#FF6A00" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.01" />
              </linearGradient>
              <filter id="garudaCurveGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#FF6A00" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Gridlines & Y-Axis Scale */}
            {gridLevels.map((lvl) => {
              const yPos = padTop + height - (lvl / yMax) * height;
              return (
                <g key={lvl}>
                  <line
                    x1={padLeft}
                    y1={yPos}
                    x2={padLeft + width}
                    y2={yPos}
                    stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padLeft - 8}
                    y={yPos + 3}
                    textAnchor="end"
                    className="text-[9px] font-mono select-none"
                    fill={isDark ? '#64748B' : '#94A3B8'}
                  >
                    {lvl}
                  </text>
                </g>
              );
            })}

            {/* Area Under Curved Line */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#garudaAreaGradient)"
                className="transition-all duration-500 ease-out"
              />
            )}

            {/* Smooth Curved Line Path */}
            {curvePath && (
              <path
                d={curvePath}
                fill="none"
                stroke="#FF6A00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#garudaCurveGlow)"
                className="transition-all duration-500 ease-out"
              />
            )}

            {/* Interactive Nodes & Value Labels */}
            {points.map((p) => {
              const isSelected = selectedYear === p.year;
              return (
                <g
                  key={p.year}
                  onClick={() => onSelectYear && onSelectYear(isSelected ? 'all' : p.year)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse halo */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 9 : 5.5}
                    fill="#FF6A00"
                    opacity={isSelected ? 0.35 : 0.15}
                    className="transition-all duration-300 group-hover:scale-125 group-hover:opacity-40"
                  />
                  {/* Inner Node Circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 4 : 3}
                    fill={isSelected ? '#FF6A00' : '#ffffff'}
                    stroke="#FF6A00"
                    strokeWidth={isSelected ? 2 : 1.5}
                    className="transition-all duration-300 group-hover:scale-110 shadow-xs"
                  />
                  {/* Numeric Count Label on Top of Node */}
                  <text
                    x={p.x}
                    y={p.y - 7}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold select-none transition-transform duration-300 group-hover:-translate-y-0.5"
                    fill={isSelected ? '#FF6A00' : (isDark ? '#FDBA74' : '#C2410C')}
                  >
                    {p.count}
                  </text>
                  {/* Year Label on X-Axis */}
                  <text
                    x={p.x}
                    y={baseline + 16}
                    textAnchor="middle"
                    className="text-[10px] font-mono select-none font-semibold transition-colors"
                    fill={isSelected ? '#FF6A00' : (isDark ? '#E2E8F0' : '#334155')}
                  >
                    {p.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

interface ScholarSectionProps {
  articles?: ResearchArticle[];
  scholarStats?: ScholarStats;
  pageContent?: PageContentData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const ScholarSection: React.FC<ScholarSectionProps> = ({
  articles = [],
  scholarStats,
  pageContent,
  theme: propTheme,
  onNavigate
}) => {
  const theme = useTheme(propTheme);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'featured' | 'vosviewer'>('featured');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Extract all distinct keywords from articles
  const allKeywords = useMemo(() => {
    const set = new Set<string>();
    (articles || []).forEach(a => {
      (a.keywords || []).forEach(k => set.add(k));
    });
    return Array.from(set);
  }, [articles]);

  // SINTA Garuda yearly publications data (curved line chart data)
  const garudaYearlyData = useMemo(() => {
    if (scholarStats?.yearlyPublications && scholarStats.yearlyPublications.length > 0) {
      return [...scholarStats.yearlyPublications].sort((a, b) => a.year - b.year);
    }
    // Authentic SINTA Garuda author data for Gautama Sastra Waskita (ID: 6801795)
    return [
      { year: 2023, count: 1 },
      { year: 2024, count: 4 },
      { year: 2025, count: 10 },
      { year: 2026, count: 6 }
    ];
  }, [scholarStats]);

  const totalGarudaDocs = useMemo(() => {
    if (scholarStats?.garudaPublicationsCount) return scholarStats.garudaPublicationsCount;
    return garudaYearlyData.reduce((sum, item) => sum + item.count, 0);
  }, [scholarStats, garudaYearlyData]);

  // Point 4: Khusus 2 artikel pilihan (Featured) di Homepage
  // Aturan: "yang paling kuat adalah pilihan terakhir, yang lain menyesuaikan" (mirip buku)
  const getFeaturedHomeArticles = (): ResearchArticle[] => {
    // Ambil semua artikel yang ditandai isFeatured
    const featuredCandidates = (articles || []).filter(a => a.isFeatured);

    // Urutkan berdasarkan yang terakhir dipilih/diupdate (updatedAt DESC)
    // Pilihan terakhir memiliki prioritas tertinggi ("paling kuat")
    const sortedByLatestChoice = [...featuredCandidates].sort((a, b) => {
      const timeA = a.updatedAt || 0;
      const timeB = b.updatedAt || 0;
      if (timeB !== timeA) return timeB - timeA;
      return (Number(a.featuredOrder) || 1) - (Number(b.featuredOrder) || 1);
    });

    // 2 Slot posisi di homepage: [Posisi 1 (Kiri / Artikel Utama), Posisi 2 (Kanan / Artikel Kedua)]
    const slots: (ResearchArticle | null)[] = [null, null];

    // Masukkan artikel mulai dari pilihan terakhir (yang paling kuat)
    for (const article of sortedByLatestChoice) {
      // Posisi yang diinginkan: 1 -> index 0, 2 -> index 1
      const targetIndex = Math.min(Math.max((Number(article.featuredOrder) || 1) - 1, 0), 1);

      if (slots[targetIndex] === null) {
        // Slot target masih kosong -> langsung tempati
        slots[targetIndex] = article;
      } else {
        // Slot target sudah ditempati oleh pilihan yang lebih baru/kuat -> slot lain menyesuaikan
        const otherIdx = (targetIndex + 1) % 2;
        if (slots[otherIdx] === null) {
          slots[otherIdx] = article;
        }
      }

      // Jika kedua slot sudah terisi, selesai
      if (slots.every(s => s !== null)) break;
    }

    // Jika slot belum genap 2 (misal artikel featured yang dicentang kurang dari 2):
    // Lengkapi dengan artikel lainnya yang belum masuk slot
    const assignedIds = new Set(slots.filter((a): a is ResearchArticle => a !== null).map(a => a.id));
    const nonFeaturedOrRemaining = (articles || []).filter(a => !assignedIds.has(a.id));

    let remIdx = 0;
    for (let i = 0; i < 2; i++) {
      if (slots[i] === null && remIdx < nonFeaturedOrRemaining.length) {
        slots[i] = nonFeaturedOrRemaining[remIdx++];
      }
    }

    return slots.filter((a): a is ResearchArticle => a !== null);
  };

  const homeArticles = useMemo(() => getFeaturedHomeArticles(), [articles]);

  const fallbackCopyText = (text: string, doi: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedDoi(doi);
      setTimeout(() => setCopiedDoi(null), 2500);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
  };

  const handleCopyDoi = (doi?: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!doi) return;
    const url = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedDoi(doi);
        setTimeout(() => setCopiedDoi(null), 2500);
      }).catch(() => {
        fallbackCopyText(url, doi);
      });
    } else {
      fallbackCopyText(url, doi);
    }
  };

  return (
    <section id="scholar" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t overflow-hidden w-full max-w-full ${
      isDark ? 'border-white/10' : 'border-slate-200'
    }`}>
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="max-w-2xl space-y-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark 
              ? 'bg-amber-950/60 border-amber-400/30 text-amber-300' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <Award className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>{scholarStats?.sectionBadge || pageContent?.researchBadge || "SINTA Kemdiktisaintek • Garuda Index"}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {scholarStats?.sectionTitle ? (
              scholarStats.sectionTitle.includes('Publications & Metric Timeline') ? (
                <>
                  {scholarStats.sectionTitle.replace('Publications & Metric Timeline', '').trim()}{' '}
                  <span className="font-bold text-[#FF6A00]">Publications &amp; Metric Timeline</span>
                </>
              ) : (
                <span className="font-bold">{scholarStats.sectionTitle}</span>
              )
            ) : pageContent?.researchTitle ? (
              <span className="font-bold">{pageContent.researchTitle}</span>
            ) : (
              <>SINTA Garuda <span className="font-bold text-[#FF6A00]">Publications &amp; Metric Timeline</span></>
            )}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {scholarStats?.sectionSubtitle || pageContent?.researchSubtitle || "Dokumen publikasi terindeks Garba Rujukan Digital (Garuda), tren garis melengkung (curved chart) metrik publikasi per tahun, dan repositori riset terverifikasi SINTA ID: 6801795."}
          </p>
        </div>

        {/* View Switching Tabs & Dedicated Garuda Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'featured'
                  ? 'bg-[#FF6A00] text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Garuda Publications</span>
            </button>

            <button
              onClick={() => setActiveTab('vosviewer')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'vosviewer'
                  ? 'bg-[#FF6A00] text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>VOSviewer Map</span>
            </button>
          </div>

          <a
            href={scholarStats?.sintaGarudaUrl || "https://sinta.kemdiktisaintek.go.id/authors/profile/6801795/?view=garuda"}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isDark
                ? 'bg-[#FF6A00]/10 border-[#FF6A00]/30 text-[#FF6A00] hover:bg-[#FF6A00]/20'
                : 'bg-orange-50 border-orange-200 text-orange-900 hover:bg-orange-100 shadow-sm'
            }`}
          >
            <span>SINTA Garuda Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6A00]" />
          </a>
        </div>
      </div>

      {/* 0. TAB: VOSVIEWER BIBLIOMETRIC NETWORK */}
      {activeTab === 'vosviewer' && (
        <div className="space-y-6 animate-fadeIn">
          <VosViewerNetwork
            articles={articles}
            selectedKeyword={selectedKeyword}
            onSelectKeyword={(kw) => {
              setSelectedKeyword(kw);
              if (kw) {
                setActiveTab('featured');
              }
            }}
            isDark={isDark}
            vosViewerUrl={scholarStats?.vosViewerUrl}
            vosViewerTitle={scholarStats?.vosViewerTitle}
            vosViewerDescription={scholarStats?.vosViewerDescription}
          />
        </div>
      )}

      {/* 1. TAB: GARUDA PUBLICATIONS WITH CURVED TIMELINE */}
      {activeTab === 'featured' && (
        <div className="space-y-6 animate-fadeIn">
          {/* SINTA Garuda Curved Line Trajectory */}
          <GarudaCurvedChart
            data={garudaYearlyData}
            selectedYear={selectedYear}
            onSelectYear={(yr) => setSelectedYear(yr)}
            isDark={isDark}
            totalDocs={totalGarudaDocs}
            citationsCount={scholarStats?.garudaCitationsCount}
            sintaGarudaUrl={scholarStats?.sintaGarudaUrl}
            chartLatestBadge={scholarStats?.chartLatestBadge}
            chartIndexBadge={scholarStats?.chartIndexBadge}
            chartTitle={scholarStats?.chartTitle}
            chartSubtitle={scholarStats?.chartSubtitle}
          />

          {homeArticles.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <p className="text-sm">Belum ada publikasi yang dipilih untuk ditampilkan di homepage.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {homeArticles.map((article) => (
              <div
                key={article.id}
                className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-xl group ${
                  isDark 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-white/40' 
                    : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-blue-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                        isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        {article.category}
                      </span>
                      {article.isFeatured && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border bg-amber-500/10 border-amber-500/30 text-amber-500">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        {article.year}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold border ${
                        isDark ? 'bg-emerald-950/60 border-emerald-400/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {article.citations} Citations
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-base sm:text-lg font-semibold leading-snug group-hover:text-blue-500 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {article.title}
                  </h3>

                  <div className="space-y-1 text-xs font-mono">
                    <p className="text-blue-500 font-semibold">
                      {article.journal}
                    </p>
                    {/* Full Authors List */}
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="font-semibold text-slate-400">Authors: </span>
                      {article.authors}
                    </p>
                  </div>

                  {/* 5 Keywords Badges with click-to-filter */}
                  {article.keywords && article.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {article.keywords.map((kw, kwIdx) => (
                        <button
                          key={kwIdx}
                          onClick={() => setSelectedKeyword(selectedKeyword === kw ? null : kw)}
                          title={`Filter by #${kw}`}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            selectedKeyword === kw
                              ? 'bg-blue-600 text-white border-blue-400 font-bold'
                              : isDark 
                                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-blue-600/30' 
                                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-blue-100'
                          }`}
                        >
                          #{kw}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className={`text-xs leading-relaxed line-clamp-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {article.abstract}
                  </p>
                </div>

                <div className={`pt-4 mt-4 border-t flex items-center justify-between gap-2 flex-wrap ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  {/* Clickable & Copyable DOI Pill */}
                  {article.doi ? (
                    <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 overflow-hidden shadow-xs">
                      <a
                        href={article.doi.startsWith('http') ? article.doi : `https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open DOI in new tab"
                        className="px-2.5 py-1 text-[11px] font-mono font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/10 flex items-center gap-1 transition-colors"
                      >
                        <Quote className="w-3 h-3 text-blue-500" />
                        <span>DOI</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <button
                        onClick={(e) => handleCopyDoi(article.doi, e)}
                        title="Copy DOI link to clipboard"
                        className="px-2 py-1 border-l border-slate-200 dark:border-white/15 text-[10px] font-mono text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedDoi === article.doi ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">Peer Reviewed</span>
                  )}

                  {/* Direct Journal Link in New Tab */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open original journal article on publisher portal"
                    className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all hover:scale-105"
                  >
                    <span>Direct Journal Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Bottom Navigation Link Banner */}
      <div className={`mt-8 p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}>
        <p className="text-xs">
          Showing verified Scholar indexing. Total repository contains {articles.length} peer-reviewed articles, conference proceedings, and doctoral working papers.
        </p>
        <a
          href="/research"
          className="shrink-0 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow text-center"
        >
          Open Research Repository ({articles.length}) &rarr;
        </a>
      </div>

    </section>
  );
};
