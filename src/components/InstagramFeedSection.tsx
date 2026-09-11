import React, { useState } from 'react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  ExternalLink, 
  X, 
  Sparkles,
  Calendar,
  Share2,
  Users
} from 'lucide-react';
import type { InstagramFeedData, InstagramPost, ThemeMode, AuthorProfile } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import { useTheme } from '../utils/useTheme';

/**
 * Official Instagram Verified Badge SVG
 */
export const InstagramVerifiedBadge: React.FC<{ className?: string }> = ({ 
  className = "w-4 h-4 sm:w-5 sm:h-5" 
}) => (
  <svg
    viewBox="0 0 40 40"
    aria-label="Sudah Diverifikasi"
    className={`inline-block shrink-0 fill-[#0095F6] ${className}`}
    style={{ minWidth: '14px' }}
  >
    <title>Sudah Diverifikasi</title>
    <path 
      d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" 
      fillRule="evenodd"
    />
  </svg>
);

interface InstagramFeedSectionProps {
  feedData?: InstagramFeedData;
  profile?: AuthorProfile;
  theme?: ThemeMode;
  showProfileHeader?: boolean;
}

export const InstagramFeedSection: React.FC<InstagramFeedSectionProps> = ({
  feedData: propFeedData,
  profile,
  theme: propTheme,
  showProfileHeader = true
}) => {
  const feed = propFeedData || INITIAL_PORTFOLIO_DATA.instagramFeed!;
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  const avatarToDisplay = 
    (feed as any).avatarImage || 
    (feed.avatarUrl && !feed.avatarUrl.includes('photo-1534528741775') ? feed.avatarUrl : '') || 
    profile?.avatarImage || 
    profile?.avatarUrl || 
    '/static/images/profile/avatarImage.jpeg';

  return (
    <div className="space-y-8 animate-fadeIn w-full">
      {/* Instagram Profile Connected Card Header */}
      {showProfileHeader && (
        <div className={`rounded-3xl p-6 sm:p-8 border relative overflow-hidden transition-all shadow-xl ${
          isDark 
            ? 'bg-gradient-to-br from-[#0c1a30] via-[#0f2444] to-[#131127] border-white/15' 
            : 'bg-gradient-to-br from-white via-slate-50 to-pink-50/30 border-slate-200'
        }`}>
          {/* Subtle Instagram Gradient Glow in Background */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-purple-600/15 via-rose-500/15 to-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Avatar with Instagram Gradient Ring & Profile Info */}
            <div className="flex items-center gap-5">
              {/* Avatar with Gradient Ring */}
              <a 
                href={feed.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group shrink-0"
                aria-label={`Kunjungi Instagram @${feed.username}`}
                title={`Kunjungi Instagram @${feed.username}`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src={avatarToDisplay}
                    alt={feed.displayName}
                    loading="eager"
                    className="w-full h-full object-cover rounded-full border-2 border-slate-900"
                  />
                </div>
              </a>

              {/* Identity & Stats */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={feed.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg sm:text-2xl font-bold tracking-tight hover:text-pink-500 transition-colors flex items-center gap-1.5"
                  >
                    <span>@{feed.username}</span>
                    <InstagramVerifiedBadge className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>

                  {/* Active Status Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{feed.statusBadge || 'Live Connected'}</span>
                  </span>
                </div>

                <p className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {feed.displayName}
                </p>

                <p className={`text-xs max-w-xl line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feed.bio}
                </p>

                {/* Followers & Posts Counter */}
                <div className="flex items-center gap-4 pt-1 text-xs font-mono">
                  <span><strong className={isDark ? 'text-white' : 'text-slate-900'}>{feed.postsCount}</strong> <span className="text-slate-400">posts</span></span>
                  <span><strong className={isDark ? 'text-white' : 'text-slate-900'}>{feed.followersCount}</strong> <span className="text-slate-400">followers</span></span>
                  <span><strong className={isDark ? 'text-white' : 'text-slate-900'}>{feed.followingCount}</strong> <span className="text-slate-400">following</span></span>
                </div>
              </div>
            </div>

            {/* Right: CTA Actions */}
            <div className="flex sm:items-center gap-3 w-full md:w-auto shrink-0 flex-wrap">
              <a
                href={feed.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 transition-all shadow-md shadow-rose-500/20 hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
                <span>{feed.followButtonText || `Follow @${feed.username} on Instagram`}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://www.instagram.com/direct/t/${feed.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200' 
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{feed.dmButtonText || 'Direct Message'}</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Feed Section Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/15 via-rose-500/15 to-amber-500/15 text-rose-500 dark:text-rose-400 border border-rose-400/25">
            <Instagram className="w-3.5 h-3.5" />
            <span>{feed.sectionBadge || 'Live Instagram Social Feed'}</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>{feed.sectionTitle || 'Instagram Activity & Fieldwork Feed'}</span>
          </h2>

          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {feed.sectionSubtitle}
          </p>
        </div>

        <a
          href={feed.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-500 hover:text-rose-600 hover:underline shrink-0"
        >
          <span>{feed.viewProfileText || `View complete profile @${feed.username}`}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Instagram Posts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {feed.posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setActivePost(post)}
            className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col relative aspect-square ${
              isDark ? 'bg-slate-900/80 border-white/15' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Square Post Image */}
            <img
              src={post.imageUrl}
              alt={post.caption.slice(0, 50)}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Category Badge */}
            {post.category && (
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md text-white border border-white/20">
                  {post.category}
                </span>
              </div>
            )}

            {/* Top Right Instagram Icon */}
            <div className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20">
              <Instagram className="w-3 h-3" />
            </div>

            {/* Hover Dark Overlay with Engagement Metrics & Caption */}
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white z-20">
              {/* Top Meta info */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-400" />
                  <span>{post.date}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold uppercase">
                  Instagram
                </span>
              </div>

              {/* Caption Excerpt */}
              <p className="text-xs leading-relaxed text-slate-200 line-clamp-4 font-light">
                {post.caption}
              </p>

              {/* Bottom Likes & Comments Count */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <Heart className="w-3.5 h-3.5 fill-rose-400" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center gap-1 text-blue-300 font-bold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-white flex items-center gap-0.5">
                  <span>View</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instagram Post Detail Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setActivePost(null)}
        >
          <div
            className={`max-w-3xl w-full rounded-3xl overflow-hidden border shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] ${
              isDark ? 'bg-[#0B1528] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePost(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image View */}
            <div className="md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[260px] md:min-h-full">
              <img
                src={activePost.imageUrl}
                alt={activePost.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover max-h-[500px]"
              />
              <div className="absolute bottom-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-black/75 text-white backdrop-blur-md border border-white/20">
                  {activePost.category || 'Instagram Post'}
                </span>
              </div>
            </div>

            {/* Right Details & Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
              
              {/* Profile Header on Modal */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
                  <img
                    src={feed.avatarUrl}
                    alt={feed.displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1">
                    <span>@{feed.username}</span>
                    <InstagramVerifiedBadge className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-400 text-[11px]">{activePost.date}</span>
                </div>
              </div>

              {/* Full Caption */}
              <div className="space-y-3 flex-1">
                <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  {activePost.caption}
                </p>
              </div>

              {/* Engagement Stats & CTA Action */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-rose-500 font-bold">
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{activePost.likes} likes</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <MessageCircle className="w-4 h-4" />
                      <span>{activePost.comments} comments</span>
                    </span>
                  </div>
                  <span>{activePost.date}</span>
                </div>

                <a
                  href={activePost.postUrl || feed.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 transition-all shadow-md hover:scale-[1.02]"
                >
                  <Instagram className="w-4 h-4" />
                  <span>View Original Post on Instagram (@{feed.username})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Bottom Instagram Connect CTA Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 border flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left ${
        isDark ? 'bg-gradient-to-r from-purple-950/40 via-rose-950/30 to-slate-900/60 border-white/10' : 'bg-gradient-to-r from-purple-50/60 via-rose-50/50 to-amber-50/40 border-slate-200 shadow-sm'
      }`}>
        <div className="space-y-1 max-w-xl">
          <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {feed.bannerTitle || 'Follow the Research Journey & Doctoral Dispatches on Instagram'}
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {feed.bannerSubtitle || `Receive regular updates on SME operations fieldwork, international conference proceedings, and daily somatic discipline routines directly from @${feed.username}.`}
          </p>
        </div>

        <a
          href={feed.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:scale-105 transition-all shadow-lg shadow-rose-500/25 shrink-0"
        >
          <Instagram className="w-4 h-4" />
          <span>{feed.bannerCtaText || `Follow @${feed.username} on Instagram`}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
