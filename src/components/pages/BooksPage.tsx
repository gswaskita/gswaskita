import React, { useState } from 'react';
import { 
  BookOpen, 
  ShoppingCart, 
  ExternalLink, 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  Sparkles, 
  ArrowUpRight,
  Layers,
  BookMarked,
  ShoppingBag,
  Share2,
  Bookmark
} from 'lucide-react';
import type { Book, ThemeMode, PageId, PageContentData } from '../../types';
import { INITIAL_PORTFOLIO_DATA } from '../../data/portfolioData';
import { PortraitBookCover } from '../PortraitBookCover';
import { useTheme } from '../../utils/useTheme';

interface BooksPageProps {
  books?: Book[];
  pageContent?: PageContentData;
  theme?: ThemeMode;
  onNavigate: (page: PageId) => void;
  onOpenSanity?: () => void;
}

export const BooksPage: React.FC<BooksPageProps> = ({
  books = [],
  pageContent: propPageContent,
  theme: propTheme,
  onNavigate
}) => {
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  const allTopics = ['All', ...Array.from(new Set((books || []).flatMap(b => b.topics || [])))];

  const filteredBooks = (books || []).filter(b => {
    const matchesTopic = selectedTopic === 'All' || (b.topics && b.topics.includes(selectedTopic));
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (b.title || '').toLowerCase().includes(query) ||
      (b.subtitle || '').toLowerCase().includes(query) ||
      (b.publisher || '').toLowerCase().includes(query) ||
      (b.isbn && b.isbn.toLowerCase().includes(query)) ||
      (b.blurb || '').toLowerCase().includes(query);
    return matchesTopic && matchesSearch;
  });

  const handleShareBook = (book: Book) => {
    const text = `Check out "${book.title}" by Gautama S. Waskita (${book.publisher}, ${book.year})`;
    if (navigator.share) {
      navigator.share({ title: book.title, text, url: book.ctaUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}: ${book.ctaUrl}`);
      setCopiedId(book.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn overflow-hidden w-full max-w-full">
      
      {/* Top Breadcrumb Permalink & Catalog Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <nav aria-label="Breadcrumb" className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono border ${
          isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <a href="/" className="hover:text-blue-500 transition-colors">
            <span>Home</span>
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-blue-500 font-semibold">Books</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">{pageContent.booksBreadcrumb || 'Monographs & Textbooks'}</span>
        </nav>

        <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Catalog: <strong>{books.length} Books &amp; Academic Monographs</strong>
        </span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <BookOpen className="w-3.5 h-3.5" />
          <span>{pageContent.booksBadge || 'Academic Publishing • Authored Books & Monographs'}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-light tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {pageContent.booksTitle ? (
            <span>{pageContent.booksTitle}</span>
          ) : (
            <>Books &amp; <span className="font-bold text-blue-500">Academic Monographs</span></>
          )}
        </h1>

        <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {pageContent.booksSubtitle || 'Comprehensive university textbooks, SME strategic roadmaps, and qualitative methodology monographs published across prominent national and international academic presses.'}
        </p>
      </div>

      {/* Search & Topic Filters */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search books by title, publisher, ISBN, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 focus:border-blue-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
              }`}
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredBooks.length} of {books.length} publications
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedTopic === topic
                  ? isDark 
                    ? 'bg-blue-600 text-white border-blue-400 font-bold shadow' 
                    : 'bg-blue-900 text-white border-blue-900 font-bold shadow'
                  : isDark 
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Rich Books Showcase with Portrait Covers */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredBooks.map((book, idx) => (
          <div
            key={book.id}
            className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-2xl group ${
              isDark 
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-lg'
            }`}
          >
            {/* Top Section: Portrait Book Cover + Meta Column */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Portrait Book Cover */}
                <div className="mx-auto sm:mx-0">
                  <PortraitBookCover book={book} size="lg" loading={idx === 0 ? 'eager' : 'lazy'} />
                </div>

                {/* Meta details */}
                <div className="flex-1 space-y-2.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                      book.status === 'Published'
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                        : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    }`}>
                      {book.status}
                    </span>
                    <span className="text-[11px] font-mono opacity-80">
                      Year: <strong>{book.year}</strong>
                    </span>
                    {book.isFeatured && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border bg-blue-500/20 border-blue-400/40 text-blue-300">
                        ★ Homepage Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold leading-snug font-editorial-serif text-white">
                    {book.title}
                  </h3>

                  <p className="text-xs font-mono font-semibold text-blue-400">
                    {book.subtitle}
                  </p>

                  <div className="text-xs space-y-1 pt-1 font-mono">
                    <p className="text-slate-300">
                      Publisher: <strong className="text-white">{book.publisher}</strong>
                    </p>
                    {book.edition && (
                      <p className="text-slate-400">
                        Edition: <strong className="text-slate-300">{book.edition}</strong>
                      </p>
                    )}
                    {book.isbn && (
                      <p className="text-slate-400">
                        ISBN: <strong className="text-slate-300">{book.isbn}</strong>
                      </p>
                    )}
                    {book.pages && (
                      <p className="text-slate-400">
                        Length: <strong>{book.pages} pages</strong>
                      </p>
                    )}
                    {book.dimensions && (
                      <p className="text-slate-400">
                        Dimensions: <strong>{book.dimensions}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Synopsis / Blurb */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                  Book Synopsis &amp; Academic Scope:
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {book.blurb}
                </p>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {book.topics.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className={`text-[10px] px-2.5 py-1 rounded-full border font-mono ${
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

            {/* Bottom Actions: Purchase channels & share */}
            <div className={`pt-5 mt-6 border-t space-y-3 ${
              isDark ? 'border-white/15' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <a
                  href={book.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-3 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                    isDark 
                      ? 'bg-white text-blue-950 hover:bg-blue-50' 
                      : 'bg-blue-900 text-white hover:bg-blue-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{book.ctaText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleShareBook(book)}
                  title="Share Book"
                  className={`p-3 rounded-xl border text-xs flex items-center justify-center transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/15 hover:bg-white/15 text-slate-300' 
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Online Marketplace Directory Links */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono pt-1 text-slate-400 gap-2">
                <span>Distributors:</span>
                <div className="flex items-center gap-3 flex-wrap">
                  {book.marketplaceLinks && book.marketplaceLinks.length > 0 ? (
                    book.marketplaceLinks.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                      >
                        <span>{link.name}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
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
                      <a
                        href={`https://shopee.co.id/search?keyword=${encodeURIComponent(book.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                      >
                        Shopee
                      </a>
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

          </div>
        ))}
      </div>

    </div>
  );
};
