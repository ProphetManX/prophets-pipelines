---
name: 'sweep-workspace'
description: 'Walk every ProphetsWay repo in the workspace and run the analyze -> refine -> document workflow one repo at a time, checkpointing between each. The on-demand substitute for background crawling.'
agent: 'Repo Docs Lead'
argument-hint: 'Optionally limit to specific repos, or say "audit only" for a read-only pass'
---

Run the documentation workflow across the whole workspace, one repository at a time.

## Scope

Process in this order — lowest-maturity first, so the biggest wins land early:

1. `ProphetsWay.Utilities` — no pipeline, empty packaging metadata, EOL frameworks, unclear purpose
2. `ProphetsWay.Hasher` — empty packaging metadata, legacy standalone pipeline
3. `prophets-pipelines` — two-line README documenting the build system everything else depends on
4. `ProphetsWay.Logger` — healthy, but the widest EOL framework spread
5. `ProphetsWay.Example` — reference implementation, duplicated inside EFTools
6. `ProphetsWay.BaseDataAccess` — healthy, but has no test project
7. `ProphetsWay.EFTools` — healthiest; use it as the reference for what "good" looks like

Skip any repo the user excludes. If the user says **audit only**, run phase 1 (analysis) for every
repo and stop — write no README, make no refinement proposals.

## Per Repo

Read that repo's `AGENTS.md` **first**. It records purpose, layout, and a list of already-known
deviations. Do not re-report a documented deviation as a new discovery — the value of this sweep is
finding what is *not* already written down.

Then run the standard three phases: `repo-analyst`, `purpose-refiner`, `readme-author`, checkpointing
with the user between each.

## Between Repos

Stop after each repo and report before starting the next. Ask whether to continue, skip ahead, or
stop. Never run more than one repo without a checkpoint — a long unattended run produces a pile of
output nobody reviews.

## Watch For Cross-Repo Issues

These span repositories and no single-repo agent will catch them. Note any evidence you encounter:

- `ProphetsWay.Example` exists both standalone and vendored inside `ProphetsWay.EFTools`. Track
  whether the two copies have diverged.
- Test dependency versions range from `Microsoft.NET.Test.Sdk` 16.0.1 to 17.13.0, and
  `FluentAssertions` 5.10.3 to 8.2.0. Note the spread.
- Target framework sets that contradict the standard in `AGENTS.md`.
- Packaging metadata that is present in one repo and an empty stub in another.
- Anything that would be fixed once and for all by `Directory.Build.props`, `.editorconfig`, or
  `Directory.Packages.props` — none of which exist anywhere yet.

## Final Report

After the last repo, produce a workspace-level summary:

- Table of repos processed, files written, and outcome
- **Cross-repo findings** — patterns no single repo would reveal
- Ranked list of the highest-value fixes across the whole workspace, with the repo each belongs to
- Any change that should be promoted into `prophets-pipelines/conventions/AGENTS.shared.md`,
  followed by a reminder to run `/sync-agents-md`
