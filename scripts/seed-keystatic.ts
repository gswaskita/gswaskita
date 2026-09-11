import fs from 'fs';
import path from 'path';
import { INITIAL_PORTFOLIO_DATA } from '../src/data/portfolioData';

const contentDir = path.resolve(process.cwd(), 'src/content');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath: string, data: any) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function blocksToMarkdown(content: any): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((b: any) => {
      if (b.type === 'h2') return `## ${b.text || ''}`;
      if (b.type === 'h3') return `### ${b.text || ''}`;
      if (b.type === 'callout') return `> [!NOTE]\n> ${b.text || ''}`;
      if (b.type === 'quote') return `> ${b.text || ''}`;
      if (b.type === 'ul') return (b.items || []).map((i: string) => `- ${i}`).join('\n');
      return b.text || '';
    })
    .join('\n\n');
}

async function seed() {
  console.log('🌱 Starting Keystatic CMS Content Seeding...');
  ensureDir(contentDir);

  // 1. Profile Singleton
  const profilePath = path.join(contentDir, 'profile.json');
  writeJson(profilePath, INITIAL_PORTFOLIO_DATA.profile);
  console.log('✅ Seeded Author Profile singleton');

  // 2. ScholarStats Singleton
  const scholarStatsPath = path.join(contentDir, 'scholarStats.json');
  writeJson(scholarStatsPath, INITIAL_PORTFOLIO_DATA.scholarStats);
  console.log('✅ Seeded Google Scholar stats singleton');

  // 2a. Education Timeline Singleton
  if (INITIAL_PORTFOLIO_DATA.education) {
    const educationPath = path.join(contentDir, 'education.json');
    writeJson(educationPath, INITIAL_PORTFOLIO_DATA.education);
    console.log('✅ Seeded Education timeline singleton');
  }

  // 2b. PhD Status Singleton
  if (INITIAL_PORTFOLIO_DATA.phdStatus) {
    const phdStatusPath = path.join(contentDir, 'phdStatus.json');
    writeJson(phdStatusPath, INITIAL_PORTFOLIO_DATA.phdStatus);
    console.log('✅ Seeded PhD Status singleton');
  }

  // 2c. Page Content Singleton
  if (INITIAL_PORTFOLIO_DATA.pageContent) {
    const pageContentPath = path.join(contentDir, 'pageContent.json');
    writeJson(pageContentPath, INITIAL_PORTFOLIO_DATA.pageContent);
    console.log('✅ Seeded Page Content singleton');
  }

  // 2d. Somatic Reflections Singleton
  if (INITIAL_PORTFOLIO_DATA.somaticReflections) {
    const somaticPath = path.join(contentDir, 'somaticReflections.json');
    writeJson(somaticPath, INITIAL_PORTFOLIO_DATA.somaticReflections);
    console.log('✅ Seeded Somatic Reflections singleton');
  }

  // 2e. Instagram Feed Singleton
  if (INITIAL_PORTFOLIO_DATA.instagramFeed) {
    const igPath = path.join(contentDir, 'instagramFeed.json');
    writeJson(igPath, INITIAL_PORTFOLIO_DATA.instagramFeed);
    console.log('✅ Seeded Instagram Feed singleton');
  }

  // 3. Research Articles Collection
  const articles = INITIAL_PORTFOLIO_DATA.researchArticles || INITIAL_PORTFOLIO_DATA.articles || [];
  for (const article of articles) {
    const articlePath = path.join(contentDir, 'researchArticles', `${article.id}.json`);
    writeJson(articlePath, article);
  }
  console.log(`✅ Seeded ${articles.length} research articles`);

  // 4. Books Collection
  const books = INITIAL_PORTFOLIO_DATA.books || [];
  for (const book of books) {
    const bookPath = path.join(contentDir, 'books', `${book.id}.json`);
    writeJson(bookPath, book);
  }
  console.log(`✅ Seeded ${books.length} books`);

  // 5. Blog Posts Collection
  const blogPosts = INITIAL_PORTFOLIO_DATA.blogPosts || [];
  for (const post of blogPosts) {
    const postPath = path.join(contentDir, 'blogPosts', `${post.slug}.json`);
    const markdownContent = blocksToMarkdown(post.content);
    const { headings, content, ...rest } = post;
    writeJson(postPath, {
      ...rest,
      content: markdownContent,
    });
  }
  console.log(`✅ Seeded ${blogPosts.length} blog posts`);

  // 6. About Pillars Collection
  const pillars = INITIAL_PORTFOLIO_DATA.aboutPillars || [];
  pillars.forEach((pillar, idx) => {
    const pillarPath = path.join(contentDir, 'aboutPillars', `${pillar.id}.json`);
    writeJson(pillarPath, {
      ...pillar,
      order: idx + 1,
    });
  });
  console.log(`✅ Seeded ${pillars.length} about pillars`);

  // 7. Gallery Items Collection
  const galleryItems = INITIAL_PORTFOLIO_DATA.galleryItems || [];
  galleryItems.forEach((item, idx) => {
    const itemPath = path.join(contentDir, 'galleryItems', `${item.id}.json`);
    writeJson(itemPath, {
      ...item,
      order: idx + 1,
    });
  });
  console.log(`✅ Seeded ${galleryItems.length} gallery items`);

  // 8. Martial Arts Collection
  const martialArts = INITIAL_PORTFOLIO_DATA.martialArts || [];
  martialArts.forEach((art, idx) => {
    const slugId = (art as any).id || art.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const artPath = path.join(contentDir, 'martialArts', `${slugId}.json`);
    writeJson(artPath, {
      id: slugId,
      ...art,
      order: idx + 1,
    });
  });
  console.log(`✅ Seeded ${martialArts.length} martial arts items`);

  // 9. Comments Collection
  const comments = INITIAL_PORTFOLIO_DATA.comments || [];
  for (const comment of comments) {
    const commentPath = path.join(contentDir, 'comments', `${comment.id}.json`);
    writeJson(commentPath, comment);
  }
  console.log(`✅ Seeded ${comments.length} comments`);

  console.log('🎉 Keystatic CMS Content Seeding Complete!');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
