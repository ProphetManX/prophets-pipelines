# Toolbelt Archive — Retired Customization Generations

This folder holds **retired generations** of the ProphetsWay agent toolbelt. Nothing in here is loaded
by VS Code, and nothing in here is part of the current mirror.

## The Four Locations

| # | Path | Role |
| --- | --- | --- |
| 1 | `%APPDATA%\Code\User\prompts\` | **Current live selector.** Flat, no subfolders. What VS Code actually loads |
| 2 | `conventions\toolbelt\*` (flat, this folder's parent) | **Current mirror.** Must exactly match #1 by name set and hash |
| 3 | `conventions\toolbelt\archive\<generation>\` | **Retired generations.** Rollback material only |
| 4 | `conventions\agent-toolbelt.md` and `conventions\agent-toolbelt-v2.md` | **Documentation** |

Registered shared skills extend #1 at `%USERPROFILE%/.agents/skills/<name>/` and #2 at
`conventions/skills/<name>/`. Compare each named bundle by relative file set and SHA-256, separately
from flat prompts. Never sweep unrelated personal skills or put a skill folder beneath live prompts.
The owned set is recorded in `agent-toolbelt-v2.md`.

**Direction of truth is #1 → #2.** Edit the live file, then mirror it. The only time that reverses is a
restore onto a new machine, or a deliberate generation rollback.

**Files directly under `conventions\toolbelt\` are the current mirror**, and their name set and SHA-256
hashes must match the flat live prompt root exactly. **Files under `archive\` are excluded from that
comparison** — they are a different generation and must never be counted as current-mirror drift.

## Generations

| Generation | Contents | Status |
| --- | --- | --- |
| `archive\v1\` | 26 v1 agents, two generation-specific prompt snapshots under `prompts\`, and `SHA256SUMS.txt` | Retired 2026-08-29. Complete rollback material |
| — current — | The v2 agents and two prompts, flat in `conventions\toolbelt\`, plus registered bundles in `conventions/skills/` | Active selector generation and shared skills |
| `archive\v2\` | Created only when a v3 cutover happens | Does not exist yet |
| `archive\v3\` | Same scheme, later | Does not exist yet |

**VS Code never loads the repository archive.** It reads the live prompts folder only, and it does not
recurse into subfolders even there — which is why an archive folder must never be created under
`%APPDATA%\Code\User\prompts\`. A customization placed in a live subfolder disappears from the picker
silently.

## Skill-Aware Snapshots

This extension applies to future archives, not retroactively to v1. The v1 generation remains its
existing root agents, prompt snapshots and 28-entry manifest, with an empty owned skill set.

For a future generation, snapshot each registered bundle under `skills/<name>/`, preserving every
relative asset path. Include those files and a generated `generation.json` record in `SHA256SUMS.txt`
alongside root agents and prompt snapshots. The manifest does not include itself or this scheme README.
The metadata records the generation name, exact owned skill names, and shared dependency identities:
repository-relative paths, mechanically generated SHA-256 values and Git revisions when available.
For the validation skill, include its protocol and AgentEvidence helper/test dependencies. Do not
transcribe hashes, capture secrets, or snapshot unrelated installed skills.

Before clearing any live definitions during restore, verify manifest completeness and compare required
shared dependency identities with the actual resolved files. A mismatch or missing dependency stops
the restore for an owner-scoped compatibility decision; never silently upgrade the archived skill,
overwrite a newer protocol/helper, or activate it against unverified dependencies. A skill-bearing
generation with missing metadata is incomplete, not equivalent to v1's intentionally empty skill set.

## Before a Future v3 Cutover

1. Confirm the flat live selector/mirror and every registered skill pair agree by name set and hash.
2. Create `archive\v2\` only if it does not already exist. Copy all current root-level `.agent.md`
   files into it, snapshot generation-specific prompts under `prompts/` and owned bundles under
   `skills/`, and generate the dependency metadata above. Create a sorted `SHA256SUMS.txt` covering
   exactly those agents, prompt/skill snapshots and `generation.json`.
3. Verify every manifest entry before deleting any current agent file. A missing, extra, or mismatched
   entry aborts the cutover.
4. Remove all current root-level `.agent.md` files from the live root and flat current mirror, then
   install the v3 agents flat in both locations. Replace only the owned skill bundles in their separate
   live/mirror roots with the explicitly selected generation's set; preserve unrelated installed skills.
5. Update the active prompts, or restore their chosen generation snapshots, flat to both current
   locations. Retarget any prompt whose `agent:` field names an archived agent.
6. Update the documentation in location #4 so no retired generation is described as active.
7. Validate: live and current mirror match 1:1 by name and hash; the archive manifest validates;
   registered skill pairs match separately; frontmatter model pins and `agents:` allowlists resolve;
   skill metadata/assets/dependencies are valid. Check selector and skill loading after reload.

## Rollback Is Generation-Atomic

A rollback restores **one whole named generation**, never a mixture. Two generations of the same roster
answering the same request is the failure this scheme exists to prevent — the selector cannot tell a
caller which one it picked.

1. Prefer invoking `Toolbelt Keeper v2`; it must archive the current generation first if its named
   archive is absent. Never overwrite an existing archive folder.
2. Before deletion or restoration, validate the selected archive's `SHA256SUMS.txt` against exactly
   its root agents, `prompts/` snapshots and, where present, `skills/` and `generation.json`. Check
   dependency compatibility before clearing live definitions. A mismatch is a stop.
3. Remove **all** current root-level `.agent.md` files from the live root and the flat current mirror.
4. Restore exactly one selected generation's root agent files, flat, into both current locations.
5. Restore that generation's two prompt snapshots, flat, into both current locations, then update
   only its owned skill bundles in their separate live/mirror roots. Remove current owned bundles not
   present in the selected generation only after the current-generation snapshot is verified. v1
   restores an empty owned skill set, not the current v2 skill. Preserve unrelated skills. Update
   documentation and active prompt routing to name only the restored generation.
6. Validate live against the current mirror by root-level name set and hash, validate the restored
   skill pairs separately and the archive manifest again, then confirm selector/skill loading in
   Diagnostics after reload.

**Never mix two generations by accident.** If a restore cannot be completed across all locations, put
back the pre-rollback state rather than leaving the roster half-swapped.

## The Archive Is Immutable

Files inside a named archive generation are corrected only to repair **proven corruption**, verified against this
repository's Git history. A wanted change to an old generation creates a **new** generation instead —
the archive records what shipped, and editing it destroys the only reason to keep it.

## Restoring a Generation

Use `Toolbelt Keeper v2` for a rollback. An emergency manual restore follows the same complete order:
archive the current generation if absent, verify the selected archive manifest, clear all current
root-level agents from live and mirror, restore one generation's root agents and its two prompt snapshots
flat to both, update documentation and prompt routing, then compare live and mirror hashes. It is never
an overlay operation.

For skill-aware generations, validate dependency compatibility before clearing anything and replace
only the owned skill set from the selected snapshot in its separate roots. Compare its relative-path
hashes as well. This README is the mutable scheme document; no instruction here permits editing an
existing generation or silently mixing current skills with restored agents.

**Never restore with a recursive copy from `conventions\toolbelt\`** — that would sweep every archived
generation into the live folder at once and register two rosters in the picker simultaneously. Archive
subfolders are rollback material, never current-mirror files.
