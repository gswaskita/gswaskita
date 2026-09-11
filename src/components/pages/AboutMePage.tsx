import React from 'react';
import { 
  Compass, 
  Workflow, 
  Eye, 
  Lightbulb, 
  Target, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Download, 
  Mail, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  Home,
  Phone,
  ExternalLink
} from 'lucide-react';
import type { AboutPillar, ThemeMode, PageId, AuthorProfile, EducationData, PageContentData } from '../../types';
import { INITIAL_PORTFOLIO_DATA } from '../../data/portfolioData';
import { useTheme } from '../../utils/useTheme';

interface AboutMePageProps {
  pillars?: AboutPillar[];
  profile: AuthorProfile;
  education?: EducationData;
  pageContent?: PageContentData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  onOpenSanity?: () => void;
}

export const AboutMePage: React.FC<AboutMePageProps> = ({
  pillars = [],
  profile,
  education: propEducation,
  pageContent: propPageContent,
  theme: propTheme,
  onNavigate,
  onOpenCV,
  onOpenContact,
  onOpenSanity
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  const education = propEducation || INITIAL_PORTFOLIO_DATA.education!;
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  const educationTimeline = education.timeline || [];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fadeIn overflow-hidden w-full max-w-full">
      
      {/* Top Breadcrumb Permalink & Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <nav aria-label="Breadcrumb" className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono border ${
          isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <a href="/" className="hover:text-blue-500 transition-colors">
            <span>Home</span>
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-blue-500 font-semibold">About Me</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">{pageContent.aboutPageBreadcrumb || 'Academic Foundation'}</span>
        </nav>

        <div className="flex items-center gap-2">
          {profile.cvPdfUrl ? (
            <a
              href={profile.cvPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-sm ${
                isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV (PDF)</span>
            </a>
          ) : (
            <button
              onClick={onOpenCV}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-sm ${
                isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header on About Page */}
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <Compass className="w-3.5 h-3.5" />
            <span>{pageContent.aboutPageBadge || 'Comprehensive Academic Biography'}</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-light tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {pageContent.aboutPageTitle ? (
              <span>{pageContent.aboutPageTitle}</span>
            ) : (
              <>About <span className="font-bold text-blue-500">{profile.name}</span></>
            )}
          </h1>

          <p className="text-base sm:text-lg font-editorial-serif italic text-blue-500 max-w-3xl leading-relaxed">
            &ldquo;{profile.bioQuote}&rdquo;
          </p>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {profile.phdTargetDescription}
          </p>
        </div>

        {/* Author Portrait Card */}
        <div className="lg:col-span-4 flex justify-center">
          <div className={`p-4 rounded-2xl border shadow-2xl space-y-3 w-full max-w-sm ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-800 relative shadow-inner">
              <img
                src={profile.avatarImage || profile.avatarUrl || '/static/images/profile/avatarImage.jpeg'}
                alt={profile.name}
                referrerPolicy="no-referrer"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-950/80 text-white text-[10px] font-mono border border-white/20 backdrop-blur-sm shadow-md">
                {profile.aboutPhotoBadge || pageContent.aboutPhotoBadge || 'UK PhD Applicant'}
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {profile.name} {profile.suffix}
              </h3>
              <p className="text-xs text-blue-500 font-mono">{profile.role}</p>
              <p className="text-xs text-slate-400">{profile.institution}</p>
            </div>
          </div>
        </div>
      </div>

      {/* All 4 Core Academic Pillars */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {pageContent.aboutPillarsHeading || 'Foundational Research & Scholarly Pillars'}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {pageContent.aboutPillarsSubtitle || 'Four interconnected dimensions defining my analytical framework and research portfolio.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.id || idx}
              className={`p-7 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                    isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    Dimension 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold leading-snug">{pillar.title}</h3>
                
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                  {pillar.description}
                </p>

                {pillar.quote && (
                  <p className="text-xs sm:text-sm leading-relaxed italic font-editorial-serif text-blue-500 pt-1">
                    &ldquo;{pillar.quote}&rdquo;
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-2">
                {pillar.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium ${
                      isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Qualifications Timeline */}
      <div className="space-y-6">
        <div className="space-y-2">
          {education.sectionBadge && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{education.sectionBadge}</span>
            </div>
          )}
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {education.sectionTitle || 'Education & Academic Qualifications'}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {education.sectionDescription || 'Formal academic degrees, specialization tracks, and doctoral admission timeline.'}
          </p>
        </div>

        <div className="space-y-4">
          {educationTimeline.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold">{item.degree}</h3>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    item.status.includes('Prospective') 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-blue-500 font-medium">{item.institution}</p>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Focus: {item.focus}
                </p>
              </div>

              <div className="shrink-0 font-mono text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Affiliation & Domicile Addresses (Optional: Only rendered if at least one address is present) */}
      {(profile.campusAddress || profile.domicileAddress) && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <MapPin className="w-3.5 h-3.5" />
              <span>Verifiable Institutional Affiliation &amp; Correspondence</span>
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Academic Workplace &amp; Domicile Addresses
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Official university workplace affiliation and residential correspondence address for formal supervisory, research collaborations, and doctoral inquiries.
            </p>
          </div>

          <div className={`grid ${profile.campusAddress && profile.domicileAddress ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {/* Campus / Workplace Address */}
            {profile.campusAddress && (
              <div className={`p-7 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-500 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                          isDark ? 'text-blue-300' : 'text-blue-700'
                        }`}>
                          Afiliasi Kampus Tempat Kerja
                        </span>
                        <h3 className="text-base font-bold">{profile.institution}</h3>
                      </div>
                    </div>
                  </div>

                  {profile.faculty && (
                    <div className="text-xs font-mono text-blue-500 font-medium">
                      {profile.faculty}
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 space-y-2 text-xs leading-relaxed">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                      Alamat Kampus:
                    </span>
                    <p className={`whitespace-pre-line font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {profile.campusAddress}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={profile.campusMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${profile.institution} ${profile.campusAddress.replace(/\n/g, ' ')}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>Petunjuk Lokasi (Google Maps)</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Domicile / Personal Correspondence Address */}
            {profile.domicileAddress && (
              <div className={`p-7 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-500 shrink-0">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                          isDark ? 'text-emerald-300' : 'text-emerald-700'
                        }`}>
                          Alamat Domisili &amp; Korespondensi
                        </span>
                        <h3 className="text-base font-bold">Kediaman Resmi &bull; Korespondensi</h3>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-2 text-xs leading-relaxed">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                      Alamat Domisili Lengkap:
                    </span>
                    <p className={`whitespace-pre-line font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {profile.domicileAddress}
                    </p>
                  </div>

                  {/* Direct Contact Channels */}
                  <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {profile.email && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <a href={`mailto:${profile.email}`} className="text-blue-500 hover:underline truncate">
                          {profile.email}
                        </a>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="text-emerald-500 hover:underline truncate">
                          {profile.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={profile.domicileMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(profile.domicileAddress.replace(/\n/g, ' '))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Lokasi Domisili (Google Maps)</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UK PhD Research Proposal Focus Card */}
      <div className={`p-8 rounded-2xl border shadow-xl space-y-4 transition-all ${
        isDark 
          ? 'bg-blue-950/80 border-blue-400/30 text-white' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white border-blue-200 text-slate-900 shadow-md'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span className={`text-xs font-bold uppercase tracking-widest ${
            isDark ? 'text-emerald-300' : 'text-emerald-700 font-mono'
          }`}>
            Prospective PhD Dissertation Title &bull; UK Admission
          </span>
        </div>

        <h3 className={`text-xl sm:text-2xl font-bold leading-snug ${
          isDark ? 'text-white' : 'text-blue-950'
        }`}>
          &ldquo;{profile.phdTargetProposal}&rdquo;
        </h3>

        <p className={`text-sm leading-relaxed max-w-4xl ${
          isDark ? 'text-slate-200' : 'text-slate-700'
        }`}>
          {profile.phdTargetDescription}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent("PhD Supervision & Doctoral Research Dialogue - Gautama Sastra Waskita")}`}
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all shadow inline-flex items-center gap-2 cursor-pointer ${
              isDark 
                ? 'bg-white text-blue-950 hover:bg-blue-50' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>Initiate Supervisory Dialogue</span>
            <span>&rarr;</span>
          </a>
          <a
            href="/research"
            className={`px-6 py-2.5 rounded-full font-semibold text-xs border transition-all inline-flex items-center gap-2 cursor-pointer ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' 
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
            }`}
          >
            <span>Examine Published Papers</span>
          </a>
        </div>
      </div>

    </div>
  );
};
