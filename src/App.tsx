import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PORTFOLIO_DATA, 
  loadSavedPortfolioData, 
  savePortfolioData,
  generateJsonLdSchemaString 
} from './data/portfolioData';
import type { PortfolioDataState, PageId, ThemeMode, AuthUser, BlogComment } from './types';

// Global Navigation & Modals
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CVModal } from './components/CVModal';
import { ContactModal } from './components/ContactModal';
import { LoginModal } from './components/LoginModal';

// Homepage Sections
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ScholarSection } from './components/ScholarSection';
import { BooksSection } from './components/BooksSection';
import { BlogSummarySection } from './components/BlogSummarySection';
import { GallerySection } from './components/GallerySection';
import { BeyondAcademia } from './components/BeyondAcademia';

// Dedicated Full Subpages
import { AboutMePage } from './components/pages/AboutMePage';
import { ResearchPage } from './components/pages/ResearchPage';
import { BooksPage } from './components/pages/BooksPage';
import { BlogPage } from './components/pages/BlogPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { BeyondAcademiaPage } from './components/pages/BeyondAcademiaPage';

export function App() {
  // Data state initialized from local persistence / Sanity default state
  const [data, setData] = useState<PortfolioDataState>(() => loadSavedPortfolioData());
  
  // Navigation & View state
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | undefined>(undefined);
  
  // Theme state: dark (navy blue) or light
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gautama_portfolio_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    }
    return 'dark';
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gautama_auth_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Modal dialog states
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Sync theme to root DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0A192F';
      document.body.style.color = '#FFFFFF';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F8FAFC';
      document.body.style.color = '#0F172A';
    }
    localStorage.setItem('gautama_portfolio_theme', theme);
  }, [theme]);

  // Sync JSON-LD SEO schema to DOM head
  useEffect(() => {
    let scriptTag = document.getElementById('dynamic-jsonld-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = generateJsonLdSchemaString(data);
  }, [data]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNavigate = (page: PageId, blogSlug?: string) => {
    setCurrentPage(page);
    if (blogSlug) {
      setActiveBlogSlug(blogSlug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveData = (newData: PortfolioDataState) => {
    setData(newData);
    savePortfolioData(newData);
  };

  const handleResetData = () => {
    setData(INITIAL_PORTFOLIO_DATA);
    savePortfolioData(INITIAL_PORTFOLIO_DATA);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('gautama_auth_user', JSON.stringify(user));
    if (user.role === 'admin') {
      window.location.href = '/keystatic';
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gautama_auth_user');
  };

  const handleOpenSanityGuard = () => {
    window.location.href = '/keystatic';
  };

  // Blog Comment Handling
  const handleAddComment = (newComment: BlogComment) => {
    const updatedComments = [newComment, ...(data.comments || [])];
    const newData: PortfolioDataState = {
      ...data,
      comments: updatedComments
    };
    setData(newData);
    savePortfolioData(newData);
  };

  const handleLikeComment = (commentId: string) => {
    const updatedComments = (data.comments || []).map(c => 
      c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    );
    const newData: PortfolioDataState = {
      ...data,
      comments: updatedComments
    };
    setData(newData);
    savePortfolioData(newData);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-blue-600 selection:text-white w-full max-w-full ${
      isDark ? 'bg-[#0A192F] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCV={() => setIsCVOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSanity={handleOpenSanityGuard}
        profile={data.profile}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full">
        
        {/* HOMEPAGE VIEW */}
        {currentPage === 'home' && (
          <div className="space-y-4">
            
            {/* 1. Hero Section (Profile photo, Scholar live metrics, UK PhD target, CTA) */}
            <Hero
              profile={data.profile}
              scholarStats={data.scholarStats}
              theme={theme}
              onOpenCV={() => setIsCVOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenSanity={handleOpenSanityGuard}
              onNavigate={handleNavigate}
            />

            {/* 2. Section 2: Academic Foundation (2 pillars on home) */}
            <AboutSection
              pillars={data.aboutPillars}
              profile={data.profile}
              pageContent={data.pageContent}
              phdStatus={data.phdStatus}
              theme={theme}
              onNavigate={handleNavigate}
            />

            {/* 3. Section 3: Peer-Reviewed Journal Publications (4 articles on home + Scholar Metrics explorer) */}
            <ScholarSection
              articles={data.articles || data.researchArticles}
              scholarStats={data.scholarStats}
              theme={theme}
              onNavigate={handleNavigate}
              onOpenSanity={handleOpenSanityGuard}
            />

            {/* 4. Section 4: Books & Monographs (3 books on home with portrait cover, synopsis, marketplace links) */}
            <BooksSection
              books={data.books}
              theme={theme}
              onNavigate={handleNavigate}
              onOpenSanity={handleOpenSanityGuard}
            />

            {/* 5. Section 5: Academic Insights & Blog Summary (3 cards on home with auto reading time) */}
            <BlogSummarySection
              posts={data.blogPosts}
              theme={theme}
              onNavigate={handleNavigate}
              onOpenSanity={handleOpenSanityGuard}
            />

            {/* 6. Section 6: Activity Photo Gallery (6 photos on home) */}
            <GallerySection
              items={data.galleryItems}
              theme={theme}
              onNavigate={handleNavigate}
              onOpenSanity={handleOpenSanityGuard}
            />

            {/* 7. Section 7: Holistic Discipline (3 disciplines on home) */}
            <BeyondAcademia
              items={data.martialArts}
              theme={theme}
              onNavigate={handleNavigate}
              onOpenSanity={handleOpenSanityGuard}
            />

          </div>
        )}

        {/* DEDICATED SUBPAGE: ABOUT ME */}
        {currentPage === 'about' && (
          <AboutMePage
            pillars={data.aboutPillars}
            profile={data.profile}
            theme={theme}
            onNavigate={handleNavigate}
            onOpenCV={() => setIsCVOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
            onOpenSanity={handleOpenSanityGuard}
          />
        )}

        {/* DEDICATED SUBPAGE: RESEARCH ARTICLES REPOSITORY */}
        {currentPage === 'research' && (
          <ResearchPage
            articles={data.articles || data.researchArticles}
            scholarStats={data.scholarStats}
            theme={theme}
            onNavigate={handleNavigate}
            onOpenSanity={handleOpenSanityGuard}
          />
        )}

        {/* DEDICATED SUBPAGE: BOOKS & MONOGRAPHS CATALOG */}
        {currentPage === 'books' && (
          <BooksPage
            books={data.books}
            theme={theme}
            onNavigate={handleNavigate}
            onOpenSanity={handleOpenSanityGuard}
          />
        )}

        {/* DEDICATED SUBPAGE: RESEARCH BLOG & DYNAMIC TOC */}
        {currentPage === 'blog' && (
          <BlogPage
            posts={data.blogPosts || []}
            profile={data.profile}
            phdStatus={data.phdStatus}
            pageContent={data.pageContent}
            initialSlug={activeBlogSlug}
            theme={theme}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginOpen(true)}
            comments={data.comments || []}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onNavigate={handleNavigate}
            onOpenSanity={handleOpenSanityGuard}
          />
        )}

        {/* DEDICATED SUBPAGE: ACTIVITY PHOTO GALLERY */}
        {currentPage === 'gallery' && (
          <GalleryPage
            items={data.galleryItems}
            theme={theme}
            onNavigate={handleNavigate}
            onOpenSanity={handleOpenSanityGuard}
          />
        )}

        {/* DEDICATED SUBPAGE: BEYOND ACADEMIA (HOLISTIC DISCIPLINE) */}
        {currentPage === 'beyond' && (
          <BeyondAcademiaPage
            items={data.martialArts}
            theme={theme}
            onNavigate={handleNavigate}
            onOpenSanity={handleOpenSanityGuard}
          />
        )}

      </main>

      {/* Global Footer */}
      <Footer
        profile={data.profile}
        theme={theme}
        onNavigate={handleNavigate}
        onOpenSanity={handleOpenSanityGuard}
        onOpenCV={() => setIsCVOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
      />



      {/* Curriculum Vitae Modal */}
      <CVModal
        isOpen={isCVOpen}
        onClose={() => setIsCVOpen(false)}
        data={data}
        theme={theme}
      />

      {/* Contact & Doctoral Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        profile={data.profile}
        theme={theme}
      />

      {/* Login Modal (Admin for CMS or Member for Commenting) */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLoginSuccess}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSanity={handleOpenSanityGuard}
        theme={theme}
      />

    </div>
  );
}

export default App;
