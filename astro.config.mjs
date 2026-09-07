// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://suped.dev',
  trailingSlash: 'never',
  build: { format: 'file' },
  redirects: {
    '/docs': '/docs/getting-started',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
    },
  },
});
