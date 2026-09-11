import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const COMMENTS_DIR = path.resolve(process.cwd(), 'src/content/comments');
const SETTINGS_FILE = path.resolve(process.cwd(), 'src/content/commentSettings.json');
const PROFILE_FILE = path.resolve(process.cwd(), 'src/content/profile.json');

// Helper to get author's full formal name from profile.json
function getDefaultAuthorName(): string {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const p = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf-8'));
      const prefix = p.prefix ? p.prefix.trim() + ' ' : '';
      const suffix = p.suffix ? (p.suffix.trim().startsWith(',') ? p.suffix.trim() : `, ${p.suffix.trim()}`) : '';
      return `${prefix}${p.name}${suffix}`.trim();
    }
  } catch (e) {}
  return 'Prof. DR. Ir. H. Gautama Sastra Waskita, S.E., B.BA., M.M.';
}

// Helper to map status to clean prefix (approve, pending, hiden)
function getStatusPrefix(status: string): string {
  if (status === 'approved' || status === 'approve') return 'approve';
  if (status === 'hidden' || status === 'hiden') return 'hiden';
  return 'pending';
}

// Helper to generate human-readable, recognizable Comment IDs starting with status prefix
// e.g. approve-budi-santoso-sangat-menarik-260911-b17
function generateReadableCommentId(userName: string, content: string, status: string = 'approved'): string {
  const prefix = getStatusPrefix(status);
  const cleanName = (userName || 'reviewer')
    .replace(/^(Dr\.|Prof\.|Ir\.|H\.|Mr\.|Ms\.|Mrs\.)\s+/gi, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);

  const cleanContent = (content || 'review')
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('-')
    .slice(0, 28);

  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yy}${mm}${dd}`;

  const rand = Math.random().toString(36).slice(2, 5);
  const candidate = `${prefix}-${cleanName || 'scholar'}-${cleanContent || 'review'}-${dateStr}-${rand}`
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return candidate;
}

function ensureDirectories() {
  try {
    if (!fs.existsSync(COMMENTS_DIR)) {
      fs.mkdirSync(COMMENTS_DIR, { recursive: true });
    }
  } catch (e) {}
}

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { globalEnabled: true, moderationRequired: false, disabledPosts: [] };
}

function saveSettings(settings: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (e) {}
}

// GitHub API Integration for Vercel / Production environment (Option 1)
async function saveToGitHub(commentRecord: any): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN || process.env.KEYSTATIC_GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.PUBLIC_KEYSTATIC_GITHUB_REPO;
  if (!token || !repo) return false;

  const filePath = `src/content/comments/${commentRecord.id}.json`;
  const contentBase64 = Buffer.from(JSON.stringify(commentRecord, null, 2), 'utf-8').toString('base64');

  let sha: string | undefined;
  try {
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Gautama-Academic-Portfolio',
      },
    });
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }
  } catch (e) {}

  const putBody: any = {
    message: sha
      ? `chore(comments): update scholarly comment ${commentRecord.id}`
      : `chore(comments): new scholarly comment from ${commentRecord.userName}`,
    content: contentBase64,
  };
  if (sha) putBody.sha = sha;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Gautama-Academic-Portfolio',
      },
      body: JSON.stringify(putBody),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function deleteFromGitHub(commentId: string): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN || process.env.KEYSTATIC_GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.PUBLIC_KEYSTATIC_GITHUB_REPO;
  if (!token || !repo) return false;

  const filePath = `src/content/comments/${commentId}.json`;
  let sha: string | undefined;
  try {
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Gautama-Academic-Portfolio',
      },
    });
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }
  } catch (e) {
    return false;
  }

  if (!sha) return false;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Gautama-Academic-Portfolio',
      },
      body: JSON.stringify({
        message: `chore(comments): delete comment ${commentId}`,
        sha,
      }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// -------------------------------------------------------------
// GET: Fetch comments (filtered by slug & moderation status)
// -------------------------------------------------------------
export const GET: APIRoute = async ({ request }) => {
  try {
    ensureDirectories();
    const url = new URL(request.url);
    const postSlug = url.searchParams.get('postSlug');
    const includeAll = url.searchParams.get('includeAll') === 'true'; // For admin / moderation

    let comments: any[] = [];

    if (fs.existsSync(COMMENTS_DIR)) {
      const files = fs.readdirSync(COMMENTS_DIR).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(COMMENTS_DIR, file), 'utf-8');
          const parsed = JSON.parse(content);
          comments.push(parsed);
        } catch (e) {}
      }
    }

    if (postSlug) {
      comments = comments.filter((c) => c.postSlug === postSlug);
    }

    // Moderation filter: Visitors only see 'approved' (or unassigned legacy) comments
    if (!includeAll) {
      comments = comments.filter((c) => !c.status || c.status === 'approved');
    }

    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(
      JSON.stringify({
        success: true,
        comments,
        settings: getSettings(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// -------------------------------------------------------------
// POST: Submit new scholarly comment
// -------------------------------------------------------------
export const POST: APIRoute = async ({ request }) => {
  try {
    ensureDirectories();
    const body = await request.json();
    const settings = getSettings();

    // Check if comments are enabled
    if (!settings.globalEnabled || (body.postSlug && settings.disabledPosts?.includes(body.postSlug))) {
      return new Response(
        JSON.stringify({ success: false, error: 'Comments are currently disabled by the administrator.' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.content || !body.userName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name and Comment content are required.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Moderation status: 'approved' by default, or 'pending' if moderation is enforced (Request #2)
    const status = body.status || (settings.moderationRequired ? 'pending' : 'approved');

    // Generate readable, human-friendly comment ID starting with status prefix (approve, pending, hiden)
    const commentId = body.id || generateReadableCommentId(body.userName, body.content, status);

    // Direct clickable link to the article page (Request #7)
    const origin = new URL(request.url).origin;
    const postSlug = body.postSlug || 'general';
    const postUrl = body.postUrl || `${origin}/blog/${postSlug}`;

    const commentRecord = {
      id: commentId,
      status,
      postSlug,
      postTitle: body.postTitle || postSlug,
      postUrl,
      userName: body.userName.trim(),
      userEmail: (body.userEmail || '').trim(),
      userRole: body.userRole || 'Peer Reviewer / Academician',
      institution: (body.institution || 'Academic Institution').trim(),
      content: body.content.trim(),
      createdAt: body.createdAt || new Date().toISOString(),
      likes: body.likes || 0,
      reply: body.reply || undefined,
    };

    // Save locally if disk is writable
    let savedOnDisk = false;
    try {
      const filePath = path.join(COMMENTS_DIR, `${commentId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(commentRecord, null, 2), 'utf-8');
      savedOnDisk = true;
    } catch (e) {
      // e.g. EROFS on Vercel Serverless
    }

    // Also auto-commit to GitHub if running on Vercel / GitHub configured (Option 1)
    if (process.env.VERCEL || !savedOnDisk) {
      await saveToGitHub(commentRecord);
    }

    return new Response(JSON.stringify({ success: true, comment: commentRecord }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// -------------------------------------------------------------
// DELETE: Remove comment
// -------------------------------------------------------------
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const commentId = url.searchParams.get('id');

    if (!commentId) {
      return new Response(JSON.stringify({ success: false, error: 'Comment ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const safeId = commentId.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(COMMENTS_DIR, `${safeId}.json`);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {}

    // Also remove from GitHub in production
    if (process.env.VERCEL) {
      await deleteFromGitHub(safeId);
    }

    return new Response(JSON.stringify({ success: true, message: 'Comment deleted successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// -------------------------------------------------------------
// PATCH: Reply, Like, Moderate, or Toggle Settings
// -------------------------------------------------------------
export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // 1. Author Reply action (Requests #5 & #6)
    if (body.action === 'reply' && body.commentId && body.replyText) {
      const safeId = body.commentId.replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = path.join(COMMENTS_DIR, `${safeId}.json`);

      let existing: any = null;
      if (fs.existsSync(filePath)) {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }

      if (!existing) {
        return new Response(JSON.stringify({ success: false, error: 'Comment not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Default author automatically to Dr. Gautama's formal profile unless specified
      const defaultAuthor = getDefaultAuthorName();
      const authorName = (body.authorName && body.authorName.trim()) || defaultAuthor;

      // Automatically timestamp the reply at the exact moment of saving
      const now = new Date();
      const repliedAt = body.repliedAt || now.toISOString();

      existing.reply = {
        text: body.replyText.trim(),
        authorName,
        repliedAt,
      };

      try {
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
      } catch (e) {}

      if (process.env.VERCEL) {
        await saveToGitHub(existing);
      }

      return new Response(JSON.stringify({ success: true, comment: existing }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Moderation action: approve, pending, or hide (Request #1 & #2)
    if (body.action === 'moderate' && body.commentId && body.status) {
      const safeId = body.commentId.replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = path.join(COMMENTS_DIR, `${safeId}.json`);

      if (fs.existsSync(filePath)) {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const oldId = existing.id || safeId;
        const newStatus = body.status; // 'approved' | 'pending' | 'hidden'
        existing.status = newStatus;

        // Automatically update Comment ID and filename to reflect new status prefix
        const newPrefix = getStatusPrefix(newStatus);
        let newId = oldId;
        if (/^(approve|pending|hiden)-/.test(oldId)) {
          newId = oldId.replace(/^(approve|pending|hiden)-/, `${newPrefix}-`);
        } else {
          newId = `${newPrefix}-${oldId}`;
        }
        existing.id = newId;

        const newFilePath = path.join(COMMENTS_DIR, `${newId}.json`);
        try {
          fs.writeFileSync(newFilePath, JSON.stringify(existing, null, 2), 'utf-8');
          if (newFilePath !== filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {}

        if (process.env.VERCEL) {
          if (newId !== oldId) {
            await deleteFromGitHub(oldId);
          }
          await saveToGitHub(existing);
        }

        return new Response(JSON.stringify({ success: true, comment: existing }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 3. Like / Upvote action
    if (body.action === 'like' && body.commentId) {
      const safeId = body.commentId.replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = path.join(COMMENTS_DIR, `${safeId}.json`);

      if (!fs.existsSync(filePath)) {
        return new Response(JSON.stringify({ success: false, error: 'Comment not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      existing.likes = (existing.likes || 0) + 1;

      try {
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
      } catch (e) {}

      if (process.env.VERCEL) {
        await saveToGitHub(existing);
      }

      return new Response(JSON.stringify({ success: true, likes: existing.likes, comment: existing }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Settings toggle action (e.g. toggle moderationRequired or globalEnabled)
    if (body.action === 'toggleSettings') {
      const settings = getSettings();
      if (typeof body.globalEnabled === 'boolean') {
        settings.globalEnabled = body.globalEnabled;
      }
      if (typeof body.moderationRequired === 'boolean') {
        settings.moderationRequired = body.moderationRequired;
      }
      if (Array.isArray(body.disabledPosts)) {
        settings.disabledPosts = body.disabledPosts;
      }
      saveSettings(settings);

      return new Response(JSON.stringify({ success: true, settings }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

