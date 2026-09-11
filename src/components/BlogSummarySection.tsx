import React from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  BookOpen
} from 'lucide-react';
import type { BlogPost, ThemeMode, PageId, PageContentData } from '../types';
import { calculateWordCount, formatReadingTime } from '../utils/readingTime';
import { LandscapeBlogVisual } from './LandscapeBlogVisual';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import { useTheme } from '../utils/useTheme';

interface BlogSummarySectionProps {
  posts?: BlogPost[];
  pageContent?: PageContentData;
  theme?: ThemeMode;
  onNavigate: (page: PageId, slug?: string) => void;
  onOpenSanity?: () => void;
}

export const BlogSummarySection: React.FC<BlogSummarySectionProps> = ({
  posts = [],
  pageContent: propPageContent,
  theme: propTheme,
  onNavigate
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  // Point 2: On Homepage only show brief summary of 3 blog articles
  const recentPosts = (posts || []).slice(0, 3);

  return (
    <section id="blog-summary" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t overflow-hidden w-full max-w-full ${
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
            <FileText className="w-3.5 h-3.5" />
            <span>{pageContent.blogBadge || 'Academic Insights & Research Notes'}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {pageContent.blogTitle ? (
              <span>{pageContent.blogTitle}</span>
            ) : (
              <>Latest <span className="font-bold text-blue-500">Academic Insights</span></>
            )}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {pageContent.blogSubtitle || 'Methodological notes, qualitative fieldwork reflections, and doctoral research synthesis with landscape visual documentation.'}
          </p>
        </div>

        <a
          href="/blog"
          className={`w-full sm:w-auto shrink-0 px-4 py-2.5 sm:py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
            isDark 
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
              : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <span>Explore Full Blog &amp; Dynamic ToC</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
        </a>
      </div>

      {/* 3 Summary Cards Grid with Landscape Previews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 min-w-0 w-full">
        {recentPosts.map((post) => {
          const autoReadTime = formatReadingTime(post);
          const words = calculateWordCount(post);

          return (
            <div
              key={post.slug}
              className={`p-4 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-xl group min-w-0 max-w-full w-full overflow-hidden ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-white/40' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-blue-300'
              }`}
            >
              <div className="space-y-4">
                {/* Landscape Visual Header (Photo or Diagram Schematic) */}
                <a href={`/blog/${post.slug}`} className="block">
                  <LandscapeBlogVisual
                    post={post}
                    theme={theme}
                    variant="card"
                  />
                </a>

                {/* Category & Read time */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${
                    isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {post.category}
                  </span>

                  <span className={`flex items-center gap-1 ${isDark ? 'text-blue-300' : 'text-blue-700 font-semibold'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{autoReadTime}</span>
                  </span>
                </div>

                {/* Title */}
                <a href={`/blog/${post.slug}`} className="block">
                  <h3 
                    className={`text-base font-bold leading-snug group-hover:text-blue-500 transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {post.title}
                  </h3>
                </a>

                {/* Excerpt */}
                <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {post.excerpt}
                </p>
              </div>

              {/* Read Full Article Button & Word Count */}
              <div className={`pt-4 mt-4 border-t flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <span className={`text-[11px] font-mono flex items-center gap-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </span>

                <a
                  href={`/blog/${post.slug}`}
                  className={`text-xs font-bold flex items-center gap-1.5 transition-colors group-hover:translate-x-1 ${
                    isDark ? 'text-blue-300 hover:text-white' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
