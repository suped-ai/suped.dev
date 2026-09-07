---
title: Getting started
description: One command. A computer that keeps everything.
order: 1
---

## Requirements

- Docker, either [Docker Desktop](https://docs.docker.com/get-docker/) or Docker Engine, with the daemon running.
- Node 18 or newer, for `npx`.

That's it. suped itself has no dependencies.

## Run it

```sh
npx suped@latest
```

The first run builds a local image and creates your persistent home. Expect a few minutes and a couple of gigabytes, most of it Chromium and ffmpeg. When it finishes you're in a shell:

```
suped@suped:~/workspace$
```

You're the `suped` user with passwordless sudo, in `/home/suped/workspace`. Look around, install things, clone a repo. Exit whenever.

## Run it again

```sh
npx suped@latest
```

Instant this time. Same home, same files, same tools you installed. The container stays up in the background between sessions and comes back on its own after a Docker restart, unless you stopped it on purpose.

## Ports and mounts

If something inside needs to reach the outside, or you want a host folder available inside, say so when the computer is first created:

```sh
npx suped@latest -p 3000:3000 -v ~/data:/home/suped/data
```

These are plain `docker run` flags. They're fixed for the life of the container. To change them, recreate it, which keeps your home:

```sh
suped reset -p 8080:8080
```

## Install it globally, or don't

`npx suped@latest` always works and always fetches the current version. If you'd rather type less:

```sh
npm i -g suped
suped
```

## Next

- [The computer](/docs/the-computer): what's on the box and where things live.
- [Persistence](/docs/persistence): exactly what survives what.
- [Agents](/docs/agents): handing the computer to something other than you.
