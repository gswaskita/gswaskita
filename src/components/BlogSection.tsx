import React, { useState, useEffect, useRef } from 'react';
import { 
  BookText, 
  ListTree, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight,
  Share2,
  Check,
  Bookmark
} from 'lucide-react';
import { BLOG_POSTS } from '../data/portfolioData';

export const BlogSection: React.FC = () => {
  const [selectedPostSlug, setSelectedPostSlug] = useState<string>(BLOG_POSTS[0]?.slug || '');
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const articleContentRef = useRef<HTMLDivElement>(null);

  const activePost = BLOG_POSTS.find((p) => p.slug === selectedPostSlug) || BLOG_POSTS[0];

  if (!activePost) {
    return null;
  }

  // Scrollspy effect: detects which H2/H3 heading is currently near top of viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    const headings = articleContentRef.current?.querySelectorAll('h2[id], h3[id]');
    headings?.forEach((el) => observer.observe(el));

    return () => {
      headings?.forEach((el) => observer.unobserve(el));
    };
  }, [selectedPostSlug]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeadingId(id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-xs font-semibold text-blue-300">
            <BookText className="w-3.5 h-3.5" />
            <span>Academic Research Notes &amp; Dynamic ToC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Research Essays &amp; <span className="font-bold text-blue-400">Methodological Notes</span>
          </h2>
          <p className="text-sm text-slate-400">
            Live preview of <code className="text-blue-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono text-xs">[slug].astro</code> with sticky floating Glassmorphism Table of Contents.
          </p>
        </div>

        {/* Post Switcher Selector */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 self-start md:self-auto">
          {BLOG_POSTS.map((post) => (
            <button
              key={post.slug}
              onClick={() => {
                setSelectedPostSlug(post.slug);
                window.scrollTo({ top: document.getElementById('blog')?.offsetTop || 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedPostSlug === post.slug
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {post.category.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Blog Layout Container: 8 cols Article + 4 cols Sticky ToC Sidebar */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Article Body (8 cols) */}
        <article
          ref={articleContentRef}
          className="lg:col-span-8 p-6 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white space-y-8"
        >
          {/* Article Header */}
          <header className="space-y-4 pb-8 border-b border-white/15">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-semibold text-blue-300">
                {activePost.category}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activePost.date}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activePost.readTime}
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {activePost.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic border-l-2 border-blue-400 pl-4 font-editorial-serif text-lg">
              &ldquo;{activePost.excerpt}&rdquo;
            </p>
          </header>

          {/* Dynamic Article Content Nodes */}
          <div className="space-y-6 text-slate-200 leading-relaxed text-sm sm:text-base">
            {activePost.content.map((block, index) => {
              if (block.type === 'p') {
                return (
                  <p key={index} className="leading-relaxed text-slate-300">
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'h2') {
                return (
                  <h2
                    key={index}
                    id={block.id}
                    className="text-xl sm:text-2xl font-bold text-white pt-6 pb-2 scroll-mt-28 border-b border-white/10 flex items-center gap-2 group"
                  >
                    <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">#</span>
                    <span>{block.text}</span>
                  </h2>
                );
              }
              if (block.type === 'h3') {
                return (
                  <h3
                    key={index}
                    id={block.id}
                    className="text-lg sm:text-xl font-bold text-blue-200 pt-4 scroll-mt-28 flex items-center gap-2"
                  >
                    <span className="text-indigo-400 text-sm">##</span>
                    <span>{block.text}</span>
                  </h3>
                );
              }
              if (block.type === 'callout') {
                return (
                  <div
                    key={index}
                    className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/20 text-slate-200 text-sm sm:text-base font-medium shadow-inner flex items-start gap-3.5"
                  >
                    <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{block.text}</p>
                  </div>
                );
              }
              if (block.type === 'ul' && block.items) {
                return (
                  <ul key={index} className="space-y-2.5 list-none pt-2">
                    {block.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* Article Footer */}
          <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <p className="text-white font-semibold">Author: Gautama Sastra Waskita</p>
              <p className="text-slate-400">Faculty of Economics &amp; Business &bull; PhD Applicant</p>
            </div>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white flex items-center gap-2 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </article>

        {/* Sticky Floating Glassmorphism Table of Contents (4 cols) */}
        <aside className="lg:col-span-4 sticky top-24 space-y-6">
          
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <ListTree className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Table of Contents
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {activePost.headings.length} Sections
              </span>
            </div>

            {/* Heading Link Navigation */}
            <nav className="space-y-1 text-sm max-h-[60vh] overflow-y-auto pr-1">
              {activePost.headings.map((heading) => {
                const isActive = activeHeadingId === heading.id;

                return (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-between group ${
                      heading.level === 3 ? 'pl-6 text-slate-400' : 'font-medium text-slate-200'
                    } ${
                      isActive
                        ? 'bg-white text-blue-900 font-bold shadow-sm'
                        : 'hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{heading.text}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? 'translate-x-0.5 text-blue-900' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Dynamic Astro Info Box */}
            <div className="pt-4 border-t border-white/15 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-blue-300 block font-semibold">
                  Astro Static Extraction
                </span>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Generates zero runtime JS overhead with SSG markdown AST parser, paired with client:idle scrollspy.
                </p>
              </div>

              <a
                href="https://scholar.google.com/citations?user=jUvO-FEAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full border border-white/20 hover:bg-white/10 text-blue-200 hover:text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Google Scholar Citations</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </aside>

      </div>

    </section>
  );
};
