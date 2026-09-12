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
| Source | git, openssh-client |
| Network | curl, wget, ca-certificates |
| Web | w3m, lynx |
| Data | jq, sqlite3, ripgrep, unzip, zip |
| Scheduling | cron |
| Secrets | age |

That base builds in about a minute. The `suped` user has passwordless sudo. Run `sudo apt-get update` before installing a system package. Those packages survive stop/start but not container reset.

Node is not optional: setup installs the agent clients and several provider CLIs with npm, so it has to exist before any selection runs.

## Optional software

A browser engine, a media toolchain, and a C compiler are large, and most work needs none of them. Choose the ones you want and they are built into your image:

| Feature | What it adds | Cost |
|---|---|---|
| `browser` | Playwright driving `chromium-headless-shell`, for automation and JS-heavy pages | ~910 MB |
| `build` | build-essential and pkg-config, for packages that compile native extensions | ~340 MB |
| `media` | ffmpeg and its codecs | ~620 MB |

```sh
suped --with browser              # when the computer is created
suped --with browser,build        # several at once
suped rebuild --with media        # change it later
suped rebuild --without           # back to the base
suped status                      # shows what is baked in
```

**Why these are baked in rather than installed later.** They are system packages, and system packages do not survive [`reset`](/docs/persistence). A browser installed into a running container would disappear on the next upgrade with nothing explaining why. Your selection is part of the image tag instead, so `reset` and `rebuild` reproduce the same computer. Changing it rebuilds a layer, which takes under two minutes.

`chromium-headless-shell` is Playwright's headless-only build. It has the same API for automation and is roughly 600 MB smaller than full Chromium. If you need headed mode or Chrome-specific behaviour, install full Chromium yourself with `playwright install chromium`, and re-run that after a reset.

## Reading the web

For research, the base is usually enough. `curl` fetches, and `w3m -dump` renders a page to clean text:

```sh
curl -sL https://example.com | w3m -T text/html -dump
w3m -dump https://example.com
```

That covers documentation, articles, and API references. Reach for `--with browser` when a page needs JavaScript to render, or when you are driving a page rather than reading it.

Suped 0.3.0 offers [17 optional CLIs](/docs/tools) for repositories, hosting, databases, cloud infrastructure, payments, and agent clients. Select the providers you use. They install under `~/.local` and are available on PATH. The agent uses the vendor commands directly.

## User-installed tools

For npm tools, first run `npm config set prefix ~/.local` inside the workspace, then use `npm i -g` for the package you want. `uv tool install` also installs in your home. Both survive container reset. Tools installed by Suped's setup already use home paths explicitly.

Use a virtual environment for Python project dependencies:

```sh
cd ~/workspace
uv venv .venv
uv pip install --python .venv/bin/python requests
```

## Playwright

With `--with browser`, Chromium and its system dependencies are there. In any project, install the `playwright` package at the same version as the global one and it will find the browser through `PLAYWRIGHT_BROWSERS_PATH`, which is set for you.

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

## Scheduled work

cron runs in the computer, so `crontab -e` schedules work that actually happens. `reset` carries your crontab across, the same way it carries ports and mounts.

One thing to know: cron gives a job `PATH=/usr/bin:/bin` and ignores both the container environment and `/etc/environment`, so a scheduled `gh` would not be found. The crontab ships with a `PATH` line that includes `~/.local/bin`. If you replace the whole crontab that line goes with it, so the durable form is to wrap the command:

```sh
* * * * * bash -lc 'cd ~/projects/app && ./nightly.sh >> ~/nightly.log 2>&1'
```

## Workspace setup

Suped remembers your setup selection in `~/.config/suped/setup.json`. This is workspace setup state, not an agent prompt or a credentials store. Each vendor CLI manages its own authentication in your home.

Setup can install Codex or Claude Code. You can also install another client or connect a host agent through `exec`. Optional [MCP setup](/docs/mcp) configures service connections in your chosen client. The environment is headless; Supabase's local Docker stack is not bundled and the host Docker socket is not mounted.

## Under the hood

For the curious, the computer is:

- one Docker image, tagged `suped-computer:<version>`,
- one named volume, `suped-home`, mounted at `/home/suped`,
- one container, `suped`, running `suped-init` under an init process. That starts cron and then waits.

The CLI opens shells and runs commands with `docker exec`. You can inspect and manage the container with normal Docker commands too.
