---
title: Persistence
description: Exactly what survives what.
section: computer
order: 2
---

Your home directory lives in a Docker volume, separate from the container. Files and configuration saved there survive container recreation. Running processes and the rest of the container filesystem do not.

## Three layers

**The home volume.** `/home/suped` is a Docker named volume called `suped-home`. It is separate from the container and the image. Clones, virtualenvs, dotfiles, credentials, browser profiles, `uv tool install`, `npm i -g` with a user prefix, everything under `~/.config` and `~/.local`: all of it lives here.

**The container layer.** Everything else on the filesystem, notably packages you install with `apt`, lives in the container itself.

**The image.** The base tools, and whatever [optional software](/docs/the-computer) you baked in with `--with`. Your selection is part of the image tag, so recreating the container reproduces it.

## What survives

| Action | Home volume | Baked-in features | apt packages |
|---|---|---|---|
| Exit the shell | kept | kept | kept |
| `suped stop` and start again | kept | kept | kept |
| Docker or machine restart | kept | kept | kept |
| `suped reset` | kept | kept | lost |
| `suped rebuild` | kept | kept | lost |
| `suped destroy --yes` | **lost** | kept (the image remains) | lost |
| Upgrading the `suped` package | kept | kept | kept, until you `reset` |

Scheduled jobs survive too, but not because of where they live: a user's crontab sits in `/var/spool/cron`, which is the container and not the home volume. `reset` reads it out and puts it back, the same way it carries ports and mounts, so a `suped reset` does not quietly stop your schedule.

This is why a browser, a C toolchain, and ffmpeg are image features rather than things setup installs for you. They are system packages, and the apt column is the reason: installed into a running container, they would vanish the first time you reset — which is the ordinary way to upgrade.

Change what is baked in with `suped rebuild --with browser` or `--without`; `reset` and `rebuild` keep your existing selection when you pass neither.

Prefer home installs for tools you want to keep: `uv tool install` (with the `python` selection), a tarball under `~/.local`, or a virtual environment. For npm tools, first use `npm config set prefix ~/.local`, then `npm i -g`. Tools selected through the setup already install under `~/.local` explicitly.

The setup selection and the vendor CLIs' saved authentication stay in your home too. Services can expire or revoke credentials independently of those files; reconnect when needed.

## Ports and extra mounts

Suped 0.3.0's `reset` and `rebuild` preserve existing published ports and extra mounts by default, including those recovered from a 0.1.0 container. Passing `-p` replaces the whole published-port list and retains mounts; passing `-v` replaces the extra-mount list and retains ports. Repeat the flag to supply several entries.

Files in a host bind mount live on the host, outside `suped-home`. They are not included in a home-volume backup and are not removed by `destroy --yes`.

## Upgrading

A new `suped` version may ship a new image. When that happens, the CLI tells you the container was created from an older image and suggests `suped reset`. Your home is untouched either way. Until you reset, you keep running the old image.

To upgrade a 0.1.0 workspace to 0.3.0, save running work in your home and run the current CLI from your host:

```sh
npx suped@latest reset
npx suped@latest setup
```

Reset builds the new image if it is missing, then replaces the container using the existing home volume, ports, and extra mounts. If the image build fails, the existing container is kept. Home files and saved credentials remain; reset stops running processes and replaces changes outside the home, including apt installs. `rebuild` runs an image build before the same reset operation, using Docker's cache unless you add `--no-cache`.

Keep your existing `SUPED_CONTAINER` and `SUPED_VOLUME` settings when using custom names. An explicit `SUPED_IMAGE` overrides the image shipped with the CLI; update or unset it to move to the 0.3.0 image. A global CLI installation can be updated with `npm i -g suped@latest` before using `suped reset`.

## Moving to another machine

A workspace is defined by the tools you selected, the ports and mounts it was created with, and the repositories in it. `sync` writes exactly that to a small JSON file:

```sh
suped sync                          # what defines this workspace, and what would not move
suped sync save workspace.json      # write it; "-" prints to stdout
suped sync restore workspace.json   # on the other machine
```

Run `suped sync` before you travel. It names every repository with uncommitted changes, commits that are not on a remote, or no remote at all — the work a move would leave behind — and exits non-zero if it finds any.

The file contains no credentials, so connect accounts on the new machine with `suped login <tool>`. `restore` does not copy the home volume: it reinstalls the selected tools, so they are built for the architecture they land on, and clones each project from its remote. Existing directories are never overwritten. Ports and mounts are fixed when a container is created, so `restore` prints the `suped reset` command to apply them.

Baked-in features are not part of the file. Recreate them on the other machine with `suped --with browser` when you create the computer there.

## Account access

`sync` carries no credentials, by design. Moving them is a separate command you have to mean:

```sh
suped secrets                      # what can travel, and what has to be redone
suped secrets key                  # this workspace's identity
suped secrets save secrets.age     # seal what can travel
suped secrets restore secrets.age  # on the other machine
```

The sealed file is encrypted with [age](https://age-encryption.org) and is safe to commit. **The identity is not.** It lives at `~/.config/suped/credy.key`, it is the one thing you move between machines yourself, and anything holding it can open every secret inside. Lose it and the sealed files cannot be opened.

It is a keypair rather than a passphrase because `age -p` reads from the terminal and fails when there is not one, which is exactly the situation an agent works in.

Where a provider can hand its credential over, Suped uses the provider's own path rather than copying files — `gh auth token` and `gh auth login --with-token`, for instance, because `gh` keeps its token in the system keyring on machines that have one and in a config file on machines that do not. Providers are added one at a time, each verified against a real login, so `suped secrets` tells you plainly which ones travel and which you will sign into again.

### What the store holds

The store lives at `~/.config/suped/secrets.age`, in the home, so it survives a reset. Entries have a kind:

| Kind | What it is |
|---|---|
| `token` | A credential a tool can be signed back in with. |
| `email` | A mailbox you already own. |
| `account` | An account at a service: the address it was signed up with, username, password, second factor, recovery codes, and any key issued later. |

```sh
suped secrets list              # what is there, and what is waiting on you
suped secrets show resend       # secrets hidden; add --reveal to print them
suped secrets set resend        # one entry as JSON on stdin
suped secrets remove resend
```

An account is a record rather than a single secret because a signup leaves more than one thing behind. Keeping only "the key" loses the password, the second factor, the recovery codes, and which mailbox the confirmation went to — everything you need the day something goes wrong.

Accounts reference an `email` entry rather than an address invented for the occasion. A mailbox you already own is one you can still get into next year.

### When a service will not let an agent sign up

Some will not, and being banned is a worse outcome than being asked. In that case the account is recorded as **pending**, with what it still needs:

```
  x-com               account   x    — WAITING ON YOU: password, API key from the developer portal
```

Finish the signup yourself, then replace the entry with the real one. From that point it is an ordinary account that any machine holding the identity can use, and the record keeps whether a person or an agent created it.

Suped does not sign anyone up. Your agent does that with a browser and a shell, the way you would; Suped holds the mailbox to do it with, records what came back, and gives the ones you had to finish somewhere to live.

## Backup

To copy a home volume byte for byte, including its saved logins, back it up while the workspace is stopped so agents and applications are not changing it. The following commands use a POSIX shell and the default volume/container names:

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
