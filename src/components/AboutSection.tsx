import React from 'react';
import { 
  Compass, 
  Workflow, 
  Eye, 
  Lightbulb, 
  Target, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { AboutPillar, ThemeMode, PageId, AuthorProfile, PageContentData, PhdStatusData } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import { useTheme } from '../utils/useTheme';

interface AboutSectionProps {
  pillars?: AboutPillar[];
  profile: AuthorProfile;
  pageContent?: PageContentData;
  phdStatus?: PhdStatusData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  pillars = [],
  profile,
  pageContent: propPageContent,
  phdStatus,
  theme: propTheme,
  onNavigate
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  // Point 9: Academic Foundation tampilkan 2 saja di homepage
  const homePillars = (pillars || []).slice(0, 2);

  const proposalHeading = 
    phdStatus?.bannerProposalHeading || 
    pageContent?.aboutProposalHeading || 
    'Doctoral Research Proposal Focus';

  const proposalTitle = 
    phdStatus?.bannerProposalTitle || 
    pageContent?.aboutProposalTitle || 
    'Sustaining Dynamic Capabilities in Decentralized SME Value Networks: A Multi-Method Qualitative Investigation';

  const proposalButtonText = 
    phdStatus?.bannerProposalButtonText || 
    pageContent?.aboutProposalCta || 
    'View Full Proposal & CV →';

  const proposalButtonUrl = 
    phdStatus?.bannerProposalButtonUrl || 
    pageContent?.aboutProposalUrl || 
    '/about';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Workflow': return <Workflow className="w-6 h-6" />;
      case 'Eye': return <Eye className="w-6 h-6" />;
      case 'Lightbulb': return <Lightbulb className="w-6 h-6" />;
      default: return <Compass className="w-6 h-6" />;
    }
  };

  return (
    <section id="about" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t overflow-hidden w-full max-w-full ${
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
            <Compass className="w-3.5 h-3.5" />
            <span>{pageContent.aboutSectionBadge || 'Academic Foundation & Research Pillars'}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {pageContent.aboutSectionTitle ? (
              <span>{pageContent.aboutSectionTitle}</span>
            ) : (
              <>About <span className="font-bold text-blue-500">Me</span></>
            )}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {pageContent.aboutSectionSubtitle || 'Bridging operational rigor with qualitative depth for doctoral inquiries in the United Kingdom.'}
          </p>
        </div>

        <a
          href="/about"
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all border ${
            isDark 
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
              : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <span>{pageContent.aboutSectionCta || 'Read Full Biography & Journey'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
        </a>
      </div>

      {/* 2 Core Foundation Pillars Grid on Homepage */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        {homePillars.map((pillar, idx) => (
          <div 
            key={pillar.id || idx}
            className={`p-6 sm:p-8 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-xl ${
              isDark 
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-white/40' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-blue-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  idx === 0
                    ? isDark 
                      ? 'bg-blue-600/30 border-blue-400/30 text-blue-300' 
                      : 'bg-blue-100 border-blue-200 text-blue-700'
                    : isDark 
                      ? 'bg-indigo-600/30 border-indigo-400/30 text-indigo-300' 
                      : 'bg-indigo-100 border-indigo-200 text-indigo-700'
                }`}>
                  {getIcon(pillar.icon)}
                </div>
                <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-md border ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  Pillar 0{idx + 1}
                </span>
              </div>

              <h3 className={`text-xl font-bold leading-snug ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {pillar.title}
              </h3>

              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-slate-200' : 'text-slate-600'
              }`}>
                {pillar.description}
              </p>

              {pillar.quote && (
                <p className={`text-xs sm:text-sm leading-relaxed italic font-editorial-serif pt-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700 font-medium'
                }`}>
                  &ldquo;{pillar.quote}&rdquo;
                </p>
              )}
            </div>

            <div className={`pt-4 mt-4 border-t flex flex-wrap gap-2 ${
              isDark ? 'border-white/15' : 'border-slate-200'
            }`}>
              {pillar.tags.map((tag, tIdx) => (
                <span 
                  key={tIdx}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-blue-200' 
                      : 'bg-slate-100 border-slate-200 text-blue-800'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PhD Aspirations Summary Banner */}
      <div className={`mt-8 p-6 sm:p-7 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg transition-all ${
        isDark 
          ? 'bg-blue-950/70 backdrop-blur-md border-blue-400/30 text-white' 
          : 'bg-gradient-to-r from-blue-50 via-indigo-50/80 to-blue-50 border-blue-200 text-slate-900 shadow-md'
      }`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className={`text-xs font-bold tracking-wide ${
              isDark ? 'text-emerald-300' : 'text-emerald-700'
            }`}>
              {proposalHeading}
            </span>
          </div>
          <p className={`text-sm sm:text-base font-bold leading-relaxed ${
            isDark ? 'text-white' : 'text-blue-950'
          }`}>
            &ldquo;{proposalTitle}&rdquo;
          </p>
        </div>
        <a
          href={proposalButtonUrl}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow text-center cursor-pointer ${
            isDark 
              ? 'bg-white text-blue-950 hover:bg-blue-50' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {proposalButtonText}
        </a>
      </div>

    </section>
  );
};
