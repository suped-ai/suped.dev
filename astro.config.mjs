// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://suped.dev',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  redirects: {
    '/docs': '/docs/getting-started',
  },
  markdown: {
    shikiConfig: {
      theme: 'vitesse-black',
    },
  },
});
