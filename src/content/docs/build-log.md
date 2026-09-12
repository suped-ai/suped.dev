---
title: Build log
description: What has been added, newest first.
section: why
order: 3
---

What has been added, newest first. Exact changes per release are in the CLI's
[changelog](https://github.com/suped-ai/suped/blob/main/cli/CHANGELOG.md).

## 0.4.0 · 2026-09-12

**The workspace can run what it builds.** Python 3.14.7 with `uv` and `uvx`, Go 1.27.1, Deno 2.9.6
and Bun 1.4.2, alongside the Node already in the base. Each is pinned and checksum-verified and
unpacks into the persistent home rather than the image, so picking a language up later never means
rebuilding. Selecting Python puts a current CPython ahead of Ubuntu's externally managed 3.12.

**The Docker client, and no daemon.** The CLI with the Compose and Buildx plugins, for local builds
and container checks. Suped runs no daemon and never mounts your host's socket — a workspace holding
that socket can start a container with the host filesystem mounted, so it is root on the host. Point
the client at a daemon with `DOCKER_HOST`, or mount the socket yourself knowing what it grants.

**Tools that have nothing to sign in to.** Herdr arrives under a new Workspace category, and setup
now understands that some tools have no account: it stops offering to connect one, reports them as
installed rather than unverified, and explains instead of failing a login that could never exist.

**Credentials the providers already read.** `suped secrets env` prints shell exports for the
environment variables each provider documents, so one stored token covers every machine:
`eval "$(suped secrets env)"`.

## 0.3.0 · 2026-09-12

**A small base image, with the heavy software opt-in.** The base is about a quarter of its previous
size and builds in roughly a minute. Add a browser, a media toolchain or a C compiler with
`--with browser,build,media`; they are built into the image, so `reset` keeps them.
`chromium-headless-shell` gives the full Playwright API around 600 MB smaller than Chromium, and
`w3m` reads pages as text without a browser engine at all.

**Workspaces move between machines.** `suped sync` writes what defines a workspace — tool selection,
ports, mounts, and each project's remote — to a small file, and `sync restore` rebuilds it
elsewhere, reinstalling tools for the architecture they land on. It also carries what the workspace
grew: apt packages, `uv` tools and npm globals added after setup. Run bare, it names the work a move
would leave behind.

**Account access travels.** `suped secrets` seals the credentials that can travel into one
[age](https://age-encryption.org)-encrypted file that is safe to commit. One identity file is the
only thing you move by hand, and there is no hosted service.

**Accounts, not just credentials.** The store holds records: a mailbox you already own, and an
account's address, password, second factor, recovery codes and any key issued later. Where a service
will not let an agent sign up, the account is recorded as pending with what it still needs, and
finishing the signup is just replacing the entry.

**A scheduler.** cron runs in the computer, so `crontab -e` schedules work that actually happens, and
`reset` carries your crontab across.

## 0.2.0 · 2026-09-09

Guided setup: 17 optional CLIs across repositories, hosting, databases, cloud, payments and agent
clients, and nine official MCP connections. Ports and extra mounts preserved across reset and
rebuild.

## 0.1.0 · 2026-09-07

The first persistent Linux computer, created on first run and kept in a Docker volume: `up`, `exec`,
`status`, `stop`, `reset`, `rebuild`, `destroy`, `prompt`.
