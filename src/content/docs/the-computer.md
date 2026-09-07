---
title: The computer
description: A plain Linux box. Nothing in it is special.
order: 2
---

## The image

Ubuntu 24.04, built locally from a Dockerfile that ships inside the npm package. There is no registry image to trust and nothing phones home. You can read the whole thing:

```sh
cat "$(npm root -g)/suped/docker/Dockerfile"
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

The `suped` user has passwordless sudo, so `sudo apt-get install` works without ceremony.

## Playwright

Chromium and its system dependencies are already there. In any project, install the `playwright` package and it will find the browser through `PLAYWRIGHT_BROWSERS_PATH`, which is set for you.

```sh
npm i playwright
node -e "require('playwright').chromium.launch().then(b => b.close())"
```

Python users: `uv pip install playwright` works the same way against the same browser.

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

## What's deliberately not there

- No suped daemon, agent, or service inside the box.
- No configuration format. No manifest. No `.suped/`.
- No special filesystem layout beyond a home directory.
- No opinions about which agent, model, or tool you use.

If you need something, install it. If you want a convention, make one. Linux is Linux.

## Under the hood

For the curious, the computer is:

- one Docker image, tagged `suped-computer:<version>`,
- one named volume, `suped-home`, mounted at `/home/suped`,
- one container, `suped`, running `sleep infinity` under an init process.

`suped` opens shells with `docker exec`. That's the whole trick. Every `docker` command works on it too, if you ever need to go around the CLI.
