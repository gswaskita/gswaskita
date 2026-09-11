import React from 'react';
import { 
  Shield, 
  HeartHandshake, 
  Zap, 
  Activity, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Swords
} from 'lucide-react';
import type { MartialArtItem, ThemeMode, PageId, PageContentData } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import { useTheme } from '../utils/useTheme';

interface BeyondAcademiaProps {
  items?: MartialArtItem[];
  pageContent?: PageContentData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const BeyondAcademia: React.FC<BeyondAcademiaProps> = ({
  items = [],
  pageContent: propPageContent,
  theme: propTheme,
  onNavigate,
  onOpenSanity
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  // Point 7: On Homepage show 3 martial art disciplines only
  const homeDisciplines = (items || []).slice(0, 3);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-6 h-6 text-blue-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-emerald-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      default: return <Activity className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <section id="beyond" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t overflow-hidden w-full max-w-full ${
      isDark ? 'border-white/10' : 'border-slate-200'
    }`}>
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="max-w-2xl space-y-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark 
              ? 'bg-white/10 border-white/15 text-blue-300' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <Swords className="w-3.5 h-3.5" />
            <span>{pageContent.beyondBadge || 'Holistic Discipline & Martial Arts Synergy'}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {pageContent.beyondTitle ? (
              <span>{pageContent.beyondTitle}</span>
            ) : (
              <>Beyond <span className="font-bold text-blue-500">Academia</span></>
            )}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {pageContent.beyondSubtitle || 'Martial arts, ethical brotherhood, and physical endurance as the foundational engine for doctoral research rigor.'}
          </p>
        </div>

        <a
          href="/beyond"
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all border ${
            isDark 
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
              : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <span>{pageContent.beyondCta || 'Explore Holistic Discipline Portal'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
        </a>
      </div>

      {/* 3 Martial Arts Cards Grid on Homepage */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        {homeDisciplines.map((art, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-xl group ${
              isDark 
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-white/40' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-blue-300'
            }`}
          >
            <div className="space-y-4">
              {/* Icon & Badge */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}>
                  {getIcon(art.iconName)}
                </div>

                <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${
                  isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  {art.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h3 className={`text-lg sm:text-xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {art.name}
                </h3>
                <p className="text-xs font-mono text-blue-500 font-medium">
                  {art.type}
                </p>
                <p className={`text-xs italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  &ldquo;{art.subtitle}&rdquo;
                </p>
              </div>

              {/* Description */}
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {art.description}
              </p>

              {/* Key Pillars */}
              <div className="space-y-1.5 pt-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider block font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Core Tenets:
                </span>
                <ul className="space-y-1 text-xs">
                  {art.keyPillars.map((pillar, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{pillar}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Academic Parallel Box */}
            <div className={`pt-4 mt-4 border-t space-y-1.5 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-500 block">
                PhD Parallel:
              </span>
              <p className={`text-xs leading-relaxed italic font-editorial-serif ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                &ldquo;{art.academicParallel}&rdquo;
              </p>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
