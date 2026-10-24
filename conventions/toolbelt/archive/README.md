# Agent Suite Archives

This directory contains historical customization generations only. VS Code does not discover files
from the repository archive.

## Current suite

The active source of truth is [`agent-suite-v3/`](../../agent-suite-v3/). Its personal install
places six agents in `%COPILOT_HOME%\agents\` (default `%USERPROFILE%\.copilot\agents\`),
seven skills in `%USERPROFILE%\.agents\skills\`, and registers the local `pw-journal` MCP server
in `%COPILOT_HOME%\mcp-config.json` (default `%USERPROFILE%\.copilot\mcp-config.json`). The journal and
read-only dashboard runtime data live under `%LOCALAPPDATA%\ProphetsWay\AgentSuite\v3\`.

The v3 install and dashboard launch scripts are in the source tree. A change to agents, skills,
reporting contracts, or the journal is reviewed and verified there before installing; the flat v2
mirror is no longer the active source and must not be populated with v3 copies.

## Retired generations

| Generation | Contents | Status |
| --- | --- | --- |
| `v1/` | 26 agents, two prompt snapshots, and its original manifest | Historical rollback material |
| `v2/` | 30 agents, the two owned prompt files under `prompts/`, `generation.json`, and `SHA256SUMS.txt` | Archived and removed from the live selector |

The v2 archive preserves the exact pre-cutover bytes. Its generated manifest covers the archived
agents, prompts, and metadata; the manifest does not hash itself. Do not edit an archived generation
except to repair corruption proven against the original source. A desired behavior change belongs in
the current v3 source, not an old snapshot.

## Rollback safety

Restoring a generation requires an explicit suite-maintenance decision and a complete compatibility
review. Never copy an archive over the current installation or load v2 and v3 together. A rollback
must validate its archive manifest, restore one complete generation, and preserve unrelated personal
skills and customizations. The archive is not an install source for routine updates.
