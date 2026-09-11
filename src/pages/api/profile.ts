import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const PROFILE_FILE = path.resolve(process.cwd(), 'src/content/profile.json');
const SCHOLAR_FILE = path.resolve(process.cwd(), 'src/content/scholarStats.json');

export const GET: APIRoute = async () => {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf-8'));
      return new Response(JSON.stringify({ success: true, profile: data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ success: false, error: 'File not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    let currentProfile: any = {};
    if (fs.existsSync(PROFILE_FILE)) {
      currentProfile = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf-8'));
    }

    // Merge updated fields
    const updatedProfile = {
      ...currentProfile,
      ...body
    };

    // Make sure SINTA uses kemdiktisaintek domain if kemdikbud was pasted
    if (updatedProfile.sintaUrl && updatedProfile.sintaUrl.includes('sinta.kemdikbud.go.id')) {
      updatedProfile.sintaUrl = updatedProfile.sintaUrl.replace('sinta.kemdikbud.go.id', 'sinta.kemdiktisaintek.go.id');
    }

    // Handle brand image & favicon file upload (base64)
    if (body.brandBase64) {
      try {
        const matches = body.brandBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          
          let ext = 'png';
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpeg';
          else if (mimeType.includes('webp')) ext = 'webp';
          else if (mimeType.includes('svg')) ext = 'svg';
          else if (mimeType.includes('ico') || mimeType.includes('icon')) ext = 'ico';

          const brandDir = path.resolve(process.cwd(), 'public/static/images/brand');
          if (!fs.existsSync(brandDir)) {
            fs.mkdirSync(brandDir, { recursive: true });
          }

          const filename = `brandImage.${ext}`;
          const filePath = path.join(brandDir, filename);
          fs.writeFileSync(filePath, buffer);

          updatedProfile.brandImage = `/static/images/brand/${filename}`;

          // Also copy to favicon.ico and favicon.png
          const faviconIcoPath = path.resolve(process.cwd(), 'public/favicon.ico');
          const faviconPngPath = path.resolve(process.cwd(), 'public/favicon.png');
          fs.writeFileSync(faviconIcoPath, buffer);
          fs.writeFileSync(faviconPngPath, buffer);
        }
      } catch (e) {
        console.error('Failed to save brand image file:', e);
      }
      delete updatedProfile.brandBase64;
    }

    // Handle avatar image file upload (Hero photo only)
    if (body.avatarBase64) {
      try {
        const matches = body.avatarBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          
          let ext = 'png';
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpeg';
          else if (mimeType.includes('webp')) ext = 'webp';
          else if (mimeType.includes('svg')) ext = 'svg';
          else if (mimeType.includes('ico') || mimeType.includes('icon')) ext = 'ico';

          const profileDir = path.resolve(process.cwd(), 'public/static/images/profile');
          if (!fs.existsSync(profileDir)) {
            fs.mkdirSync(profileDir, { recursive: true });
          }

          const filename = `avatarImage.${ext}`;
          const filePath = path.join(profileDir, filename);
          fs.writeFileSync(filePath, buffer);

          updatedProfile.avatarImage = `/static/images/profile/${filename}`;
        }
      } catch (e) {
        console.error('Failed to save avatar image file:', e);
      }
      delete updatedProfile.avatarBase64;
    }

    // If user clicked reset brand image
    if (body.resetBrandImage) {
      updatedProfile.brandImage = null;
      updatedProfile.brandImageUrl = '';
      delete updatedProfile.resetBrandImage;
    }

    // If user clicked reset avatar
    if (body.resetAvatar) {
      updatedProfile.avatarImage = null;
      updatedProfile.avatarUrl = '';
      delete updatedProfile.resetAvatar;
    }

    // Clean up obsolete fallback IDs if full URLs are present
    if (updatedProfile.scopusId) delete updatedProfile.scopusId;
    if (updatedProfile.scholarId && updatedProfile.scholarUrl) delete updatedProfile.scholarId;
    if (updatedProfile.orcidId && updatedProfile.orcidUrl) delete updatedProfile.orcidId;
    if (updatedProfile.sintaId && updatedProfile.sintaUrl) delete updatedProfile.sintaId;

    fs.writeFileSync(PROFILE_FILE, JSON.stringify(updatedProfile, null, 2), 'utf-8');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Profil, foto avatar, dan konfigurasi favicon berhasil disimpan.',
      profile: updatedProfile 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
