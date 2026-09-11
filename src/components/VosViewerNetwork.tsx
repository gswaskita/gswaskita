import React, { useState, useMemo } from 'react';
import { Sparkles, Network, RotateCcw, Info, ZoomIn, ZoomOut, Calendar, Flame, ExternalLink, Globe, BookOpen, Maximize2, Minimize2, Lock, Unlock, MousePointer } from 'lucide-react';
import type { ResearchArticle } from '../types';

interface VosViewerNetworkProps {
  articles: ResearchArticle[];
  selectedKeyword: string | null;
  onSelectKeyword: (keyword: string | null) => void;
  isDark?: boolean;
  vosViewerUrl?: string;
  vosViewerTitle?: string;
  vosViewerDescription?: string;
}

type VosMode = 'network' | 'overlay' | 'density';

// Helper to extract Google Drive file ID from various link formats
export const extractGoogleDriveFileId = (url?: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  try {
    const decoded = decodeURIComponent(url);
    // Matches drive.google.com/file/d/ID, open?id=ID, uc?id=ID, or query id=ID
    const match = decoded.match(/(?:drive\.google\.com|docs\.google\.com)\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    const altMatch = decoded.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (altMatch && (decoded.includes('drive.google.com') || decoded.includes('docs.google.com'))) {
      return altMatch[1];
    }
  } catch {
    // ignore decode error
  }
  return null;
};

// Helper to format any Google Drive link, JSON dataset, or VOSviewer web app link safely with visualization scale
export const formatVosViewerEmbedUrl = (rawUrl?: string, scale: number = 2): string | null => {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return null;
  const clean = rawUrl.trim();
  const scaleParam = scale ? `&scale=${scale}` : '';
  
  // 1. Google Drive URLs (transforms any file/d/ID link into VOSviewer app embed with direct uc stream)
  const gdriveId = extractGoogleDriveFileId(clean);
  if (gdriveId) {
    const directDownloadUrl = `https://drive.google.com/uc?id=${gdriveId}`;
    return `https://app.vosviewer.com/?json=${encodeURIComponent(directDownloadUrl)}&simple_ui=true${scaleParam}`;
  }

  // 2. Already formatted VOSviewer Web App URL
  if (clean.includes('app.vosviewer.com/?json=') || clean.includes('app.vosviewer.com?json=')) {
    let url = clean;
    if (!url.includes('simple_ui=')) {
      url = url.includes('?') ? `${url}&simple_ui=true` : `${url}?simple_ui=true`;
    }
    if (scale && url.includes('scale=')) {
      url = url.replace(/scale=[0-9.]+/g, `scale=${scale}`);
    } else if (scale) {
      url = `${url}${scaleParam}`;
    }
    return url;
  }
  
  // 3. Direct JSON Dataset URL or relative path (e.g. /static/docs/vosviewer/dataset.json)
  if (clean.endsWith('.json') || clean.includes('.json?')) {
    let fullUrl = clean;
    if (clean.startsWith('/') && typeof window !== 'undefined') {
      fullUrl = `${window.location.origin}${clean}`;
    }
    const encoded = encodeURIComponent(fullUrl);
    return `https://app.vosviewer.com/?json=${encoded}&simple_ui=true${scaleParam}`;
  }
  
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
    return clean;
  }
  
  return null;
};

interface ClusterMeta {
  id: number;
  name: string;
  color: string;
  lightColor: string;
  glow: string;
  keywordsCount: number;
}

interface DynamicKeywordNode {
  id: string;
  name: string;
  cluster: number;
  clusterName: string;
  x: number;
  y: number;
  radius: number;
  weight: number; // Total citations
  occurrences: number; // Number of articles containing this keyword
  avgYear: number; // Average publication year for overlay mode
  overlayColor: string;
  connectedKeywords: string[];
}

interface DynamicNetworkLink {
  source: string;
  target: string;
  weight: number;
}

const PALETTE = [
  { color: '#2563EB', lightColor: '#1D4ED8', glow: 'rgba(37, 99, 235, 0.45)' }, // Blue
  { color: '#059669', lightColor: '#047857', glow: 'rgba(5, 150, 105, 0.45)' }, // Emerald
  { color: '#D97706', lightColor: '#B45309', glow: 'rgba(217, 119, 6, 0.45)' }, // Amber
  { color: '#9333EA', lightColor: '#7E22CE', glow: 'rgba(147, 51, 234, 0.45)' }, // Purple
  { color: '#DB2777', lightColor: '#BE185D', glow: 'rgba(219, 39, 119, 0.45)' }, // Pink
  { color: '#0891B2', lightColor: '#0E7490', glow: 'rgba(8, 145, 178, 0.45)' }, // Cyan
  { color: '#EA580C', lightColor: '#C2410C', glow: 'rgba(234, 88, 12, 0.45)' }, // Orange
  { color: '#4F46E5', lightColor: '#4338CA', glow: 'rgba(79, 70, 229, 0.45)' }  // Indigo
];

// Helper to compute overlay colors based on year
const getOverlayColor = (year: number, minYear: number, maxYear: number): string => {
  if (maxYear === minYear) return '#10B981';
  const ratio = Math.max(0, Math.min(1, (year - minYear) / (maxYear - minYear)));
  if (ratio < 0.25) return '#3B82F6'; // Cool blue (earlier years)
  if (ratio < 0.5) return '#06B6D4';  // Cyan
  if (ratio < 0.75) return '#10B981'; // Green (mid years)
  if (ratio < 0.9) return '#F59E0B';  // Yellow/Amber
  return '#EF4444';                  // Red/Orange (latest years)
};

export const VosViewerNetwork: React.FC<VosViewerNetworkProps> = ({
  articles = [],
  selectedKeyword,
  onSelectKeyword,
  isDark = true,
  vosViewerUrl,
  vosViewerTitle,
  vosViewerDescription
}) => {
  const [activeMode, setActiveMode] = useState<VosMode>('network');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeCluster, setActiveCluster] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [vizScale, setVizScale] = useState<number>(2);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Format any input URL or JSON link for the official VOSviewer Cloud Web Instance with visualization scale
  const formattedVosViewerUrl = useMemo(
    () => formatVosViewerEmbedUrl(vosViewerUrl, vizScale),
    [vosViewerUrl, vizScale]
  );

  // 1. DYNAMIC CLUSTERING & KEYWORD EXTRACTION FROM POSTED ARTICLES
  const { clusters, nodes, links, nodeMap, minYear, maxYear, maxLinkWeight } = useMemo(() => {
    const categoryCounts = new Map<string, number>();
    const keywordMap = new Map<string, {
      name: string;
      citations: number;
      occurrences: number;
      years: number[];
      categoryOccurrences: Map<string, number>;
      coOccurrences: Map<string, number>;
    }>();

    let calculatedMinYear = 2024;
    let calculatedMaxYear = 2020;

    articles.forEach((art) => {
      const cat = art.category || 'General Operations';
      const year = art.year || 2023;
      if (year < calculatedMinYear) calculatedMinYear = year;
      if (year > calculatedMaxYear) calculatedMaxYear = year;

      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);

      const kws = (art.keywords && art.keywords.length > 0)
        ? art.keywords
        : [cat, 'Empirical Study', 'Research Methodology'];

      kws.forEach((kw) => {
        const cleanKw = kw.trim();
        if (!cleanKw) return;

        if (!keywordMap.has(cleanKw)) {
          keywordMap.set(cleanKw, {
            name: cleanKw,
            citations: 0,
            occurrences: 0,
            years: [],
            categoryOccurrences: new Map(),
            coOccurrences: new Map()
          });
        }

        const data = keywordMap.get(cleanKw)!;
        data.citations += (art.citations || 0);
        data.occurrences += 1;
        data.years.push(year);
        data.categoryOccurrences.set(cat, (data.categoryOccurrences.get(cat) || 0) + 1);

        kws.forEach((otherKw) => {
          const cleanOther = otherKw.trim();
          if (cleanOther && cleanOther !== cleanKw) {
            data.coOccurrences.set(cleanOther, (data.coOccurrences.get(cleanOther) || 0) + 1);
          }
        });
      });
    });

    const uniqueCategories = Array.from(categoryCounts.keys());
    const dynamicClusters: ClusterMeta[] = uniqueCategories.map((catName, idx) => {
      const paletteItem = PALETTE[idx % PALETTE.length];
      return {
        id: idx,
        name: catName,
        color: paletteItem.color,
        lightColor: paletteItem.lightColor,
        glow: paletteItem.glow,
        keywordsCount: 0
      };
    });

    const clusterByName = new Map<string, ClusterMeta>();
    dynamicClusters.forEach(cl => clusterByName.set(cl.name, cl));

    const clusterKeywords = new Map<number, string[]>();
    dynamicClusters.forEach(cl => clusterKeywords.set(cl.id, []));

    const keywordList = Array.from(keywordMap.entries());

    keywordList.forEach(([kw, data]) => {
      let bestCat = uniqueCategories[0];
      let maxCount = 0;
      data.categoryOccurrences.forEach((count, cat) => {
        if (count > maxCount) {
          maxCount = count;
          bestCat = cat;
        }
      });

      const cluster = clusterByName.get(bestCat) || dynamicClusters[0];
      cluster.keywordsCount += 1;
      const list = clusterKeywords.get(cluster.id) || [];
      list.push(kw);
      clusterKeywords.set(cluster.id, list);
    });

    // Compute min/max citations and occurrences for dramatic contrast scaling
    const citationsList = keywordList.map(([_, d]) => d.citations);
    const occurrencesList = keywordList.map(([_, d]) => d.occurrences);
    const minCitations = Math.min(...citationsList, 0);
    const maxCitations = Math.max(...citationsList, 1);
    const minOccurrences = Math.min(...occurrencesList, 1);
    const maxOccurrences = Math.max(...occurrencesList, 1);

    const totalClusterCount = dynamicClusters.length || 1;
    const dynamicNodes: DynamicKeywordNode[] = [];

    dynamicClusters.forEach((cl, clIdx) => {
      const kwNames = clusterKeywords.get(cl.id) || [];
      if (kwNames.length === 0) return;

      const clusterAngle = (clIdx / totalClusterCount) * 2 * Math.PI - Math.PI / 2;
      const clusterCenterX = 400 + Math.cos(clusterAngle) * 220;
      const clusterCenterY = 240 + Math.sin(clusterAngle) * 130;

      kwNames.forEach((kwName, kwIdx) => {
        const data = keywordMap.get(kwName)!;
        
        // High-contrast dramatic size scaling (from 10px up to 38px)
        const citRatio = (data.citations - minCitations) / (maxCitations - minCitations || 1);
        const occRatio = (data.occurrences - minOccurrences) / (maxOccurrences - minOccurrences || 1);
        const combinedScore = (citRatio * 0.65) + (occRatio * 0.35);
        
        const radius = Math.round(10 + Math.pow(combinedScore, 0.75) * 28);

        const subAngle = (kwIdx / kwNames.length) * 2 * Math.PI + (clIdx * 0.7);
        const distance = 35 + (kwIdx % 3) * 35 + (1 - combinedScore) * 25;

        const rawX = clusterCenterX + Math.cos(subAngle) * distance;
        const rawY = clusterCenterY + Math.sin(subAngle) * distance;

        const x = Math.min(740, Math.max(60, Math.round(rawX)));
        const y = Math.min(435, Math.max(45, Math.round(rawY)));

        const avgYear = data.years.length > 0 
          ? Number((data.years.reduce((a, b) => a + b, 0) / data.years.length).toFixed(1))
          : 2023;

        const overlayColor = getOverlayColor(avgYear, calculatedMinYear, calculatedMaxYear);

        dynamicNodes.push({
          id: kwName,
          name: kwName,
          cluster: cl.id,
          clusterName: cl.name,
          x,
          y,
          radius,
          weight: data.citations,
          occurrences: data.occurrences,
          avgYear,
          overlayColor,
          connectedKeywords: Array.from(data.coOccurrences.keys())
        });
      });
    });

    const dynamicLinks: DynamicNetworkLink[] = [];
    const addedLinkKeys = new Set<string>();

    dynamicNodes.forEach((node) => {
      const data = keywordMap.get(node.id);
      if (!data) return;

      data.coOccurrences.forEach((coCount, otherKw) => {
        const otherNode = dynamicNodes.find(n => n.id === otherKw);
        if (otherNode) {
          const key = [node.id, otherKw].sort().join('---');
          if (!addedLinkKeys.has(key)) {
            addedLinkKeys.add(key);
            dynamicLinks.push({
              source: node.id,
              target: otherKw,
              weight: coCount
            });
          }
        }
      });
    });

    const maxLinkWt = Math.max(...dynamicLinks.map(l => l.weight), 1);
    const map = new Map<string, DynamicKeywordNode>();
    dynamicNodes.forEach(n => map.set(n.id, n));

    return {
      clusters: dynamicClusters.filter(c => c.keywordsCount > 0),
      nodes: dynamicNodes,
      links: dynamicLinks,
      nodeMap: map,
      minYear: calculatedMinYear,
      maxYear: calculatedMaxYear,
      maxLinkWeight: maxLinkWt
    };
  }, [articles]);

  const isNodeActive = (node: DynamicKeywordNode) => {
    if (selectedKeyword) {
      return node.id.toLowerCase() === selectedKeyword.toLowerCase() || node.connectedKeywords.some(k => k.toLowerCase() === selectedKeyword.toLowerCase());
    }
    if (hoveredNode) {
      const active = nodeMap.get(hoveredNode);
      if (!active) return true;
      return node.id === hoveredNode || active.connectedKeywords.includes(node.id);
    }
    if (activeCluster !== null && activeMode === 'network') {
      return node.cluster === activeCluster;
    }
    return true;
  };

  const isLinkActive = (link: DynamicNetworkLink) => {
    if (selectedKeyword) {
      const s = link.source.toLowerCase();
      const t = link.target.toLowerCase();
      const sel = selectedKeyword.toLowerCase();
      return s === sel || t === sel;
    }
    if (hoveredNode) {
      return link.source === hoveredNode || link.target === hoveredNode;
    }
    if (activeCluster !== null && activeMode === 'network') {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      return sourceNode?.cluster === activeCluster || targetNode?.cluster === activeCluster;
    }
    return true;
  };

  return (
    <div className="space-y-8">
      {/* CONDITIONAL OFFICIAL VOSVIEWER CLOUD INSTANCE / WEB FRAME */}
      {formattedVosViewerUrl && (
        <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-50 rounded-none border-0 w-screen h-screen flex flex-col bg-slate-950 text-white' 
            : isDark ? 'bg-[#060F1E] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}>
          <div className={`p-4 sm:p-5 border-b flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shrink-0 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 flex-wrap">
                  <span>Official VOSviewer Cloud Web Instance</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 font-semibold">
                    Scale {vizScale}x Active
                  </span>
                </h3>
                <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Official interactive cloud visualization by VOSviewer (CWTS Leiden University)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-stretch lg:self-auto flex-wrap justify-end">
              {/* Visualization Scale Options (Scale 1x, 1.5x, 2x, 2.5x) */}
              <div className={`inline-flex items-center p-1 rounded-xl border text-xs font-mono ${
                isDark ? 'bg-slate-900/90 border-white/15 text-slate-300' : 'bg-white border-slate-300 text-slate-700 shadow-xs'
              }`}>
                <span className="px-2 text-[11px] font-semibold text-slate-400">
                  Scale:
                </span>
                {[1, 1.5, 2, 2.5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setVizScale(s)}
                    title={`Set Visualization Scale to ${s}x`}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      vizScale === s
                        ? 'bg-blue-600 text-white shadow'
                        : isDark 
                          ? 'hover:text-white hover:bg-white/10 text-slate-400' 
                          : 'hover:text-slate-900 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Scroll Protection / Free Page Scroll Toggle */}
              <button
                type="button"
                onClick={() => setIsInteracting(!isInteracting)}
                title={isInteracting ? "Kunci kembali (Scroll halaman bebas, proteksi zoom aktif)" : "Aktifkan interaksi diagram & zoom"}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isInteracting
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                    : isDark 
                      ? 'bg-slate-900/90 border-white/15 text-slate-300 hover:text-white hover:bg-white/10' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {isInteracting ? <Unlock className="w-3.5 h-3.5 text-white" /> : <Lock className="w-3.5 h-3.5 text-blue-400" />}
                <span className="hidden sm:inline">
                  {isInteracting ? 'Mode Interaktif' : 'Scroll Bebas (Proteksi Zoom)'}
                </span>
              </button>

              {/* Fullscreen / Full Viewport Toggle on PC */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Full Viewport" : "Expand Full Viewport"}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isFullscreen
                    ? 'bg-blue-600 text-white border-blue-500 shadow'
                    : isDark 
                      ? 'bg-slate-900/90 border-white/15 text-slate-300 hover:text-white hover:bg-white/10' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
              </button>

              {/* Open in external official app */}
              <a
                href={formattedVosViewerUrl.replace('&simple_ui=true', '')}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka visualisasi interaktif di portal resmi app.vosviewer.com"
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow transition-all hover:scale-105 cursor-pointer"
              >
                <span>Open in App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Full Edge-to-Edge Responsive Iframe View with Scroll Trap Protection */}
          <div 
            className={`relative w-full overflow-hidden bg-slate-950 ${isFullscreen ? 'flex-1 h-full' : ''}`}
            onMouseLeave={() => setIsInteracting(false)}
          >
            {/* Scroll Guard Overlay: allows smooth page scrolling without accidental zoom */}
            {!isInteracting && !isFullscreen && (
              <div
                onClick={() => setIsInteracting(true)}
                title="Klik untuk mengaktifkan interaksi peta (Scroll halaman tetap bebas)"
                className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-transparent group"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2.5 rounded-full bg-slate-900/95 text-white border border-white/20 shadow-2xl backdrop-blur-md text-xs font-mono font-semibold flex items-center gap-2 pointer-events-none">
                  <MousePointer className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span>Klik untuk Mengaktifkan Interaksi Peta &bull; Scroll Halaman Tetap Lancar</span>
                </div>
              </div>
            )}

            <iframe
              loading="lazy"
              allowFullScreen={true}
              src={formattedVosViewerUrl}
              width="100%"
              title="VOSviewer Bibliometric Visualization"
              className={`w-full block border-0 transition-all ${
                isFullscreen 
                  ? 'h-full flex-1' 
                  : 'h-[520px] sm:h-[640px] md:h-[750px] lg:h-[820px] xl:h-[880px]'
              }`}
              style={{
                border: 'none',
                width: '100%',
                display: 'block',
                pointerEvents: (isInteracting || isFullscreen) ? 'auto' : 'none'
              }}
            />
          </div>

          {/* Dedicated Space Keterangan & Analisis Visualisasi (Input Mandiri dari Keystatic CMS) */}
          {vosViewerDescription && (
            <div className={`p-5 sm:p-6 border-t space-y-3 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50/90 border-slate-200'
            }`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold tracking-tight">
                    {vosViewerTitle || "Bibliometric Map Interpretation & Insights"}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Keystatic CMS Description Feed
                </span>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {vosViewerDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                  isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  &bull; Co-occurrence Analysis
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                  isDark ? 'bg-emerald-950/60 border-emerald-400/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  &bull; Thematic Cluster Structure
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                  isDark ? 'bg-purple-950/60 border-purple-400/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-800'
                }`}>
                  &bull; Document Citation Metrics
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOM DYNAMIC VOSVIEWER SUITE (Built-in Dynamic Engine) */}
      <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-[#060F1E] border-white/15 text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        {/* VOSviewer Header with Trinity Mode Switcher */}
        <div className={`p-4 sm:p-5 border-b flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border ${
              isDark 
                ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' 
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
              <Network className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold tracking-tight">
              Bibliometric Research Map <span className="text-blue-500 font-mono text-xs">(VOSviewer Dynamic Suite)</span>
            </h3>
          </div>
          <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {activeMode === 'network' && 'Network Visualization: Node size = research weight/citations, line = relation strength, color = thematic cluster.'}
            {activeMode === 'overlay' && 'Overlay Visualization: Color indicates publication timeline (Blue: Earlier -> Yellow/Red: Latest).'}
            {activeMode === 'density' && 'Density Visualization: Cyan/Teal = research gap/opportunity -> Yellow/Orange -> Vivid Red = dense publication cluster.'}
          </p>
        </div>

        {/* 3 Trinity Visualization Mode Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-mono font-semibold ${
            isDark ? 'bg-slate-900/90 border-white/15' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <button
              onClick={() => setActiveMode('network')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'network'
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network</span>
            </button>

            <button
              onClick={() => setActiveMode('overlay')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'overlay'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Overlay (Timeline)</span>
            </button>

            <button
              onClick={() => setActiveMode('density')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'density'
                  ? 'bg-gradient-to-r from-teal-500 to-amber-500 text-white font-bold shadow'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Density (Cyan-Orange)</span>
            </button>
          </div>

          {/* Zoom and Reset Controls */}
          <div className={`flex items-center p-1 rounded-xl border text-xs font-mono ${
            isDark ? 'bg-slate-900/80 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.8, Number((prev - 0.15).toFixed(2))))}
              title="Zoom out"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-[11px]">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, Number((prev + 0.15).toFixed(2))))}
              title="Zoom in"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); onSelectKeyword(null); setActiveCluster(null); }}
              title="Reset view and filters"
              className={`ml-1 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
                isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <RotateCcw className="w-3 h-3 text-blue-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Clusters Bar (for Network Mode) */}
      {activeMode === 'network' && (
        <div className={`px-4 sm:px-6 py-2.5 border-b flex items-center gap-2 flex-wrap overflow-x-auto text-[11px] font-mono ${
          isDark ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={`font-semibold mr-1 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Thematic Clusters ({clusters.length}):
          </span>
          <button
            onClick={() => setActiveCluster(null)}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              activeCluster === null
                ? isDark ? 'bg-slate-700 text-white font-bold' : 'bg-slate-800 text-white font-bold'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({nodes.length} nodes)
          </button>
          {clusters.map((cl) => {
            const isCurrent = activeCluster === cl.id;
            return (
              <button
                key={cl.id}
                onClick={() => setActiveCluster(isCurrent ? null : cl.id)}
                className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isCurrent
                    ? 'text-white font-bold shadow-md'
                    : isDark 
                      ? 'text-slate-400 hover:text-white border-transparent' 
                      : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
                style={{
                  backgroundColor: isCurrent ? cl.color : 'transparent',
                  borderColor: isCurrent ? cl.color : undefined
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: cl.color }}
                />
                <span>{cl.name} ({cl.keywordsCount})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Overlay Timeline Legend Bar (for Overlay Mode) */}
      {activeMode === 'overlay' && (
        <div className={`px-4 sm:px-6 py-2.5 border-b flex items-center justify-between gap-4 flex-wrap text-[11px] font-mono ${
          isDark ? 'bg-slate-950/40 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <span className="font-semibold">Publication Timeline Scale (Average Publication Year):</span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-400">{minYear}</span>
            <div className="w-48 sm:w-64 h-3.5 rounded-full border border-white/20 bg-gradient-to-r from-blue-500 via-cyan-400 via-emerald-400 via-amber-400 to-red-500 shadow-inner" />
            <span className="font-bold text-red-500">{maxYear} (Latest)</span>
          </div>
        </div>
      )}

      {/* Density Heatmap Legend Bar (Cyan -> Yellow -> Orange -> Vivid Red) */}
      {activeMode === 'density' && (
        <div className={`px-4 sm:px-6 py-2.5 border-b flex items-center justify-between gap-4 flex-wrap text-[11px] font-mono ${
          isDark ? 'bg-[#041F2D] border-teal-500/20 text-teal-200' : 'bg-teal-50/60 border-teal-200 text-teal-900'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Research Density Spectrum:</span>
            <span className="text-[10px] opacity-80">Cyan/Teal (Research Opportunity) &rarr; Yellow &rarr; Orange &rarr; Vivid Red (Dense Publication Cluster)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-teal-400">Cyan/Teal (0)</span>
            <div className="w-44 sm:w-56 h-3.5 rounded-full border border-teal-400/40 bg-gradient-to-r from-teal-500 via-cyan-400 via-yellow-400 via-orange-500 to-red-600 shadow-inner" />
            <span className="font-bold text-red-500">Vivid Red (+80)</span>
          </div>
        </div>
      )}

      {/* VOSviewer Interactive SVG Canvas (Theme Adaptive) */}
      <div className={`relative w-full h-[420px] sm:h-[490px] overflow-hidden select-none flex items-center justify-center transition-colors duration-300 ${
        activeMode === 'density'
          ? (isDark ? 'bg-radial from-[#062438] via-[#041A29] to-[#02101A]' : 'bg-radial from-[#F0FDFA] via-[#CCFBF1]/50 to-[#F8FAFC]')
          : (isDark ? 'bg-radial from-slate-900/90 via-[#050D1A] to-[#020610]' : 'bg-radial from-white via-slate-50 to-slate-100')
      }`}>
        
        {/* Subtle background grid */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `radial-gradient(${activeMode === 'density' ? (isDark ? '#2DD4BF' : '#0D9488') : (isDark ? '#38bdf8' : '#64748B')} 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            opacity: isDark ? 0.15 : 0.12
          }}
        />

        <svg 
          viewBox="0 0 800 480"
          className="w-full h-full max-w-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Dynamic Glow Gradients */}
            {clusters.map(cl => (
              <radialGradient key={cl.id} id={`dyn-glow-${cl.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={cl.color} stopOpacity={isDark ? "0.8" : "0.6"} />
                <stop offset="60%" stopColor={cl.color} stopOpacity={isDark ? "0.35" : "0.2"} />
                <stop offset="100%" stopColor={cl.color} stopOpacity="0" />
              </radialGradient>
            ))}

            {/* Density Heatmap Gradients (Biru Toska -> Kuning -> Orange -> Merah Menyala) */}
            {nodes.map(node => (
              <radialGradient key={`heat-${node.id}`} id={`heat-grad-${node.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" /> {/* Merah Menyala Inti */}
                <stop offset="25%" stopColor="#F97316" stopOpacity="0.8" /> {/* Oranye Hangat */}
                <stop offset="50%" stopColor="#FACC15" stopOpacity="0.6" /> {/* Kuning Terang */}
                <stop offset="75%" stopColor="#0D9488" stopOpacity="0.4" /> {/* Biru Toska / Teal */}
                <stop offset="90%" stopColor="#06B6D4" stopOpacity="0.15" /> {/* Cyan */}
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </radialGradient>
            ))}

            <filter id="vos-node-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity={isDark ? "0.6" : "0.25"}/>
            </filter>

            <filter id="vos-heat-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
            </filter>
          </defs>

          {/* 3. DENSITY HEATMAP LAYER (Biru Toska ke Orange Kemerahan) */}
          {activeMode === 'density' && (
            <g className="density-layer">
              {nodes.map((node) => {
                const heatRadius = Math.max(45, node.radius * 3.8);
                const opacity = isDark 
                  ? Math.min(0.95, Math.max(0.4, node.weight / 80))
                  : Math.min(0.85, Math.max(0.35, node.weight / 85));
                return (
                  <circle
                    key={`density-${node.id}`}
                    cx={node.x}
                    cy={node.y}
                    r={heatRadius}
                    fill={`url(#heat-grad-${node.id})`}
                    opacity={opacity}
                    filter="url(#vos-heat-blur)"
                    className="pointer-events-none"
                  />
                );
              })}
            </g>
          )}

          {/* 1. NETWORK LINKS (CONNECTING LINES) with distinct thickness */}
          {activeMode !== 'density' && (
            <g className="links">
              {links.map((link, idx) => {
                const sourceNode = nodeMap.get(link.source);
                const targetNode = nodeMap.get(link.target);
                if (!sourceNode || !targetNode) return null;

                const active = isLinkActive(link);
                const sourceCluster = clusters.find(c => c.id === sourceNode.cluster);
                
                let lineColor = isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(15, 23, 42, 0.12)';
                if (active) {
                  if (activeMode === 'overlay') {
                    lineColor = sourceNode.overlayColor;
                  } else {
                    lineColor = sourceCluster?.color || '#38BDF8';
                  }
                }

                // Dramatic line thickness contrast
                const normalizedLinkWeight = link.weight / (maxLinkWeight || 1);
                const strokeWidth = active 
                  ? (2.0 + normalizedLinkWeight * 4.2) 
                  : (0.9 + normalizedLinkWeight * 2.5);

                return (
                  <line
                    key={`link-${idx}`}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={lineColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={active ? (hoveredNode ? 0.95 : 0.8) : 0.25}
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>
          )}

          {/* Glow Rings (Network mode) */}
          {activeMode === 'network' && (
            <g className="glows">
              {nodes.map((node) => {
                const active = isNodeActive(node);
                if (!active && (hoveredNode || selectedKeyword)) return null;
                
                return (
                  <circle
                    key={`glow-${node.id}`}
                    cx={node.x}
                    cy={node.y}
                    r={node.radius * 2.2}
                    fill={`url(#dyn-glow-${node.cluster})`}
                    opacity={active ? (node.id === hoveredNode || node.id === selectedKeyword ? 0.95 : 0.45) : 0.1}
                    className="transition-all duration-300 pointer-events-none"
                  />
                );
              })}
            </g>
          )}

          {/* NODES LAYER (Distinct Size & High-Contrast Labels across Network, Overlay, & Density) */}
          <g className="nodes">
            {nodes.map((node) => {
              const active = isNodeActive(node);
              const isSelected = selectedKeyword?.toLowerCase() === node.id.toLowerCase();
              const isHovered = hoveredNode === node.id;
              const cluster = clusters.find(c => c.id === node.cluster) || clusters[0] || { color: '#3B82F6' };

              let nodeColor = cluster.color;
              if (activeMode === 'overlay') {
                nodeColor = node.overlayColor;
              } else if (activeMode === 'density') {
                nodeColor = isHovered ? '#FFFFFF' : '#EF4444';
              }

              const approxTextWidth = Math.max(38, node.name.length * (node.radius >= 24 ? 6.5 : 5.8));

              return (
                <g
                  key={`node-${node.id}`}
                  onClick={() => onSelectKeyword(isSelected ? null : node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-all duration-300 group"
                >
                  {/* Outer spinning dash ring on selection */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + 7}
                      fill="none"
                      stroke={isDark ? '#FFFFFF' : '#0F172A'}
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                  )}

                  {/* Node Circle with distinct radius */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered || isSelected ? node.radius * 1.18 : (activeMode === 'density' ? Math.max(8, node.radius * 0.5) : node.radius)}
                    fill={nodeColor}
                    fillOpacity={activeMode === 'density' ? (isHovered ? 1 : 0.9) : (active ? 0.95 : 0.25)}
                    stroke={
                      isSelected || isHovered 
                        ? (isDark ? '#FFFFFF' : '#0F172A') 
                        : (isDark ? 'rgba(255, 255, 255, 0.45)' : '#FFFFFF')
                    }
                    strokeWidth={isSelected || isHovered ? 2.5 : (node.radius >= 24 ? 2 : 1.5)}
                    filter={activeMode !== 'density' ? 'url(#vos-node-shadow)' : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Center Dot Indicator for Network and Overlay */}
                  {activeMode !== 'density' && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius >= 24 ? 4 : 2.5}
                      fill="#FFFFFF"
                      opacity={active ? 0.95 : 0.4}
                    />
                  )}

                  {/* High-Contrast Label Pill Badge for Density Mode */}
                  {activeMode === 'density' && (
                    <rect
                      x={node.x - approxTextWidth / 2 - 4}
                      y={node.y + 8}
                      width={approxTextWidth + 8}
                      height={18}
                      rx={5}
                      fill={isDark ? "rgba(4, 28, 44, 0.92)" : "rgba(255, 255, 255, 0.95)"}
                      stroke={isDark ? "rgba(45, 212, 191, 0.4)" : "rgba(20, 184, 166, 0.4)"}
                      strokeWidth={1}
                      className="pointer-events-none drop-shadow-sm"
                    />
                  )}

                  {/* Node Text Label */}
                  <text
                    x={node.x}
                    y={node.y + (activeMode === 'density' ? 20 : node.radius + (node.radius >= 24 ? 14 : 11))}
                    textAnchor="middle"
                    fill={
                      activeMode === 'density'
                        ? (isDark ? '#FFFFFF' : '#0F172A')
                        : (active 
                            ? (isDark ? '#FFFFFF' : '#0F172A') 
                            : (isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(15, 23, 42, 0.35)'))
                    }
                    fontSize={node.radius >= 26 ? '12px' : node.radius >= 18 ? '10px' : '8.5px'}
                    fontWeight={isSelected || isHovered || node.radius >= 24 ? 'bold' : '600'}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
                    className="transition-all duration-300 pointer-events-none"
                    style={{
                      textShadow: activeMode === 'density'
                        ? 'none'
                        : (isDark 
                            ? '0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9)' 
                            : '0 1px 2px rgba(255,255,255,0.95), 0 0 4px rgba(255,255,255,0.95)')
                    }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip info on hover */}
        {hoveredNode && nodeMap.get(hoveredNode) && (
          <div className={`absolute bottom-4 left-4 z-20 p-3.5 rounded-2xl backdrop-blur-md border shadow-2xl max-w-xs animate-fadeIn pointer-events-none ${
            isDark 
              ? 'bg-slate-900/95 border-white/20 text-white shadow-2xl' 
              : 'bg-white/95 border-slate-300 text-slate-900 shadow-xl'
          }`}>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-blue-500">
              <Sparkles className="w-3 h-3" />
              <span>{nodeMap.get(hoveredNode)?.clusterName}</span>
            </div>
            <h4 className="text-sm font-bold mt-0.5">
              #{nodeMap.get(hoveredNode)?.name}
            </h4>
            <div className={`flex flex-col gap-1 text-[11px] font-mono mt-2 pt-2 border-t ${
              isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center justify-between">
                <span>Total Citations: <strong>{nodeMap.get(hoveredNode)?.weight}+</strong></span>
                <span>Year: <strong>{nodeMap.get(hoveredNode)?.avgYear}</strong></span>
              </div>
              <div className="flex items-center justify-between text-emerald-500 font-bold pt-1">
                <span>{nodeMap.get(hoveredNode)?.occurrences} publications</span>
                <span>Click to Filter &rarr;</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom status bar */}
      <div className={`p-3 sm:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
        isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Active Mode: <strong>{
            activeMode === 'network' ? 'Network Visualization (Relations & Clusters)' : 
            activeMode === 'overlay' ? 'Overlay Visualization (Timeline Evolution)' : 
            'Density Visualization (Cyan -> Orange -> Vivid Red)'
          }</strong> &bull; {nodes.length} keywords mapped.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-emerald-500">VOSviewer Suite 3-in-1 Active</span>
        </div>
      </div>

      </div>
    </div>
  );
};
