---
name: 'sweep-workspace'
description: 'Walk every ProphetsWay repository in the workspace and run the v2 grounding and documentation route one repository at a time, checkpointing between each. The on-demand substitute for background crawling.'
agent: 'Vanguard v2'
argument-hint: 'Optionally limit to specific repositories, or say "audit only" for a read-only pass'
---

Run the grounding and documentation route across the whole workspace, one repository at a time.

## Discovering the Scope

**Do not assume a repository list.** Enumerate the workspace folders at the start of the run and derive
the scope from what is actually there:

- A **repository root** is a workspace folder containing its own `.git`. Include every one of them,
  including a repository that is still an empty stub — a stub with no `AGENTS.md` is a grounding
  target, not a skip.
- **Exclude every non-repository customization root**, such as the VS Code user prompts folder. It is a
  workspace folder and it is not a repository; folding it in produces analysis of the toolbelt in the
  middle of a product sweep, and it corrupts any run root derived from the set.
- Skip anything the caller excludes.

## Ordering

Order by **evidence, not by a remembered ranking**. For each repository, read its artifact ledger —
`docs/repo-profile.md`, `docs/purpose-and-scope.md`, `docs/feature-requests.md`, `README.md`,
`CHANGELOG.md` — and sort:

1. Repositories with **missing** ledger artifacts.
2. Repositories with **stale** artifacts, where the artifact's last commit predates the last commit
   touching source.
3. Repositories whose ledger is **current** — these get one all-clear line and no delegations at all.

A maturity ranking written into this file goes stale the first time a sweep succeeds. Derive it each
run.

## Per Repository

Read that repository's `AGENTS.md` **first**. It records purpose, layout, and the deviations already
known. Do not re-report a documented deviation as a discovery — the value of this sweep is finding what
is *not* already written down.

This is a **documentation and grounding sweep, not a build cycle.** Delegate only:

- `Repo Analyst v2` — grounding and diagnosis, including dependency, packaging, and framework debt. It
  is read-only on source and reports debt without applying it.
- `Purpose Refiner v2` — the scope gate, and the only agent that may change a feature-request status.
- `README Author v2` — the root `README.md`, where it is missing or stale.
- `Changelog Author v2` — only where a repository's changelog is behind its released state.

**No mutation route runs in this sweep.** Do not open a build lap, do not scaffold, do not delegate
`Modernizer v2`, and do not delegate `Repository Operator v2`. Diagnosis belongs to `Repo Analyst v2`;
applying what it finds is a separate, owner-approved run. If the caller says **audit only**, run the
grounding leg for every repository and stop — write no README, propose no status change, and make no
repository write at all.

## Between Repositories

**Attended — the default.** Stop after each repository and report before starting the next. Ask whether
to continue, skip ahead, or stop. Never cross a repository boundary without a checkpoint; a long
unattended run produces a pile of output nobody reviews.

**Unattended.** Continuing across repository boundaries without a checkpoint requires an explicit
`Vanguard v2` run envelope naming the allowed repositories, allowed paths, required checks, required
reviews, and a stop time. Without one, the attended rule above applies and the run checkpoints.
Reaching an envelope ceiling is a normal `PARTIAL` / `BUDGET` ending, not a failure.

## Watch For Cross-Repository Issues

These span repositories and no single-repository agent will catch them. Record what you actually
observe this run, with the repository and the evidence — never a remembered figure:

- Solutions or projects that appear in more than one repository, whether by submodule, vendoring, or
  copy, and whether the copies have diverged.
- Test dependency and tooling versions that differ across repositories where a single version would do.
- Assertion or test libraries that diverge from the convention in `AGENTS.shared.md`, noting which
  repository carries which, and whether the convention or the code is the thing that should move.
- Target framework sets that contradict the standard in `AGENTS.md`, and any repository with a ratified
  exception, which is not drift.
- Packaging metadata present in one repository and an empty stub in another.
- Anything a shared `Directory.Build.props`, `.editorconfig`, or `Directory.Packages.props` would fix
  once for every repository.

## Final Report

After the last repository, produce a workspace-level summary:

- A table of repositories processed, files written, and outcome, with `Outcome` / `Reason` /
  `Continuation` for the run.
- **Cross-repository findings** — patterns no single repository would reveal, each with its evidence.
- A ranked list of the highest-value fixes across the workspace, with the repository each belongs to
  and the agent that owns applying it.
- Any change that should be promoted into `prophets-pipelines/conventions/AGENTS.shared.md`, followed
  by a reminder to run `/sync-agents-md`.
