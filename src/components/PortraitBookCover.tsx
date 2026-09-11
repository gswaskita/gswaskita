import React, { useState, useEffect } from 'react';
import { Book as BookIcon } from 'lucide-react';
import type { Book } from '../types';

interface PortraitBookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: 'eager' | 'lazy';
}

export const PortraitBookCover: React.FC<PortraitBookCoverProps> = ({
  book,
  size = 'md',
  className = '',
  loading = 'lazy'
}) => {
  const [imgError, setImgError] = useState(false);
  const [effectiveLoading, setEffectiveLoading] = useState<'eager' | 'lazy'>(loading);
  const coverSrc = book.coverImage || book.coverUrl;

  useEffect(() => {
    setImgError(false);
  }, [coverSrc]);

  useEffect(() => {
    if (loading === 'eager') {
      const checkPos = () => {
        const el = document.getElementById(`book-cover-${book.id}`);
        if (el) {
          let y = 0;
          let cur: HTMLElement | null = el;
          while (cur) {
            y += cur.offsetTop;
            cur = cur.offsetParent as HTMLElement | null;
          }
          setEffectiveLoading(y <= window.innerHeight ? 'eager' : 'lazy');
        }
      };
      checkPos();
      window.addEventListener('resize', checkPos);
      return () => window.removeEventListener('resize', checkPos);
    }
  }, [loading, book.id]);

  const sizeClasses = {
    sm: 'w-28 h-40 sm:w-32 sm:h-48 text-[9px]',
    md: 'w-40 h-56 sm:w-48 sm:h-68 text-[11px]',
    lg: 'w-48 h-68 sm:w-60 sm:h-84 text-xs',
  };

  // Color theme generator based on book topic or title
  const getGradient = (b: Book) => {
    if (b.coverGradient) return b.coverGradient;
    if (b.title.includes('Kualitas') || b.title.includes('Service')) {
      return 'from-slate-900 via-blue-950 to-indigo-950 text-blue-100 border-blue-400/30';
    }
    if (b.title.includes('UMKM') || b.title.includes('Digital')) {
      return 'from-slate-900 via-teal-950 to-emerald-950 text-teal-100 border-teal-400/30';
    }
    return 'from-slate-950 via-slate-900 to-blue-950 text-slate-100 border-indigo-400/30';
  };

  const gradient = getGradient(book);
  const hasImage = Boolean(coverSrc && !imgError);

  return (
    <div id={`book-cover-${book.id}`} className={`relative group shrink-0 select-none ${className}`}>
      {/* 3D Book Shadow Effect */}
      <div className="absolute inset-0 bg-blue-950/60 rounded-r-lg rounded-l-sm blur-md translate-x-1.5 translate-y-2 group-hover:translate-x-2 group-hover:translate-y-3 transition-transform duration-300" />
      
      {/* Book Outer Container */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-r-lg rounded-l-sm border shadow-2xl overflow-hidden flex flex-col justify-between ${
          hasImage 
            ? 'bg-slate-900 border-white/20' 
            : `bg-gradient-to-br ${gradient} p-3.5 sm:p-4`
        } transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-[1.02]`}
      >
        {/* 3D Spine Crease Overlay (Left Edge) */}
        <div className="absolute left-0 top-0 bottom-0 w-3.5 sm:w-4 bg-gradient-to-r from-black/60 via-white/15 to-transparent pointer-events-none z-20 border-r border-black/30" />
        <div className="absolute left-3.5 top-0 bottom-0 w-[1px] bg-white/15 pointer-events-none z-20" />

        {/* Paper Page Edge effect (Right Edge) */}
        <div className="absolute right-0 top-1 bottom-1 w-1 sm:w-1.5 bg-gradient-to-l from-slate-200/30 via-slate-400/20 to-transparent pointer-events-none z-20" />

        {hasImage ? (
          <>
            {/* Real Book Cover Image Asset / URL */}
            <img
              src={coverSrc}
              alt={book.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
              loading={effectiveLoading}
            />

            {/* Realistic Print Finish Gloss Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none z-10" />

            {/* Subtle floating metadata tag */}
            <div className="relative z-10 p-2.5 sm:p-3 flex items-center justify-between pointer-events-none">
              <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950/75 backdrop-blur-md text-white/90 border border-white/20 shadow-sm truncate max-w-[70%]">
                {book.publisher}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950/75 backdrop-blur-md text-white font-bold border border-white/20 shadow-sm">
                {book.year}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Ambient Top Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />

            {/* Book Jacket Header */}
            <div className="relative z-10 pl-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider opacity-80 font-bold block truncate max-w-[80%]">
                  {book.publisher}
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/20">
                  {book.year}
                </span>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-white/30 to-transparent" />
            </div>

            {/* Book Title & Subtitle in Editorial Typography */}
            <div className="relative z-10 pl-2 my-auto py-2 space-y-1.5">
              <div className="inline-block p-1 rounded-md bg-white/5 border border-white/10 mb-1">
                <BookIcon className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h4 className="font-bold font-editorial-serif text-xs sm:text-sm lg:text-base leading-snug tracking-tight text-white line-clamp-3">
                {book.title}
              </h4>
              <p className="text-[9px] sm:text-[10px] font-mono text-blue-300/90 leading-tight line-clamp-2">
                {book.subtitle}
              </p>
            </div>

            {/* Book Jacket Footer (Author & ISBN Barcode simulation) */}
            <div className="relative z-10 pl-2 pt-2 border-t border-white/15 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-white tracking-wide">
                    Gautama S. Waskita
                  </p>
                  <p className="text-[7.5px] sm:text-[8.5px] font-mono opacity-70">
                    Academic Press Edition
                  </p>
                </div>

                {book.isbn && (
                  <div className="text-right">
                    <div className="flex gap-[1px] items-end h-3 justify-end opacity-60">
                      <div className="w-[1.5px] h-full bg-white" />
                      <div className="w-[1px] h-2 bg-white" />
                      <div className="w-[2px] h-full bg-white" />
                      <div className="w-[1px] h-2.5 bg-white" />
                      <div className="w-[1.5px] h-full bg-white" />
                      <div className="w-[1px] h-1.5 bg-white" />
                      <div className="w-[2px] h-full bg-white" />
                    </div>
                    <span className="text-[6.5px] font-mono opacity-60 block">
                      {book.isbn.slice(-6)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
