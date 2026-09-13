---
title: Moving a workspace
description: Take a workspace to another machine, or keep several machines in step.
section: computer
order: 3
---

There are two ways to get a workspace onto another machine. Use `move` for a
one-off. Use `state` when you work from the same few machines all the time.

## Move it once

```sh
suped move save ./my-workspace      # on this machine
suped move restore ./my-workspace   # on the other one
```

`move save` writes a directory with two files in it. Copy that directory across
however you like — a USB stick, `scp`, a private git repo — and run
`move restore` on the other side.

What comes with you:

- the tools you selected, reinstalled for the machine they land on;
- your projects, cloned from wherever they already live;
- your account logins, encrypted;
- **the work you had not finished** — see below.

What does not: the files themselves. Nothing is copied wholesale, which is why a
workspace built on a laptop works on a server with a different processor.

Run `suped move` on its own first to see what would travel and what would not.

## Unfinished work comes too

This is the part people expect to lose. Files you changed but never committed,
files you never added, files you deleted, commits you never pushed — all of it
turns up on the other machine exactly as you left it, still uncommitted.

It travels through git, pushed to a hidden branch on each project's own remote,
so it never touches the branches you work on and never appears in your history.
Your repository is not disturbed on the way out: nothing is stashed, nothing is
checked out, nothing is committed for you.

Use `suped move save --no-work` to leave it behind.

Three things to know:

- **A project with no remote has nowhere to put its work.** `move` tells you
  which ones, rather than pretending.
- **Work only lands where there is nothing to lose.** If the project on the far
  machine has its own uncommitted changes, is on a different branch, or has
  moved ahead, `move` leaves it alone and tells you where the work is waiting.
- **This is a handoff, not a two-way sync.** The machine you left keeps its
  copy — suped never deletes unfinished work anywhere. Hand off in one
  direction, and commit or discard before you hand back.

## Keep several machines in step

If you regularly use a laptop and a server, put the workspace's definition in a
git repository and let each machine catch up with it.

```sh
suped state init git@github.com:you/my-workspace.git   # once on each machine
suped state sync                                        # catch up, then publish
suped state                                             # what differs, changing nothing
```

`state sync` installs any tool and clones any project the shared definition has
and this machine does not, records what this machine has, and pushes. `git log`
on that repository is the history of your workspace.

Most of the time there is nothing to resolve. If you added Go on one machine
and Python on another, you end up with both — that is not a conflict, it is two
additions.

**Ports and mounts are not shared.** A mount points at a folder on one
particular computer, and a published port is about where the workspace is
running rather than what it is. Those stay with the machine.

The repository lives inside the workspace and pushes using the GitHub
connection it already has, so there is nothing extra to sign in to. It holds no
passwords or tokens.

## Your key

Logins are encrypted with a key that stays on your machine and is never part of
anything suped writes out. Without it, the saved logins cannot be opened — by
you or anyone else.

Move it to another machine once:

```sh
suped secrets key --show | ssh other-machine suped secrets key --import
```

Everything else `move` writes is safe to commit anywhere. The key is the one
thing that is not.

## What still needs a sign-in

Account access travels, but only GitHub reconnects on its own today. Most other
services carry a token you can set through `suped secrets env`, and the rest
want a normal sign-in when you arrive:

```sh
suped tools          # what is connected and what is not
suped login vercel   # reconnect one
```

Each service is added only after its sign-in has been proved to survive the
trip against a real account, which is why the list grows slowly.
