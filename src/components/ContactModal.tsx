import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Phone, 
  MapPin, 
  Check, 
  GraduationCap, 
  Sparkles,
  ArrowUpRight,
  Building2,
  Home
} from 'lucide-react';
import type { AuthorProfile, ThemeMode } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AuthorProfile;
  theme: ThemeMode;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  profile,
  theme
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [inquiryType, setInquiryType] = useState('PhD Supervisory Dialogue');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-[#0A192F] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'bg-[#0d2242] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-base font-bold">Academic Inquiry &amp; Contact</h2>
              <p className="text-xs text-slate-400">UK PhD Admissions &bull; Research Collaborations &bull; Speaking</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark ? 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-300' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold">Inquiry Transmitted Successfully</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Thank you for reaching out. A confirmation copy will be routed to {profile.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Direct channels */}
              <div className={`p-4 rounded-xl border grid sm:grid-cols-2 gap-3 text-xs font-mono ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Direct Email:</span>
                  <a href={`mailto:${profile.email}`} className="text-blue-500 font-bold hover:underline break-all">
                    {profile.email}
                  </a>
                </div>
                {profile.phone ? (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Phone / WhatsApp:</span>
                    <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="text-emerald-500 font-bold hover:underline">
                      {profile.phone}
                    </a>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Institution:</span>
                    <span className="font-semibold">{profile.institution}</span>
                  </div>
                )}
              </div>

              {/* Optional Verifiable Addresses (Rendered ONLY if filled) */}
              {(profile.campusAddress || profile.domicileAddress) && (
                <div className={`grid ${profile.campusAddress && profile.domicileAddress ? 'sm:grid-cols-2' : 'grid-cols-1'} gap-3`}>
                  {profile.campusAddress && (
                    <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold text-blue-500 text-[11px]">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Alamat Kampus Afiliasi:</span>
                      </div>
                      <p className="font-semibold text-xs">{profile.institution}</p>
                      <p className="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed">
                        {profile.campusAddress}
                      </p>
                    </div>
                  )}

                  {profile.domicileAddress && (
                    <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold text-emerald-500 text-[11px]">
                        <Home className="w-3.5 h-3.5 shrink-0" />
                        <span>Alamat Domisili Korespondensi:</span>
                      </div>
                      <p className="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed">
                        {profile.domicileAddress}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-400">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. / Dr. / Scholar Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-400">Your Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="scholar@university.ac.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-400">Affiliated University / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. University of Warwick / Manchester"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-400">Subject / Inquiry Type</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                    }`}
                  >
                    <option value="PhD Supervisory Dialogue">PhD Supervisory Dialogue (UK)</option>
                    <option value="Research Co-Authorship">Research Co-Authorship / Grant</option>
                    <option value="Journal Peer Review">Journal Editorial / Review Invitation</option>
                    <option value="Keynote / Guest Lecture">Keynote / Guest Lecture</option>
                    <option value="Book Purchase / Adoption">Academic Book Adoption</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-400">Message / Doctoral Inquiry</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your inquiry, proposed supervisory alignment, or collaboration scope..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-medium border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
