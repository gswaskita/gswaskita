import React from 'react';
import { 
  Shield, 
  HeartHandshake, 
  Zap, 
  Activity, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Swords,
  Trophy,
  Flame,
  BrainCircuit
} from 'lucide-react';
import type { MartialArtItem, ThemeMode, PageId, PageContentData, SomaticReflectionsData } from '../../types';
import { INITIAL_PORTFOLIO_DATA } from '../../data/portfolioData';
import { useTheme } from '../../utils/useTheme';

interface BeyondAcademiaPageProps {
  items?: MartialArtItem[];
  pageContent?: PageContentData;
  somaticReflections?: SomaticReflectionsData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const BeyondAcademiaPage: React.FC<BeyondAcademiaPageProps> = ({
  items = [],
  pageContent: propPageContent,
  somaticReflections: propSomaticReflections,
  theme: propTheme,
  onNavigate,
  onOpenSanity
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  const somatic = propSomaticReflections || INITIAL_PORTFOLIO_DATA.somaticReflections!;
  const reflections = somatic.reflections || [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-7 h-7 text-blue-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-7 h-7 text-emerald-400" />;
      case 'Zap': return <Zap className="w-7 h-7 text-amber-400" />;
      default: return <Activity className="w-7 h-7 text-purple-400" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fadeIn overflow-hidden w-full max-w-full">
      {/* Top Breadcrumb Permalink & Philosophy Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <nav aria-label="Breadcrumb" className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono border ${
          isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <a href="/" className="hover:text-blue-500 transition-colors">
            <span>Home</span>
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-blue-500 font-semibold">Beyond Academia</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">{pageContent.beyondBreadcrumb || 'Holistic Discipline & Martial Synergy'}</span>
        </nav>

        <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {pageContent.beyondTaglineRight || 'Holistic Discipline • Somatic Conditioning & Research Rigor'}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <Swords className="w-3.5 h-3.5" />
          <span>{pageContent.beyondBadge || 'Holistic Discipline & Martial Arts Synergy'}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-light tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {pageContent.beyondPageTitle || 'Beyond Academia: Holistic Discipline'}
        </h1>

        <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {pageContent.beyondPageSubtitle || 'The grueling physical conditioning of full-contact martial arts serves as the foundational engine for intellectual clarity, stamina, and ethical integrity during intense doctoral research.'}
        </p>
      </div>

      {/* All Martial Arts Disciplines */}
      <div className="grid md:grid-cols-3 gap-8">
        {items.map((art, idx) => (
          <div
            key={idx}
            className={`p-7 sm:p-8 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-2xl ${
              isDark 
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-lg'
            }`}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}>
                  {getIcon(art.iconName)}
                </div>

                <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${
                  isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  {art.badge}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold">{art.name}</h3>
                <p className="text-xs font-mono text-blue-500 font-semibold">{art.type}</p>
                <p className={`text-xs italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  &ldquo;{art.subtitle}&rdquo;
                </p>
              </div>

              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {art.description}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs uppercase font-bold tracking-wider block font-mono text-slate-400">
                  Key Disciplines &amp; Tenets:
                </span>
                <ul className="space-y-1.5 text-xs">
                  {art.keyPillars.map((pillar, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{pillar}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`pt-5 mt-5 border-t space-y-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-blue-500 block">
                Doctoral Mindset Parallel:
              </span>
              <p className={`text-xs sm:text-sm leading-relaxed italic font-editorial-serif ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                &ldquo;{art.academicParallel}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Somatic Conditioning Reflection Cards */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {somatic.sectionTitle || 'Somatic Endurance & Research Philosophy'}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {somatic.sectionSubtitle || 'Personal reflections on how physical conditioning sharpens cognitive clarity and persistence.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reflections.map((ref, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border space-y-3 ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-blue-500">
                <BrainCircuit className="w-4 h-4" />
                <h3 className="font-bold text-sm">{ref.title}</h3>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed italic font-editorial-serif ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                &ldquo;{ref.quote}&rdquo;
              </p>
              <p className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/10">
                — {ref.author}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
