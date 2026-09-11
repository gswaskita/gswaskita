export type ThemeMode = 'dark' | 'light';

export type PageId = 'home' | 'about' | 'research' | 'books' | 'blog' | 'gallery' | 'beyond';

export type UserRole = 'guest' | 'member' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  avatarUrl?: string;
  title?: string;
}

export interface BlogComment {
  id: string;
  postSlug: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  institution?: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
  reply?: {
    text: string;
    authorName: string;
    repliedAt: string;
  };
}

export interface AuthorProfile {
  siteTitle?: string;
  name: string;
  lastName: string;
  prefix: string;
  suffix: string;
  role: string;
  faculty: string;
  tagline: string;
  bioQuote: string;
  authorNoteHeading?: string;
  authorNoteText?: string;
  aboutPhotoBadge?: string;
  avatarUrl: string;
  avatarImage?: string | null;
  brandImage?: string | null;
  brandImageUrl?: string;
  useAvatarAsFavicon?: boolean;
  email: string;
  phone?: string;
  institution: string;
  location: string;
  phdTargetProposal: string;
  phdTargetDescription: string;
  supervisoryBadge?: string;
  scholarId?: string;
  scholarUrl?: string;
  orcidId?: string;
  orcidUrl?: string;
  sintaId?: string;
  sintaUrl?: string;
  scopusId?: string;
  scopusUrl?: string;
  researchGateUrl?: string;
  cvPdfFile?: string | null;
  cvPdfUrl?: string;
  cvUrl?: string;
  campusAddress?: string;
  campusMapsUrl?: string;
  domicileAddress?: string;
  domicileMapsUrl?: string;
}

export interface ScholarStats {
  // Editable Section Header Texts (SINTA Garuda section)
  sectionBadge?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;

  // Editable Curved Chart Texts
  chartLatestBadge?: string;
  chartIndexBadge?: string;
  chartTitle?: string;
  chartSubtitle?: string;

  // SINTA Garuda & National Index Metrics
  sintaGarudaUrl?: string;
  garudaPublicationsCount?: number;
  garudaCitationsCount?: number;
  yearlyPublications?: {
    year: number;
    count: number;
  }[];

  // Google Scholar & VOSviewer
  totalCitations?: number;
  hIndex?: number;
  i10Index?: number;
  scholarId?: string;
  scholarUrl?: string;
  orcidId?: string;
  orcidUrl?: string;
  sintaId?: string;
  sintaUrl?: string;
  vosViewerUrl?: string;
  vosViewerTitle?: string;
  vosViewerDescription?: string;
  yearlyCitations?: {
    year: number;
    count: number;
    milestone?: string;
    growthPercent?: number;
    cumulative?: number;
  }[];
}

export interface ResearchArticle {
  id: string;
  isFeatured?: boolean;
  featuredOrder?: number | string;
  updatedAt?: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  doi?: string;
  url: string;
  category: 'Service Quality' | 'SME Digitalization' | 'Hospitality Operations' | 'Consumer Behavior' | 'Operations Management' | string;
  abstract: string;
  status: 'Published' | 'Under Review' | 'In Press';
  keywords?: string[];
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  year: number;
  publisher: string;
  isbn?: string;
  coverGradient?: string;
  coverImage?: string;
  coverUrl?: string;
  blurb: string;
  status: 'Published' | 'Upcoming';
  ctaText: string;
  ctaUrl: string;
  topics: string[];
  pages?: number;
  edition?: string;
  dimensions?: string;
  marketplaceLinks?: {
    name: string;
    url: string;
    icon?: string;
  }[];
  isFeatured?: boolean;
  featuredOrder?: number;
  updatedAt?: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  date?: string;
  datetime?: string;
  readTime?: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  imageCaption?: string;
  illustrationType?: 'supply-chain' | 'operations' | 'qualitative' | 'hospitality' | 'analytics' | 'default';
  tags?: string[];
  author?: {
    name: string;
    role: string;
    institution: string;
    avatarUrl?: string;
    bio?: string;
  };
  authors?: Array<{
    name: string;
    role?: string;
    avatar?: string;
    avatarImage?: string | null;
    avatarUrl?: string;
    affiliation?: string;
  }>;
  noteHeading?: string;
  noteText?: string;
  documentFile?: string | null;
  mediaFile?: string | null;
  headings: {
    id: string;
    text: string;
    level: 2 | 3;
  }[];
  content: {
    type: 'p' | 'h2' | 'h3' | 'callout' | 'quote' | 'ul';
    text?: string;
    id?: string;
    items?: string[];
  }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Conferences' | 'Field Research' | 'Teaching' | 'Community Service';
  location: string;
  date: string;
  description: string;
  imageUrl: string;
}

export interface MartialArtItem {
  name: string;
  type: string;
  subtitle: string;
  keyPillars: string[];
  description: string;
  academicParallel: string;
  badge: string;
  iconName: string;
}

export interface AstroCodeFile {
  filename: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export interface AboutPillar {
  id: string;
  title: string;
  description: string;
  quote: string;
  icon: string;
  tags: string[];
}

export interface EducationTimelineItem {
  degree: string;
  institution: string;
  period: string;
  focus: string;
  status: string;
}

export interface EducationData {
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  timeline: EducationTimelineItem[];
}

export interface PhdStatusData {
  heroBadge: string;
  // Kotak Kiri
  supervisoryTargetHeading: string;
  supervisoryBadge?: string;
  phdTargetProposal?: string;
  phdTargetDescription?: string;
  // Kotak Kanan (Berbeda dengan Kotak Kiri)
  rightSupervisoryHeading?: string;
  rightSupervisoryDescription?: string;
  // Banner Full Proposal & CV di Homepage
  bannerProposalHeading?: string;
  bannerProposalTitle?: string;
  bannerProposalButtonText?: string;
  bannerProposalButtonUrl?: string;
  proposalFocusTitle?: string;
  verifiedTriangulationHeading: string;
  footerStatusTitle: string;
  footerFocus: string;
  footerDescription: string;
  verificationText: string;
  copyrightText: string;
}

export interface PageContentData {
  // About Section & Page
  aboutSectionBadge: string;
  aboutSectionTitle: string;
  aboutSectionSubtitle: string;
  aboutSectionCta: string;
  aboutProposalHeading?: string;
  aboutProposalTitle?: string;
  aboutProposalCta?: string;
  aboutProposalUrl?: string;
  aboutPageBadge: string;
  aboutPageTitle: string;
  aboutPageBreadcrumb: string;
  aboutPillarsHeading: string;
  aboutPillarsSubtitle: string;
  aboutPhotoBadge: string;
  aboutAddressSectionBadge?: string;
  aboutAddressSectionTitle?: string;
  aboutAddressSectionSubtitle?: string;
  aboutCampusCardBadge?: string;
  aboutCampusAddressLabel?: string;
  aboutCampusMapsButtonText?: string;
  aboutDomicileCardBadge?: string;
  aboutDomicileCardTitle?: string;
  aboutDomicileAddressLabel?: string;
  aboutDomicileMapsButtonText?: string;
  aboutProposalCardBadge?: string;

  // Research Section & Page
  researchBadge: string;
  researchTitle: string;
  researchSubtitle: string;
  researchBreadcrumb: string;

  // Books Section & Page
  booksBadge: string;
  booksTitle: string;
  booksSubtitle: string;
  booksBreadcrumb: string;

  // Blog Section & Page
  blogBadge: string;
  blogTitle: string;
  blogPageTitle: string;
  blogSubtitle: string;
  blogPageSubtitle: string;
  blogBreadcrumb: string;
  blogTelemetryHeading?: string;
  blogArticleNoteHeading?: string;
  blogArticleNoteText?: string;

  // Gallery Section & Page
  galleryBadge: string;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryBreadcrumb: string;
  galleryArchiveCountLabel?: string;
  galleryTabAll?: string;
  galleryTabInstagram?: string;
  galleryTabAcademic?: string;
  galleryDividerLabel?: string;
  galleryArchiveHeading?: string;
  galleryArchiveSubtitle?: string;

  // Beyond Section & Page
  beyondBadge: string;
  beyondTitle: string;
  beyondPageTitle: string;
  beyondSubtitle: string;
  beyondPageSubtitle: string;
  beyondCta: string;
  beyondBreadcrumb: string;
  beyondTaglineRight: string;

  // Footer Navigation
  footerSubpagesHeading: string;
  footerNavAbout: string;
  footerNavResearch: string;
  footerNavBooks: string;
  footerNavBlog: string;
  footerNavGallery: string;
  footerNavBeyond: string;
}

export interface SomaticReflectionItem {
  title: string;
  quote: string;
  author: string;
}

export interface SomaticReflectionsData {
  sectionTitle: string;
  sectionSubtitle: string;
  reflections: SomaticReflectionItem[];
}

export interface InstagramPost {
  id: string;
  caption: string;
  imageUrl: string;
  postUrl: string;
  date: string;
  likes: number;
  comments: number;
  category?: string;
  tags?: string[];
}

export interface InstagramFeedData {
  username: string;
  profileUrl: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  avatarImage?: string | null;
  postsCount: string;
  followersCount: string;
  followingCount: string;
  statusBadge?: string;
  sectionBadge?: string;
  sectionTitle: string;
  sectionSubtitle: string;
  followButtonText?: string;
  dmButtonText?: string;
  viewProfileText?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerCtaText?: string;
  posts: InstagramPost[];
}

export interface PortfolioDataState {
  profile: AuthorProfile;
  scholarStats: ScholarStats;
  researchArticles: ResearchArticle[];
  articles?: ResearchArticle[];
  books: Book[];
  blogPosts: BlogPost[];
  galleryItems: GalleryItem[];
  martialArts: MartialArtItem[];
  aboutPillars: AboutPillar[];
  astroFiles: AstroCodeFile[];
  comments?: BlogComment[];
  education?: EducationData;
  phdStatus?: PhdStatusData;
  pageContent?: PageContentData;
  somaticReflections?: SomaticReflectionsData;
  instagramFeed?: InstagramFeedData;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: 'visit' | 'create' | 'update' | 'delete' | 'like' | 'share' | 'comment' | 'download' | 'upload' | 'auth_attempt';
  title: string;
  description: string;
  target?: string;
  user?: string;
  ip?: string;
  device?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  authProvider?: 'github' | 'google' | 'local';
}

export interface MediaAssetItem {
  id: string;
  filename: string;
  type: 'image' | 'video' | 'doc' | 'audio';
  path: string;
  publicUrl: string;
  sizeBytes?: number;
  uploadedAt: string;
  uploader: string;
  aspectRatio?: string;
}

export interface CommentSetting {
  globalEnabled: boolean;
  disabledPosts: string[];
}

export interface DashboardAnalytics {
  activeUsersCount: number;
  reportsCount: number;
  postsCount: number;
  commentsCount: number;
  pagesCount: number;
  categoriesCount: number;
  subCategoriesCount: number;
  filesCount: number;
  mediaCount: number;
  videoStreamPlays: number;
}
