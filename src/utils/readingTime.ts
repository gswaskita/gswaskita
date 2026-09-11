import type { BlogPost } from '../types';

/**
 * Calculates total word count across title, excerpt, and content blocks
 */
export function calculateWordCount(post: BlogPost): number {
  let text = `${post.title} ${post.excerpt} `;
  
  if (post.content && Array.isArray(post.content)) {
    for (const block of post.content) {
      if (block.text) {
        text += ` ${block.text}`;
      }
      if (block.items && Array.isArray(block.items)) {
        text += ` ${block.items.join(' ')}`;
      }
    }
  }

  // Split by whitespace and remove empty elements
  const words = text.trim().split(/\s+/).filter(Boolean);
  return Math.max(1, words.length);
}

/**
 * Calculates estimated reading time automatically based on 200 words per minute
 */
export function calculateReadingTimeMinutes(post: BlogPost): number {
  const words = calculateWordCount(post);
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Returns a formatted reading time string (e.g. "4 min read" / "4 menit baca")
 */
export function formatReadingTime(post: BlogPost, lang: 'en' | 'id' = 'en'): string {
  const minutes = calculateReadingTimeMinutes(post);
  if (lang === 'id') {
    return `${minutes} menit baca`;
  }
  return `${minutes} min read`;
}

/**
 * Automatically extracts H2 and H3 headings from content if needed
 */
export function extractHeadings(post: BlogPost): { id: string; text: string; level: 2 | 3 }[] {
  if (post.headings && post.headings.length > 0) {
    return post.headings;
  }

  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  if (post.content && Array.isArray(post.content)) {
    for (const block of post.content) {
      if (block.type === 'h2' && block.text) {
        const id = block.id || block.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        headings.push({ id, text: block.text, level: 2 });
      } else if (block.type === 'h3' && block.text) {
        const id = block.id || block.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        headings.push({ id, text: block.text, level: 3 });
      }
    }
  }
  return headings;
}
