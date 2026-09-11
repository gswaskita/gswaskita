import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const LOGS_FILE = path.resolve(process.cwd(), 'src/content/activityLogs.json');

function getLogs(): any[] {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    }
  } catch (e) {}

  // Generate initial rich activity log data
  const now = Date.now();
  const sampleLogs = [
    {
      id: 'log-01',
      timestamp: new Date(now - 1000 * 60 * 12).toISOString(),
      type: 'auth_attempt',
      title: 'GitHub OAuth Admin Verification',
      description: 'Account @gwaskita-phd successfully authenticated via GitHub OAuth token to Keystatic CMS Studio.',
      target: '/keystatic',
      user: 'gwaskita-phd (GitHub)',
      ip: '180.252.164.22',
      device: 'macOS Chrome 134.0 (Desktop)',
      status: 'success',
      authProvider: 'github',
    },
    {
      id: 'log-02',
      timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
      type: 'download',
      title: 'Working Paper PDF Downloaded',
      description: 'Downloaded "Bridging Operations Management with SME Digitalization - Pre-Print Working Paper.pdf"',
      target: '/static/docs/UK_PhD_Research_Proposal_Dossier.pdf',
      user: 'Academic Reader (Univ of Manchester)',
      ip: '130.88.240.11',
      device: 'Safari iOS 18.2 (Mobile)',
      status: 'info',
    },
    {
      id: 'log-03',
      timestamp: new Date(now - 1000 * 60 * 95).toISOString(),
      type: 'visit',
      title: 'Page Visited: Research Publications',
      description: 'Deep interaction with Google Scholar Live Metrics & VOSviewer Bibliometric Cluster.',
      target: '/research',
      user: 'Anonymous Scholar',
      ip: '114.124.205.88',
      device: 'Windows Edge (Desktop)',
      status: 'info',
    },
    {
      id: 'log-04',
      timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
      type: 'comment',
      title: 'New Scholarly Discussion Posted',
      description: 'Prof. Richard B. submitted feedback on qualitative triangulation methodology in operations research.',
      target: '/blog/bridging-operations-management-with-sme-digitalization',
      user: 'Prof. Richard B. (Warwick)',
      ip: '137.205.192.4',
      device: 'macOS Safari (Desktop)',
      status: 'success',
    },
    {
      id: 'log-05',
      timestamp: new Date(now - 1000 * 60 * 240).toISOString(),
      type: 'auth_attempt',
      title: 'Google Account Sign-In Attempt',
      description: 'User gautama.waskita@academic.ac.id accessed Dashboard Administration Portal.',
      target: '/studio',
      user: 'gautama.waskita@academic.ac.id',
      ip: '180.252.164.22',
      device: 'macOS Chrome 134.0 (Desktop)',
      status: 'success',
      authProvider: 'google',
    },
    {
      id: 'log-06',
      timestamp: new Date(now - 1000 * 60 * 320).toISOString(),
      type: 'like',
      title: 'Article Liked & Bookmarked',
      description: 'Article "Navigating UK PhD Admissions in Operations Management" received 1 citation-bookmark.',
      target: '/blog/navigating-uk-phd-operations-management',
      user: 'Doctoral Applicant',
      ip: '36.85.12.94',
      device: 'Android Chrome (Mobile)',
      status: 'info',
    },
    {
      id: 'log-07',
      timestamp: new Date(now - 1000 * 60 * 480).toISOString(),
      type: 'upload',
      title: 'Media Asset Uploaded',
      description: 'Uploaded field research photo "fieldwork-traditional-market.webp" to public/static/images/posts/',
      target: '/static/images/posts/fieldwork-traditional-market.webp',
      user: 'Gautama Sastra Waskita, S.E., B.BA., M.M. (Lead Author)',
      ip: '180.252.164.22',
      device: 'macOS Chrome 134.0 (Desktop)',
      status: 'success',
    },
    {
      id: 'log-08',
      timestamp: new Date(now - 1000 * 60 * 600).toISOString(),
      type: 'share',
      title: 'Publication Shared to LinkedIn Academic',
      description: 'Research page shared to LinkedIn Academic Network with DOI tracking.',
      target: '/research',
      user: 'Academic Visitor',
      ip: '103.21.124.6',
      device: 'Linux Firefox (Desktop)',
      status: 'info',
    },
    {
      id: 'log-09',
      timestamp: new Date(now - 1000 * 60 * 750).toISOString(),
      type: 'auth_attempt',
      title: 'Unrecognized Dashboard Access Blocked',
      description: 'Unauthorized login attempt from unknown IP address rejected by CSRF firewall.',
      target: '/studio',
      user: 'unknown_guest@crawler.net',
      ip: '45.154.255.99',
      device: 'Python-urllib/3.11',
      status: 'warning',
      authProvider: 'local',
    },
    {
      id: 'log-10',
      timestamp: new Date(now - 1000 * 60 * 920).toISOString(),
      type: 'update',
      title: 'Scholar Citations Synchronized',
      description: 'Google Scholar total citations verified (501 citations, h-index 10, i10-index 10).',
      target: 'scholarStats.json',
      user: 'System Automated Telemetry',
      ip: '127.0.0.1',
      device: 'Astro SSG Engine',
      status: 'success',
    },
  ];

  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(sampleLogs, null, 2), 'utf-8');
  } catch (e) {}

  return sampleLogs;
}

export const GET: APIRoute = async () => {
  try {
    const logs = getLogs();
    return new Response(JSON.stringify({ success: true, logs }), {
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const logs = getLogs();

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      type: body.type || 'visit',
      title: body.title || 'Action Performed',
      description: body.description || '',
      target: body.target || '',
      user: body.user || 'Guest Visitor',
      ip: body.ip || '127.0.0.1',
      device: body.device || 'Web Browser',
      status: body.status || 'info',
      authProvider: body.authProvider || undefined,
    };

    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();

    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, log: newLog }), {
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
