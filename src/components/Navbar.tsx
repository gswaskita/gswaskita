import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  FileText, 
  Mail, 
  Sun, 
  Moon, 
  Database,
  Sparkles,
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  Shield,
  Home,
  User,
  LogIn,
  Lock,
  UserCheck
} from 'lucide-react';
import type { PageId, ThemeMode, AuthorProfile, AuthUser } from '../types';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  onOpenSanity: () => void;
  profile: AuthorProfile;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenCV,
  onOpenContact,
  onOpenSanity,
  profile,
  currentUser,
  onOpenLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About Me', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'research', label: 'Research', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'blog', label: 'Blog', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'beyond', label: 'Beyond Academia', icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 backdrop-blur-xl border-b w-full max-w-full ${
      isDark 
        ? 'bg-[#0A192F]/85 border-white/10 text-white' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Monogram & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm tracking-wider transition-transform group-hover:scale-105 shadow shrink-0 border border-slate-200 dark:border-white/10 ${
              isDark ? 'bg-white text-blue-900' : 'bg-blue-900 text-white'
            }`}>
              {(profile.brandImage || profile.brandImageUrl) ? (
                <img
                  src={profile.brandImage || profile.brandImageUrl}
                  alt={profile.name}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>GW</span>
              )}
            </div>
            <div>
              <span className={`font-semibold tracking-tight text-sm sm:text-base group-hover:text-blue-500 transition-colors block ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {profile.name}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-white text-blue-950 shadow-md font-bold'
                        : 'bg-blue-900 text-white shadow-md font-bold'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
              className={`p-2 rounded-full border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/15 text-amber-300 hover:bg-white/15 hover:border-white/30'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            {/* Authenticated User or Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">

                <button
                  onClick={onOpenLogin}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-[9px] text-white flex items-center justify-center font-bold">
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                id="navbar-login-btn"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/15'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* CV Modal Trigger */}
            <button
              onClick={onOpenCV}
              id="navbar-cv-btn"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full CV</span>
            </button>

            {/* Get in Touch Trigger */}
            <button
              onClick={onOpenContact}
              id="navbar-contact-btn"
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                isDark
                  ? 'bg-white text-blue-950 hover:bg-blue-50'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-full border transition-all ${
                isDark ? 'bg-white/10 border-white/15 text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border focus:outline-none ${
                isDark ? 'border-white/15 text-white bg-white/5' : 'border-slate-200 text-slate-800 bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`xl:hidden border-b px-4 pt-3 pb-6 space-y-3 ${
          isDark ? 'bg-[#0A192F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
        }`}>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all text-left ${
                    isActive
                      ? isDark
                        ? 'bg-white text-blue-950 font-bold'
                        : 'bg-blue-900 text-white font-bold'
                      : isDark
                        ? 'text-slate-300 hover:bg-white/10'
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
            <button
              onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
            </button>
            <button
              onClick={() => { onOpenCV(); setMobileMenuOpen(false); }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full CV</span>
            </button>
            <button
              onClick={() => { onOpenContact(); setMobileMenuOpen(false); }}
              className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow ${
                isDark ? 'bg-white text-blue-950' : 'bg-blue-900 text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
