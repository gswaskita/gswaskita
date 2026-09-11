import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  server: {
    port: 3000,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  image: {
    domains: ['github.githubassets.com', 'cloud.klikada.com', 'media.licdn.com'],
  },
  integrations: [react(), keystatic()],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'crypto-subtle-polyfill',
        transformIndexHtml() {
          return [
            {
              tag: 'script',
              attrs: { src: '/crypto-polyfill.js' },
              injectTo: 'head-prepend',
            },
          ];
        },
      },
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }
  }
});
