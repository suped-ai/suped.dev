# suped.dev

The docs site for [suped](https://github.com/suped-ai/suped). Astro, static, no framework on the client.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
```

Content lives in `src/content/docs/*.md`. Each file needs `title`, optional
`description`, and `order` for sidebar position. The landing page is
`src/pages/index.astro`. Theme tokens are at the top of `src/styles/global.css`
and match suped.ai.
