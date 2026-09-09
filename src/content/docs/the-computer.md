---
title: The computer
description: Normal Linux tools, a persistent home, and room to build.
section: computer
order: 1
---

## The image

Ubuntu 24.04, built locally from the Dockerfile shipped with the CLI. The first run still builds locally; a prebuilt registry image is not part of this release. From a source checkout, inspect it with:

```sh
cat cli/docker/Dockerfile
```

## What's installed

| Category | Tools |
|---|---|
| Shell | bash, tmux, less, vim, nano |
| Languages | python3 with pip and venv, node 22 with npm and npx, uv |
| Source | git, openssh-client, build-essential, pkg-config |
| Network | curl, wget, ca-certificates |
| Data | jq, sqlite3, ripgrep, unzip, zip |
| Media | ffmpeg |
| Browser | Playwright with Chromium, installed system-wide |

The `suped` user has passwordless sudo. Run `sudo apt-get update` before installing a system package. Those packages survive stop/start but not container reset.

Suped 0.2.0 offers [17 optional CLIs](/docs/tools) for repositories, hosting, databases, cloud infrastructure, payments, and agent clients. Select the providers you use. They install under `~/.local` and are available on PATH. The agent uses the vendor commands directly.

## User-installed tools

For npm tools, first run `npm config set prefix ~/.local` inside the workspace, then use `npm i -g` for the package you want. `uv tool install` also installs in your home. Both survive container reset. Tools installed by Suped's setup already use home paths explicitly.

Use a virtual environment for Python project dependencies:

```sh
cd ~/workspace
uv venv .venv
uv pip install --python .venv/bin/python requests
```

## Playwright

Chromium and its system dependencies are already there. In any project, install the `playwright` package at the same version as the global one and it will find the browser through `PLAYWRIGHT_BROWSERS_PATH`, which is set for you.

```sh
playwright --version          # e.g. Version 1.63.0
npm i playwright@1.63.0
node -e "require('playwright').chromium.launch().then(b => b.close())"
```

Playwright ties each release to a specific browser build, so a different version would try to download its own Chromium. Matching the version avoids that. Installing the matching package in the project also works after changing npm's global prefix to `~/.local`; the system Playwright package is not moved by that prefix change.

For Python, install the matching Playwright version into a virtual environment. Browser builds are tied to Playwright releases; an unmatched version may require another browser download.

A normal `launch()` session does not preserve browser logins. For a reusable profile, use a persistent context and keep its directory in your home:

```js
const { chromium } = require('playwright');
const path = require('node:path');
const os = require('node:os');

(async () => {
  const context = await chromium.launchPersistentContext(
    path.join(os.homedir(), '.config', 'browser-profile'),
    { headless: true },
  );
  // Use context.pages() or context.newPage() for the work.
  await context.close();
})();
```

Save this inside a project with the matching Playwright package installed. Avoid opening the same profile from multiple browser processes at once. Vendor CLI logins are separate from this browser profile.

## Where things live

```
/home/suped/
  workspace/    where shells open
  projects/
  downloads/
  .config/
  .local/bin/   on PATH, where uv and user-installed tools go
```

These are suggestions, not rules. Make whatever structure you want. The only thing that matters is that it's under `/home/suped`, because that's what [persists](/docs/persistence).

## Workspace setup

Suped remembers your setup selection in `~/.config/suped/setup.json`. This is workspace setup state, not an agent prompt or a credentials store. Each vendor CLI manages its own authentication in your home.

Setup can install Codex or Claude Code. You can also install another client or connect a host agent through `exec`. Optional [MCP setup](/docs/mcp) configures service connections in your chosen client. The environment is headless; Supabase's local Docker stack is not bundled and the host Docker socket is not mounted.

## Under the hood

For the curious, the computer is:

- one Docker image, tagged `suped-computer:<version>`,
- one named volume, `suped-home`, mounted at `/home/suped`,
- one container, `suped`, running `sleep infinity` under an init process.

The CLI opens shells and runs commands with `docker exec`. You can inspect and manage the container with normal Docker commands too.
