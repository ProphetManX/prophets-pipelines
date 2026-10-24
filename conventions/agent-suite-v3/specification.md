# ProphetsWay Agent Suite v3

**Purpose:** a candid design colleague, a requirements-bounded TDD delivery team, a bug
investigator that diagnoses without fixing, and useful visibility into unattended work.

## Product principles

1. The owner has final say over product behavior. Design discussion is collegial and candid:
   ask relevant probing questions, identify contradictions, explain tradeoffs, and do not invent
   objections or alternatives merely to appear helpful.
2. Delivery implements the smallest complete solution to the approved behavior. It does not add
   speculative validation, restrictions, abstractions, providers, or environment preflights.
   Guard a real contract, safety property, or evidenced material risk. Preserve legitimate uses
   beyond the examples.
3. Public library hardening means correct behavior at genuine boundaries, not an unnecessarily
   narrow interpretation of what consumers may do. The Logger design and accepted requirements
   remain authoritative; this policy does not weaken them.
4. TDD separates specification authorship from implementation. New behavior is specified against
   the approved requirements, tested for a meaningful behavioral failure, independently reviewed,
   implemented, and reverified. The implementer never edits tests to make a result green.
5. Review is independent. No agent approves its own artifact. Passing tests are evidence, not proof
   that requirements or tests are correct.
6. Bug investigation establishes expected/observed behavior, reproduction, evidence, cause and
   confidence. It does not implement the production fix.
7. Unattended delivery continues through independent approved work. It records unresolved product
   decisions and parks dependent work instead of inventing product semantics or waiting for an
   owner overnight.
8. Scope, risk and evidence are proportionate. Mechanical repairs continue within the approved
   target. Repeated unchanged failures require a new hypothesis and a materially different plan.
9. User interface, journal or reporting availability is never a product-quality gate unless the
   approved assignment explicitly makes it one. Report infrastructure errors honestly.

## Roles and visibility

| Display name | Responsibility | Picker |
|---|---|---|
| `PW - Lead` | Owns an approved assignment, progress, bounded delegation, continuation and final reconciliation | Yes |
| `PW - Design` | Product and architecture discussion with the owner; prepares decisions and requirements | Yes |
| `PW - Investigate` | Evidence-led bug reproduction and diagnosis; no production fix | Yes |
| `PW - Tests` | Approved behavioral specifications and test-project fixtures/setup | No |
| `PW - Build` | Approved production contracts and implementation, configuration, examples and assigned docs | No |
| `PW - Review` | Independent review of requirements, tests, code, security concerns and evidence | No |

Tests, Build and Review are never interchangeable merely because the artifact type changes.
Each assignment names the author, allowed paths, acceptance revision, checks, reviewer and
operational limits. The Lead does not authorize new product requirements, approve its own
work, publish releases, or turn a suggestion into owner approval.

## Artifact ownership

- Design records approved behavior, boundaries and unresolved decisions. It does not write
  production code.
- Tests owns tests, test fixtures and explicitly scoped test-project configuration. It does not
  change production code.
- Build owns the explicitly scoped production declarations and implementation, implementation
  project configuration when approved, examples and assigned documentation.
- Review receives immutable artifact/revision references and reports findings; it does not edit
  what it reviews or replace an independent specialist gate.
- Lead owns assignment-level state and decisions already delegated by the owner, not product
  implementation or review artifacts.
- A schema or report-protocol revision is ordinary reviewed software maintenance, never a
  runtime reporter's self-directed alteration.

## TDD and completion semantics

1. Select a coherent slice of approved observable behavior.
2. Confirm its existing requirements, contract details, scope, risks and working baseline.
3. Tests writes the necessary discriminating specifications and isolated fixtures.
4. Review independently audits requirement traceability and whether an incorrect implementation
   could pass. A genuine contradiction with approved requirements goes to Tests for a justified,
   reviewed correction; a desired behavior change returns to Design/owner approval.
5. Build implements the target, runs focused checks and fixes ordinary local implementation
   mistakes without widening the target.
6. Review independently reviews implementation and material risks. Lead confirms actual required
   evidence and records the slice outcome.
7. If blocked, isolate the dependent work and continue independent approved slices. Stop only when
   complete, at a real assignment limit, or when no authorized ready work remains.

Do not require an artificial red for an already sufficient existing specification. A compile error
alone is not behavioral red. Zero executed tests, stale evidence, unexplained skips, failures, or a
missing required review are not green.

## Reporting contract

Reporting revision 2 uses SQLite schema version 2. Existing calls remain valid. Maintenance
explicitly migrates v1 databases with a backup; worker tool calls never migrate a live database.
Historical events and evidence remain unchanged and receive only nullable/default metadata.

- Workers send short factual milestones to the local MCP journal. Do not report private model
  reasoning, credentials, full prompts, indiscriminate tool output, or secrets.
- Start, assignment, meaningful phase, review, blocker, completion claim, failure and interruption
  are meaningful reporting events. Routine keystrokes and every trivial correction are not.
- The runtime/journal keeps each event append-only. Corrections are new events.
- `review_returned` accepts a separate optional `review_verdict` (nonempty text, at most 160
  characters), including a Lead relay. Work `status` is not a review verdict; omitted verdicts
  remain unspecified rather than being inferred from prose. Other event types reject a verdict.
- Test evidence defaults to `expected_outcome: pass`. Intentional RED uses `expected_outcome: red`
  and a nonempty `expectation_note` (at most 500 characters) naming the expected failures and reason.
  RED is supported only for `test_result`. A mechanically observed RED requires a Failed TRX,
  nonzero complete execution, actual failures, consistent counters and no skipped tests.
  Missing/malformed/zero/skipped/inconsistent or unexpectedly passing results remain gaps.
  Observed expected RED is not a passing result or independent verification of exact failure
  identities; it never substitutes for separate passing test evidence in a completion claim.
- A completion claim is persisted even when incomplete; the response identifies specific gaps.
  Missing evidence must not disappear from the view.
- Unless a slice explicitly supplies another evidence policy, a completion claim requires both a
  mechanically passing, nonzero test result and a review artifact reference. The journal checks
  artifact presence and basic TRX counters; it does not determine review quality or independently
  verify the reported work. Required-evidence gaps apply to completion claims, not routine progress.
- The journal distinguishes `recorded`, `claimed`, `gaps`, and `review-reported`. It never asserts
  product correctness from a status string or a successful SQL insert.
- A test result can be mechanically checked for file availability, parseability, execution count,
  failures and skips. An artifact reference does not prove that a reviewer considered its contents
  or that it covers the approved requirements.
- MCP and dashboard access are localhost-only. The SQLite database lives in per-user local
  application data and is not checked into a product repository.
- The browser is read-only. Every five seconds it refreshes the run list and selected details;
  the selected run survives reload through the URL fragment. Registered invocations appear
  before their first event, clearly distinguished from last-reported worker status.
  It shows the objective, a summary of where things stand (latest report, slice status, claimed and
  attached evidence kinds), a timeline with one bar per worker invocation, and a newest-first event
  feed whose rows expand to full text, gaps and evidence references; opening it does not launch or
  authorize engineering work.
- The feed groups a delegated worker's exchange and reports into one expandable item, ordered by
  its latest event. All original events remain available inside the item and in a raw-events view.
  Worker identities, reporters, verdicts, gaps and evidence are preserved; grouping does not
  rewrite historical data or convert reporter status into a review decision.
- Dashboard/API failure is reported as observability failure. It does not fabricate activity,
  silently mark an incomplete slice green, or erase completed product evidence.
- Keep schema and validation policy migrations versioned, reviewed and explicit. Runtime workers
  cannot execute arbitrary SQL or change the schema.

## Runtime and retirement

- Copilot user agents are installed under `$COPILOT_HOME/agents` (default `~/.copilot/agents`);
  MCP uses the native user `mcp-config.json` and `mcpServers` object, not the legacy Local
  profile configuration. Lead delegates through native `task`, not a Local-only subagent tool.
  Portable personal skills use
  `~/.agents/skills`. Logger is the first repository pilot.
- Only Lead, Design and Investigate appear in the picker. The three workers are delegation-only.
- The dashboard opens explicitly at `http://127.0.0.1:47831/`.
- Preserve v1/v2 history outside discovery paths. Verify v3 files, MCP registration, three visible
  agents, three available worker definitions, local report roundtrip, and dashboard rendering
  before removing old live v2 files.
- Never delete unrelated VS Code agents or personal skills. Current v2 agents/prompts are archived
  as one exact generation before their live source copies are retired.
- First Logger task is a fresh, time-bounded M5 Microsoft bridge slice derived from approved
  requirements. Old task/run folders, deadlines, evidence, and pending dashboard edits remain
  historical; do not reactivate them.
