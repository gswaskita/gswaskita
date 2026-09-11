import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Tag, 
  Share2, 
  Sparkles, 
  ArrowUpRight, 
  Check, 
  Copy, 
  Send, 
  Heart, 
  MessageSquare, 
  User, 
  FileText, 
  Hash, 
  Search, 
  Filter, 
  ChevronRight,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  Award,
  Layers,
  LogOut,
  CornerDownRight,
  Download,
  Paperclip,
  Users
} from 'lucide-react';
import type { BlogPost, ThemeMode, PageId, AuthUser, BlogComment, PageContentData, AuthorProfile, PhdStatusData } from '../../types';
import { calculateWordCount, calculateReadingTimeMinutes, formatReadingTime, extractHeadings } from '../../utils/readingTime';
import { LandscapeBlogVisual } from '../LandscapeBlogVisual';
import { useTheme } from '../../utils/useTheme';
import { LoginModal } from '../LoginModal';
import { INITIAL_PORTFOLIO_DATA } from '../../data/portfolioData';

interface BlogPageProps {
  posts?: BlogPost[];
  pageContent?: PageContentData;
  profile?: AuthorProfile;
  phdStatus?: PhdStatusData;
  theme?: ThemeMode;
  onNavigate: (page: PageId, slug?: string) => void;
  currentUser?: AuthUser | null;
  onOpenLogin?: () => void;
  comments?: BlogComment[];
  onAddComment?: (comment: BlogComment) => void;
  onLikeComment?: (commentId: string) => void;
  initialSlug?: string | null;
  onOpenSanity?: () => void;
}

interface ScholarlyDiscussionSectionProps {
  postSlug: string;
  postTitle: string;
  isDark: boolean;
  currentUser?: AuthUser | null;
  authorName?: string;
  onCommentCountChange?: (count: number) => void;
}

interface ScholarlyCommentItem {
  id: string;
  postSlug: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  institution?: string;
  content: string;
  createdAt: string;
  likes?: number;
  reply?: {
    text: string;
    authorName?: string;
    repliedAt?: string;
  };
}

const ScholarlyDiscussionSection: React.FC<ScholarlyDiscussionSectionProps> = ({
  postSlug,
  postTitle,
  isDark,
  currentUser,
  authorName = 'Gautama Sastra Waskita, S.E., B.BA., M.M.',
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState<ScholarlyCommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form inputs
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [role, setRole] = useState(
    currentUser?.role === 'admin'
      ? 'Author / Principal Investigator'
      : 'Peer Reviewer / Academician'
  );
  const [institution, setInstitution] = useState(currentUser?.institution || '');
  const [content, setContent] = useState('');

  // Upvote / Like tracking
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // In-line Author reply state
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const formContainerRef = useRef<HTMLDivElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  // Sync user info if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!institution && currentUser.institution) setInstitution(currentUser.institution);
    }
  }, [currentUser]);

  // Load liked comments from localStorage
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('gautama_scholarly_liked_comments');
      if (savedLikes) {
        setLikedIds(new Set(JSON.parse(savedLikes)));
      }
    } catch (e) {}
  }, []);

  // Fetch comments from local SSR API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.comments)) {
          setComments(data.comments);
          if (onCommentCountChange) {
            onCommentCountChange(data.comments.length);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load comments:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setSubmitError('Name and review content are required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          postTitle,
          postUrl: typeof window !== 'undefined' ? window.location.href : undefined,
          userName: name.trim(),
          userEmail: email.trim(),
          userRole: role,
          institution: institution.trim() || 'Academic Institution',
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        const newCount = comments.length + 1;
        if (onCommentCountChange) {
          onCommentCountChange(newCount);
        }
        setContent('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.error || 'Failed to submit comment. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Error submitting comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (likedIds.has(commentId)) return;

    const nextLiked = new Set([...likedIds, commentId]);
    setLikedIds(nextLiked);
    try {
      localStorage.setItem('gautama_scholarly_liked_comments', JSON.stringify(Array.from(nextLiked)));
    } catch (e) {}

    // Optimistic update
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );

    try {
      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', commentId }),
      });
    } catch (e) {}
  };

  const handleQuote = (comment: ScholarlyCommentItem) => {
    const quote = `@${comment.userName}: `;
    setContent((prev) => (prev.includes(quote) ? prev : `${quote}${prev}`));
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (contentInputRef.current) {
      contentInputRef.current.focus();
    }
  };

  const handleAuthorReplySubmit = async (commentId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          commentId,
          replyText: replyText.trim(),
          authorName,
        }),
      });

      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => prev.map((c) => (c.id === commentId ? data.comment : c)));
        setReplyingCommentId(null);
        setReplyText('');
      }
    } catch (e) {
      console.error('Failed to submit author reply:', e);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch (e) {}
    return dateStr || 'Recently';
  };

  const getInitials = (userName: string) => {
    if (!userName) return 'SR';
    const clean = userName.replace(/^(Dr\.|Prof\.|Ir\.|H\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const getRoleStyle = (userRole?: string) => {
    const r = (userRole || '').toLowerCase();
    if (r.includes('author') || r.includes('investigator')) {
      return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    }
    if (r.includes('doctor') || r.includes('phd') || r.includes('lecturer') || r.includes('prof')) {
      return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    }
    if (r.includes('industry') || r.includes('practitioner') || r.includes('exec')) {
      return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
    }
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
  };

  const isAuthorUser =
    currentUser?.role === 'admin' ||
    (currentUser?.name && currentUser.name.toLowerCase().includes('gautama'));

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* 1. Comment Submission Form */}
      <div
        ref={formContainerRef}
        id="comment-form-container"
        className={`p-4 sm:p-6 rounded-2xl border transition-all duration-200 ${
          isDark
            ? 'bg-slate-900/60 border-white/10 shadow-inner'
            : 'bg-slate-50/80 border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-200">
              Submit Scholarly Review &amp; Inquiry
            </h4>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-300">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <p className="font-medium">
              Thank you for contributing. Your scholarly comment has been published and registered to the academic dossier.
            </p>
          </div>
        )}

        {submitError && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <span className="font-bold">Error:</span>
            <p>{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Reviewer Name &amp; Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Jane Doe / John Smith, M.Sc."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark
                    ? 'bg-slate-950/70 border-white/10 text-white placeholder-slate-500 focus:border-blue-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Email Address <span className="text-[10px] font-normal text-slate-400">(Confidential)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@university.edu"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark
                    ? 'bg-slate-950/70 border-white/10 text-white placeholder-slate-500 focus:border-blue-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Academic Role / Designation
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark
                    ? 'bg-slate-950/70 border-white/10 text-white focus:border-blue-400'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              >
                <option value="Peer Reviewer / Academician">Peer Reviewer / Academician</option>
                <option value="Doctoral Candidate">Doctoral Candidate / PhD Researcher</option>
                <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                <option value="Industry Practitioner / Executive">Industry Practitioner / Executive</option>
                <option value="Student / Independent Scholar">Student / Independent Scholar</option>
                {isAuthorUser && (
                  <option value="Author / Principal Investigator">Author / Principal Investigator</option>
                )}
              </select>
            </div>

            {/* University / Institution */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                University / Institution Affiliation
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Universitas Indonesia, Manchester, etc."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark
                    ? 'bg-slate-950/70 border-white/10 text-white placeholder-slate-500 focus:border-blue-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Comment Content */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Constructive Review / Inquiry <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={contentInputRef}
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your academic review, methodological inquiry, or field observation regarding this research..."
              className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y min-h-[110px] ${
                isDark
                  ? 'bg-slate-950/70 border-white/10 text-white placeholder-slate-500 focus:border-blue-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Academic integrity guidelines apply.</span>
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all duration-200 shadow-md ${
                isSubmitting
                  ? 'opacity-60 cursor-not-allowed bg-blue-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white hover:shadow-blue-500/25'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Scholarly Review'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Comments List Header */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-sans">
            Published Peer Inquiries &amp; Reviews
          </h4>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            {comments.length}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Chronological Peer Feedback
        </span>
      </div>

      {/* 3. Comments Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className={`p-5 rounded-2xl border animate-pulse space-y-3 ${
                isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-400/20"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-3 bg-slate-400/20 rounded"></div>
                  <div className="w-48 h-2.5 bg-slate-400/15 rounded"></div>
                </div>
              </div>
              <div className="w-full h-12 bg-slate-400/15 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div
          className={`p-8 sm:p-12 text-center rounded-2xl border flex flex-col items-center justify-center space-y-3 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <h5 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              No Peer Reviews Published Yet
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Be the first academic colleague, doctoral candidate, or researcher to initiate scholarly dialogue on this working paper.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isLiked = likedIds.has(comment.id);
            const isReplyingThis = replyingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className={`p-4 sm:p-6 rounded-2xl border transition-all duration-200 space-y-3.5 ${
                  isDark
                    ? 'bg-slate-900/40 border-white/10 hover:border-white/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 flex items-center justify-center font-bold text-xs font-mono border border-blue-500/20 shrink-0">
                      {getInitials(comment.userName)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {comment.userName}
                        </h5>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-medium truncate ${getRoleStyle(
                            comment.userRole
                          )}`}
                        >
                          {comment.userRole || 'Scholar Reviewer'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                        <GraduationCap className="w-3 h-3 shrink-0" />
                        <span className="truncate">{comment.institution || 'Academic Institution'}</span>
                        <span>&bull;</span>
                        <span className="shrink-0">{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleLike(comment.id)}
                      title={isLiked ? 'Liked' : 'Helpful review'}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border ${
                        isLiked
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleQuote(comment)}
                      title="Quote in review"
                      className={`p-1.5 rounded-lg text-xs font-mono transition-all duration-200 border ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1 sm:pl-13 whitespace-pre-wrap break-words">
                  {comment.content}
                </div>

                {/* Verified Author Reply */}
                {comment.reply && (
                  <div
                    className={`mt-3 ml-2 sm:ml-10 p-3.5 sm:p-4 rounded-xl border space-y-2 ${
                      isDark
                        ? 'bg-blue-950/20 border-blue-500/30'
                        : 'bg-blue-50/70 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        </span>
                        <span className="text-xs font-bold font-sans text-blue-600 dark:text-blue-400">
                          {comment.reply.authorName || `${authorName} (Author Response)`}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold">
                          VERIFIED
                        </span>
                      </div>
                      {comment.reply.repliedAt && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {formatDate(comment.reply.repliedAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pl-7">
                      {comment.reply.text}
                    </p>
                  </div>
                )}

                {/* In-line Author Reply Toggle & Form for Authenticated Author */}
                {isAuthorUser && !comment.reply && (
                  <div className="pt-1 pl-1 sm:pl-13">
                    {!isReplyingThis ? (
                      <button
                        onClick={() => {
                          setReplyingCommentId(comment.id);
                          setReplyText('');
                        }}
                        className="text-[11px] font-mono font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Reply as Author</span>
                      </button>
                    ) : (
                      <div className="mt-2 space-y-2 p-3 rounded-xl border bg-slate-900/30 border-blue-500/30">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write verified author response..."
                          className="w-full p-2.5 rounded-lg border text-xs bg-slate-950/70 border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingCommentId(null)}
                            className="px-3 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isSubmittingReply || !replyText.trim()}
                            onClick={() => handleAuthorReplySubmit(comment.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                          >
                            {isSubmittingReply ? 'Posting...' : 'Post Author Response'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const BlogPage: React.FC<BlogPageProps> = ({
  posts = [],
  pageContent: propPageContent,
  profile: propProfile,
  phdStatus: propPhdStatus,
  theme: propTheme,
  onNavigate,
  currentUser: propUser = null,
  onOpenLogin,
  comments: propComments = [],
  onAddComment,
  onLikeComment,
  initialSlug,
  onOpenSanity
}) => {
  const pageContent = propPageContent || INITIAL_PORTFOLIO_DATA.pageContent!;
  const profile = propProfile || INITIAL_PORTFOLIO_DATA.profile;
  const phdStatus = propPhdStatus || INITIAL_PORTFOLIO_DATA.phdStatus;
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Authenticated user state
  const [localUser, setLocalUser] = useState<AuthUser | null>(propUser || null);

  // Comments state with fallback persistence (initialized from server data to prevent hydration mismatch)
  const [allComments, setAllComments] = useState<BlogComment[]>(() => {
    if (propComments && propComments.length > 0) return propComments;
    return INITIAL_PORTFOLIO_DATA.comments || [];
  });

  // Track liked comments
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  // Post-hydration localStorage sync (runs strictly on client after initial render to eliminate SSR mismatch)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('gautama_portfolio_auth_user');
      if (savedUser) setLocalUser(JSON.parse(savedUser));

      const savedComments = localStorage.getItem('gautama_portfolio_comments');
      if (savedComments) {
        const parsed = JSON.parse(savedComments);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllComments(parsed);
        }
      }

      const savedLikes = localStorage.getItem('gautama_liked_comments');
      if (savedLikes) setLikedCommentIds(new Set(JSON.parse(savedLikes)));
    } catch (e) {}
  }, []);

  // Active view: null means showing the Collection, string slug means showing Single Article
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  
  // Search & Filter state for collection view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Single Article State: Active Heading for Table of Contents (Scrollspy)
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Comment submission form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentInstitution, setCommentInstitution] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Live Cusdis comments count for current post
  const [cusdisCommentCount, setCusdisCommentCount] = useState<number | null>(null);

  // Sync initialSlug if prop changes
  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  // Sync user info if user changes
  useEffect(() => {
    if (localUser) {
      setCommentName(localUser.name);
      setCommentEmail(localUser.email);
      setCommentInstitution(localUser.institution || '');
    }
  }, [localUser]);

  // Selected article
  const currentPost = useMemo(() => {
    if (!selectedSlug) return null;
    const safePosts = posts || [];
    return safePosts.find(p => p.slug === selectedSlug) || safePosts[0] || null;
  }, [selectedSlug, posts]);

  // Fetch live comment count from local API whenever post changes
  useEffect(() => {
    if (!currentPost?.slug) {
      setCusdisCommentCount(null);
      return;
    }

    let isMounted = true;
    fetch(`/api/comments?postSlug=${encodeURIComponent(currentPost.slug)}`)
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && Array.isArray(res.comments)) {
          setCusdisCommentCount(res.comments.length);
        } else {
          setCusdisCommentCount(0);
        }
      })
      .catch(() => {
        if (isMounted) setCusdisCommentCount(0);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPost?.slug]);

  // Dynamic headings for ToC
  const postHeadings = useMemo(() => {
    if (!currentPost) return [];
    return extractHeadings(currentPost);
  }, [currentPost]);

  // Filtered comments for the current post
  const postComments = useMemo(() => {
    if (!currentPost) return [];
    return allComments.filter(c => c && c.postSlug === currentPost.slug);
  }, [allComments, currentPost]);

  // Scrollspy logic for Table of Contents
  useEffect(() => {
    if (!currentPost || postHeadings.length === 0) return;

    // Set first heading as active initially
    setActiveHeadingId(postHeadings[0]?.id || '');

    const handleScroll = () => {
      const headingElements = postHeadings
        .map(h => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);

      const scrollPosition = window.scrollY + 180;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveHeadingId(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPost, postHeadings]);

  // Scroll to heading on click (with clearance for sticky navbar)
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveHeadingId(id);
    }
  };

  // Categories & Tags list for filtering in collection view
  const allCategories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags || [])))];

  const filteredPosts = posts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesTag = selectedTag === 'All' || (p.tags && p.tags.includes(selectedTag));
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));
    return matchesCat && matchesTag && matchesSearch;
  });

  const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp' | 'copy') => {
    if (!currentPost) return;
    const url = typeof window !== 'undefined' ? window.location.href : `https://sastrawaskita.com/blog/${currentPost.slug}`;
    const title = currentPost.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(url);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleLogin = (user: AuthUser) => {
    setLocalUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gautama_portfolio_auth_user', JSON.stringify(user));
    }
    setCommentName(user.name);
    setCommentEmail(user.email);
    setCommentInstitution(user.institution || '');
    if (user.role === 'admin') {
      window.location.href = '/keystatic';
    }
  };

  const handleLogout = () => {
    setLocalUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gautama_portfolio_auth_user');
    }
    setCommentName('');
    setCommentEmail('');
    setCommentInstitution('');
  };

  const handleLikeComment = (commentId: string) => {
    const isAlreadyLiked = likedCommentIds.has(commentId);
    const updatedLikes = new Set(likedCommentIds);

    const updated = allComments.map(c => {
      if (c.id === commentId) {
        const newLikes = isAlreadyLiked ? Math.max(0, c.likes - 1) : c.likes + 1;
        return { ...c, likes: newLikes };
      }
      return c;
    });

    if (isAlreadyLiked) {
      updatedLikes.delete(commentId);
    } else {
      updatedLikes.add(commentId);
    }

    setLikedCommentIds(updatedLikes);
    setAllComments(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('gautama_portfolio_comments', JSON.stringify(updated));
      localStorage.setItem('gautama_liked_comments', JSON.stringify(Array.from(updatedLikes)));
    }

    if (onLikeComment) {
      onLikeComment(commentId);
    }
  };

  const handleReply = (authorName: string) => {
    const prefix = `@${authorName} `;
    setCommentText(prev => prev.includes(prefix) ? prev : `${prefix}${prev}`);
    if (commentTextareaRef.current) {
      commentTextareaRef.current.focus();
    }
    const formEl = document.getElementById('comments-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost || !commentText.trim()) return;

    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      postSlug: currentPost.slug,
      userName: commentName.trim() || localUser?.name || 'Anonymous Scholar',
      userEmail: commentEmail.trim() || localUser?.email || 'reader@academia.edu',
      userRole: localUser ? localUser.role : 'member',
      institution: commentInstitution.trim() || localUser?.institution || 'Academic Reader',
      content: commentText.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likes: 0
    };

    const updatedComments = [newComment, ...allComments];
    setAllComments(updatedComments);

    if (typeof window !== 'undefined') {
      localStorage.setItem('gautama_portfolio_comments', JSON.stringify(updatedComments));
    }

    if (onAddComment) {
      onAddComment(newComment);
    }

    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  // ==========================================
  // VIEW 1: SINGLE BLOG POST WITH DYNAMIC ToC
  // ==========================================
  if (currentPost) {
    const wordCount = calculateWordCount(currentPost);
    const readingMinutes = calculateReadingTimeMinutes(currentPost);
    const formattedReadTime = formatReadingTime(currentPost);

    // Primary Author Information (Synchronized from Profile & PhD Status)
    const primaryAuthorAvatar = profile.avatarImage || profile.avatarUrl;
    const formattedAuthorSuffix = profile.suffix
      ? (profile.suffix.trim().startsWith(',') ? profile.suffix.trim() : `, ${profile.suffix.trim()}`)
      : '';
    const primaryAuthorFullName = `${profile.prefix ? `${profile.prefix.trim()} ` : ''}${profile.name}${formattedAuthorSuffix}`;
    const primaryAuthorRole = profile.role || 'Lecturer in Management & Entrepreneurship';
    const primaryAuthorAffiliation = (() => {
      const inst = (profile.institution || 'Universitas Tulungagung').trim();
      const fac = (profile.faculty || '').trim();
      const loc = (profile.location || 'Indonesia').trim();
      let base = '';
      if (fac && inst) {
        base = inst.toLowerCase().includes(fac.toLowerCase()) ? inst : `${fac}, ${inst}`;
      } else {
        base = inst || fac;
      }
      return loc ? `${base} • ${loc}` : base;
    })();

    // Additional Co-Authors (Filter out primary author to prevent redundancy)
    const additionalAuthors = (currentPost.authors || []).filter(a => {
      if (!a || !a.name || !a.name.trim()) return false;
      const lower = a.name.toLowerCase();
      const profileNameLower = (profile.name || '').toLowerCase();
      if (lower.includes('gautama') || (profileNameLower && lower.includes(profileNameLower))) {
        return false;
      }
      return true;
    });

    const noteHeading = profile.authorNoteHeading || 'Peer-Triangulated Note';
    const noteText = profile.authorNoteText || 'Methodological empirical reflections for doctoral supervision in Operations Management.';

    return (
      <div className="py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-fadeIn w-full max-w-full min-w-0 overflow-x-hidden">
        
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b pb-4 border-slate-300 dark:border-white/10 w-full min-w-0">
          <nav aria-label="Breadcrumb" className={`inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono border max-w-full ${
            isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-300 text-slate-700 shadow-sm'
          }`}>
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </a>
            <span className="text-slate-400">/</span>
            <a 
              href="/blog" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedSlug(null);
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/blog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="hover:text-blue-600 transition-colors"
            >
              Blog
            </a>
            <span className="text-slate-400">/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold truncate max-w-[130px] sm:max-w-[200px] md:max-w-none">{currentPost.category}</span>
            <span className="text-slate-400 hidden md:inline">/</span>
            <span className="text-slate-700 dark:text-slate-400 hidden md:inline truncate max-w-[280px] font-medium">{currentPost.title}</span>
          </nav>

          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 hidden sm:inline">
            Academic Research Note
          </span>
        </div>

        {/* Article Full Header (Title & Meta) */}
        <header className="space-y-3.5 sm:space-y-4 w-full min-w-0">
          {/* Category & Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
              isDark 
                ? 'bg-blue-950/80 border-blue-400/40 text-blue-300' 
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              {currentPost.category}
            </span>

            {currentPost.tags && currentPost.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Article Title (Judul) */}
          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-snug sm:leading-[1.2] font-editorial-serif break-words hyphens-auto ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {currentPost.title}
          </h1>

          {/* Excerpt / Lead Paragraph */}
          <p className={`text-sm sm:text-base md:text-lg leading-relaxed italic break-words ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            &ldquo;{currentPost.excerpt}&rdquo;
          </p>
        </header>

        {/* Unified 12-Column Article & Sidebar Grid (Artikel Tepat di Bawah Foto Tanpa Jarak) */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start w-full min-w-0 max-w-full">
          
          {/* Left Column (8 Cols): Featured Visual & Article Content Tepat di Bawahnya */}
          <main className="lg:col-span-8 space-y-5 sm:space-y-6 min-w-0 max-w-full w-full">
            
            {/* Article Landscape Visual (Photo / Scholarly Schematic) */}
            <div className="w-full min-w-0 max-w-full">
              <LandscapeBlogVisual
                post={currentPost}
                theme={theme}
                variant="hero"
                showToggle={true}
              />
            </div>

            {/* Mobile Collapsible Table of Contents (lg:hidden) */}
            {postHeadings.length > 0 && (
              <div className={`lg:hidden p-4 rounded-2xl border transition-all ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-sm'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                  className="flex items-center justify-between w-full text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="truncate">Table of Contents ({postHeadings.length} Sections)</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isMobileTocOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileTocOpen && (
                  <nav className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1">
                    {postHeadings.map((h, hIdx) => {
                      const isActive = activeHeadingId === h.id;
                      return (
                        <button
                          key={hIdx}
                          onClick={() => {
                            scrollToHeading(h.id);
                            setIsMobileTocOpen(false);
                          }}
                          className={`w-full text-left py-2 px-2.5 rounded-xl text-xs transition-colors flex items-start gap-2 ${
                            h.level === 3 ? 'pl-5 text-[11px]' : 'font-semibold'
                          } ${
                            isActive
                              ? 'bg-blue-600 text-white font-bold'
                              : isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                          <span className="leading-snug line-clamp-2">{h.text}</span>
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>
            )}

            {/* Article Text Content (Tepat di Bawah Gambar) */}
            <article className={`p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border space-y-5 sm:space-y-6 text-sm sm:text-base leading-relaxed min-w-0 max-w-full break-words overflow-x-hidden ${
              isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-md'
            }`}>
              
              {/* Dynamic Content Blocks */}
              {currentPost.content && currentPost.content.map((block, idx) => {
                if (block.type === 'h2') {
                  const headingId = block.id || block.text?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `h2-${idx}`;
                  return (
                    <h2
                      id={headingId}
                      key={idx}
                      className={`text-xl sm:text-2xl lg:text-3xl font-bold font-editorial-serif pt-4 sm:pt-6 pb-2 border-b scroll-mt-28 break-words hyphens-auto ${
                        isDark ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
                      }`}
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === 'h3') {
                  const headingId = block.id || block.text?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `h3-${idx}`;
                  return (
                    <h3
                      id={headingId}
                      key={idx}
                      className={`text-base sm:text-lg lg:text-xl font-bold font-editorial-serif pt-3 sm:pt-4 text-blue-500 scroll-mt-28 break-words hyphens-auto`}
                    >
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === 'callout') {
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border space-y-2 my-4 min-w-0 max-w-full break-words ${
                        isDark 
                          ? 'bg-blue-950/50 border-blue-400/30 text-blue-100' 
                          : 'bg-blue-50/80 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-blue-400">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>Methodological &amp; Theoretical Insight</span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed">{block.text}</p>
                    </div>
                  );
                }

                if (block.type === 'quote') {
                  return (
                    <blockquote
                      key={idx}
                      className={`pl-3.5 sm:pl-5 border-l-4 italic my-4 space-y-1 min-w-0 max-w-full break-words ${
                        isDark ? 'border-blue-500 text-slate-300' : 'border-blue-600 text-slate-700'
                      }`}
                    >
                      <p className="text-sm sm:text-base md:text-lg">&ldquo;{block.text}&rdquo;</p>
                    </blockquote>
                  );
                }

                if (block.type === 'ul' && block.items) {
                  return (
                    <ul key={idx} className="space-y-2 sm:space-y-2.5 pl-4 sm:pl-5 list-disc text-sm sm:text-base min-w-0 max-w-full break-words">
                      {block.items.map((item, iIdx) => (
                        <li key={iIdx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={idx} className="leading-relaxed break-words min-w-0 max-w-full">
                    {block.text}
                  </p>
                );
              })}

              {(!currentPost.content || currentPost.content.length === 0) && (
                <p className="leading-relaxed italic text-slate-500 py-4">
                  {currentPost.excerpt || 'Konten lengkap artikel ini sedang dalam proses penyusunan.'}
                </p>
              )}

            </article>

            {/* Attached Working Paper & Media Files if available */}
            {(currentPost.documentFile || currentPost.mediaFile) && (
              <div className={`p-4 sm:p-6 rounded-2xl border space-y-3 min-w-0 max-w-full overflow-hidden ${
                isDark 
                  ? 'bg-blue-950/30 border-blue-500/30 text-white' 
                  : 'bg-blue-50/70 border-blue-200 text-slate-900'
              }`}>
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
                    Attached Research Materials &amp; Working Papers:
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
                  {currentPost.documentFile && (
                    <a
                      href={currentPost.documentFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm w-full sm:w-auto text-center ${
                        isDark 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                          : 'bg-blue-700 hover:bg-blue-800 text-white'
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">Download Working Paper (PDF)</span>
                      <Download className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  )}

                  {currentPost.mediaFile && (
                    <a
                      href={currentPost.mediaFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm w-full sm:w-auto text-center ${
                        isDark 
                          ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white' 
                          : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                      }`}
                    >
                      <Download className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate">View Attached Media / Presentation</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Social Share Bar ("Share It") */}
            <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0 max-w-full ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-300 shadow-md'
            }`}>
              <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Share this Academic Note:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                  Share this research methodology and synthesis with academic peers &amp; colleagues
                </p>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleShare('twitter')}
                  title="Share on Twitter / X"
                  className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 transition-all shadow-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <span>Twitter / X</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                  className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-700 text-white hover:bg-blue-600 transition-all shadow-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <span>LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  title="Share via WhatsApp"
                  className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  title="Copy direct article URL"
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 border shadow-sm w-full sm:w-auto ${
                    copiedLink
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : isDark
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                  <span className="truncate">{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* About the Author Card */}
            <div className={`p-4 sm:p-8 rounded-2xl sm:rounded-3xl border space-y-4 sm:space-y-5 min-w-0 max-w-full overflow-hidden ${
              isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>About the Author</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg shrink-0 border border-slate-200 dark:border-white/10">
                  {primaryAuthorAvatar ? (
                    <img
                      src={primaryAuthorAvatar}
                      alt={primaryAuthorFullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>GW</span>
                  )}
                </div>
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="text-[10px] font-mono text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wider">
                    Author
                  </div>
                  <h3 className="text-base sm:text-lg font-bold break-words leading-snug">
                    {primaryAuthorFullName}
                  </h3>
                  <p className="text-xs text-blue-500 dark:text-blue-400 font-mono font-medium break-words leading-normal">
                    {primaryAuthorRole}
                  </p>
                  {primaryAuthorAffiliation && (
                    <p className={`text-xs break-words leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {primaryAuthorAffiliation}
                    </p>
                  )}
                  <p className={`text-xs leading-relaxed pt-1 break-words ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {profile.bioQuote || `${profile.faculty ? `${profile.faculty}, ` : ''}${profile.institution}. ${profile.tagline || ''}`}
                  </p>
                </div>
              </div>

              {/* Co-Authors / Penulis Tambahan if any */}
              {additionalAuthors.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Co-Authors &amp; Academic Collaborators ({additionalAuthors.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                    {additionalAuthors.map((author, idx) => {
                      const coAvatar = author.avatarImage || author.avatarUrl || author.avatar;
                      return (
                        <div key={idx} className={`p-3 sm:p-3.5 rounded-2xl border flex items-center gap-3 min-w-0 ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow shrink-0 border border-slate-200 dark:border-white/10">
                            {coAvatar ? (
                              <img src={coAvatar} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{author.name ? author.name.slice(0, 2).toUpperCase() : 'AU'}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className={`text-xs font-bold break-words leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {author.name}
                            </h5>
                            {author.role && (
                              <p className="text-[11px] text-blue-500 dark:text-blue-400 font-mono break-words leading-normal">
                                {author.role}
                              </p>
                            )}
                            {author.affiliation && (
                              <p className="text-[10px] text-slate-400 break-words leading-normal">
                                {author.affiliation}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Peer-Triangulated Note Box */}
              <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs space-y-1.5 min-w-0 ${
                isDark ? 'bg-blue-950/30 border-blue-400/20 text-blue-100' : 'bg-blue-50/70 border-blue-200 text-blue-950'
              }`}>
                <div className="flex items-center gap-2 font-mono font-bold text-blue-500 text-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{noteHeading}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90 pl-6">
                  {noteText}
                </p>
              </div>

              {/* Quick Navigation Action Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                  className="text-xs text-blue-400 hover:underline font-mono flex items-center gap-1 font-semibold"
                >
                  <span>View Full Academic Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
                <span className="text-slate-500 hidden xs:inline">&bull;</span>
                <a
                  href="/research"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('research');
                  }}
                  className="text-xs text-emerald-400 hover:underline font-mono flex items-center gap-1 font-semibold"
                >
                  <span>Explore Research Publications</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Scholarly Discussion & Comments */}
            <section id="comments-section" className={`p-4 sm:p-8 rounded-2xl sm:rounded-3xl border space-y-5 sm:space-y-6 transition-colors duration-200 min-w-0 max-w-full overflow-hidden ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
            }`}>
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-white/10 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight truncate">
                      Scholarly Discussion &amp; Comments
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate">
                      Peer Inquiries, Methodological Feedback &amp; Academic Dialogue
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>
                      {cusdisCommentCount !== null && cusdisCommentCount > 0
                        ? `${cusdisCommentCount} Scholarly Comment${cusdisCommentCount > 1 ? 's' : ''}`
                        : 'Open Scholarly Review'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Scholarly Discussion Guidance Callout */}
              <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 min-w-0 ${
                isDark ? 'bg-blue-950/30 border-blue-400/20 text-blue-200' : 'bg-blue-50/70 border-blue-200 text-blue-950'
              }`}>
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  Constructive scholarly reflections, methodology questions, and empirical dialogue are welcomed. Comments are moderated for academic integrity.
                </p>
              </div>

              {/* Native Scholarly Discussion Component */}
              <div className="pt-1 transition-all duration-200 min-w-0 max-w-full">
                <ScholarlyDiscussionSection
                  postSlug={currentPost.slug}
                  postTitle={currentPost.title}
                  isDark={isDark}
                  currentUser={localUser}
                  authorName={primaryAuthorFullName}
                  onCommentCountChange={setCusdisCommentCount}
                />
              </div>

            </section>

          </main>

          {/* Right Column: Telemetry Dossier, More Working Notes & Sticky Floating ToC */}
          <aside className="lg:col-span-4 space-y-5 sm:space-y-6 self-stretch h-full relative min-w-0 max-w-full w-full">
            
            {/* 1. Article Telemetry & Author Dossier Card */}
            <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col justify-between space-y-4 sm:space-y-5 shadow-lg min-w-0 max-w-full ${
              isDark 
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}>
              
              {/* Header: Author & Affiliation */}
              <div className="space-y-3 border-b pb-4 border-slate-200 dark:border-white/10 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-500">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{pageContent?.blogTelemetryHeading || 'Article Telemetry & Dossier'}</span>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow shrink-0 border border-slate-200 dark:border-white/10">
                    {primaryAuthorAvatar ? (
                      <img
                        src={primaryAuthorAvatar}
                        alt={primaryAuthorFullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>GW</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wider">
                      Author
                    </div>
                    <h4 className={`text-sm font-bold break-words leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {primaryAuthorFullName}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono break-words leading-normal">
                      {primaryAuthorRole}
                    </p>
                  </div>
                </div>

                {/* Additional Co-Authors (if any) */}
                {additionalAuthors.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2.5 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">Co-Author{additionalAuthors.length > 1 ? 's' : ''} / Penulis Tambahan:</span>
                    </div>
                    {additionalAuthors.map((author, idx) => {
                      const coAvatar = author.avatarImage || author.avatarUrl || author.avatar;
                      return (
                        <div key={idx} className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] shadow shrink-0 border border-slate-200 dark:border-white/10">
                            {coAvatar ? (
                              <img src={coAvatar} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{author.name ? author.name.slice(0, 2).toUpperCase() : 'AU'}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className={`text-xs font-bold break-words leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {author.name}
                            </h5>
                            <p className="text-[10px] text-slate-400 font-mono break-words leading-normal">
                              {[author.role, author.affiliation].filter(Boolean).join(' • ') || 'Co-Author'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4 Telemetry Metric Tiles (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 min-w-0">
                <div className={`p-2.5 sm:p-3 rounded-xl border space-y-0.5 min-w-0 overflow-hidden ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-blue-500 font-semibold">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="truncate">Read Time</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold font-mono truncate">
                    {formattedReadTime}
                  </p>
                </div>

                <div className={`p-2.5 sm:p-3 rounded-xl border space-y-0.5 min-w-0 overflow-hidden ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-semibold">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="truncate">Word Count</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold font-mono truncate">
                    {wordCount.toLocaleString()} words
                  </p>
                </div>

                <div className={`p-2.5 sm:p-3 rounded-xl border space-y-0.5 min-w-0 overflow-hidden ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 font-semibold">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span className="truncate">Published</span>
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold font-mono truncate">
                    {currentPost.date}
                  </p>
                </div>

                <a
                  href="#comments-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border space-y-0.5 block hover:border-amber-400/50 transition-all cursor-pointer min-w-0 overflow-hidden ${
                    isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Jump to Scholarly Discussion & Comments"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-500 font-semibold gap-1">
                    <div className="flex items-center gap-1 truncate">
                      <MessageSquare className="w-3 h-3 shrink-0" />
                      <span className="truncate">Discussion</span>
                    </div>
                    {cusdisCommentCount !== null && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 font-mono text-[9px] font-bold shrink-0">
                        {cusdisCommentCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold font-mono flex items-center justify-between">
                    <span className="truncate">
                      {cusdisCommentCount !== null && cusdisCommentCount > 0
                        ? `${cusdisCommentCount} Comment${cusdisCommentCount > 1 ? 's' : ''}`
                        : 'Scholarly Dialogue'}
                    </span>
                    <span className="text-[10px] opacity-75 shrink-0 ml-1">&darr;</span>
                  </p>
                </a>
              </div>

            </div>

            {/* 2. More Working Notes (Diletakkan Tepat di Bawah Article Telemetry & Dossier) */}
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg space-y-3 sm:space-y-3.5 min-w-0 max-w-full ${
              isDark ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-white/10 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider truncate">
                    More Working Notes
                  </h4>
                </div>
                <a 
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSlug(null);
                    if (typeof window !== 'undefined') {
                      window.history.pushState({}, '', '/blog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-[10px] font-mono text-blue-500 hover:underline font-semibold shrink-0"
                >
                  All ({posts.length}) &rarr;
                </a>
              </div>

              <div className="space-y-2.5 min-w-0">
                {(posts || []).filter(p => p && p.slug !== currentPost.slug).slice(0, 3).map((p) => (
                  <a
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSlug(p.slug);
                      if (typeof window !== 'undefined') {
                        window.history.pushState({}, '', `/blog/${p.slug}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`block p-2.5 rounded-2xl border transition-all group min-w-0 ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:border-blue-400/40 hover:bg-white/10 text-white' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-900 hover:bg-blue-50/40 shadow-sm'
                    }`}
                  >
                    <div className="flex gap-2.5 sm:gap-3 items-center min-w-0">
                      {/* Cuplikan Gambar (Image Thumbnail Preview) */}
                      <div className="w-16 sm:w-20 h-14 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-800 relative">
                        {p.coverImage ? (
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 flex items-center justify-center text-blue-400">
                            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      </div>

                      {/* Content Column */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                          <span className="text-blue-500 font-semibold uppercase truncate">{p.category}</span>
                          <span className="text-slate-400 shrink-0">{p.date}</span>
                        </div>
                        <h5 className="font-bold leading-snug group-hover:text-blue-500 transition-colors line-clamp-2 text-xs">
                          {p.title}
                        </h5>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* 3. Table of Contents (ToC) - Melayang Sticky di Desktop (lg:sticky), Static di Mobile */}
            <div className={`lg:sticky lg:top-24 static z-20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 shadow-2xl space-y-3 sm:space-y-4 transition-all min-w-0 max-w-full ${
              isDark 
                ? 'bg-[#0e2038]/95 backdrop-blur-xl border-blue-400/25 text-white shadow-blue-950/40' 
                : 'bg-white/95 backdrop-blur-xl border-blue-200 text-slate-900 shadow-xl shadow-slate-200/60'
            }`}>
              <div className="flex items-center justify-between border-b pb-2.5 sm:pb-3 border-slate-200 dark:border-white/10 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Hash className="w-4 h-4 text-blue-500 shrink-0" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider truncate">
                    Table of Contents (ToC)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {postHeadings.length} Sections
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Click any section title to jump directly to the topic.
              </p>

              <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                {postHeadings.map((h, hIdx) => {
                  const isActive = activeHeadingId === h.id;
                  return (
                    <button
                      key={hIdx}
                      onClick={() => scrollToHeading(h.id)}
                      className={`w-full text-left py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs transition-all duration-200 flex items-start gap-2.5 ${
                        h.level === 3 ? 'pl-5 sm:pl-6 text-[11px]' : 'font-semibold'
                      } ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 translate-x-1'
                          : isDark
                            ? 'text-slate-300 hover:text-white hover:bg-white/5'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-colors ${
                        isActive ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-slate-400 dark:bg-slate-500'
                      }`} />
                      <span className="leading-snug line-clamp-2">{h.text}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

          </aside>

        </div>

        {/* Integrated Academic Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          currentUser={localUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onOpenSanity={onOpenSanity || (() => {})}
          theme={theme}
        />

      </div>
    );
  }

  // ==========================================
  // VIEW 2: BLOG COLLECTION (KUMPULAN ARTIKEL)
  // ==========================================
  return (
    <div className="py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 animate-fadeIn overflow-hidden w-full max-w-full min-w-0">
      
      {/* Breadcrumb Permalink & Total Count */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <nav aria-label="Breadcrumb" className={`inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono border max-w-full ${
          isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <a href="/" className="hover:text-blue-500 transition-colors">
            Home
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-blue-500 font-semibold">Blog</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 dark:text-slate-500 truncate max-w-[160px] sm:max-w-none">{pageContent.blogBreadcrumb || 'Academic Essays & Working Notes'}</span>
        </nav>

        <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Collection: <strong>{posts.length} Working Notes</strong>
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3 sm:space-y-4 min-w-0">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{pageContent.blogBadge || 'Academic Working Notes & Essays'}</span>
        </div>

        <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight break-words ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {pageContent.blogPageTitle ? (
            <span>{pageContent.blogPageTitle}</span>
          ) : (
            <>Academic <span className="font-bold text-blue-500">Working Notes &amp; Blog</span></>
          )}
        </h1>

        <p className={`text-sm sm:text-base max-w-3xl leading-relaxed break-words ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {pageContent.blogPageSubtitle || 'Critical essays, qualitative triangulation fieldnotes, UK doctoral proposal syntheses, and operations management paradigms. Click any article to open its complete post view with dynamic Table of Contents.'}
        </p>
      </div>

      {/* Search & Topic Filters */}
      <div className={`p-4 sm:p-6 rounded-2xl border space-y-3.5 sm:space-y-4 min-w-0 max-w-full ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
          <div className="relative w-full sm:w-80 md:w-96 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title, keywords, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 focus:border-blue-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
              }`}
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredPosts.length} of {posts.length} articles
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all border ${
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
      </div>

      {/* Collection Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 min-w-0 w-full">
        {filteredPosts.map((post) => {
          const words = calculateWordCount(post);
          const readTimeStr = formatReadingTime(post);

          return (
            <div
              key={post.slug}
              className={`p-4 sm:p-6 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 group min-w-0 w-full overflow-hidden ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-white/40' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-md hover:border-blue-300'
              }`}
            >
              <div className="space-y-3 sm:space-y-3.5 min-w-0">
                {/* Landscape Visual Card Thumbnail */}
                <LandscapeBlogVisual
                  post={post}
                  theme={theme}
                  variant="card"
                  onClick={() => {
                    setSelectedSlug(post.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* Category & Date */}
                <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isDark 
                      ? 'bg-blue-950/60 border-blue-400/30 text-blue-300' 
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {post.category}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <a
                  href={`/blog/${post.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSlug(post.slug);
                    if (typeof window !== 'undefined') {
                      window.history.pushState({}, '', `/blog/${post.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="block group-hover:text-blue-500 transition-colors"
                >
                  <h3 className="text-base sm:text-xl font-bold font-editorial-serif leading-snug break-words">
                    {post.title}
                  </h3>
                </a>

                {/* Excerpt */}
                <p className={`text-xs leading-relaxed line-clamp-3 break-words ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Meta & Click to Single Article */}
              <div className={`pt-3 sm:pt-4 mt-4 sm:mt-5 border-t flex flex-wrap items-center justify-between gap-2 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                {/* Metrics */}
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-blue-400">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{readTimeStr}</span>
                  </span>
                  <span>&bull;</span>
                  <span>{words} words</span>
                </div>

                <a
                  href={`/blog/${post.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSlug(post.slug);
                    if (typeof window !== 'undefined') {
                      window.history.pushState({}, '', `/blog/${post.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0"
                >
                  <span>Read Full Note</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* Integrated Academic Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={localUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenSanity={onOpenSanity || (() => {})}
        theme={theme}
      />

    </div>
  );
};
