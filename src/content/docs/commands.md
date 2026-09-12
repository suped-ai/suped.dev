---
title: Commands
description: Workspace setup, account access, and the container lifecycle.
section: reference
order: 1
---

## Commands

This reference covers Suped **0.2.0**. Install globally with `npm i -g suped@latest` to use `suped` as shown below, or replace that prefix with `npx suped@latest` to run without a global install.

| Command | What it does |
|---|---|
| `suped` | Open a shell. Creates the workspace and offers setup on the first interactive run. |
| `suped up` | Start without attaching; offers setup on the first interactive run. |
| `suped catalog` | Browse optional CLIs by category without starting Docker. |
| `suped setup` | Choose tools and connect accounts interactively. |
| `suped setup gitlab vercel neon` | Install a selected stack and offer each account's sign-in steps. |
| `suped setup github --skip-auth` | Install an explicit selection without sign-in prompts. Use this for unattended setup. |
| `suped tools` | Show tool installation and connectivity status. |
| `suped tools gitlab neon` | Check only the named tools and their account access. |
| `suped login neon` | Connect or reconnect a selected tool; accepts any ID from `catalog`. |
| `suped mcp list` | Browse official remote service connections without starting Docker. |
| `suped mcp add notion linear --client claude` | Register servers in Claude Code inside the workspace; also supports Codex. Account authorization follows in the client. |
| `suped mcp export notion --client cursor` | Print a config fragment for Cursor, Claude Code, or Codex without changing files. |
| `suped exec <command...>` | Run a shell string or executable arguments inside, starting in `~/workspace`. |
| `suped sync` | Show what defines this workspace, and name the work that would not move. |
| `suped sync save <file>` | Write the workspace to a portable file. Use `-` for stdout. |
| `suped sync restore <file>` | Install that workspace's tools and clone its projects here. |
| `suped secrets` | Show which account access can travel to another machine, and which has to be re-authenticated. |
| `suped secrets key` | Create this workspace's encryption identity. |
| `suped secrets save <file>` | Seal the credentials that can travel. The file is safe to commit. |
| `suped secrets restore <file>` | Open a sealed file and sign those tools back in. |
| `suped status` | Show image, baked-in features, home volume, and container state. |
| `suped stop` | Stop the container. Home is kept. |
| `suped reset` | Recreate the container from the current image. Home and baked-in features are kept, apt installs are not. |
| `suped rebuild` | Rebuild the image, then reset. Add `--no-cache` to start from scratch. |
| `suped destroy --yes` | Remove the container **and** the persistent home. |
| `suped prompt` | Print the system prompt. |
| `suped --version` | Print the version. |
| `suped --help` | Print this table, roughly. |

## Options

Used when the container is first created, and by `reset` and `rebuild`. Put container options before `exec`; arguments after `exec` belong to the inner command:

| Option | Meaning |
|---|---|
| `-p, --publish <host:container>` | Publish a port. Repeatable. |
| `-v, --volume <host:container>` | Mount an extra host path. Repeatable. |
| `--with <features>` | Bake optional software into the image: `browser`, `build`, `media`. Comma separated, repeatable. |
| `--without` | Bake none of it in. |

Their values use Docker's publish and volume syntax. Reset and rebuild preserve existing ports and mounts unless you replace a list by passing its flag. `-p` replaces the port list while keeping mounts; `-v` replaces extra mounts while keeping ports.

`--with` behaves the same way: passing it replaces the selection, and leaving it off keeps what the computer already has. Because the selection is part of the image tag, changing it rebuilds a layer rather than installing into the running container — see [the computer](/docs/the-computer) for what each feature costs and [persistence](/docs/persistence) for why it works that way. `--with` is ignored on a computer that already exists; use `suped rebuild --with ...`.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `SUPED_CONTAINER` | `suped` | Container name. Change it to run several computers. |
| `SUPED_VOLUME` | `suped-home` | Home volume name. |
| `SUPED_IMAGE` | `suped-computer:<version>` | Image tag. Point it at your own build. |

## exec

One argument is treated as a shell string and run through `bash -lc`, so pipes, redirects, and shell expansion work inside the workspace:

```sh
npx suped@latest exec 'cd ~/projects/app && npm test'
```

Multiple arguments call the executable with those arguments, preserving flags and argument boundaries:

```sh
npx suped@latest exec gh repo list --limit 5
npx suped@latest exec printf '%s\n' 'hello world'
```

Stdin is forwarded when piped in. This POSIX-shell example writes into the existing workspace directory:

```sh
cat notes.md | npx suped@latest exec 'cat > ~/workspace/notes.md'
```

Each invocation starts in `/home/suped/workspace`; a previous command's `cd` does not carry over. The exit status is the inner command's exit status.

## Exit codes

`suped` exits 0 on success, 1 on any error, and with the inner command's status for `exec` and the shell.
