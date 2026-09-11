import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CheckCircle,
  Sparkles,
  Printer
} from 'lucide-react';
import type { PortfolioDataState, ThemeMode } from '../types';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioDataState;
  theme: ThemeMode;
}

export const CVModal: React.FC<CVModalProps> = ({
  isOpen,
  onClose,
  data,
  theme
}) => {
  if (!isOpen) return null;

  const { profile, scholarStats, books } = data;
  const articles = data.articles || data.researchArticles || [];
  const isDark = theme === 'dark';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-[#0A192F] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Top Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'bg-[#0d2242] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-bold">Curriculum Vitae (Academic Dossier)</h2>
          </div>

          <div className="flex items-center gap-2">
            {profile.cvPdfUrl && (
              <a
                href={profile.cvPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF File</span>
              </a>
            )}
            <button
              onClick={handlePrint}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-300' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable CV Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 print:p-0">
          
          {/* Header Banner */}
          <div className="border-b pb-6 space-y-3 border-slate-300/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {profile.name} {profile.suffix}
                </h1>
                <p className="text-sm font-semibold text-blue-500">
                  {profile.role} &bull; {profile.institution}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Prospective PhD Candidate &bull; UK Universities Admission Track
                </p>
              </div>

              <div className="text-xs space-y-1 font-mono text-slate-400">
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>{profile.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  <span>{profile.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{profile.location}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Academic Identifiers Bar */}
          <div className={`p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className="text-slate-400 block text-[10px]">Google Scholar</span>
              <strong className="text-blue-500">{profile.scholarId}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Citations</span>
              <strong className="text-emerald-500">{scholarStats.totalCitations}+</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">h-index</span>
              <strong className="text-amber-500">{scholarStats.hIndex}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ORCID</span>
              <strong className="text-blue-500">{profile.orcidId}</strong>
            </div>
          </div>

          {/* Research Vision for UK PhD */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b pb-1 border-slate-300/30 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Doctoral Research Focus (UK University Application)</span>
            </h2>
            <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
              isDark ? 'bg-blue-950/40 border-blue-400/20' : 'bg-blue-50 border-blue-200'
            }`}>
              <p className="font-bold text-blue-600 mb-1">
                &ldquo;{profile.phdTargetProposal}&rdquo;
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                {profile.phdTargetDescription}
              </p>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b pb-1 border-slate-300/30 font-mono">
              <GraduationCap className="w-4 h-4" />
              <span>{data.education?.sectionTitle || 'Academic Degrees & Qualifications'}</span>
            </h2>
            <div className="space-y-3 text-xs">
              {(data.education?.timeline || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div>
                    <strong className="text-sm block">{item.degree}</strong>
                    <span className="text-blue-500 font-medium">{item.institution}</span>
                    <p className="text-slate-400 mt-0.5">{item.focus} {item.status ? `• ${item.status}` : ''}</p>
                  </div>
                  <span className="font-mono text-slate-400 shrink-0">{item.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Peer-Reviewed Publications */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b pb-1 border-slate-300/30 font-mono">
              <BookOpen className="w-4 h-4" />
              <span>Selected Peer-Reviewed Publications ({articles.length})</span>
            </h2>
            <div className="space-y-3 text-xs">
              {articles.map((art, idx) => (
                <div key={art.id} className="space-y-1">
                  <p className="leading-snug">
                    <strong className="font-mono text-blue-500">[{idx + 1}]</strong> {art.authors} ({art.year}). <em>&ldquo;{art.title}&rdquo;</em>. <strong>{art.journal}</strong>. {art.doi ? `DOI: ${art.doi}` : ''} ({art.citations} citations).
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Books and Monographs */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b pb-1 border-slate-300/30 font-mono">
              <Award className="w-4 h-4" />
              <span>Authored Books &amp; Academic Monographs ({books.length})</span>
            </h2>
            <div className="space-y-2 text-xs">
              {books.map((b, idx) => (
                <div key={b.id}>
                  <p className="leading-snug">
                    <strong>[{idx + 1}]</strong> {profile.name} ({b.year}). <em>{b.title}: {b.subtitle}</em>. {b.publisher}. ISBN: {b.isbn}.
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className={`p-4 border-t flex items-center justify-end gap-3 shrink-0 ${
          isDark ? 'bg-[#0d2242] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF / Print</span>
          </button>
        </div>

      </div>
    </div>
  );
};
