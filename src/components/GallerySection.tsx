import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  X, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Instagram,
  ExternalLink
} from 'lucide-react';
import type { GalleryItem, ThemeMode, PageId, PageContentData, InstagramFeedData } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import { useTheme } from '../utils/useTheme';
import { InstagramVerifiedBadge } from './InstagramFeedSection';

interface GallerySectionProps {
  items?: GalleryItem[];
  pageContent?: PageContentData;
  instagramFeed?: InstagramFeedData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items = [],
  pageContent: propPageContent,
  instagramFeed: propInstagramFeed,
  theme: propTheme,
  onNavigate,
  onOpenSanity
}) => {
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  const instagramFeed = propInstagramFeed || INITIAL_PORTFOLIO_DATA.instagramFeed!;
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  // On Homepage show 6 activity photos only
  const homeItems = (items || []).slice(0, 6);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeIdx !== null && homeItems.length > 0) {
      setActiveIdx((activeIdx - 1 + homeItems.length) % homeItems.length);
    }
  }, [activeIdx, homeItems.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeIdx !== null && homeItems.length > 0) {
      setActiveIdx((activeIdx + 1) % homeItems.length);
    }
  }, [activeIdx, homeItems.length]);

  // Keyboard navigation while modal is open
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setActiveIdx(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, handlePrev, handleNext]);

  // Touch swipe handlers
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

  const activeItem = activeIdx !== null ? homeItems[activeIdx] : null;

  return (
    <section id="gallery" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t w-full max-w-full ${
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
            <Camera className="w-3.5 h-3.5" />
            <span>{pageContent.galleryBadge || 'Academic & Fieldwork Photo Gallery'}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {pageContent.galleryTitle ? (
              <span>{pageContent.galleryTitle}</span>
            ) : (
              <>Academic &amp; Fieldwork <span className="font-bold text-blue-500">Photographs</span></>
            )}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {pageContent.gallerySubtitle || 'Documentation of international conferences, factory floor diagnostic fieldwork, and doctoral seminars. Click any photo to open interactive slider.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <a
            href="/gallery"
            className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white hover:opacity-95 shadow-md shadow-rose-500/20 hover:scale-105"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram Feed</span>
          </a>

          <a
            href="/gallery"
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all border ${
              isDark 
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
            }`}
          >
            <span>View Complete Photo Gallery ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
          </a>
        </div>
      </div>

      {/* 6 Photos Grid on Homepage - Full box edge-to-edge presentation */}
      {homeItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeItems.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setActiveIdx(idx)}
              className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col ${
                isDark ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              {/* Image Box - Full Box Filling */}
              <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-800">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                    {photo.category}
                  </span>
                </div>

                {/* Expand Trigger Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-slate-900/80 text-white shadow">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Caption Overlay */}
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

              {/* Description Card Foot */}
              <div className={`p-4 space-y-2 flex-1 flex flex-col justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <p className="text-xs line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{photo.date}</span>
                  </span>
                  <span className="text-blue-500 font-semibold group-hover:underline flex items-center gap-1">
                    <span>Slide &amp; Expand</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-14 px-6 rounded-2xl border ${
          isDark ? 'border-white/10 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <Camera className="w-10 h-10 mx-auto mb-3 opacity-60 text-blue-500" />
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">Belum Ada Foto Galeri Dipublikasikan</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Dokumentasi foto kegiatan akademik dan riset dapat diunggah dan dikelola langsung melalui Dashboard ADAScholar.
          </p>
        </div>
      )}

      {/* Instagram Live Social Media Connection Banner */}
      <div className={`mt-8 rounded-2xl p-5 sm:p-6 border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        isDark ? 'bg-gradient-to-r from-purple-950/30 via-rose-950/20 to-slate-900/40 border-white/10' : 'bg-gradient-to-r from-purple-50/50 via-rose-50/40 to-amber-50/30 border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-md shrink-0">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className={`text-sm font-bold flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Connected to Instagram @{instagramFeed.username}</span>
                <InstagramVerifiedBadge className="w-4 h-4" />
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Follow real-time documentation of SME operations fieldwork, doctoral seminars, and daily somatic routines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/gallery"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline"
          >
            Explore Instagram Feed in Gallery &rarr;
          </a>
          <a
            href={instagramFeed.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:scale-105 transition-all shadow-md shadow-rose-500/20"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Follow @{instagramFeed.username}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interactive Lightbox Slider Modal */}
      {activeItem && activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none"
          onClick={() => setActiveIdx(null)}
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
                {activeIdx + 1} / {homeItems.length}
              </span>
              <button
                onClick={() => setActiveIdx(null)}
                aria-label="Close modal"
                className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Image Container (Full Photo Presentation) */}
            <div className="relative h-80 sm:h-[28rem] md:h-[32rem] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                key={activeItem.id}
                src={activeItem.imageUrl}
                alt={activeItem.title}
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
                {homeItems.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveIdx(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === activeIdx
                        ? 'w-8 bg-blue-500 shadow-md shadow-blue-500/50'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Photo Metadata & Description Footer */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-400/30 font-semibold">
                  {activeItem.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{activeItem.date}</span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold leading-snug">
                {activeItem.title}
              </h3>
              
              <div className="flex items-center gap-1.5 text-xs text-blue-500 font-mono">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{activeItem.location}</span>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {activeItem.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-200 dark:border-white/10">
                <span>Use keyboard left/right arrows or buttons to navigate photos</span>
                <span className="font-semibold text-blue-500">
                  {activeIdx + 1} of {homeItems.length}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
