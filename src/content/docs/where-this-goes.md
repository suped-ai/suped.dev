---
title: Where this goes
description: Two phases. The agent's computer first, the human layer second.
section: why
order: 2
---

suped is built in two phases, in a fixed order.

## Phase one: the agent's computer

What exists today. A sandboxed, headless Linux environment with the tools an agent needs to do real work for a person: shell, languages, source control, a browser, a home directory that persists. Nothing agent-facing sits on top of it. No harness, no orchestrator, no persona, no memory system, no tool registry.

This phase is about refinement, not features. The measure of success is that an agent dropped into the box can get more done, with less friction, than it could anywhere else. Every improvement here is an improvement to the computer: better defaults, fewer rough edges, tools that are there before they're needed.

The [manifesto](/docs/manifesto) explains why the environment stays this bare.

## Phase two: the human layer

Once the computer is solid, suped builds the abstractions that people need to work alongside their agent. The agent never sees this layer. It keeps working in the same headless box. The layer exists so a person can see what's happening, steer it, and pick it up from anywhere.

Concretely, that means two things:

- **Easier interaction with your agent.** The visual counterpart to what the agent does through APIs and files. The agent updates the calendar; you see the calendar.
- **A truly portable workspace.** The same computer, with everything in it, reachable from any machine you sit down at.

## What won't change

The order. The human layer is built on top of a finished agent environment, not alongside a half-finished one. And the boundary: abstractions go on the human side. The agent gets a computer.
