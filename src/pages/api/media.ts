import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

interface MediaItem {
  id: string;
  filename: string;
  type: 'image' | 'video' | 'doc' | 'audio';
  path: string;
  publicUrl: string;
  sizeBytes: number;
  uploadedAt: string;
  uploader: string;
  aspectRatio: string;
}

const STATIC_DIR = path.resolve(process.cwd(), 'public/static');

function scanDirectory(dir: string, baseType: 'image' | 'doc' | 'media'): MediaItem[] {
  if (!fs.existsSync(dir)) return [];
  const files: MediaItem[] = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name.startsWith('.') || item.name === '.gitkeep') continue;
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...scanDirectory(fullPath, baseType));
    } else if (item.isFile()) {
      const stats = fs.statSync(fullPath);
      const ext = path.extname(item.name).toLowerCase();
      let type: 'image' | 'video' | 'doc' | 'audio' = 'doc';
      let aspectRatio = '16:9';

      if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
        type = 'image';
        aspectRatio = '4:3';
      } else if (['.mp4', '.webm', '.mov', '.mkv'].includes(ext)) {
        type = 'video';
        aspectRatio = '16:9';
      } else if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
        type = 'audio';
        aspectRatio = '1:1';
      } else {
        type = 'doc';
        aspectRatio = '1:1';
      }

      const relativeToPublic = path.relative(path.resolve(process.cwd(), 'public'), fullPath);
      const publicUrl = '/' + relativeToPublic.split(path.sep).join('/');

      files.push({
        id: relativeToPublic.replace(/[^a-zA-Z0-9-_]/g, '_'),
        filename: item.name,
        type,
        path: relativeToPublic,
        publicUrl,
        sizeBytes: stats.size,
        uploadedAt: stats.mtime.toISOString(),
        uploader: 'Gautama Sastra Waskita, S.E., B.BA., M.M. (Lead Author)',
        aspectRatio,
      });
    }
  }

  return files;
}

export const GET: APIRoute = async () => {
  try {
    const imagesDir = path.join(STATIC_DIR, 'images');
    const docsDir = path.join(STATIC_DIR, 'docs');
    const mediaDir = path.join(STATIC_DIR, 'media');

    const allMedia = [
      ...scanDirectory(imagesDir, 'image'),
      ...scanDirectory(docsDir, 'doc'),
      ...scanDirectory(mediaDir, 'media'),
    ];

    if (allMedia.length === 0) {
      allMedia.push(
        {
          id: 'sample_post_img_1',
          filename: 'operations-research-sme.webp',
          type: 'image',
          path: 'public/static/images/posts/operations-research-sme.webp',
          publicUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
          sizeBytes: 345000,
          uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          uploader: 'Gautama Sastra Waskita, S.E., B.BA., M.M.',
          aspectRatio: '16:9',
        },
        {
          id: 'sample_post_img_2',
          filename: 'fieldwork-traditional-market.webp',
          type: 'image',
          path: 'public/static/images/posts/fieldwork-traditional-market.webp',
          publicUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
          sizeBytes: 412000,
          uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          uploader: 'Gautama Sastra Waskita, S.E., B.BA., M.M.',
          aspectRatio: '4:3',
        },
        {
          id: 'sample_doc_1',
          filename: 'UK_PhD_Research_Proposal_Dossier.pdf',
          type: 'doc',
          path: 'public/static/docs/UK_PhD_Research_Proposal_Dossier.pdf',
          publicUrl: '/static/docs/UK_PhD_Research_Proposal_Dossier.pdf',
          sizeBytes: 1850000,
          uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          uploader: 'Gautama Sastra Waskita, S.E., B.BA., M.M.',
          aspectRatio: '1:1',
        },
        {
          id: 'sample_video_1',
          filename: 'Somatic_Endurance_Philosophy_Intro.mp4',
          type: 'video',
          path: 'public/static/media/Somatic_Endurance_Philosophy_Intro.mp4',
          publicUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          sizeBytes: 15400000,
          uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          uploader: 'Gautama Sastra Waskita, S.E., B.BA., M.M.',
          aspectRatio: '16:9',
        }
      );
    }

    return new Response(JSON.stringify({ success: true, files: allMedia }), {
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

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const targetPath = url.searchParams.get('path');

    if (!targetPath) {
      return new Response(JSON.stringify({ success: false, error: 'Path parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedTarget = path.normalize(targetPath);
    const resolvedPath = path.resolve(process.cwd(), normalizedTarget.startsWith('public/') ? normalizedTarget : path.join('public', normalizedTarget));

    if (!resolvedPath.startsWith(STATIC_DIR)) {
      return new Response(JSON.stringify({ success: false, error: 'Access denied: cannot delete files outside public/static' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      return new Response(JSON.stringify({ success: true, message: `File ${path.basename(resolvedPath)} deleted successfully from server.` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: true, message: `File record removed.` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
