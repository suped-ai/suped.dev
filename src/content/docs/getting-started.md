---
title: Getting started
description: Start a workspace, connect your tools, and hand it to your agent.
section: start
order: 1
---

## Requirements

- Docker Desktop or Docker Engine, with the daemon running and Linux containers enabled.
- Node 18 or newer, for the CLI.
- Your own agent account. Setup can install Codex or Claude Code, or you can bring another client.

## Start your workspace

```sh
npx suped@latest
```

Suped **0.4.0** opens a persistent Linux workspace and guides you through choosing tools, connecting accounts, and adding optional MCP connections.

The first run builds a local image and creates a persistent home. The base image takes about a minute and under a gigabyte. Later runs reuse the image and workspace.

Adding [optional software](/docs/the-computer) costs more, once: `suped --with browser` bakes in Playwright and headless Chromium and takes another minute or so. Leave it off and the base still reads the web with `curl` and `w3m`.

## Choose your setup

The first interactive run offers four choices:

- **Websites and web apps:** choose repositories, hosting, databases, cloud services, payments, and an optional agent client. GitHub and Cloudflare are editable defaults.
- **Data, scripts, and services:** choose repositories, databases, cloud tools, payments, and an optional agent client.
- **Pick from the full catalogue:** select any combination of the available tools.
- **Base workspace only:** start with the Linux environment and its base tools.

Choose GitLab instead of GitHub, Neon instead of Supabase, or Vercel instead of Cloudflare. Select more than one provider in a category if your work needs it. Complete the selected services' sign-in steps, or connect them later. After choosing an agent client, setup also offers optional [MCP connections](/docs/mcp). Your shell then opens in `/home/suped/workspace`.

To run setup again from the host terminal:

```sh
npx suped@latest setup
```

Setup adds tools. Choosing fewer tools later, or choosing the base workspace, does not uninstall tools or remove account configuration already in your home.

For an explicit selection without sign-in prompts:

```sh
npx suped@latest catalog
npx suped@latest setup gitlab vercel neon codex --skip-auth
```

Then connect an account and inspect the workspace:

```sh
npx suped@latest login gitlab vercel neon codex
npx suped@latest tools gitlab vercel neon codex
npx suped@latest exec 'ls -la ~/projects'
```

These are host commands. Exit the workspace shell to return to your host terminal. [Tools and accounts](/docs/tools) explains the sign-in flows and what persists.

## Hand over the workspace

Select an agent client during setup, install another client inside the workspace, or point an external agent's command tool at `npx suped@latest exec`. It will find selected CLIs on PATH and the account configuration in the same home directory. For example, after connecting Codex:

```sh
npx suped@latest exec codex
```

Give it an objective such as building a repo and app with your connected services. [Agents](/docs/agents) shows commands to inspect the environment and a brief you can use. Setup prepares tools and authentication; it does not create repos, projects, or deployments.

## Come back to it

Run the same CLI command again. Your home, files, and installed user tools remain. The container stays up between shell sessions and restarts with Docker unless you stopped it deliberately. Services can expire or revoke authentication; use `tools` to check and `login` to reconnect.

## Ports and mounts

To open an app running inside from your host, publish its port when creating the workspace. To make a host folder available, add a mount:

```sh
npx suped@latest -p 3000:3000 -v /absolute/path/to/data:/home/suped/data
```

Replace the host path with your own. On Windows, use a path such as `C:/data`; quote the whole mount argument if it contains spaces. Have the app listen on `0.0.0.0` inside the container, then open `http://localhost:3000` on the host. Outbound API calls do not need published ports.

Container ports and mounts require recreation to change. Reset keeps the existing lists unless you replace one:

```sh
npx suped@latest reset -p 8080:8080
```

This replaces published ports and keeps extra mounts. Your home survives; apt packages installed after the image was built do not. See [persistence](/docs/persistence).

## Upgrade from 0.1.0

Save running work under `/home/suped`, then use the new CLI to recreate the container and choose your tools:

```sh
npx suped@latest reset
npx suped@latest setup
npx suped@latest tools
```

The 0.4.0 CLI builds its local image if needed before replacing the old container. It reuses your existing home volume, keeping files, home-installed tools, and saved account configuration. It also recovers published ports and extra mounts from a 0.1.0 container. Reset stops running processes and replaces changes outside the home, including apt installs, with the image's contents.

Keep the same `SUPED_CONTAINER` and `SUPED_VOLUME` values if you use custom names. If you set `SUPED_IMAGE`, update or unset that override to use the image shipped with 0.4.0. `rebuild` also keeps the home but rebuilds the image even when it already exists; `reset` is sufficient for this upgrade. See [upgrading and persistence](/docs/persistence#upgrading).

## Optional global install

```sh
npm i -g suped@latest
suped
```

After a global install, use `suped` as shorthand for `npx suped@latest` in the examples. Update that global installation with `npm i -g suped@latest` when upgrading. You can also continue using `npx suped@latest` without a global install.

## Run from source

From the root of a Suped source checkout:

```sh
node ./cli/bin/suped.js
```

The CLI itself has no npm dependencies to install. Append the same commands, such as `setup` or `tools`, when working on the CLI from source.
