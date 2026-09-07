---
title: Commands
description: The whole CLI fits on one screen.
section: reference
order: 1
---

## Commands

| Command | What it does |
|---|---|
| `suped` | Open a shell in your computer. Creates it on first run. |
| `suped up` | Start the computer without attaching. |
| `suped exec <command...>` | Run a command line inside, in `~/workspace`, as a login shell. |
| `suped status` | Show image, home volume, and container state. |
| `suped stop` | Stop the container. Home is kept. |
| `suped reset` | Recreate the container from the current image. Home is kept, apt installs are not. |
| `suped rebuild` | Rebuild the image, then reset. Add `--no-cache` to start from scratch. |
| `suped destroy --yes` | Remove the container **and** the persistent home. |
| `suped prompt` | Print the system prompt. |
| `suped --version` | Print the version. |
| `suped --help` | Print this table, roughly. |

## Options

Used when the container is first created, and by `reset` and `rebuild`:

| Option | Meaning |
|---|---|
| `-p, --publish <host:container>` | Publish a port. Repeatable. |
| `-v, --volume <host:container>` | Mount an extra host path. Repeatable. |

Both are passed straight through to `docker run`, so anything Docker accepts works.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `SUPED_CONTAINER` | `suped` | Container name. Change it to run several computers. |
| `SUPED_VOLUME` | `suped-home` | Home volume name. |
| `SUPED_IMAGE` | `suped-computer:<version>` | Image tag. Point it at your own build. |

## exec

`suped exec` joins its arguments into one shell line and runs it with `bash -lc`, so quoting, pipes, and environment work as they would in a shell:

```sh
suped exec 'cd projects/app && npm test 2>&1 | tail -20'
```

Stdin is forwarded when it isn't a terminal, so you can pipe into the computer:

```sh
cat notes.md | suped exec 'cat > workspace/notes.md'
```

The exit status is the command's exit status.

## Exit codes

`suped` exits 0 on success, 1 on any error, and with the inner command's status for `exec` and the shell.
