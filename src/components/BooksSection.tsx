import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  ShoppingCart, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Layers,
  ArrowUpRight,
  ShoppingBag
} from 'lucide-react';
import type { Book, ThemeMode, PageId, PageContentData } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import { PortraitBookCover } from './PortraitBookCover';
import { useTheme } from '../utils/useTheme';

interface BooksSectionProps {
  books?: Book[];
  pageContent?: PageContentData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const BooksSection: React.FC<BooksSectionProps> = ({
  books = [],
  pageContent: propPageContent,
  theme: propTheme,
  onNavigate
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;

  // Point 4: Khusus 3 buku pilihan (Featured) di Homepage
  // Aturan: "yang paling kuat adalah pilihan terakhir, yang lain menyesuaikan"
  const getFeaturedHomeBooks = (): Book[] => {
    // Ambil semua buku yang ditandai isFeatured
    const featuredCandidates = (books || []).filter(b => b.isFeatured);

    // Urutkan berdasarkan yang terakhir dipilih/diupdate (updatedAt DESC)
    // Pilihan terakhir memiliki prioritas tertinggi ("paling kuat")
    const sortedByLatestChoice = [...featuredCandidates].sort((a, b) => {
      const timeA = a.updatedAt || 0;
      const timeB = b.updatedAt || 0;
      if (timeB !== timeA) return timeB - timeA;
      return (Number(a.featuredOrder) || 1) - (Number(b.featuredOrder) || 1);
    });

    // 3 Slot posisi di homepage: [Posisi 1 (Kiri), Posisi 2 (Tengah), Posisi 3 (Kanan)]
    const slots: (Book | null)[] = [null, null, null];

    // Masukkan buku mulai dari pilihan terakhir (yang paling kuat)
    for (const book of sortedByLatestChoice) {
      // Posisi yang diinginkan: 1 -> index 0, 2 -> index 1, 3 -> index 2
      const targetIndex = Math.min(Math.max((Number(book.featuredOrder) || 1) - 1, 0), 2);

      if (slots[targetIndex] === null) {
        // Slot target masih kosong -> langsung tempati
        slots[targetIndex] = book;
      } else {
        // Slot target sudah ditempati oleh pilihan yang lebih baru/kuat -> "yang lain menyesuaikan"
        const emptyIdx = [
          (targetIndex + 1) % 3,
          (targetIndex + 2) % 3,
          targetIndex
        ].find(idx => slots[idx] === null);

        if (emptyIdx !== undefined) {
          slots[emptyIdx] = book;
        }
      }

      // Jika ketiga slot sudah terisi, selesai
      if (slots.every(s => s !== null)) break;
    }

    // Jika slot belum genap 3 (misal buku featured yang dicentang kurang dari 3):
    // Lengkapi dengan buku lainnya yang belum masuk slot
    const assignedIds = new Set(slots.filter((b): b is Book => b !== null).map(b => b.id));
    const nonFeaturedOrRemaining = (books || []).filter(b => !assignedIds.has(b.id));

    let remIdx = 0;
    for (let i = 0; i < 3; i++) {
      if (slots[i] === null && remIdx < nonFeaturedOrRemaining.length) {
        slots[i] = nonFeaturedOrRemaining[remIdx++];
      }
    }

    return slots.filter((b): b is Book => b !== null);
  };

  const homeBooks = getFeaturedHomeBooks();

  return (
    <section id="books" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t overflow-hidden w-full max-w-full ${
      isDark ? 'border-white/10' : 'border-slate-200'
    }`}>
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="max-w-2xl space-y-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark 
              ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>{pageContent.booksBadge || 'Books & Academic Monographs'}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {pageContent.booksTitle ? (
              <span>{pageContent.booksTitle}</span>
            ) : (
              <>Authored <span className="font-bold text-blue-500">Books &amp; Monographs</span></>
            )}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {pageContent.booksSubtitle || 'University textbooks, practitioner guides, and doctoral methodology handbooks with direct publisher &amp; marketplace links.'}
          </p>
        </div>

        <a
          href="/books"
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all border ${
            isDark 
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
              : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <span>View All Books ({books.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
        </a>
      </div>

      {/* 3 Books Grid on Homepage with Portrait Covers, Synopsis & Marketplace Links */}
      <div className="grid lg:grid-cols-3 gap-8">
        {homeBooks.map((book) => (
          <div
            key={book.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-2xl group ${
              isDark 
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-white/40' 
                : 'bg-white border-slate-200 text-slate-900 shadow-md hover:border-blue-300'
            }`}
          >
            {/* Top Row: Portrait Cover + Essential Meta */}
            <div className="space-y-4">
              <div className="flex gap-4 sm:gap-5 items-start">
                {/* Portrait Book Cover */}
                <a href="/books" className="shrink-0 transition-transform group-hover:scale-105">
                  <PortraitBookCover book={book} size="md" />
                </a>

                {/* Metadata Column */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      book.status === 'Published'
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                        : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    }`}>
                      {book.status}
                    </span>
                    <span className="text-[10px] font-mono opacity-70">
                      {book.year}
                    </span>
                    {book.isFeatured && (
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isDark 
                          ? 'bg-blue-500/20 border-blue-400/40 text-blue-300' 
                          : 'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <a href="/books" className="block hover:text-blue-500 transition-colors">
                    <h3 className="text-base sm:text-lg font-bold leading-snug font-editorial-serif line-clamp-3">
                      {book.title}
                    </h3>
                  </a>

                  <p className="text-xs font-mono text-blue-500 font-medium">
                    {book.publisher}
                  </p>

                  {book.isbn && (
                    <p className="text-[10px] font-mono text-slate-400">
                      ISBN: {book.isbn}
                    </p>
                  )}
                </div>
              </div>

              {/* Subtitle & Synopsis */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <p className="text-xs font-semibold text-blue-400 font-mono">
                  {book.subtitle}
                </p>
                <p className={`text-xs leading-relaxed line-clamp-3 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {book.blurb}
                </p>
              </div>

              {/* Topic Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {book.topics.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-slate-300' 
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Marketplace & Purchasing Channels */}
            <div className={`pt-4 mt-5 border-t space-y-2 ${
              isDark ? 'border-white/15' : 'border-slate-200'
            }`}>
              <a
                href={book.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow ${
                  isDark 
                    ? 'bg-white text-blue-950 hover:bg-blue-50' 
                    : 'bg-blue-900 text-white hover:bg-blue-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{book.ctaText}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Alternative Stores: Marketplace links */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <span>Available at:</span>
                {book.marketplaceLinks && book.marketplaceLinks.length > 0 ? (
                  book.marketplaceLinks.map((link, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {lIdx > 0 && <span>&bull;</span>}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {link.name}
                      </a>
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <a
                      href={`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(book.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      Tokopedia
                    </a>
                    <span>&bull;</span>
                    <a
                      href={`https://shopee.co.id/search?keyword=${encodeURIComponent(book.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline"
                    >
                      Shopee
                    </a>
                    <span>&bull;</span>
                    <a
                      href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(book.title + ' ' + book.publisher)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Google Books
                    </a>
                  </>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
