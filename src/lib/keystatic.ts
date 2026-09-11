import fs from 'node:fs';
import path from 'node:path';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';
import type { 
  PortfolioDataState, 
  AuthorProfile, 
  ScholarStats, 
  ResearchArticle, 
  Book, 
  BlogPost, 
  GalleryItem, 
  MartialArtItem, 
  AboutPillar,
  BlogComment,
  EducationData,
  PhdStatusData,
  PageContentData,
  SomaticReflectionsData,
  InstagramFeedData
} from '../types';

// Global keystatic reader instance for SSR / SSG
let readerInstance: any = null;

function getReader() {
  if (process.env.NODE_ENV === 'development') {
    return createReader(process.cwd(), keystaticConfig);
  }
  if (!readerInstance) {
    readerInstance = createReader(process.cwd(), keystaticConfig);
  }
  return readerInstance;
}

/**
 * Calculate read time automatically based on standard average reading speed (200 words per minute)
 */
export function calculateReadTime(text: string): string {
  if (!text) return '3 min read';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Automatically formats ISO datetime string (e.g. 2025-02-18T10:00) into a readable date string
 */
export function formatPublicationDate(datetimeStr?: string, fallbackDate?: string): string {
  if (datetimeStr) {
    try {
      const d = new Date(datetimeStr);
      if (!isNaN(d.getTime())) {
        return new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(d);
      }
    } catch {
      // fallback
    }
  }
  return fallbackDate || 'February 18, 2025';
}

/**
 * Recursively extract raw string content from Markdoc AST node
 */
export function getNodeText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.type === 'text') {
    return typeof node.attributes?.content === 'string' ? node.attributes.content : '';
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(getNodeText).join('');
  }
  return '';
}

/**
 * Extract raw text from Markdoc node structure or string
 */
export function extractTextFromMarkdoc(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object') {
    if (content.node) {
      return getNodeText(content.node).trim();
    }
  }
  return '';
}

/**
 * Convert raw markdown string content into structured BlogPost content blocks
 */
export function markdownStringToBlocks(rawText: string): { 
  blocks: BlogPost['content']; 
  headings: BlogPost['headings'];
} {
  if (!rawText || !rawText.trim()) return { blocks: [], headings: [] };
  const rawParagraphs = rawText.split(/\n\s*\n/);
  const blocks: BlogPost['content'] = [];
  const headings: BlogPost['headings'] = [];

  for (let idx = 0; idx < rawParagraphs.length; idx++) {
    const p = rawParagraphs[idx];
    const trimmed = p.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h3-${idx}`;
      blocks.push({ type: 'h3', text, id });
      headings.push({ id, text, level: 3 });
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h2-${idx}`;
      blocks.push({ type: 'h2', text, id });
      headings.push({ id, text, level: 2 });
    } else if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> NOTE:')) {
      const text = trimmed.split('\n').map(l => l.replace(/^>\s*(\[!NOTE\]|NOTE:)?/i, '').trim()).join(' ').trim();
      blocks.push({ type: 'callout', text });
    } else if (trimmed.startsWith('> ')) {
      const text = trimmed.split('\n').map(l => l.replace(/^>\s*/, '').trim()).join(' ').trim();
      blocks.push({ type: 'quote', text });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').map(l => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
      blocks.push({ type: 'ul', items });
    } else {
      blocks.push({ type: 'p', text: trimmed });
    }
  }

  return { blocks, headings };
}

/**
 * Convert Markdoc AST document node directly into structured BlogPost content blocks
 */
export function markdocNodeToBlocks(docNode: any): {
  blocks: BlogPost['content'];
  headings: BlogPost['headings'];
} {
  const blocks: BlogPost['content'] = [];
  const headings: BlogPost['headings'] = [];
  if (!docNode || !Array.isArray(docNode.children)) return { blocks, headings };

  for (let idx = 0; idx < docNode.children.length; idx++) {
    const child = docNode.children[idx];
    const text = getNodeText(child).trim();
    if (!text && child.type !== 'image') continue;

    if (child.type === 'heading') {
      const level = child.attributes?.level || 2;
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h${level}-${idx}`;
      if (level === 3) {
        blocks.push({ type: 'h3', text, id });
        headings.push({ id, text, level: 3 });
      } else {
        blocks.push({ type: 'h2', text, id });
        headings.push({ id, text, level: 2 });
      }
    } else if (child.type === 'blockquote') {
      if (text.startsWith('[!NOTE]') || text.startsWith('NOTE:')) {
        const clean = text.replace(/^(\[!NOTE\]|NOTE:)\s*/i, '').trim();
        blocks.push({ type: 'callout', text: clean });
      } else {
        blocks.push({ type: 'quote', text });
      }
    } else if (child.type === 'list') {
      const items: string[] = [];
      if (Array.isArray(child.children)) {
        for (const itemNode of child.children) {
          const itemText = getNodeText(itemNode).trim();
          if (itemText) items.push(itemText);
        }
      }
      blocks.push({ type: 'ul', items });
    } else {
      if (text.startsWith('> [!NOTE]') || text.startsWith('> NOTE:')) {
        const clean = text.replace(/^>\s*(\[!NOTE\]|NOTE:)?\s*/i, '').trim();
        blocks.push({ type: 'callout', text: clean });
      } else if (text.startsWith('> ')) {
        const clean = text.replace(/^>\s*/, '').trim();
        blocks.push({ type: 'quote', text: clean });
      } else {
        blocks.push({ type: 'p', text });
      }
    }
  }

  return { blocks, headings };
}

/**
 * Read raw .mdoc file directly from disk
 */
export function readRawMdocFromDisk(slug: string): string | null {
  try {
    const mdocPath = path.join(process.cwd(), 'src', 'content', 'blogPosts', slug, 'content.mdoc');
    if (fs.existsSync(mdocPath)) {
      return fs.readFileSync(mdocPath, 'utf-8');
    }
  } catch (e) {
    // silently fallback
  }
  return null;
}

/**
 * Convert any Markdoc or markdown content representation to structured blocks and extract headings
 */
export function markdownToBlocks(content: any, slug?: string): { 
  blocks: BlogPost['content']; 
  headings: BlogPost['headings'];
} {
  if (!content && !slug) return { blocks: [], headings: [] };

  // 1. If Markdoc AST node is provided
  if (typeof content === 'object' && content?.node) {
    const astRes = markdocNodeToBlocks(content.node);
    if (astRes.blocks.length > 0) {
      return astRes;
    }
  }

  // 2. If raw string is provided
  if (typeof content === 'string' && content.trim()) {
    const strRes = markdownStringToBlocks(content);
    if (strRes.blocks.length > 0) {
      return strRes;
    }
  }

  // 3. Fallback to raw content.mdoc from disk
  if (slug) {
    const diskContent = readRawMdocFromDisk(slug);
    if (diskContent && diskContent.trim()) {
      const diskRes = markdownStringToBlocks(diskContent);
      if (diskRes.blocks.length > 0) {
        return diskRes;
      }
    }
  }

  // 4. Fallback to INITIAL_PORTFOLIO_DATA
  if (slug) {
    const initialPost = INITIAL_PORTFOLIO_DATA.blogPosts.find(p => p.slug === slug);
    if (initialPost && initialPost.content && initialPost.content.length > 0) {
      return {
        blocks: initialPost.content,
        headings: initialPost.headings || [],
      };
    }
  }

  return { blocks: [], headings: [] };
}

/**
 * Fetch complete portfolio data from Keystatic with fallback to INITIAL_PORTFOLIO_DATA
 */
export async function getPortfolioData(): Promise<PortfolioDataState> {
  try {
    const reader = getReader();

    // Read singletons in parallel
    const [
      profileEntry,
      scholarStatsEntry,
      educationEntry,
      phdStatusEntry,
      pageContentEntry,
      somaticReflectionsEntry,
      instagramFeedEntry,
    ] = await Promise.all([
      reader.singletons.profile.read(),
      reader.singletons.scholarStats.read(),
      reader.singletons.education.read(),
      reader.singletons.phdStatus.read(),
      reader.singletons.pageContent.read(),
      reader.singletons.somaticReflections.read(),
      reader.singletons.instagramFeed.read(),
    ]);

    // Read collections in parallel
    const [
      articleEntries,
      bookEntries,
      blogPostEntries,
      pillarEntries,
      galleryEntries,
      martialArtEntries,
      commentEntries,
    ] = await Promise.all([
      reader.collections.researchArticles.all(),
      reader.collections.books.all(),
      reader.collections.blogPosts.all(),
      reader.collections.aboutPillars.all(),
      reader.collections.galleryItems.all(),
      reader.collections.martialArts.all(),
      reader.collections.comments.all(),
    ]);

    const profile: AuthorProfile = profileEntry 
      ? ({
          ...INITIAL_PORTFOLIO_DATA.profile,
          ...profileEntry,
          avatarUrl: (profileEntry as any).avatarImage || (profileEntry as any).avatarUrl || INITIAL_PORTFOLIO_DATA.profile.avatarUrl,
          brandImage: (profileEntry as any).brandImage || null,
          brandImageUrl: (profileEntry as any).brandImageUrl || '',
          cvPdfUrl: (profileEntry as any).cvPdfFile || (profileEntry as any).cvPdfUrl || (profileEntry as any).cvUrl || INITIAL_PORTFOLIO_DATA.profile.cvPdfUrl || '',
          authorNoteHeading: (profileEntry as any).authorNoteHeading || 'Peer-Triangulated Note',
          authorNoteText: (profileEntry as any).authorNoteText || 'Methodological empirical reflections for doctoral supervision in Operations Management.',
          aboutPhotoBadge: (profileEntry as any).aboutPhotoBadge || (pageContentEntry as any)?.aboutPhotoBadge || 'UK PhD Applicant',
          campusAddress: (profileEntry as any).campusAddress ?? INITIAL_PORTFOLIO_DATA.profile.campusAddress,
          campusMapsUrl: (profileEntry as any).campusMapsUrl ?? INITIAL_PORTFOLIO_DATA.profile.campusMapsUrl,
          domicileAddress: (profileEntry as any).domicileAddress ?? INITIAL_PORTFOLIO_DATA.profile.domicileAddress,
          domicileMapsUrl: (profileEntry as any).domicileMapsUrl ?? INITIAL_PORTFOLIO_DATA.profile.domicileMapsUrl,
        } as AuthorProfile) 
      : INITIAL_PORTFOLIO_DATA.profile;

    const rawVosUrl = (scholarStatsEntry as any)?.vosViewerUrl;

    const scholarStats: ScholarStats = scholarStatsEntry
      ? ({
          ...INITIAL_PORTFOLIO_DATA.scholarStats,
          ...scholarStatsEntry,
          totalCitations: (scholarStatsEntry as any).totalCitations !== undefined ? Number((scholarStatsEntry as any).totalCitations) : INITIAL_PORTFOLIO_DATA.scholarStats.totalCitations,
          hIndex: (scholarStatsEntry as any).hIndex !== undefined ? Number((scholarStatsEntry as any).hIndex) : INITIAL_PORTFOLIO_DATA.scholarStats.hIndex,
          i10Index: (scholarStatsEntry as any).i10Index !== undefined ? Number((scholarStatsEntry as any).i10Index) : INITIAL_PORTFOLIO_DATA.scholarStats.i10Index,
          vosViewerUrl: (rawVosUrl && rawVosUrl.trim()) || INITIAL_PORTFOLIO_DATA.scholarStats.vosViewerUrl,
          yearlyPublications: Array.isArray(scholarStatsEntry.yearlyPublications)
            ? scholarStatsEntry.yearlyPublications.map((y: any) => ({ ...y }))
            : INITIAL_PORTFOLIO_DATA.scholarStats.yearlyPublications,
          yearlyCitations: Array.isArray(scholarStatsEntry.yearlyCitations) 
            ? scholarStatsEntry.yearlyCitations.map((y: any) => ({ ...y }))
            : INITIAL_PORTFOLIO_DATA.scholarStats.yearlyCitations,
        } as ScholarStats)
      : INITIAL_PORTFOLIO_DATA.scholarStats;

    const articlesDir = path.join(process.cwd(), 'src/content/researchArticles');
    const researchArticles: ResearchArticle[] = articleEntries.length > 0
      ? articleEntries
          .map((e: any) => {
            const entry = e.entry;
            const slug = entry.id || e.slug;
            let fileMtime = 0;
            try {
              const articleFilePath = path.join(articlesDir, `${slug}.json`);
              if (fs.existsSync(articleFilePath)) {
                fileMtime = fs.statSync(articleFilePath).mtimeMs;
              }
            } catch (err) {
              fileMtime = 0;
            }
            return {
              ...entry,
              id: slug,
              isFeatured: Boolean(entry.isFeatured),
              featuredOrder: entry.featuredOrder ? parseInt(String(entry.featuredOrder), 10) || 1 : 99,
              updatedAt: entry.updatedAt ? new Date(entry.updatedAt).getTime() : fileMtime,
            } as ResearchArticle;
          })
          .sort((a: any, b: any) => (b.year - a.year) || (b.citations - a.citations))
      : INITIAL_PORTFOLIO_DATA.researchArticles;

    const booksDir = path.join(process.cwd(), 'src/content/books');
    const books: Book[] = bookEntries.length > 0
      ? bookEntries
          .map((e: any) => {
            const entry = e.entry;
            const slug = entry.id || e.slug;
            const coverImage = entry.coverImage || entry.coverUrl || '';
            const coverUrl = entry.coverUrl || entry.coverImage || '';
            let fileMtime = 0;
            try {
              const bookFilePath = path.join(booksDir, `${slug}.json`);
              if (fs.existsSync(bookFilePath)) {
                fileMtime = fs.statSync(bookFilePath).mtimeMs;
              }
            } catch (err) {
              fileMtime = 0;
            }
            return {
              ...entry,
              id: slug,
              coverImage,
              coverUrl,
              isFeatured: Boolean(entry.isFeatured),
              featuredOrder: entry.featuredOrder ? parseInt(String(entry.featuredOrder), 10) || 1 : 99,
              updatedAt: entry.updatedAt ? new Date(entry.updatedAt).getTime() : fileMtime,
            } as Book;
          })
          .sort((a: any, b: any) => b.year - a.year)
      : INITIAL_PORTFOLIO_DATA.books;

    const blogPosts: BlogPost[] = blogPostEntries.length > 0
      ? await Promise.all(blogPostEntries.map(async (e: any) => {
          const entry = e.entry;
          const slug = entry.slug || e.slug;
          const rawContent = typeof entry.content === 'function' ? await entry.content() : entry.content;
          const { blocks, headings } = markdownToBlocks(rawContent, slug);

          const fullText = typeof rawContent === 'string' 
            ? rawContent 
            : extractTextFromMarkdoc(rawContent) || blocks.map(b => b.text || (b.items ? b.items.join(' ') : '')).join(' ');

          const calculatedReadTime = calculateReadTime(fullText);
          const displayDate = formatPublicationDate(entry.datetime, entry.date);

          return {
            slug,
            title: entry.title,
            date: displayDate,
            datetime: entry.datetime,
            readTime: calculatedReadTime,
            category: entry.category,
            excerpt: entry.excerpt,
            coverImage: entry.coverImage,
            imageCaption: entry.imageCaption,
            authors: Array.isArray(entry.authors)
              ? entry.authors.map((a: any) => ({
                  name: a.name || '',
                  role: a.role || '',
                  affiliation: a.affiliation || '',
                  avatarImage: a.avatarImage || null,
                  avatarUrl: a.avatarUrl || '',
                }))
              : [],
            noteHeading: entry.noteHeading || 'Peer-Triangulated Note',
            noteText: entry.noteText || 'Methodological empirical reflections for doctoral supervision in Operations Management.',
            documentFile: entry.documentFile || null,
            mediaFile: entry.mediaFile || null,
            tags: Array.isArray(entry.tags) ? [...entry.tags] : [],
            headings,
            content: blocks,
          } as BlogPost;
        }))
      : INITIAL_PORTFOLIO_DATA.blogPosts;

    const aboutPillars: AboutPillar[] = pillarEntries.length > 0
      ? pillarEntries
          .map((e: any) => e.entry)
          .sort((a: any, b: any) => ((a as any).order || 0) - ((b as any).order || 0))
          .map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            quote: e.quote,
            icon: e.icon,
            tags: Array.isArray(e.tags) ? [...e.tags] : [],
          }))
      : INITIAL_PORTFOLIO_DATA.aboutPillars;

    const galleryItems: GalleryItem[] = galleryEntries.length > 0
      ? galleryEntries
          .map((e: any) => e.entry)
          .sort((a: any, b: any) => ((a as any).order || 0) - ((b as any).order || 0))
          .map((e: any) => ({
            id: e.id,
            title: e.title,
            category: e.category as any,
            location: e.location,
            date: e.date,
            description: e.description,
            imageUrl: e.imageUrl,
          }))
      : INITIAL_PORTFOLIO_DATA.galleryItems;

    const martialArts: MartialArtItem[] = martialArtEntries.length > 0
      ? martialArtEntries
          .map((e: any) => e.entry)
          .sort((a: any, b: any) => ((a as any).order || 0) - ((b as any).order || 0))
          .map((e: any) => ({
            name: e.name,
            type: e.type,
            subtitle: e.subtitle,
            keyPillars: Array.isArray(e.keyPillars) ? [...e.keyPillars] : [],
            description: e.description,
            academicParallel: e.academicParallel,
            badge: e.badge,
            iconName: e.iconName,
          }))
      : INITIAL_PORTFOLIO_DATA.martialArts;

    const comments: BlogComment[] = commentEntries.length > 0
      ? commentEntries.map((e: any) => ({
          id: e.entry.id,
          postSlug: e.entry.postSlug,
          userName: e.entry.userName,
          userEmail: e.entry.userEmail,
          userRole: (e.entry.userRole as any) || 'guest',
          institution: e.entry.institution,
          content: e.entry.content,
          createdAt: e.entry.createdAt,
          likes: e.entry.likes || 0,
          reply: e.entry.reply?.text ? {
            text: e.entry.reply.text,
            authorName: e.entry.reply.authorName || 'Dr. Gautama Sastra Waskita',
            repliedAt: e.entry.reply.repliedAt || '',
          } : undefined,
        }))
      : (INITIAL_PORTFOLIO_DATA.comments || []);

    const education: EducationData = educationEntry
      ? ({
          ...educationEntry,
          timeline: Array.isArray(educationEntry.timeline)
            ? educationEntry.timeline.map((t: any) => ({ ...t }))
            : INITIAL_PORTFOLIO_DATA.education?.timeline || [],
        } as EducationData)
      : INITIAL_PORTFOLIO_DATA.education!;

    const rawSupervisoryBadge = (phdStatusEntry as any)?.supervisoryBadge || (profileEntry as any)?.supervisoryBadge || 'Open for Supervision';
    const rawProposal = (phdStatusEntry as any)?.phdTargetProposal || (profileEntry as any)?.phdTargetProposal || INITIAL_PORTFOLIO_DATA.profile.phdTargetProposal;
    const rawDescription = (phdStatusEntry as any)?.phdTargetDescription || (profileEntry as any)?.phdTargetDescription || INITIAL_PORTFOLIO_DATA.profile.phdTargetDescription;
    const rawRightHeading = (phdStatusEntry as any)?.rightSupervisoryHeading || 'Doctoral Research Proposal Focus';
    const rawRightDescription = (phdStatusEntry as any)?.rightSupervisoryDescription || 'Seeking supervisory alignment in Sustainable Value Chains, Service Operations, and Dynamic Capability Modeling for doctoral admission at UK business schools.';
    const rawBannerProposalHeading = (phdStatusEntry as any)?.bannerProposalHeading || (pageContentEntry as any)?.aboutProposalHeading || 'Doctoral Research Proposal Focus';
    const rawBannerProposalTitle = (phdStatusEntry as any)?.bannerProposalTitle || (pageContentEntry as any)?.aboutProposalTitle || INITIAL_PORTFOLIO_DATA.phdStatus.phdTargetProposal;
    const rawBannerProposalButtonText = (phdStatusEntry as any)?.bannerProposalButtonText || (pageContentEntry as any)?.aboutProposalCta || 'View Full Proposal & CV →';
    const rawBannerProposalButtonUrl = (phdStatusEntry as any)?.bannerProposalButtonUrl || (pageContentEntry as any)?.aboutProposalUrl || '/about';

    const phdStatus: PhdStatusData = phdStatusEntry
      ? ({
          ...INITIAL_PORTFOLIO_DATA.phdStatus,
          ...phdStatusEntry,
          supervisoryBadge: rawSupervisoryBadge,
          phdTargetProposal: rawProposal,
          phdTargetDescription: rawDescription,
          rightSupervisoryHeading: rawRightHeading,
          rightSupervisoryDescription: rawRightDescription,
          bannerProposalHeading: rawBannerProposalHeading,
          bannerProposalTitle: rawBannerProposalTitle,
          bannerProposalButtonText: rawBannerProposalButtonText,
          bannerProposalButtonUrl: rawBannerProposalButtonUrl,
        } as PhdStatusData)
      : ({
          ...INITIAL_PORTFOLIO_DATA.phdStatus,
          supervisoryBadge: rawSupervisoryBadge,
          phdTargetProposal: rawProposal,
          phdTargetDescription: rawDescription,
          rightSupervisoryHeading: rawRightHeading,
          rightSupervisoryDescription: rawRightDescription,
          bannerProposalHeading: rawBannerProposalHeading,
          bannerProposalTitle: rawBannerProposalTitle,
          bannerProposalButtonText: rawBannerProposalButtonText,
          bannerProposalButtonUrl: rawBannerProposalButtonUrl,
        } as PhdStatusData);

    profile.supervisoryBadge = rawSupervisoryBadge;
    profile.phdTargetProposal = rawProposal;
    profile.phdTargetDescription = rawDescription;

    const pageContent: PageContentData = pageContentEntry
      ? ({
          ...INITIAL_PORTFOLIO_DATA.pageContent,
          ...pageContentEntry,
        } as PageContentData)
      : INITIAL_PORTFOLIO_DATA.pageContent!;

    const somaticReflections: SomaticReflectionsData = somaticReflectionsEntry
      ? ({
          ...somaticReflectionsEntry,
          reflections: Array.isArray(somaticReflectionsEntry.reflections)
            ? somaticReflectionsEntry.reflections.map((r: any) => ({ ...r }))
            : INITIAL_PORTFOLIO_DATA.somaticReflections?.reflections || [],
        } as SomaticReflectionsData)
      : INITIAL_PORTFOLIO_DATA.somaticReflections!;

    const rawIgAvatar = (instagramFeedEntry as any)?.avatarImage 
      || ((instagramFeedEntry as any)?.avatarUrl && (instagramFeedEntry as any).avatarUrl.trim() !== '' && !(instagramFeedEntry as any).avatarUrl.includes('photo-1534528741775') ? (instagramFeedEntry as any).avatarUrl : '')
      || profile.avatarImage 
      || profile.avatarUrl 
      || '/static/images/profile/avatarImage.jpeg';

    const instagramFeed: InstagramFeedData = instagramFeedEntry
      ? ({
          ...INITIAL_PORTFOLIO_DATA.instagramFeed,
          ...instagramFeedEntry,
          avatarUrl: rawIgAvatar,
          posts: Array.isArray(instagramFeedEntry.posts)
            ? instagramFeedEntry.posts.map((p: any) => ({ ...p }))
            : INITIAL_PORTFOLIO_DATA.instagramFeed?.posts || [],
        } as InstagramFeedData)
      : ({
          ...INITIAL_PORTFOLIO_DATA.instagramFeed,
          avatarUrl: profile.avatarImage || profile.avatarUrl || '/static/images/profile/avatarImage.jpeg',
        } as InstagramFeedData);

    return {
      profile,
      scholarStats,
      aboutPillars,
      articles: researchArticles,
      researchArticles,
      books,
      blogPosts,
      galleryItems,
      martialArts,
      astroFiles: INITIAL_PORTFOLIO_DATA.astroFiles || [],
      comments,
      education,
      phdStatus,
      pageContent,
      somaticReflections,
      instagramFeed,
    };
  } catch (error) {
    console.warn('⚠️ Error reading data from Keystatic. Falling back to local dataset:', error);
    return INITIAL_PORTFOLIO_DATA;
  }
}

/**
 * Fetch a single blog post by slug from Keystatic with fallback
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const reader = getReader();
    const postEntry = await reader.collections.blogPosts.read(slug);
    if (postEntry) {
      const rawContent = typeof postEntry.content === 'function' ? await postEntry.content() : postEntry.content;
      const { blocks, headings } = markdownToBlocks(rawContent, slug);

      const fullText = typeof rawContent === 'string' 
        ? rawContent 
        : extractTextFromMarkdoc(rawContent) || blocks.map(b => b.text || (b.items ? b.items.join(' ') : '')).join(' ');

      const calculatedReadTime = calculateReadTime(fullText);
      const displayDate = formatPublicationDate(postEntry.datetime, (postEntry as any).date);

      return {
        slug: postEntry.slug || slug,
        title: postEntry.title,
        date: displayDate,
        datetime: postEntry.datetime,
        readTime: calculatedReadTime,
        category: postEntry.category,
        excerpt: postEntry.excerpt,
        coverImage: postEntry.coverImage,
        imageCaption: postEntry.imageCaption,
        illustrationType: (postEntry.illustrationType as any) || 'default',
        authors: Array.isArray(postEntry.authors)
          ? postEntry.authors.map((a: any) => ({
              name: a.name || '',
              role: a.role || '',
              affiliation: a.affiliation || '',
              avatarImage: a.avatarImage || null,
              avatarUrl: a.avatarUrl || '',
            }))
          : [],
        noteHeading: (postEntry as any).noteHeading || 'Peer-Triangulated Note',
        noteText: (postEntry as any).noteText || 'Methodological empirical reflections for doctoral supervision in Operations Management.',
        documentFile: postEntry.documentFile || null,
        mediaFile: postEntry.mediaFile || null,
        tags: Array.isArray(postEntry.tags) ? [...postEntry.tags] : [],
        headings,
        content: blocks,
      } as BlogPost;
    }
  } catch (error) {
    console.warn(`⚠️ Error reading post "${slug}" from Keystatic:`, error);
  }

  return (INITIAL_PORTFOLIO_DATA.blogPosts || []).find(p => p.slug === slug);
}
