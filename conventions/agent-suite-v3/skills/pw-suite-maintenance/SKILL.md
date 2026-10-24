---
name: pw-suite-maintenance
description: "Maintain or extend the versioned ProphetsWay Copilot agents, skills, journal reporting contract and installation. Use when changing agent definitions, suite policy, MCP tools, journal schema, dashboard or retiring/restoring a generation."
user-invocable: false
---
# Suite Maintenance

Use an ordinary fresh chat or Lead session with this skill. The installed specification is
`%LOCALAPPDATA%\ProphetsWay\AgentSuite\v3\specification.md`; adjacent `runtime.json` records
the source checkout containing `specification.md`. No permanent Toolbelt Keeper is required.

1. Locate suite source, installed user copies, active customizations and generation status. Read the v3 specification and relevant runtime documentation.
2. Confirm no active run depends on the definitions/reporting contract being changed. Do not mutate an in-flight assignment.
3. Change the smallest coherent source set. Keep role/tool/visibility boundaries in agent files; procedures in skills; actual project behavior in approved project contracts; reporting mechanics in MCP implementation and schemas.
4. Report-contract or SQLite changes require a versioned, tested, backward-compatible migration or a clearly documented explicit migration plan. Runtime worker tools never change the live schema.
5. Preserve unrelated personal skills, MCP servers, user agent files, and user mcp.json settings. Install only owned PW files.
6. Validate YAML frontmatter, skill name/folder equality, worker allowlists and exact tool names. Run the focused service/skill tests and syntax checks.
7. Test the actual target runtime's discovery and delegation. File existence or a reload alone is not proof the selector loaded the correct set.
8. For generation cutover, first archive and verify the whole current generation. Remove only the exact owned old definitions after the replacement is installed and loaded. Preserve unrelated agents and keep archive files outside discovery paths.
9. Reconcile installed copies to versioned source by file list and SHA-256. Reopen changed outputs and report limitations.
10. When changing shared repository instructions, edit `conventions/AGENTS.shared.md` once and
    synchronize only its generated block into the named repositories' `AGENTS.md` files.
    Preserve repository-specific prefix/suffix bytes and unrelated pending edits. Check existing
    differences before regeneration; conflicting changes need reconciliation, not overwrite.
    Do not revive retired role names or require a fresh human message for every already-approved
    worker turn. A documentation rollout never renews an old product assignment.

Never write credentials, expose private conversations in the journal, install a self-modifying schema mechanism, delete unarchived generations, or treat prose-only agent boundaries as operating-system isolation. Prefer small additive migrations and retain a rollback path.
