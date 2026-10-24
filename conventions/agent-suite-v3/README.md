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
