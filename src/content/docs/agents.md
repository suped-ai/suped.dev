---
title: Agents
description: Give your agent a workspace with tools and accounts ready.
section: agents
order: 1
---

Suped supplies a prepared workspace for the agent you choose. After [setup](/docs/tools), it can use your selected CLIs—such as `glab`, `vercel`, and `neon`—alongside the shell, Git, Python, Node, and browser tools. Optional [MCP connections](/docs/mcp) add services through the agent client's own integration support.

## Check before handing it over

Run these in the host terminal:

```sh
npx suped@latest tools
npx suped@latest exec gh auth status
npx suped@latest exec wrangler whoami
npx suped@latest exec supabase projects list
```

Run the checks for the tools you selected. They inspect account access; they do not create resources. A successful login does not necessarily grant permission to every organization, project, or action.

## From outside

An agent running on your host can use `exec` for commands in the workspace. Install Suped globally on the host with `npm i -g suped@latest`, then configure the agent's command tool to run:

```sh
suped exec gh auth status
suped exec 'ls -la ~/projects'
suped exec 'cd ~/projects/my-app && git status'
```

Replace the project name with your own. Without a global installation, use `npx suped@latest exec` as the command prefix. Configuration of the command tool depends on your agent; Suped does not automatically redirect a host agent's other filesystem or browser tools into the container.

Each command starts in `/home/suped/workspace`. Use absolute paths or an explicit `cd` for work elsewhere. A single quoted string runs as a shell command; separate arguments are forwarded as arguments to the executable.

## From inside

Setup can install Codex or Claude Code in the persistent home. From the host:

```sh
npx suped@latest setup codex
npx suped@latest exec codex
```

Use `claude` instead of `codex` for Claude Code. Your account or subscription is separate from installing the client. You can also install another agent using its own instructions. Put user tools under `~/.local` so they survive a reset; for an npm global install inside the workspace, first run `npm config set prefix ~/.local`.

The agent runs beside the selected tools and account configuration. Follow its login instructions too: connecting service accounts does not authenticate your model provider. Setup offers MCP registration after a guided agent installation; see [MCP connections](/docs/mcp) to configure it later.

## Give it the job

The short operating brief is available through `npx suped@latest prompt` on the host and `/etc/suped/prompt.md` inside the workspace:

```text
You are operating a persistent Linux computer on behalf of the user.

You have access to the shell, filesystem, installed applications, and
explicitly connected services.

Use the computer to accomplish the user's objective. Inspect the
environment, install dependencies when appropriate, write scripts, use
APIs and CLIs, and preserve useful work in the filesystem.

Ask the user only when you need information, authentication, or approval
for a consequential action.
```

Add the actual objective, for example:

```text
Build a project dashboard in ~/projects/dashboard.
Create a GitHub repo and deploy the app to Cloudflare Pages.
Return the repo URL and live app URL.
Save the code and run instructions in the workspace.
```

For an app that needs a database, select Supabase, Neon, Turso, or PlanetScale and include your requirements in the objective. Use GitLab and a different hosting provider in the same way. The brief describes the environment; it does not replace the agent's own required configuration.

## Continue with another agent

Another agent in the same workspace can inspect the same saved code, tools, and account configuration. Unsaved conversation context does not transfer. Leave run instructions and remaining work in an ordinary project README so the next agent can pick it up.

Credentials remain subject to the service's expiration, revocation, and account permissions. Use `login` again when needed. Browser sessions persist only when your browser code explicitly saves a profile under `/home/suped`; see [the computer](/docs/the-computer#playwright).
