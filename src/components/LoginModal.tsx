import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  Mail, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  Check, 
  Database,
  ArrowRight,
  LogOut,
  Building
} from 'lucide-react';
import type { AuthUser, ThemeMode } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  onOpenSanity?: () => void;
  theme: ThemeMode;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onOpenSanity,
  theme
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'admin' | 'member'>('admin');
  
  // Admin form state
  const [adminEmail, setAdminEmail] = useState('admin@sastrawaskita.com');
  const [adminPassword, setAdminPassword] = useState('gautama2025');
  const [adminError, setAdminError] = useState('');

  // Member form state
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberInstitution, setMemberInstitution] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setAdminError('Please fill in both email and password');
      return;
    }

    if (adminPassword !== 'gautama2025' && adminPassword !== 'admin') {
      setAdminError('Password salah. Gunakan: gautama2025');
      return;
    }

    const adminUser: AuthUser = {
      id: 'admin-gautama',
      name: 'Gautama S. Waskita (Admin)',
      email: adminEmail,
      role: 'admin',
      institution: 'Universitas Tulungagung',
      title: 'Site Owner & Administrator'
    };

    onLogin(adminUser);
    onClose();
    window.location.href = '/keystatic';
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;

    const memberUser: AuthUser = {
      id: `member-${Date.now()}`,
      name: memberName.trim(),
      email: memberEmail.trim(),
      role: 'member',
      institution: memberInstitution.trim() || 'Academic Visitor / Scholar'
    };

    onLogin(memberUser);
    onClose();
  };

  const handleQuickDemoAdmin = () => {
    const adminUser: AuthUser = {
      id: 'admin-gautama',
      name: 'Gautama S. Waskita (Admin)',
      email: 'admin@sastrawaskita.com',
      role: 'admin',
      institution: 'Universitas Tulungagung',
      title: 'Principal Author & Administrator'
    };
    onLogin(adminUser);
    onClose();
    window.location.href = '/keystatic';
  };

  const handleQuickDemoScholar = () => {
    const memberUser: AuthUser = {
      id: 'scholar-peer',
      name: 'Prof. David Hughes',
      email: 'd.hughes@warwick.ac.uk',
      role: 'member',
      institution: 'University of Warwick (UK)',
      title: 'Operations Management Reviewer'
    };
    onLogin(memberUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-[#0A192F] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'bg-[#0d2242] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-base font-bold">Academic Portal Authentication</h2>
              <p className="text-[11px] text-slate-400">Keystatic CMS Management &amp; Scholarly Commenting</p>
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
        <div className="p-6 space-y-6">
          
          {/* Current Logged-in State */}
          {currentUser ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex items-start justify-between ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">{currentUser.name}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        currentUser.role === 'admin' 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                    {currentUser.institution && (
                      <p className="text-[11px] font-mono text-blue-400 mt-0.5">{currentUser.institution}</p>
                    )}
                  </div>
                </div>
              </div>


              <button
                onClick={() => {
                  onLogout();
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  isDark ? 'bg-red-950/40 border-red-500/30 text-red-300 hover:bg-red-900/40' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Login Mode Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'admin'
                      ? 'bg-blue-600 text-white shadow font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin (CMS Editor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('member')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'member'
                      ? 'bg-blue-600 text-white shadow font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Academic Member (Comment)</span>
                </button>
              </div>

              {/* ADMIN LOGIN FORM */}
              {activeTab === 'admin' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isDark ? 'bg-blue-950/40 border-blue-400/20 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}>
                    <p className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Admin CMS Access:</span>
                    </p>
                    <p className="mt-1 text-[11px] opacity-80">
                      Sign in as Gautama to modify all website data, scholar metrics, books, articles, blog posts, and photo gallery via Keystatic CMS Studio.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-slate-400">Admin Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-slate-400">Password / Access Key</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  {adminError && (
                    <p className="text-xs text-red-400 font-mono">{adminError}</p>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In as Admin &bull; Open CMS</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickDemoAdmin}
                      className={`w-full py-2 rounded-xl text-[11px] font-mono border transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      ⚡ Quick 1-Click Admin Sign-In (Demo)
                    </button>
                  </div>
                </form>
              )}

              {/* MEMBER LOGIN FORM */}
              {activeTab === 'member' && (
                <form onSubmit={handleMemberSubmit} className="space-y-4">
                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isDark ? 'bg-emerald-950/40 border-emerald-400/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <p className="font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Scholarly Member / Peer Login:</span>
                    </p>
                    <p className="mt-1 text-[11px] opacity-80">
                      Enter your name and university affiliation to post comments, ask research questions, and engage in peer discussions.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-slate-400">Your Full Name &amp; Title</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Jane Smith / Alex Chen"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-slate-400">Academic / Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="scholar@university.edu"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-slate-400">Affiliation / University (Optional)</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Universitas Nahdlatul Ulama Blitar"
                        value={memberInstitution}
                        onChange={(e) => setMemberInstitution(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-white/15 text-white focus:border-blue-400' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Join as Scholarly Member</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickDemoScholar}
                      className={`w-full py-2 rounded-xl text-[11px] font-mono border transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      ⚡ Quick 1-Click Peer Scholar Sign-In (Demo)
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
