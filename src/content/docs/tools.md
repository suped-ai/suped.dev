---
title: Tools and accounts
description: Choose your repository host, deployment platform, databases, and agent clients.
section: start
order: 2
---

Suped **0.2.0** includes the tool catalogue and guided account setup below. Run these commands from your host terminal. See [getting started](/docs/getting-started) for requirements and upgrading an existing workspace.

Suped prepares a workspace around the tools you use. Choose GitHub or GitLab, Cloudflare or Vercel, Supabase or Neon—or combine the services your work needs. Your agent uses their ordinary commands and saved account connections inside the same Linux home.

## Choose your tools

```sh
npx suped@latest catalog
npx suped@latest setup
```

`suped catalog` lists the available CLIs by category without starting Docker. `suped setup` installs your selection and offers to connect each account. The examples use `npx suped@latest`; after `npm i -g suped@latest`, the shorter `suped` command works too.

The guided setup offers websites and web apps, data and scripts, the full catalogue, or the base workspace. Choose providers within each category, select more than one, or enter `none` to skip it. The web workflow suggests GitHub and Cloudflare; those defaults are editable. The first interactive shell or `up` run also offers setup when the workspace has not been configured yet.

Setup adds tools to the workspace. Rerunning it with fewer tools selected, including the base-only choice, does not uninstall existing tools or remove their account configuration.

To specify tools directly:

```sh
npx suped@latest setup gitlab vercel neon
```

For unattended installation, skip authentication:

```sh
npx suped@latest setup github netlify turso --skip-auth
```

Run `login` interactively afterward. Setup installs tools in the workspace, not on your host, and does not create cloud resources or register service accounts.

## Available CLIs

The catalogue contains 17 optional CLIs. The base workspace already includes Git, Node, Python, a browser with Playwright, and other [development tools](/docs/the-computer).

### Repositories

| Selection | Command | Use it for |
| --- | --- | --- |
| `github` | `gh` | [GitHub](https://cli.github.com/manual/): repositories, issues, pull requests, and Git authentication |
| `gitlab` | `glab` | [GitLab](https://docs.gitlab.com/cli/): repositories, merge requests, issues, and CI pipelines |

### Hosting and deployment

| Selection | Command | Use it for |
| --- | --- | --- |
| `cloudflare` | `wrangler` | [Cloudflare](https://developers.cloudflare.com/workers/wrangler/): Workers, Pages, and related services |
| `vercel` | `vercel` | [Vercel](https://vercel.com/docs/cli): web apps, previews, domains, and environment variables |
| `netlify` | `netlify` | [Netlify](https://docs.netlify.com/cli/get-started/): sites, previews, functions, and environment variables |
| `railway` | `railway` | [Railway](https://docs.railway.com/cli): application services, databases, deployments, and logs |
| `fly` | `fly` | [Fly.io](https://fly.io/docs/flyctl/): apps, Machines, volumes, secrets, and logs |
| `render` | `render` | [Render](https://render.com/docs/cli): web services, background workers, databases, and deployments |

### Databases and app backends

| Selection | Command | Use it for |
| --- | --- | --- |
| `supabase` | `supabase` | [Supabase](https://supabase.com/docs/reference/cli/introduction): hosted projects, migrations, and functions |
| `neon` | `neon` | [Neon](https://neon.com/docs/cli): serverless Postgres projects, databases, and branches |
| `turso` | `turso` | [Turso](https://docs.turso.tech/cli/introduction): hosted SQLite and libSQL databases, replicas, and branches |
| `planetscale` | `pscale` | [PlanetScale](https://planetscale.com/docs/cli): managed Postgres and Vitess databases, branches, and deploy requests |

### Cloud infrastructure

| Selection | Command | Use it for |
| --- | --- | --- |
| `firebase` | `firebase` | [Firebase](https://firebase.google.com/docs/cli): Hosting, Firestore, authentication, functions, and projects |
| `digitalocean` | `doctl` | [DigitalOcean](https://docs.digitalocean.com/reference/doctl/): App Platform, Droplets, managed databases, and infrastructure |

### Payments

| Selection | Command | Use it for |
| --- | --- | --- |
| `stripe` | `stripe` | [Stripe](https://docs.stripe.com/cli): payment integration, test data, products, and webhook development |

### Agent clients

| Selection | Command | Use it for |
| --- | --- | --- |
| `codex` | `codex` | [Codex](https://developers.openai.com/codex/cli/): OpenAI's coding agent, running inside your workspace |
| `claude` | `claude` | [Claude Code](https://code.claude.com/docs/en/overview): Anthropic's coding agent, running inside your workspace |

Both clients are optional. You can bring another agent or use a host agent through `suped exec`. Agent accounts are separate from your service accounts. See [agents](/docs/agents) for the handoff and [MCP connections](/docs/mcp) for connecting apps to a compatible agent client.

## Example combinations

These are selections you can make, not separate editions of Suped:

| Work | Example selection |
| --- | --- |
| A web app with hosted Postgres | `gitlab vercel neon` |
| A site with functions and a small database | `github netlify turso` |
| An app using Supabase services | `github cloudflare supabase` |
| A service with background jobs | `gitlab render planetscale` |
| Scripts that manage cloud infrastructure | `github digitalocean` |

Add `stripe` when working on payments, or an agent client if you want it installed inside. You can add another provider at any time with `setup`.

## Connect your accounts

Use accounts you already have with the selected services. Suped runs each vendor's own CLI sign-in flow inside the workspace. Complete the browser or device-code step on your host when prompted.

```sh
npx suped@latest login gitlab vercel neon
```

Some providers need a specific step:

- **Neon:** create an API key in your Neon account settings and paste it into Suped's hidden prompt. Suped passes it through standard input to the Neon CLI, which validates and saves it in its active profile. A valid existing connection is kept.
- **Turso:** connection requires a manual step. Open the workspace with `npx suped@latest shell`, run `turso auth login --headless`, and follow the printed URL and provider instructions for `turso config set token`. Run `set +o history` before pasting a command containing the token. Exit to your host terminal and run `npx suped@latest tools turso` to verify. See [Turso headless mode](https://docs.turso.tech/cli/headless-mode).
- **DigitalOcean:** create a personal access token and paste it into the native `doctl` prompt. Include account read access for the connection check and the permissions your work needs.
- **GitLab:** setup connects GitLab.com using a device code. Accept Git authentication when prompted to let the agent push over HTTPS. Self-managed instances use native `glab auth login --hostname YOUR_HOST --device` and may require instance configuration; Suped's connection check currently targets GitLab.com.
- **Fly.io:** login requires an interactive terminal. Paste the browser's completion code into that terminal if prompted. Deployments can use Fly's remote builders with `fly deploy --remote-only`.
- **Render:** after login, choose the active workspace with `render workspace set` inside Suped before managing services.
- **Stripe:** if the CLI prints an additional command to finish authorization, run it inside the workspace.

The workspace receives the permissions you grant through those services. An agent using the same home can use that access to perform allowed actions. You can inspect, change, or revoke access through the vendor's CLI or account settings. Tokens can expire; persisted configuration does not guarantee a permanent session.

## Check installation and access

```sh
npx suped@latest tools
npx suped@latest tools gitlab vercel neon
npx suped@latest login vercel
```

`suped tools` reports `not installed`, `connected`, or `installed; connection not verified`. Checks use the provider's CLI without creating resources. An unverified connection can mean missing or expired credentials, insufficient access, or a network failure. Use `setup` for missing tools and `login` to reconnect. A verified account connection does not imply access to every organization or project.

The native commands remain available to you and your agent:

```sh
npx suped@latest exec glab auth status
npx suped@latest exec vercel whoami
npx suped@latest exec neon projects list
```

## What stays in the workspace

Tools install under `/home/suped/.local`, with commands available in `~/.local/bin`. Provider configuration and installed agent clients share the persistent home. Suped records tool selections separately from provider credentials; each vendor manages its own account configuration.

Your home survives shell exit, stop/start, reset, and rebuild. System packages installed with apt after the image was built do not survive reset or rebuild. Removing the home with `destroy --yes` removes its tools and local credentials. Removing local credentials does not revoke previously issued credentials at the provider; use the provider's account controls when you want revocation. See [persistence](/docs/persistence).

## Supabase cloud and local development

The installed CLI can work with hosted Supabase projects. Supabase's local development stack requires its own Docker environment; it is not bundled here, and Suped does not mount the host Docker socket into the workspace. Installing the CLI alone does not make `supabase start` available as a working local stack.

## After setup

Give your agent the objective and access to this workspace. It can use the installed CLIs to inspect your accounts, prepare a repo, build an app, and deploy when you authorize those actions. [Agents](/docs/agents) shows how to hand it over.
