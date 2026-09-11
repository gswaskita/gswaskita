import React from 'react';
import { 
  Heart, 
  ArrowUp, 
  ArrowUpRight, 
  Database, 
  FileText, 
  Mail, 
  Award,
  Sparkles,
  Code,
  LogIn,
  Lock,
  ShieldCheck
} from 'lucide-react';
import type { AuthorProfile, PageId, ThemeMode, AuthUser } from '../types';
import { getAcademicLinks } from '../utils/academicLinks';

interface FooterProps {
  profile: AuthorProfile;
  theme: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  theme,
  onNavigate,
  onOpenSanity,
  onOpenCV,
  onOpenContact,
  currentUser,
  onOpenLogin
}) => {
  const isDark = theme === 'dark';
  const academicLinks = getAcademicLinks(profile);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t transition-colors duration-200 overflow-hidden w-full max-w-full ${
      isDark 
        ? 'bg-[#060f1e] border-white/10 text-slate-300' 
        : 'bg-slate-100 border-slate-200 text-slate-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm shadow bg-blue-600 text-white shrink-0 border border-slate-200 dark:border-white/10">
                {(profile.brandImage || profile.brandImageUrl) ? (
                  <img
                    src={profile.brandImage || profile.brandImageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>GW</span>
                )}
              </div>
              <div>
                <span className={`font-bold text-base block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {profile.name} {profile.suffix}
                </span>
                <span className="text-xs text-blue-500 font-mono block">
                  {profile.role}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm">
              Academic portfolio and doctoral candidate dossier prepared for prospective PhD supervision in Operations Management, Sustainable Value Chains, and SME Digitalization across UK universities.
            </p>

            <div className="flex items-center gap-2 pt-2">
              {currentUser?.role === 'admin' ? (
                <a
                  href="/keystatic"
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300 hover:bg-blue-900' : 'bg-white border-blue-200 text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  <span>Keystatic CMS Editor</span>
                </a>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin / Member Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Pages Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Academic Pages
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              {[
                { id: 'home', label: 'Home Portfolio' },
                { id: 'about', label: 'About Me & Qualifications' },
                { id: 'research', label: 'Research Articles Repository' },
                { id: 'books', label: 'Books & Academic Monographs' },
                { id: 'blog', label: 'Research Blog & Dynamic ToC' },
                { id: 'gallery', label: 'Fieldwork Photo Gallery' },
                { id: 'beyond', label: 'Beyond Academia (Disciplines)' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id as PageId);
                      scrollToTop();
                    }}
                    className="hover:text-blue-500 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Identifiers */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Scholarly Triangulation
            </h3>
            <ul className="space-y-2 text-xs font-mono">
              {academicLinks.scholarHref && (
                <li>
                  <a
                    href={academicLinks.scholarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-500 hover:underline"
                  >
                    <span>Google Scholar Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
              {academicLinks.orcidHref && (
                <li>
                  <a
                    href={academicLinks.orcidHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-500 hover:underline"
                  >
                    <span>ORCID Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
              {academicLinks.sintaHref && (
                <li>
                  <a
                    href={academicLinks.sintaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-amber-500 hover:underline"
                  >
                    <span>SINTA Kemdiktisaintek</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
              {academicLinks.researchGateHref && (
                <li>
                  <a
                    href={academicLinks.researchGateHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-teal-500 hover:underline"
                  >
                    <span>ResearchGate Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
              {academicLinks.scopusHref && (
                <li>
                  <a
                    href={academicLinks.scopusHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-orange-500 hover:underline"
                  >
                    <span>Scopus Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Actions & Inquiry */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Doctoral Inquiry
            </h3>
            <div className="space-y-2">
              <button
                onClick={onOpenCV}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  isDark ? 'bg-white/5 border-white/15 text-white hover:bg-white/10' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Curriculum Vitae</span>
              </button>
              
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Academic Inquiry & Collaboration - Gautama Sastra Waskita")}`}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Gautama</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Scroll to Top */}
        {/* Bottom copyright, Attribution & Scroll to Top */}
        <div className={`pt-8 border-t grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-4 text-xs font-mono ${
          isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-500'
        }`}>
          <div className="text-center md:text-left">
            &copy; {new Date().getFullYear()} {profile.name}. All Rights Reserved.
          </div>

          <div className="flex justify-center text-center">
            <p className="footer-heart inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300">
              <span>Made with</span>
              <span className="g-emoji inline-flex items-center">
                <img className="emoji inline-block align-middle w-4 h-4 mx-0.5" alt="heart" height="16" width="16" src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png" />
              </span>{' '}
              <span>by</span>
              <a href="https://masden.klikada.com" target="_blank" rel="noopener noreferrer" className="footer-heart-link font-bold">masden.</a><a href="https://masden.klikada.com" target="_blank" rel="noopener noreferrer" className="footer-logo-link inline-flex items-center" title="klikada.com"><span className="g-emoji inline-flex items-center"><img className="emoji inline-block align-middle h-5 w-auto object-contain hover:opacity-80 transition-opacity" alt="klikada.com" width="129" height="20" src="https://cloud.klikada.com/image/klikada.com-logo.png" /></span></a>
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
