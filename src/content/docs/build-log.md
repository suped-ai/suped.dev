---
title: Build log
description: What has been built, changed, and learned, newest first.
section: why
order: 3
---

A running record of what has actually been built and what it cost, newest first.
Package releases are in the CLI's [changelog](https://github.com/suped-ai/suped/blob/main/cli/CHANGELOG.md);
this covers the wider work — infrastructure, decisions, and the things that went wrong.

## 2026-09-12

### The base image got small

Measured on a two-core machine, cold: the image was **2.94 GB and took 3 m 16 s** to build. Three
things most agent work never touches accounted for most of it — Playwright and Chromium (~1.5 GB),
ffmpeg (~620 MB), and a C toolchain (~340 MB). They are now opt-in, and the base is **804 MB in
about a minute**.

```sh
suped --with browser            # at creation
suped rebuild --with media      # change later
suped rebuild --without         # back to the base
```

They are built into the image rather than installed at setup, because system packages do not
survive `reset` — a browser installed into a running container would disappear on the next upgrade.
The selection is part of the image tag, so `reset` and `rebuild` reproduce the same computer. See
[the computer](/docs/the-computer).

Two findings from this work. `chromium-headless-shell` gives the same Playwright API for automation
and JS-heavy pages **about 600 MB smaller** than full Chromium, so that is what `--with browser`
installs. And a great deal of "research" is just reading, which `w3m` and `lynx` handle for about
7 MB — so they are in the base and a browser engine is a choice, not a tax.

A build-cache detail worth knowing: a Docker `ARG` in scope joins the cache key of **every** later
`RUN`, including ones that never read it. Declaring the feature args at the top of the Dockerfile
rebuilt the base on any feature change — 2 m 09 s where the base alone is 1 m 11 s. Each arg now
sits immediately before the layer that uses it, and the layers run most expensive first, so
switching to `--with browser` takes 65 s and adding `build` on top of it takes 42 s.

### Workspaces can move between machines

`suped sync` writes what defines a workspace — tool selection, ports, mounts, and each project's
remote and branch — to a small JSON file with no credentials in it. `suped sync restore` rebuilds
that workspace elsewhere: it reinstalls the tools, so they are built for the architecture they land
on, and clones the projects. The home volume is not copied.

Run bare, `suped sync` names every repository with uncommitted changes, commits that are not on a
remote, or no remote at all — the work a move would leave behind — and exits non-zero if it finds
any. See [persistence](/docs/persistence).

### Workspaces carry what they grew

The curated selection was recorded; anything the agent installed afterwards was invisible, so
nothing could carry it. `sync` now also records apt packages beyond the image's own, `uv` tools, and
npm globals under the home prefix — by inspecting the workspace rather than asking anyone to write
it down, so there is no new convention for an agent to learn. `restore` puts them back.

### The site had not deployed in five days

suped.dev was serving the pre-0.2.0 homepage. `CLOUDFLARE_ACCOUNT_ID` was set on both repositories
but `CLOUDFLARE_API_TOKEN` was not, and both deploy workflows checked for the token, printed a
notice, skipped the deploy and **exited 0**. Eight green runs, nothing published, no signal that
anything was wrong.

The secret is set and both sites deploy again. A push to `main` that cannot deploy now fails loudly
instead of passing; a fork without the secret still builds green.

### A new homepage, and an experimental notice

The hero now leads with the environment rather than the agent, because that is where the value
sits: set your projects, tooling and connections up once, then bring whichever agent you like and
change models — or go local — without losing any of it.

The homepage also carries an [experimental notice](/). The agent holds real credentials for real
accounts, a container is not a security boundary, and every future inbound channel — email, chat, a
webhook — is a prompt-injection surface where a stranger's text becomes instructions to something
holding your keys. That should be visible before anyone connects an account, not after.

## 2026-09-09

**Suped 0.2.0.** Guided setup with 17 optional CLIs across repositories, hosting, databases, cloud,
payments and agent clients; nine official MCP connections with registration for Codex and Claude
Code; ports and mounts preserved across reset and rebuild; argument boundaries and piped input
preserved in `exec`.

## 2026-09-07

**Suped 0.1.0.** A persistent Linux computer with `up`, `exec`, `status`, `stop`, `reset`,
`rebuild`, `destroy` and `prompt`, created on first run and kept in a Docker named volume.
