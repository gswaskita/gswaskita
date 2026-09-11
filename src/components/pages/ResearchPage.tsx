import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Quote, 
  Check, 
  ArrowLeft,
  FileText,
  Award,
  Sparkles,
  Layers,
  Copy,
  ExternalLink,
  Tag
} from 'lucide-react';
import type { ResearchArticle, ThemeMode, PageId, PageContentData, ScholarStats } from '../../types';
import { INITIAL_PORTFOLIO_DATA } from '../../data/portfolioData';
import { useTheme } from '../../utils/useTheme';
import { VosViewerNetwork } from '../VosViewerNetwork';

interface ResearchPageProps {
  articles?: ResearchArticle[];
  scholarStats?: any;
  pageContent?: PageContentData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({
  articles = [],
  scholarStats,
  pageContent: propPageContent,
  theme: propTheme,
  onNavigate,
  onOpenSanity
}) => {
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'year' | 'citations'>('year');
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);
  const [selectedBibtex, setSelectedBibtex] = useState<ResearchArticle | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  const categories = ['All', 'Service Quality', 'SME Digitalization', 'Hospitality Operations', 'Consumer Behavior', 'Operations Management'];

  const filteredArticles = useMemo(() => {
    return (articles || [])
      .filter((article) => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        const matchesKeyword = !selectedKeyword || (article.keywords || []).some(k => k.toLowerCase() === selectedKeyword.toLowerCase());
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          (article.title || '').toLowerCase().includes(query) ||
          (article.authors || '').toLowerCase().includes(query) ||
          (article.journal || '').toLowerCase().includes(query) ||
          (article.doi && article.doi.toLowerCase().includes(query)) ||
          (article.abstract || '').toLowerCase().includes(query) ||
          (article.keywords || []).some(k => k.toLowerCase().includes(query));
        return matchesCategory && matchesKeyword && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'citations') {
          return (b.citations || 0) - (a.citations || 0);
        }
        return (b.year || 0) - (a.year || 0);
      });
  }, [articles, selectedCategory, selectedKeyword, searchQuery, sortBy]);

  // Robust Copy Helper with full textarea fallback
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

  const generateBibtex = (art: ResearchArticle) => {
    const key = `waskita${art.year}${art.id.replace('-', '')}`;
    return `@article{${key},
  author    = {${art.authors}},
  title     = {${art.title}},
  journal   = {${art.journal}},
  year      = {${art.year}},
  doi       = {${art.doi || 'N/A'}},
  url       = {${art.url}}
}`;
  };

  const handleCopyBibtex = (art: ResearchArticle) => {
    const text = generateBibtex(art);
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedBibtex(true);
        setTimeout(() => setCopiedBibtex(false), 2500);
      }).catch(() => {
        fallbackCopyText(text, 'bibtex');
        setCopiedBibtex(true);
        setTimeout(() => setCopiedBibtex(false), 2500);
      });
    } else {
      fallbackCopyText(text, 'bibtex');
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2500);
    }
  };

  const totalCitations = articles.reduce((acc, curr) => acc + curr.citations, 0);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn w-full max-w-full">
      {/* Top Breadcrumb Permalink & Stats Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <nav aria-label="Breadcrumb" className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono border ${
          isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <a href="/" className="hover:text-blue-500 transition-colors">
            <span>Home</span>
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-blue-500 font-semibold">Research</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">{pageContent.researchBreadcrumb || 'Peer-Reviewed Papers & DOI Repository'}</span>
        </nav>

        <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Total Papers: <strong>{articles.length}</strong> &bull; Total Paper Citations: <strong>{totalCitations}</strong>
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{pageContent.researchBadge || 'Full Research Repository • Journal Articles & Proceedings'}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-light tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {pageContent.researchTitle ? (
            <span>{pageContent.researchTitle}</span>
          ) : (
            <>Research <span className="font-bold text-blue-500">Articles &amp; Publications</span></>
          )}
        </h1>

        <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {pageContent.researchSubtitle || 'Explore peer-reviewed journal papers, empirical studies, and working manuscripts across Operations Management, Service Quality (SERVQUAL), SME Digital Transformation, and Qualitative Visual Methods.'}
        </p>
      </div>

      {/* VOSviewer Bibliometric Co-occurrence Network Visualization */}
      <VosViewerNetwork
        articles={articles}
        selectedKeyword={selectedKeyword}
        onSelectKeyword={(kw) => setSelectedKeyword(kw)}
        isDark={isDark}
        vosViewerUrl={scholarStats?.vosViewerUrl}
        vosViewerTitle={scholarStats?.vosViewerTitle}
        vosViewerDescription={scholarStats?.vosViewerDescription}
      />

      {/* Filter and Search Bar Controls */}
      <div className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, journal, keyword, DOI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 focus:border-blue-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-400 font-mono">Sort by:</span>
            <button
              onClick={() => setSortBy('year')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                sortBy === 'year'
                  ? isDark ? 'bg-white text-blue-950 border-white font-bold' : 'bg-blue-900 text-white font-bold'
                  : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              Year (Newest)
            </button>
            <button
              onClick={() => setSortBy('citations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                sortBy === 'citations'
                  ? isDark ? 'bg-white text-blue-950 border-white font-bold' : 'bg-blue-900 text-white font-bold'
                  : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              Citations (Highest)
            </button>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? isDark 
                    ? 'bg-blue-600 text-white border-blue-400 font-bold shadow' 
                    : 'bg-blue-900 text-white border-blue-900 font-bold shadow'
                  : isDark 
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border space-y-3 ${
            isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <p className="text-sm">No research articles match your search or filter criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedKeyword(null); }}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className={`p-6 sm:p-8 rounded-2xl border transition-all space-y-4 hover:shadow-xl ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-white/40' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                      isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                      {article.category}
                    </span>
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
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      article.status === 'Published' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    }`}>
                      {article.status}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold leading-snug">
                    {article.title}
                  </h3>

                  <div className="space-y-1 text-xs font-mono">
                    <p className="text-blue-500 font-semibold">
                      {article.journal}
                    </p>
                    {/* Full Authors List */}
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
                          title={`Filter publications by #${kw}`}
                          className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
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
                </div>
              </div>

              {/* Abstract */}
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {article.abstract}
              </p>

              {/* Bottom Action Footer */}
              <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Clickable & Copyable DOI in New Tab */}
                  {article.doi && (
                    <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 overflow-hidden shadow-xs">
                      <a
                        href={article.doi.startsWith('http') ? article.doi : `https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open DOI in new tab"
                        className="px-2.5 py-1 text-xs font-mono font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/10 flex items-center gap-1 transition-colors"
                      >
                        <Quote className="w-3 h-3 text-blue-500" />
                        <span>DOI: {article.doi}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                      <button
                        onClick={(e) => handleCopyDoi(article.doi, e)}
                        title="Copy DOI link to clipboard"
                        className="px-2 py-1 border-l border-slate-200 dark:border-white/15 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedDoi === article.doi ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedBibtex(article)}
                    className={`text-xs font-mono flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isDark ? 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <FileText className="w-3 h-3 text-blue-500" />
                    <span>BibTeX Citation</span>
                  </button>
                </div>

                {/* Direct Journal Link in New Tab */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open original journal article on publisher portal"
                  className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all hover:scale-105"
                >
                  <span>Direct Journal Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))
        )}
      </div>

      {/* BibTeX Citation Modal */}
      {selectedBibtex && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedBibtex(null)}
        >
          <div
            className={`max-w-2xl w-full p-6 sm:p-7 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0A192F] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm">BibTeX Academic Citation Export</h3>
              </div>
              <button
                onClick={() => setSelectedBibtex(null)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Close (ESC)
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto border border-white/10">
              {generateBibtex(selectedBibtex)}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Ready for LaTeX, Overleaf, Zotero, Mendeley</span>
              <button
                onClick={() => handleCopyBibtex(selectedBibtex)}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBibtex ? 'Copied to Clipboard!' : 'Copy BibTeX'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
