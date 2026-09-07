---
title: Manifesto
description: Give the agent a computer.
order: 6
---

## Give the agent a computer

AI is remarkably capable. We keep surrounding it with abstractions designed for weaker models.

suped begins with a simpler premise: give the agent a real computer, tell it what you want, and get out of the way.

## Build an environment, not a personality

We do not need a `soul.md` to make software useful. We need a shell, files, programs, credentials, persistence, and a clear objective.

suped will not confuse lore with capability.

## No personas. No harnesses. No skill packs.

Every layer we put between a capable model and a real machine is a bet that the model can't be trusted with the machine. Personas to shape it, instruction files to constrain it, harnesses to hold it, skills to teach it the obvious. Each layer is a place for things to go wrong, and each one has to be maintained, explained, and carried to the next tool.

Take the layers away and what's left is the thing that actually works: a competent operator, a computer, and an objective.

## The system prompt

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

That is practically the whole philosophy.

## Let Linux be Linux

Start with a container or a lightweight VM. Give it a persistent home:

```
/home/suped/
  workspace/
  projects/
  downloads/
  .config/
```

Don't invent a special filesystem abstraction. Give the agent normal tools: bash, python, node, git, curl, wget, jq, sqlite, ffmpeg, ripgrep, unzip, a browser.

If more is needed, the agent can add it. As you work, the workspace's capabilities grow with you. Switching computers or switching agents doesn't mean starting over.

## What suped is

A persistent computer, and a command that puts you or your agent in front of it.

That's it. That's the product.
