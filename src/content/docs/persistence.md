---
title: Persistence
description: Exactly what survives what.
section: computer
order: 2
---

The promise is simple: your home directory survives everything short of you deleting it. The details are worth knowing.

## Two layers

**The home volume.** `/home/suped` is a Docker named volume called `suped-home`. It is separate from the container and the image. Clones, virtualenvs, dotfiles, credentials, browser profiles, `uv tool install`, `npm i -g` with a user prefix, everything under `~/.config` and `~/.local`: all of it lives here.

**The container layer.** Everything else on the filesystem, notably packages you install with `apt`, lives in the container itself.

## What survives

| Action | Home volume | apt packages |
|---|---|---|
| Exit the shell | kept | kept |
| `suped stop` and start again | kept | kept |
| Docker or machine restart | kept | kept |
| `suped reset` | kept | lost |
| `suped rebuild` | kept | lost |
| `suped destroy --yes` | **lost** | lost |
| Upgrading the `suped` package | kept | kept, until you `reset` |

In practice you'll reset rarely, so apt installs are effectively permanent. But if you're setting up something you never want to redo, prefer your home: `uv tool install`, `npm i -g` after `npm config set prefix ~/.local`, a tarball under `~/.local`, a virtualenv.

## Upgrading

A new `suped` version may ship a new image. When that happens, the CLI tells you the container was created from an older image and suggests `suped reset`. Your home is untouched either way. Until you reset, you keep running the old image.

## Backup

It's a Docker volume, so back it up like one:

```sh
docker run --rm -v suped-home:/home/suped -v "$PWD":/backup ubuntu \
  tar czf /backup/suped-home.tgz -C /home/suped .
```

And restore into a fresh one:

```sh
docker volume create suped-home
docker run --rm -v suped-home:/home/suped -v "$PWD":/backup ubuntu \
  tar xzf /backup/suped-home.tgz -C /home/suped
```

Move that tarball to another machine, restore it, run `npx suped@latest`, and you're where you left off.

## More than one computer

Set `SUPED_CONTAINER` and `SUPED_VOLUME` to run separate computers side by side:

```sh
SUPED_CONTAINER=client-a SUPED_VOLUME=client-a-home npx suped@latest
```

Each one has its own home and its own state. The image is shared.
