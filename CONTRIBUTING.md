# Contributing to suped.dev

This is the docs site. The CLI lives at https://github.com/suped-ai/suped.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # dist/
```

## Adding or editing a page

Docs are Markdown files in `src/content/docs/`. Each needs frontmatter:

```yaml
---
title: Persistence
description: Exactly what survives what.
section: computer
order: 2
---
```

- `section` must be one of the keys in `src/nav.ts`. That file also sets the
  order of the groups in the sidebar. Add a group there when the docs outgrow
  the existing ones.
- `order` positions the page within its group.
- `##` and `###` headings feed the on-page table of contents automatically.

A page with a missing or unknown `section` fails the build rather than
silently disappearing from the sidebar.

## Voice

Short sentences. Say what the thing does, not how excited we are about it.
Monospace is the brand; the copy should read like it belongs in a terminal.
Never add explanatory copy to suped.ai; that site stays a single command.

The logo is used only as the favicon. Don't add it anywhere else.

## Theme

Tokens are at the top of `src/styles/global.css` and match suped.ai. The wave
mounts once in `src/layouts/Base.astro`; its settings there are the canonical
ones and the homepage repo mirrors them.

## Pull requests

One change per PR. CI builds the site and checks that every doc has its
frontmatter and appears in the sitemap.
