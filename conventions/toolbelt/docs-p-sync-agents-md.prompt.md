---
name: 'sync-agents-md'
description: 'Regenerate the shared conventions block inside every ProphetsWay repo AGENTS.md from the master copy in prophets-pipelines/conventions/AGENTS.shared.md. Run after editing the master.'
agent: 'agent'
tools: [read, search, edit]
model: ['Claude Sonnet 4.5 (copilot)', 'GPT-5 (copilot)']
argument-hint: 'Optionally name specific repos to sync; defaults to all'
---

Propagate the shared conventions block to every ProphetsWay repo in the workspace.

## Source of Truth

`prophets-pipelines/conventions/AGENTS.shared.md`. The content to copy is everything between the
`<!-- BEGIN SHARED BLOCK -->` and `<!-- END SHARED BLOCK -->` markers in that file, exclusive of
the markers themselves.

## Targets

Every workspace folder that has an `AGENTS.md` containing `BEGIN SHARED BLOCK`, except
`prophets-pipelines` itself — that repo intentionally links to the master rather than inlining it.

Current targets: `ProphetsWay.BaseDataAccess`, `ProphetsWay.EFTools`, `ProphetsWay.Logger`,
`ProphetsWay.Utilities`, `ProphetsWay.Hasher`, `ProphetsWay.Example`.

## Rules

- **Replace only the region between the markers.** Everything above `BEGIN SHARED BLOCK` (the
  `# AGENTS.md — <Repo>` title) and everything below `END SHARED BLOCK` (the `## This Repo`
  section and its deviations table) is repo-specific and must survive byte-for-byte.
- **Never touch a repo-specific section.** If the shared block now contradicts a repo's deviations
  list, report the conflict — do not resolve it by editing the deviations.
- **Never edit any file other than `AGENTS.md`.** No source, no csproj, no yml.
- If a target repo has no `AGENTS.md`, do not create one silently. Report it and ask.
- If a target's existing block already matches the master exactly, skip it and say so.

## Approach

1. Read the master file and extract the block between the markers.
2. For each target repo, read its `AGENTS.md`.
3. Verify both markers are present and in the right order. If either is missing or duplicated,
   **skip that repo** and report it — a malformed file means a hand-edit happened and overwriting
   would destroy it.
4. Replace the region between the markers with the master content.
5. Re-read each modified file to confirm the repo-specific section below `END SHARED BLOCK`
   is intact.

## Output

A table of results, then a list of anything needing attention.

| Repo | Result |
|---|---|
| ProphetsWay.Logger | Updated |
| ProphetsWay.Hasher | Already current — skipped |
| ... | ... |

Follow with:
- Repos skipped due to malformed or missing markers, and why
- Any conflict between the new shared block and a repo's deviations list
- A reminder of which repos now have uncommitted changes
