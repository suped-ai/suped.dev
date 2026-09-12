---
title: MCP connections
description: Add first-party service connections to the agent you run in Suped.
section: agents
order: 2
---

Suped can register official remote MCP servers in the agent client inside your workspace. This gives an agent access to services such as project trackers, design files, documentation, and databases through the client's normal tools.

Choose the services you use. Guided setup offers this optional step after installing Claude Code or Codex. You can add connections later:

```sh
suped mcp list
suped mcp add notion linear --client claude
```

These commands are included in Suped **0.3.0**. The examples use the `suped` shorthand after `npm i -g suped@latest`; replace it with `npx suped@latest` if you prefer to run without a global installation.

## Available services

Every catalogue entry uses the provider's hosted HTTP endpoint. Accounts, permissions, and plan limits are controlled by that provider.

| Connection | Useful for | Provider documentation |
| --- | --- | --- |
| `notion` | Pages, databases, and workspace knowledge | [Notion](https://developers.notion.com/guides/mcp/get-started-with-mcp) |
| `linear` | Issues, projects, and comments | [Linear](https://linear.app/docs/mcp) |
| `atlassian` | Jira and Confluence in Atlassian Cloud | [Atlassian](https://atlassian.github.io/atlassian-mcp-server/) |
| `figma` | Design context and supported canvas operations | [Figma](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) |
| `sentry` | Errors, performance, and issue investigation | [Sentry](https://mcp.sentry.dev/) |
| `stripe` | Stripe account data and payment integration tools | [Stripe](https://docs.stripe.com/mcp) |
| `neon` | Postgres projects, branches, and queries | [Neon](https://neon.com/docs/ai/neon-mcp-server) |
| `supabase` | Projects, SQL, functions, and development tools | [Supabase](https://supabase.com/docs/guides/ai-tools/mcp) |
| `vercel` | Projects, deployments, logs, and analytics | [Vercel](https://vercel.com/docs/agent-resources/vercel-mcp) |

Figma and Vercel require a supported client; Claude Code, Codex, and Cursor are listed by both providers. Atlassian organization policies apply, and Jira Service Management needs its separate API-token setup. Stripe authorization distinguishes account and sandbox/live access. Neon recommends development and testing environments. The Neon, Supabase, Linear, and Sentry documentation explains narrower project or read-only configurations.

## Connect through Claude Code

Install the client, register services, and authorize each one from an interactive host terminal:

```sh
suped setup claude --skip-auth
suped mcp add notion linear --client claude
suped exec claude mcp login notion --no-browser
suped exec claude mcp login linear --no-browser
```

Open the authorization URL in your host browser. When the browser returns to a localhost URL it cannot reach, copy that complete URL from the address bar into the prompt in Claude Code. The client handles the authorization code. This is Claude Code's documented flow for environments without a local browser; no port publishing is needed. [Claude Code authentication](https://code.claude.com/docs/en/mcp#authenticate-from-the-command-line)

Run `suped login claude` to sign into the agent itself if needed, then `suped exec claude`. Use `/mcp` to confirm which services are connected before giving it work.

## Connect through Codex

```sh
suped setup codex --skip-auth
suped mcp add neon figma --client codex
suped exec codex mcp login neon
suped exec codex mcp login figma
suped exec codex mcp list
```

Suped adds validated server entries to `~/.codex/config.toml`; OAuth starts when you run the client's login command. Run `suped login codex` to sign into the agent if needed. Server login and agent login are separate. [Official OpenAI documentation](https://developers.openai.com/codex/mcp/)

Codex's browser callback listener runs inside the container. A localhost redirect opened on your host cannot reach that listener automatically. If the browser ends on a localhost connection error while Codex is still waiting, open a second Suped shell and relay the complete callback URL to the waiting listener:

```sh
suped
```

Inside that shell:

```sh
read -r -s -p 'Paste the localhost callback URL: ' callback
printf '\n'
curl --fail --silent --show-error -- "$callback"
unset callback
```

Paste the URL into the shell prompt, not a chat message. Return to the first terminal to confirm login completed. This relay uses the client's existing local callback; provider or client versions may require a different callback configuration. Suped does not automatically forward OAuth ports.

## Export for another client

```sh
suped mcp export notion figma --client cursor
suped mcp export notion linear --client claude
suped mcp export neon sentry --client codex
```

Export prints a fragment: Cursor JSON, Claude Code JSON, or Codex TOML. Merge the chosen entries into existing client configuration, then authorize them in that client. Cursor uses `.cursor/mcp.json` in a project or `~/.cursor/mcp.json` globally. Export does not install Cursor, change files, or transfer another client's authorization.

## What is saved

Claude Code registrations use user scope in `~/.claude.json`. Codex registrations use `~/.codex/config.toml`. These are inside the persistent home by default, so they survive stop, reset, and rebuild. Authentication is managed by the client and provider; account access may expire or be revoked. Client configuration directory overrides still apply.

Existing server names are preserved. Suped reports the duplicate instead of replacing it, including when its URL differs. Inspect the client's configuration to change an existing connection. Codex configuration with an inline `mcp_servers = {...}` table or a symlink needs manual configuration; Suped leaves it intact.

`suped mcp list` shows available connections. Successful registration means the client knows where to connect. Confirm account access in `/mcp` or through a small read operation before asking the agent to use the service. Installed service CLIs remain independently useful; authenticating a CLI does not automatically authenticate its MCP server.

## Other services

The catalogue grows when there is a documented, usable setup path. Asana's v2 MCP server and HubSpot's generic remote server require a pre-registered OAuth app and client credentials. Their native client instructions are available for manual setup: [Asana](https://developers.asana.com/docs/connecting-mcp-clients-to-asanas-v2-server), [HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server).

For repository work, start with the selectable GitHub or GitLab CLI in [workspace tools](/docs/tools). GitHub's remote MCP setup for Codex requires separate token configuration. [GitHub MCP instructions](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-codex.md)
