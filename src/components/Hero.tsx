import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Mail, 
  Award, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  Edit3, 
  BookOpen
} from 'lucide-react';
import type { AuthorProfile, ScholarStats, ThemeMode, PageId, PhdStatusData } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import { HeroCitationTrajectory } from './HeroCitationTrajectory';
import { useTheme } from '../utils/useTheme';
import { getAcademicLinks } from '../utils/academicLinks';

interface HeroProps {
  profile: AuthorProfile;
  scholarStats: ScholarStats;
  phdStatus?: PhdStatusData;
  theme?: ThemeMode;
  onOpenCV: () => void;
  onOpenContact: () => void;
  onOpenSanity: () => void;
  onNavigate: (page: PageId) => void;
}

// Authentic Academic Entity Icons
export const GoogleScholarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img" aria-label="Google Scholar">
    <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
  </svg>
);

export const OrcidIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" role="img" aria-label="ORCID">
    <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zM86.3 186.2H70.9V79.1h15.4v107.1zM78.6 61.7c-5.4 0-9.7-4.4-9.7-9.7 0-5.4 4.4-9.7 9.7-9.7 5.4 0 9.7 4.4 9.7 9.7 0 5.3-4.3 9.7-9.7 9.7zm119.2 70.9c0 32-21.5 53.6-53.5 53.6h-37.4V79.1h37.4c32 0 53.5 21.5 53.5 53.5zm-75.5-40.1v70.3h21.9c22.6 0 37.8-14.7 37.8-35.1 0-20.5-15.2-35.1-37.8-35.1h-21.9z" />
  </svg>
);

export const SintaIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SINTA Kemdikbud">
    <path
      d="M17.5 7.2C17.5 5 15.6 3.2 13.3 3.2H8.8C6.5 3.2 4.7 5 4.7 7.2C4.7 9 5.9 10.5 7.6 11L14.4 13C15.8 13.4 16.8 14.7 16.8 16.2C16.8 18 15.3 19.5 13.5 19.5H7.3C6.4 19.5 5.7 18.8 5.7 17.9C5.7 17 6.4 16.3 7.3 16.3H13.5C14.1 16.3 14.6 15.8 14.6 15.2C14.6 14.6 14.1 14.1 13.5 14.1L6.7 12.1C4.6 11.5 3.1 9.6 3.1 7.3C3.1 4.1 5.7 1.5 8.9 1.5H13.4C16.6 1.5 19.2 4.1 19.2 7.3C19.2 9.8 17.7 11.9 15.6 12.9C17.2 14 18.2 15.8 18.2 17.9C18.2 21.1 15.6 23.7 12.4 23.7H6.7C5.8 23.7 5.1 23 5.1 22.1C5.1 21.2 5.8 20.5 6.7 20.5H12.4C14.3 20.5 15.9 18.9 15.9 17C15.9 15.2 14.5 13.7 12.7 13.6L10.3 12.9C9.3 12.6 8.6 11.8 8.6 10.7C8.6 9.4 9.6 8.4 10.9 8.4H12.2C14.6 8.4 16.5 6.5 16.5 4.1"
      fill="currentColor"
    />
    <circle cx="17.5" cy="7.2" r="1.8" fill="#F59E0B" />
    <circle cx="7.3" cy="17.9" r="1.5" fill="#F59E0B" />
    <circle cx="14.4" cy="13" r="1.2" fill="#EA580C" />
  </svg>
);

export const ResearchGateIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img" aria-label="ResearchGate">
    <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.363 8.363 0 0 0-.085.545c-.738-.9-1.64-1.607-2.71-2.12C12.324-.407 11.135-.55 9.873-.55c-1.396 0-2.673.28-3.83.84-1.157.56-2.128 1.34-2.91 2.34-.784 1-1.368 2.18-1.75 3.54C.998 7.53.805 8.99.805 10.55c0 1.56.193 3.02.578 4.38.382 1.36.966 2.54 1.75 3.54.782 1 1.753 1.78 2.91 2.34 1.157.56 2.434.84 3.83.84 1.262 0 2.45-.143 3.52-.55 1.07-.407 1.972-1.113 2.71-2.12.03.18.06.36.085.545.027.185.065.33.112.437.243.744.65 1.303 1.213 1.68.565.375 1.255.565 2.073.565 1.01 0 1.838-.28 2.485-.84.647-.56 1.054-1.34 1.22-2.34l-2.035-.385c-.09.52-.296.9-.618 1.14-.322.24-.766.36-1.332.36-.61 0-1.073-.174-1.39-.523-.316-.35-.474-.888-.474-1.615V8.58c0-.727.158-1.266.474-1.615.317-.35.78-.524 1.39-.524.566 0 1.01.12 1.332.36.322.24.528.62.618 1.14l2.035-.385c-.166-1-.573-1.78-1.22-2.34C21.424.28 20.596 0 19.586 0z" />
  </svg>
);

export const Hero: React.FC<HeroProps> = ({
  profile,
  scholarStats,
  phdStatus: propPhdStatus,
  theme: propTheme,
  onOpenCV,
  onOpenContact,
  onOpenSanity,
  onNavigate
}) => {
  const phdStatus = propPhdStatus || INITIAL_PORTFOLIO_DATA.phdStatus!;
  const [imgError, setImgError] = useState(false);
  const [badgeLoading, setBadgeLoading] = useState<'eager' | 'lazy'>('eager');

  useEffect(() => {
    setImgError(false);
  }, [profile.avatarUrl]);

  useEffect(() => {
    const updateBadgeLoading = () => {
      const el = document.getElementById('hero-scholar-link');
      if (el) {
        let y = 0;
        let cur: HTMLElement | null = el;
        while (cur) {
          y += cur.offsetTop;
          cur = cur.offsetParent as HTMLElement | null;
        }
        setBadgeLoading(y <= window.innerHeight ? 'eager' : 'lazy');
      }
    };
    updateBadgeLoading();
    window.addEventListener('resize', updateBadgeLoading);
    return () => window.removeEventListener('resize', updateBadgeLoading);
  }, []);
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  // Calculate highest citation for sparkline normalization
  const maxYearCitation = Math.max(...((scholarStats?.yearlyCitations || []).map(y => y.count)), 100);

  const academicLinks = getAcademicLinks(profile);

  return (
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden w-full max-w-full">
      {/* Editorial Decorative Background Grid / Halo */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <div className={`w-[600px] h-[600px] rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          isDark ? 'bg-blue-600/40' : 'bg-blue-400/30'
        }`} />
        <div className={`w-[400px] h-[400px] rounded-full blur-2xl opacity-10 absolute -top-10 -right-10 ${
          isDark ? 'bg-indigo-500/30' : 'bg-indigo-300/30'
        }`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Dossier Header, Identity, Bio, Triangulation */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* Top Dossier Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border shadow-sm transition-all hover:border-blue-500/50 bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-500" />
            <span>{phdStatus.heroBadge || 'PhD Application Dossier • UK Universities Admission'}</span>
          </div>

          {/* Author Headshot & Key Identity Cluster */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            
            {/* Avatar Headshot with Ring */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-xl relative bg-slate-200 dark:bg-slate-800 transition-transform duration-300 group-hover:scale-105">
                {!imgError ? (
                  <img
                    src={profile.avatarImage || profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    fetchPriority="high"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white font-bold text-2xl">
                    <span>{profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-[#0A192F] shadow-sm" title="Active Academic Profile">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Title & Affiliation */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {profile.prefix && <span className="font-normal text-slate-500 dark:text-slate-400 text-xl sm:text-2xl mr-1">{profile.prefix}</span>}
                {profile.name}
                {profile.suffix && <span className="text-lg sm:text-xl font-medium text-blue-700 dark:text-blue-400 ml-2">{profile.suffix}</span>}
              </h1>
              
              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{profile.role}</span>
              </p>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {profile.faculty}, {profile.institution} &bull; {profile.location}
              </p>
            </div>

          </div>

          {/* Academic Tagline & Bio Statement */}
          <div className="space-y-3 pt-1">
            {/* Tagline: Responsive badges so text never cuts off on mobile */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(profile.tagline?.includes('·') || profile.tagline?.includes('•') || profile.tagline?.includes('|')) ? (
                profile.tagline.split(/\s*[·•|]\s*/).map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 px-2.5 sm:px-3 py-1 rounded-md shadow-2xs hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    {item.trim()}
                  </span>
                ))
              ) : (
                <span className="inline-block max-w-full text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 px-3 py-1 rounded-md">
                  {profile.tagline}
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg leading-relaxed font-serif text-slate-700 dark:text-slate-300 italic border-l-2 border-blue-500 pl-4 py-1">
              &ldquo;{profile.bioQuote}&rdquo;
            </p>
          </div>

          {/* Doctoral Research Target Banner */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isDark 
              ? 'bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-slate-900/60 border-blue-500/30 text-slate-200 shadow-lg shadow-blue-950/20' 
              : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border-blue-200 text-slate-800 shadow-sm'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 text-blue-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase font-mono tracking-wider text-blue-500">
                    {phdStatus.supervisoryTargetHeading || 'UK PhD Supervisory Target'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {phdStatus.supervisoryBadge || profile.supervisoryBadge || 'Open for Supervision'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                  {phdStatus.phdTargetProposal || profile.phdTargetProposal}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                  {phdStatus.phdTargetDescription || profile.phdTargetDescription}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            {profile.cvPdfUrl ? (
              <a
                href={profile.cvPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                id="hero-download-cv-btn"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Academic CV</span>
              </a>
            ) : (
              <button
                onClick={onOpenCV}
                id="hero-download-cv-btn"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Academic CV</span>
              </button>
            )}

            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent("PhD Supervision & Doctoral Research Dialogue - " + profile.name)}`}
              id="hero-contact-inquiry-btn"
              className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer ${
                isDark 
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white' 
                  : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
              }`}
            >
              <Mail className="w-4 h-4 text-blue-500" />
              <span>Scholarly Inquiry &amp; Supervision</span>
            </a>
          </div>

          {/* Triangulation Entity Badges (Google Scholar, ORCID, SINTA, ResearchGate, Scopus Logos) */}
          {academicLinks.activeCount > 0 && (
            <div className={`pt-4 border-t space-y-2.5 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <h3 className={`text-xs uppercase font-semibold tracking-wider block font-mono ${
                isDark ? 'text-blue-300' : 'text-blue-900'
              }`}>
                {phdStatus.verifiedTriangulationHeading || 'Verified Academic Triangulation:'}
              </h3>
              
              <div className={`grid gap-2.5 sm:gap-3 w-full pt-1 ${
                academicLinks.activeCount === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-3xl' :
                academicLinks.activeCount === 4 ? 'grid-cols-2 sm:grid-cols-4 max-w-2xl' :
                academicLinks.activeCount === 3 ? 'grid-cols-2 sm:grid-cols-3 max-w-xl' :
                academicLinks.activeCount === 2 ? 'grid-cols-2 max-w-md' :
                'grid-cols-1 max-w-xs'
              }`}>
                {/* 1. Google Scholar */}
                {academicLinks.scholarHref && (
                  <a
                    href={academicLinks.scholarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="hero-scholar-link"
                    title={`Google Scholar Profile: ${academicLinks.scholarHref}`}
                    aria-label="Google Scholar Profile"
                    className={`group h-11 sm:h-12 px-3 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-white/95 hover:bg-white border-white/20 shadow-black/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-slate-200/60'
                    }`}
                  >
                    <img
                      src="/static/logo/google-scholar-panjang.png"
                      alt="Google Scholar"
                      className="max-h-5.5 sm:max-h-6 max-w-[90%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading={badgeLoading}
                    />
                  </a>
                )}

                {/* 2. ORCID */}
                {academicLinks.orcidHref && (
                  <a
                    href={academicLinks.orcidHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="hero-orcid-link"
                    title={`ORCID Profile: ${academicLinks.orcidHref}`}
                    aria-label="ORCID Profile"
                    className={`group h-11 sm:h-12 px-3 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-white/95 hover:bg-white border-white/20 shadow-black/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-slate-200/60'
                    }`}
                  >
                    <img
                      src="/static/logo/ORCID-panjang.svg"
                      alt="ORCID"
                      className="max-h-5 sm:max-h-5.5 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading={badgeLoading}
                    />
                  </a>
                )}

                {/* 3. SINTA (Kemdiktisaintek) */}
                {academicLinks.sintaHref && (
                  <a
                    href={academicLinks.sintaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="hero-sinta-link"
                    title={`SINTA Kemdiktisaintek: ${academicLinks.sintaHref}`}
                    aria-label="SINTA Kemdiktisaintek Profile"
                    className={`group h-11 sm:h-12 px-3 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-white/95 hover:bg-white border-white/20 shadow-black/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-slate-200/60'
                    }`}
                  >
                    <img
                      src="/static/logo/sinta-panjang.png"
                      alt="SINTA Kemdiktisaintek"
                      className="max-h-6 sm:max-h-7 max-w-[80%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading={badgeLoading}
                    />
                  </a>
                )}

                {/* 4. ResearchGate */}
                {academicLinks.researchGateHref && (
                  <a
                    href={academicLinks.researchGateHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="hero-researchgate-link"
                    title={`ResearchGate: ${academicLinks.researchGateHref}`}
                    aria-label="ResearchGate Profile"
                    className={`group h-11 sm:h-12 px-3 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-white/95 hover:bg-white border-white/20 shadow-black/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-slate-200/60'
                    }`}
                  >
                    <img
                      src="/static/logo/ResearchGate-panjang.webp"
                      alt="ResearchGate"
                      className="max-h-4 sm:max-h-4.5 max-w-[92%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading={badgeLoading}
                    />
                  </a>
                )}

                {/* 5. Scopus */}
                {academicLinks.scopusHref && (
                  <a
                    href={academicLinks.scopusHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="hero-scopus-link"
                    title={`Scopus Profile: ${academicLinks.scopusHref}`}
                    aria-label="Scopus Profile"
                    className={`group h-11 sm:h-12 px-3 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-white/95 hover:bg-white border-white/20 shadow-black/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-slate-200/60'
                    }`}
                  >
                    <img
                      src="/static/logo/scopus-panjang.svg"
                      alt="Scopus"
                      className="max-h-5 sm:max-h-5.5 max-w-[88%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading={badgeLoading}
                    />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Google Scholar Metrics & Citation Trajectory in Hero */}
        <div className="lg:col-span-4 w-full min-w-0">
          <div className={`p-4 sm:p-6 lg:p-7 rounded-2xl border shadow-2xl space-y-5 sm:space-y-6 relative overflow-hidden transition-all w-full min-w-0 ${
            isDark 
              ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            
            {/* Metric Header */}
            <div className={`flex items-center justify-between pb-4 border-b ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" />
                <h3 className={`text-xs uppercase tracking-widest font-semibold ${
                  isDark ? 'text-blue-200' : 'text-blue-900'
                }`}>
                  Google Scholar Metrics
                </h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                isDark 
                  ? 'bg-white/10 text-emerald-300 border-white/15' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                Live Verified
              </span>
            </div>

            {/* Metric counters: Total Citations, h-index, i10-index */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-2xl font-bold block ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {scholarStats.totalCitations}+
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Citations</span>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-2xl font-bold text-blue-500 block">
                  {scholarStats.hIndex}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">h-index</span>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-2xl font-bold text-emerald-500 block">
                  {scholarStats.i10Index}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">i10-index</span>
              </div>
            </div>

            {/* Annual Citation Trajectory Graphical Table Component */}
            <div className="pt-1">
              <HeroCitationTrajectory
                scholarStats={scholarStats}
                theme={theme}
                onNavigateToResearch={() => onNavigate('research')}
              />
            </div>

            {/* Doctoral Proposal Focus Target */}
            <div className={`p-4 rounded-xl border space-y-1.5 ${
              isDark 
                ? 'bg-blue-950/60 border-blue-400/20 text-slate-200' 
                : 'bg-blue-50/70 border-blue-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{phdStatus.rightSupervisoryHeading || 'Doctoral Research Proposal Focus'}</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {phdStatus.rightSupervisoryDescription || 'Seeking supervisory alignment in Sustainable Value Chains, Service Operations, and Dynamic Capability Modeling for doctoral admission at UK business schools.'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
