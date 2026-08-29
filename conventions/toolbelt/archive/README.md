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

**Direction of truth is #1 → #2.** Edit the live file, then mirror it. The only time that reverses is a
restore onto a new machine, or a deliberate generation rollback.

**Files directly under `conventions\toolbelt\` are the current mirror**, and their name set and SHA-256
hashes must match the flat live prompt root exactly. **Files under `archive\` are excluded from that
comparison** — they are a different generation and must never be counted as current-mirror drift.

## Generations

| Generation | Contents | Status |
| --- | --- | --- |
| `archive\v1\` | 26 v1 agents, two generation-specific prompt snapshots under `prompts\`, and `SHA256SUMS.txt` | Retired 2026-08-29. Complete rollback material |
| — current — | The v2 agents and the two prompts, flat in `conventions\toolbelt\` | Active selector generation |
| `archive\v2\` | Created only when a v3 cutover happens | Does not exist yet |
| `archive\v3\` | Same scheme, later | Does not exist yet |

**VS Code never loads the repository archive.** It reads the live prompts folder only, and it does not
recurse into subfolders even there — which is why an archive folder must never be created under
`%APPDATA%\Code\User\prompts\`. A customization placed in a live subfolder disappears from the picker
silently.

## Before a Future v3 Cutover

1. Confirm the flat live selector and flat current mirror agree by name set and hash.
2. Create `archive\v2\` only if it does not already exist. Copy all current root-level `.agent.md`
   files into it, snapshot the two then-current active prompt files under `archive\v2\prompts\`, and
   create a sorted `SHA256SUMS.txt` covering those agents and snapshots. The archive README itself is
   documentation and is outside the manifest.
3. Verify every manifest entry before deleting any current agent file. A missing, extra, or mismatched
   entry aborts the cutover.
4. Remove all current root-level `.agent.md` files from the live root and flat current mirror, then
   install the v3 agents flat in both locations.
5. Update the active prompts, or restore their chosen generation snapshots, flat to both current
   locations. Retarget any prompt whose `agent:` field names an archived agent.
6. Update the documentation in location #4 so no retired generation is described as active.
7. Validate: live and current mirror match 1:1 by name and hash; the archive manifest validates;
   frontmatter model pins and `agents:` allowlists resolve.

## Rollback Is Generation-Atomic

A rollback restores **one whole named generation**, never a mixture. Two generations of the same roster
answering the same request is the failure this scheme exists to prevent — the selector cannot tell a
caller which one it picked.

1. Prefer invoking `Toolbelt Keeper v2`; it must archive the current generation first if its named
   archive is absent. Never overwrite an existing archive folder.
2. Before deletion or restoration, validate the selected archive's `SHA256SUMS.txt` against exactly
   its root agent files and `prompts\` snapshots. A mismatch is a stop.
3. Remove **all** current root-level `.agent.md` files from the live root and the flat current mirror.
4. Restore exactly one selected generation's root agent files, flat, into both current locations.
5. Restore that generation's two prompt snapshots, flat, into both current locations, then update
   documentation and active prompt routing to name only the restored generation.
6. Validate live against the current mirror by root-level name set and hash, validate the restored
   archive manifest again, then confirm the picker.

**Never mix two generations by accident.** If a restore cannot be completed across all locations, put
back the pre-rollback state rather than leaving the roster half-swapped.

## The Archive Is Immutable

Files under `archive\` are corrected only to repair **proven corruption**, verified against this
repository's Git history. A wanted change to an old generation creates a **new** generation instead —
the archive records what shipped, and editing it destroys the only reason to keep it.

## Restoring a Generation

Use `Toolbelt Keeper v2` for a rollback. An emergency manual restore follows the same complete order:
archive the current generation if absent, verify the selected archive manifest, clear all current
root-level agents from live and mirror, restore one generation's root agents and its two prompt snapshots
flat to both, update documentation and prompt routing, then compare live and mirror hashes. It is never
an overlay operation.

**Never restore with a recursive copy from `conventions\toolbelt\`** — that would sweep every archived
generation into the live folder at once and register two rosters in the picker simultaneously. Archive
subfolders are rollback material, never current-mirror files.
