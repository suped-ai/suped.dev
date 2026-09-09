---
title: Persistence
description: Exactly what survives what.
section: computer
order: 2
---

Your home directory lives in a Docker volume, separate from the container. Files and configuration saved there survive container recreation. Running processes and the rest of the container filesystem do not.

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

Prefer home installs for tools you want to keep: `uv tool install`, a tarball under `~/.local`, or a virtual environment. For npm tools, first use `npm config set prefix ~/.local`, then `npm i -g`. Tools selected through the setup already install under `~/.local` explicitly.

The setup selection and the vendor CLIs' saved authentication stay in your home too. Services can expire or revoke credentials independently of those files; reconnect when needed.

## Ports and extra mounts

Suped 0.2.0's `reset` and `rebuild` preserve existing published ports and extra mounts by default, including those recovered from a 0.1.0 container. Passing `-p` replaces the whole published-port list and retains mounts; passing `-v` replaces the extra-mount list and retains ports. Repeat the flag to supply several entries.

Files in a host bind mount live on the host, outside `suped-home`. They are not included in a home-volume backup and are not removed by `destroy --yes`.

## Upgrading

A new `suped` version may ship a new image. When that happens, the CLI tells you the container was created from an older image and suggests `suped reset`. Your home is untouched either way. Until you reset, you keep running the old image.

To upgrade a 0.1.0 workspace to 0.2.0, save running work in your home and run the current CLI from your host:

```sh
npx suped@latest reset
npx suped@latest setup
```

Reset builds the new image if it is missing, then replaces the container using the existing home volume, ports, and extra mounts. If the image build fails, the existing container is kept. Home files and saved credentials remain; reset stops running processes and replaces changes outside the home, including apt installs. `rebuild` runs an image build before the same reset operation, using Docker's cache unless you add `--no-cache`.

Keep your existing `SUPED_CONTAINER` and `SUPED_VOLUME` settings when using custom names. An explicit `SUPED_IMAGE` overrides the image shipped with the CLI; update or unset it to move to the 0.2.0 image. A global CLI installation can be updated with `npm i -g suped@latest` before using `suped reset`.

## Backup

Back up the home volume while the workspace is stopped so agents and applications are not changing it. The following commands use a POSIX shell and the default volume/container names:

```sh
docker stop suped
docker run --rm -v suped-home:/home/suped:ro -v "$PWD":/backup ubuntu \
  tar czf /backup/suped-home.tgz -C /home/suped .
```

And restore into a fresh one:

```sh
docker volume create suped-home
docker run --rm -v suped-home:/home/suped -v "$PWD":/backup ubuntu \
  tar xzf /backup/suped-home.tgz -C /home/suped
```

Move that tarball to another machine, restore it, and start Suped there. This restores your home files and compatible user-installed tools. It does not restore apt packages, running processes, host-mounted files, or port/mount configuration. Use a compatible image and architecture, recreate needed settings, and check account access after migration.

The archive includes any credentials saved under your home. Store it with the same care as the workspace itself.

## More than one computer

Set `SUPED_CONTAINER` and `SUPED_VOLUME` to run separate computers side by side:

```sh
SUPED_CONTAINER=client-a SUPED_VOLUME=client-a-home npx suped@latest
```

Each one has its own home and its own state. The image is shared.
