import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  X, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Instagram,
  Layers,
  Images
} from 'lucide-react';
import type { GalleryItem, ThemeMode, PageId, PageContentData, InstagramFeedData, AuthorProfile } from '../../types';
import { INITIAL_PORTFOLIO_DATA } from '../../data/portfolioData';
import { useTheme } from '../../utils/useTheme';
import { InstagramFeedSection, InstagramVerifiedBadge } from '../InstagramFeedSection';

interface GalleryPageProps {
  items?: GalleryItem[];
  pageContent?: PageContentData;
  instagramFeed?: InstagramFeedData;
  profile?: AuthorProfile;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  items = [],
  pageContent: propPageContent,
  instagramFeed: propInstagramFeed,
  profile,
  theme: propTheme,
  onNavigate,
  onOpenSanity
}) => {
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  const instagramFeed = propInstagramFeed || INITIAL_PORTFOLIO_DATA.instagramFeed!;
  const [activeTab, setActiveTab] = useState<'all' | 'instagram' | 'academic'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  const categories = ['All', 'Conferences', 'Field Research', 'Teaching', 'Martial Arts', 'Community'];

  const filteredItems = (items || []).filter(item => {
    if (selectedCategory === 'All') return true;
    return (item.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIdx !== null && filteredItems.length > 0) {
      setActivePhotoIdx((activePhotoIdx - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [activePhotoIdx, filteredItems.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIdx !== null && filteredItems.length > 0) {
      setActivePhotoIdx((activePhotoIdx + 1) % filteredItems.length);
    }
  }, [activePhotoIdx, filteredItems.length]);

  // Keyboard navigation while modal is open
  useEffect(() => {
    if (activePhotoIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setActivePhotoIdx(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx, handlePrev, handleNext]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const activePhoto = activePhotoIdx !== null ? filteredItems[activePhotoIdx] : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn w-full max-w-full">
      
      {/* Top Breadcrumb Permalink & Archive Count Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <nav aria-label="Breadcrumb" className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono border ${
          isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <a href="/" className="hover:text-blue-500 transition-colors">
            <span>Home</span>
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-blue-500 font-semibold">Gallery</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">{pageContent.galleryBreadcrumb || 'Fieldwork & Conference Documentation'}</span>
        </nav>

        <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Total Archive: <strong>{items.length} {pageContent.galleryArchiveCountLabel || 'Fieldwork & Academic Photos'}</strong>
        </span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <Camera className="w-3.5 h-3.5" />
          <span>{pageContent.galleryBadge || 'Academic & Fieldwork Photo Gallery'}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-light tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {pageContent.galleryTitle ? (
            <span>{pageContent.galleryTitle}</span>
          ) : (
            <>Academic &amp; Fieldwork <span className="font-bold text-blue-500">Photographs</span></>
          )}
        </h1>

        <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {pageContent.gallerySubtitle || 'Documentation of international conferences, factory floor diagnostic fieldwork, and doctoral seminars. Click any photo to open interactive slider.'}
        </p>
      </div>

      {/* Primary Gallery View Mode Selector (Instagram vs Academic vs All) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-1.5 rounded-2xl border w-fit" style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(241, 245, 249, 0.8)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 1)',
      }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'all'
              ? isDark ? 'bg-blue-600 text-white shadow-md font-bold' : 'bg-blue-900 text-white shadow-md font-bold'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{pageContent.galleryTabAll || 'All Documentation'}</span>
        </button>

        <button
          onClick={() => setActiveTab('instagram')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'instagram'
              ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-md shadow-rose-500/25 font-bold'
              : isDark 
                ? 'text-slate-300 hover:text-white hover:bg-white/5' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Instagram className="w-4 h-4 text-pink-500" />
          <span className="flex items-center gap-1">
            <span>{pageContent.galleryTabInstagram || 'Instagram Feed'}</span>
            <InstagramVerifiedBadge className="w-3.5 h-3.5" />
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-pink-500/20 text-pink-300 border border-pink-400/30">
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'academic'
              ? isDark ? 'bg-blue-600 text-white shadow-md font-bold' : 'bg-blue-900 text-white shadow-md font-bold'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>{pageContent.galleryTabAcademic || 'Academic Photo Archive'}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
            {items.length}
          </span>
        </button>
      </div>

      {/* Instagram Feed Section (Shown on 'all' and 'instagram' view) */}
      {(activeTab === 'all' || activeTab === 'instagram') && (
        <div className="space-y-6 pt-2">
          <InstagramFeedSection
            feedData={instagramFeed}
            profile={profile}
            theme={theme}
            showProfileHeader={true}
          />
        </div>
      )}

      {/* Divider if showing All */}
      {activeTab === 'all' && (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className={`px-4 py-1.5 rounded-full font-mono font-semibold border ${
              isDark ? 'bg-slate-900 border-white/15 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
            }`}>
              {pageContent.galleryDividerLabel || 'Conference & Field Research Photographic Archive'}
            </span>
          </div>
        </div>
      )}

      {/* Academic Photo Archive Section (Shown on 'all' and 'academic' view) */}
      {(activeTab === 'all' || activeTab === 'academic') && (
        <div className="space-y-6">
          {/* Sub-header for Academic Archive */}
          {activeTab === 'all' && (
            <div className="space-y-2">
              <h2 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {pageContent.galleryArchiveHeading || 'Academic Photographs & Fieldwork Archive'}
              </h2>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {pageContent.galleryArchiveSubtitle || 'High-resolution collection of doctoral seminars, university lecture halls, and empirical factory floor observations.'}
              </p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActivePhotoIdx(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  selectedCategory === cat
                    ? isDark 
                      ? 'bg-blue-600 text-white border-blue-400 font-bold shadow' 
                      : 'bg-blue-900 text-white border-blue-900 font-bold shadow'
                    : isDark 
                      ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' 
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Complete Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setActivePhotoIdx(idx)}
            className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col ${
              isDark ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            {/* Image Box - Full Box Filling */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-800">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                  {photo.category}
                </span>
              </div>

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-slate-900/80 text-white shadow">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <span className="text-[10px] font-mono text-blue-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{photo.location}</span>
                </span>
                <h3 className="text-sm font-bold leading-tight line-clamp-1">
                  {photo.title}
                </h3>
              </div>
            </div>

            <div className={`p-5 space-y-2 flex-1 flex flex-col justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p className="text-xs leading-relaxed line-clamp-3">
                {photo.description}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{photo.date}</span>
                </span>
                <span className="text-blue-500 font-semibold group-hover:underline flex items-center gap-1">
                  <span>Slide &amp; Inspect</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

      {/* Interactive Lightbox Slider Modal */}
      {activePhoto && activePhotoIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none"
          onClick={() => setActivePhotoIdx(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`max-w-4xl w-full rounded-3xl overflow-hidden border shadow-2xl relative flex flex-col ${
              isDark ? 'bg-[#0A192F] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button & Index Indicator */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                {activePhotoIdx + 1} / {filteredItems.length}
              </span>
              <button
                onClick={() => setActivePhotoIdx(null)}
                aria-label="Close modal"
                className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Image Container (Full Photo Presentation) */}
            <div className="relative h-80 sm:h-[28rem] md:h-[32rem] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                key={activePhoto.id}
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300 animate-fadeIn"
              />

              {/* Prev Slide Arrow Button */}
              <button
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Next Slide Arrow Button */}
              <button
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Bottom Thumbnail Strip on Image */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20 px-4">
                {filteredItems.slice(0, 10).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActivePhotoIdx(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === activePhotoIdx
                        ? 'w-8 bg-blue-500 shadow-md shadow-blue-500/50'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Captions */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
                <span className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-400/30 font-semibold">
                  {activePhoto.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{activePhoto.date}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold leading-snug">{activePhoto.title}</h2>
              
              <div className="flex items-center gap-1.5 text-xs text-blue-500 font-mono">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{activePhoto.location}</span>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {activePhoto.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Use keyboard left/right arrows or buttons to navigate photos</span>
                </div>
                <span className="font-semibold text-blue-500">
                  {activePhotoIdx + 1} of {filteredItems.length}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

