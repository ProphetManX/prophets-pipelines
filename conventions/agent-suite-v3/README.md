# ProphetsWay Agent Suite v3

Version-controlled source for the personal ProphetsWay Copilot suite.

## Installation layout

- User agents: `%COPILOT_HOME%\agents\` (default `%USERPROFILE%\.copilot\agents\`)
- User skills: `%USERPROFILE%\.agents\skills\<name>\`
- Installed journal service: `%LOCALAPPDATA%\ProphetsWay\AgentSuite\v3\service\`
- Installed suite specification: `%LOCALAPPDATA%\ProphetsWay\AgentSuite\v3\specification.md`
  (`runtime.json` beside it records the source checkout)
- Private journal database: `%LOCALAPPDATA%\ProphetsWay\AgentSuite\v3\journal.sqlite3`
- User MCP registration: `%COPILOT_HOME%\mcp-config.json` (default `%USERPROFILE%\.copilot\mcp-config.json`), using `mcpServers`
- Versioned suite source: `prophets-pipelines/conventions/agent-suite-v3/`

Run `scripts\Install-V3.ps1` from PowerShell 7 with Python 3.10+ available to install the suite and register its local MCP server.
Repeat installation accepts identical profiles and skill bundles. After reviewing source changes,
use `scripts\Install-V3.ps1 -Update` to replace the six named PW profiles and seven PW skill bundles
(including stale files inside those owned bundles). Other names and MCP servers are preserved.
Use `-MigrateLegacy` once to remove exact matching PW copies from the old VS Code prompts folder
and the owned legacy MCP entry, only after native profile parity is verified. Different legacy
definitions stop migration for reconciliation; no unrelated profile is deleted.
Run `scripts\Open-Dashboard.ps1` to start or open the read-only dashboard at
`http://127.0.0.1:47831/`. The dashboard runs locally and has no external telemetry.
It uses a near-black background with light gray text regardless of the operating-system theme.
After updating Python service code, restart the owned dashboard process before reopening:
an already-running process retains its imported modules. Do not launch a second copy;
the server exclusively owns its listening port on Windows and refuses an occupied port.
Installation adds only the named `PW` agents and skills; other personal skills are preserved.
These are native **Copilot harness** customizations, not legacy Local-harness tool sets.
Start a new Copilot chat after installation so its agent and MCP catalogs are rediscovered.
The three picker entries are `PW - Lead` (normal delivery entry point), `PW - Design`
(requirements discussion), and `PW - Investigate` (diagnosis without production fixes).
Lead delegates the hidden Tests, Build and Review workers through the native `task` tool.
Role boundaries are instructions and scoped assignments, not an OS filesystem sandbox.
Shared repository instructions recognize the same six roles and scoped delegated authority.
Maintain their master in `conventions/AGENTS.shared.md`; regenerate only the shared blocks,
preserving each repository's local instructions.

Installation does not retire v2. The exact v2 selector generation is archived and validated
separately before its old prompt-folder and mirror copies are removed.

## Components

- `agents/`: three picker-visible agents and three delegation-only workers.
- `skills/`: reusable work methods; skills never grant authority or change agent ownership.
- `service/agent_suite/`: dependency-free Python MCP journal and local dashboard API.
- `service/tests/`: isolated automated tests using Python's standard library.
- `scripts/`: installation, dashboard launch, and generation retirement.
- `specification.md`: suite behavior, ownership, journal semantics, and rollout decisions.

The MCP service uses newline-delimited UTF-8 JSON on its binary standard streams, independent
of the Windows console encoding. Journal text and evidence descriptions retain Unicode.

## Verify the service

```powershell
python -m unittest discover -s service\tests -t service -v
.\scripts\Test-Install.ps1
```

The installer checks use isolated disposable user directories and exercise native discovery
paths, repeat installation, conflict refusal, explicit updates and legacy migration.
They do not change your real user configuration.
The report service stores observed claims and mechanical evidence checks. A journal entry is
not a product verification, review approval, permission grant, or completion certificate.
Select a run in the dashboard; its URL fragment preserves that selection across reloads.
Both the run list and selected details refresh every five seconds. Registered workers appear
before their first report; subsequent status and timestamps are last-reported observations,
not heartbeats. Linked handoff events show both participants.

A selected run reads top to bottom as **Where things stand** (latest report, each slice's last
status, evidence kinds and counts), a **Timeline** with one bar per worker invocation grouped by
role (click a bar to list only that worker's events), and an **Activity** feed with the newest
event first. Feed rows expand to full text, gaps and evidence; *Key events only* hides routine
handoffs, starts and review requests. New events appear at the top without moving the row you
are reading.

Reporting revision 2 separates `review_verdict` from the reporter's `status`. A historical
review without structured verdict metadata says **not recorded**; the UI never guesses from prose.
Intentional RED test evidence declares `expected_outcome: red` and an `expectation_note`.
A mechanically observed RED is labeled as expected, not passing, and cannot replace passing
completion evidence. Existing failed or missing evidence is never retroactively relabeled.

Delegations appear as one expandable activity item per worker invocation, containing the original
handoff, start, return and outcome events. **Raw events** restores the full newest-first audit feed.
Every nested event retains its reporter, timestamp, verdict, evidence and gaps.

### Explicit journal migration (v1 to v2)

Stop owned dashboard/MCP processes and finish active assignments before changing the reporting
contract. Install the updated package, then run this maintenance command from its `service` directory:

```powershell
python -m agent_suite.migrate --database "$env:LOCALAPPDATA\ProphetsWay\AgentSuite\v3\journal.sqlite3" --backup "<new-backup-path>"
```

The backup path must not exist. The command makes a SQLite-consistent backup before an additive,
transactional migration. Event IDs, summaries, gaps and evidence results remain unchanged; old
verdicts default to null and evidence expectations to pass/empty note. Migration is idempotent;
unknown schema versions are refused. Worker tools refuse v1 rather than silently migrating it.
New empty journals start at v2. Restart the dashboard and start a fresh Copilot chat so the MCP
process/tool schema and reporting skill are rediscovered. For rollback, stop the updated processes,
restore the backup together with the previous service package, then restart; do not run the old
service against a v2 database.
