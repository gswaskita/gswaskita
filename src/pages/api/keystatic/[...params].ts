import type { APIRoute } from 'astro';
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import config from '../../../../keystatic.config';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID || (import.meta.env && import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID);
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || (import.meta.env && import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET);
  const secret = process.env.KEYSTATIC_SECRET || (import.meta.env && import.meta.env.KEYSTATIC_SECRET);

  const handler = makeGenericAPIRouteHandler({
    config,
    clientId,
    clientSecret,
    secret,
  }, {
    slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG'
  });

  const res = await handler(context.request);
  const headers = new Headers(res.headers);
  const location = headers.get('Location');

  if (location && location.includes('github.com/login/oauth/authorize')) {
    try {
      const url = new URL(location);
      // Inject required GitHub scopes for creating commits and modifying repo contents
      url.searchParams.set('scope', 'public_repo,repo');
      headers.set('Location', url.toString());
    } catch (e) {
      console.error('Error modifying Keystatic OAuth scope:', e);
    }
  }

  return new Response(res.body, {
    status: res.status,
    headers,
  });
};

export const all = ALL;
