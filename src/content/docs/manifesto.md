---
title: The idea
description: Prepare a useful workspace, then let the agent use it.
section: why
order: 1
---

## Give the agent somewhere to work

A capable agent still needs tools, files, dependencies, and access to the services involved in its job. Preparing that environment should be easy to repeat, and the useful setup should still be there tomorrow.

Suped provides a persistent Linux workspace. You choose the tools, connect your accounts, and tell your agent what you want to build.

## Use the tools that already exist

Use `gh` for GitHub or `glab` for GitLab. Choose the CLI for your hosting and database providers. Connect apps through the agent client's native MCP support when that is the useful interface. The agent can inspect help, run commands, write scripts, and save its work in ordinary files.

Suped curates working installation and connection paths, with defaults you can change. Setup installs the tools and guides you through authentication. The resulting workspace stays usable from a shell, by your agent, or by another agent later.

## Keep the operating brief small

Describe the environment and the objective. Let the agent inspect the computer and use the programs available to it. A project can keep its run instructions and unfinished work in a README; it does not need a Suped-specific persona or memory format.

Different agents have their own configuration and requirements. Suped supplies the workspace they operate in rather than a new agent runtime.

## Make setup easier for people

The first step is a CLI that prepares tools and account access well. Later, a visual interface can guide people through the same setup, including creating and connecting service accounts.

The agent keeps using the same Linux tools and filesystem. [Where this goes](/docs/where-this-goes) describes the order; [getting started](/docs/getting-started) describes what you can run now.
