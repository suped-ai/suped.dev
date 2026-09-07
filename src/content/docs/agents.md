---
title: Agents
description: Handing the computer to something other than you.
section: agents
order: 1
---

suped doesn't ship an agent. It ships the computer. Any agent that can run a shell command can use it, and any agent you install inside it inherits everything that's already there.

## The prompt

Tell the agent what it has. This is the entire system prompt suped recommends, and it's the same text at `/etc/suped/prompt.md` inside the box:

```
You are operating a persistent Linux computer on behalf of the user.

You have access to the shell, filesystem, installed applications, and
explicitly connected services.

Use the computer to accomplish the user's objective. Inspect the
environment, install dependencies when appropriate, write scripts, use
APIs and CLIs, and preserve useful work in the filesystem.

Ask the user only when you need information, authentication, or approval
for a consequential action.
```

`suped prompt` prints it so you can pipe it wherever your agent takes a system prompt. Add the objective. Resist adding more.

## Two ways in

**From outside.** The agent runs on your machine and reaches into the computer with `suped exec`. Any agent framework with a shell tool can do this; give it `suped exec` as the shell and it never needs to know Docker exists.

```sh
suped exec 'ls projects'
suped exec 'cd projects/app && git status'
```

**From inside.** Install the agent's CLI in the computer and run it there. Now the agent, its auth, its config, and its work all live in the persistent home together.

```sh
npx suped@latest
npm config set prefix ~/.local
npm i -g <your-agent-cli>
<your-agent-cli> login
```

Log in once. It's still logged in next month.

## Hot-swapping

Because the state is in the computer rather than in the agent, swapping agents is uneventful. Two agents, or two models, or two versions of the same tool, all see the same repos, the same `.env` files, the same installed tools, the same browser profile. Nothing to migrate, nothing to re-explain.

The same goes for machines. [Back up the volume](/docs/persistence#backup), restore it somewhere else, and the new machine has the same computer.

## Credentials

Things you authenticate inside the box stay inside the box: `gh auth login`, `aws configure`, `npm login`, a `.env` you drop into a project. They persist in `/home/suped` like everything else.

Treat the computer accordingly. It's a real machine with real access, and the point is that an agent can use that access without asking you to re-enter it every time. Give it what the job needs. Keep the rest out.

## Ports

An agent that starts a dev server inside will want you to see it. Publish the port when creating the computer:

```sh
npx suped@latest -p 3000:3000
```

Or reach it from another container on the same Docker network by name, `suped`.
