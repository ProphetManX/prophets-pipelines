# Dashboard Reporting Pilot v1

**Scope:** explicitly opted-in new runs only. **Participants:** Vanguard v2, Implementer v2,
and Code Reviewer v2. The owner approved preparing this bounded pilot and explicitly confirmed
all agents idle on 2026-10-03. That maintenance approval starts no product run, renews no deadline,
and grants no product, Git, release, installation, or operation authority.

This document supplies the narrow reporting exception referenced by protocol section 10. Existing
author boundaries, required independent reviews/checks, budgets and approval rules remain intact.
All other agents retain ordinary Markdown reporting. Do not widen this roster by putting another
display name in a task packet. Toolbelt Keeper remains outside the project run.

## Ownership And Storage

| Artifact | Writer | Purpose |
| --- | --- | --- |
| `<repository>/ai-dashboard/live/project.json` | Vanguard, only under explicit pilot metadata authority | Persistent milestone/slice forecast and immutable invocation registrations |
| Exact current-run `Record artifact:` JSON | Its registered Implementer or Code Reviewer invocation only | Canonical status, outcome, authored report body, evidence references and help/review exchanges |
| Exact current-run `Report artifact:` Markdown | The deterministic publisher only | Compatibility projection for existing readers and validation bindings; never a second authored narrative |
| `ai-dashboard/data/pilot-data.js` and `pilot-publication-state.json` | The deterministic publisher only | Human-readable dashboard projection and publication integrity state |
| Existing `run.md`, immutable targets/approvals, original evidence and legacy reports | Their existing owners | Authority, budgets, operations, historical records and unchanged validation |

The project ledger does not duplicate run-control histories or approvals. Link the existing run
authority. The canonical record's `body` carries the report its author's charter already requires;
the helper supplies standard lifecycle headers. No agent manually edits a compatibility report,
another invocation's canonical record, publisher cache, schema, or publisher implementation.

The JSON schema is [scripts/agent-dashboard.schema.json](scripts/agent-dashboard.schema.json).
The publisher is [scripts/AgentDashboard.cjs](scripts/AgentDashboard.cjs); its offline checks are
[scripts/Test-AgentDashboard.cjs](scripts/Test-AgentDashboard.cjs). These are shared scripts, not
a new agent, registered skill, evidence engine or source of execution authority.

## Readiness And Opt-In

Vanguard must verify all of these before using the pilot in a newly authorized run:

1. The owner-approved target/envelope explicitly permits `Reporting mode: dashboard-pilot-v1`,
   the exact project-ledger path, each canonical/compatibility report path, and starting/stopping
   the narrowly scoped publisher. The normal product scope, authors, required gates and deadline
   remain separately authorized. This customization session is not that project-run authority.
2. Resolve installed Node and Ajv without installing anything during an unapproved run. Pin and
   inspect publisher/schema/tool identities under the normal input-freshness procedure. They
   may not change during the run. Missing tools or approval stop dependent pilot work.
3. Confirm the selected validation/report readers accept the generated standalone `State`,
   `Record status`, `Outcome`, `Reason`, `Continuation` and required author-body fields. Standard
   headers alone do not establish compatibility with every custom validator. Protect finalized
   canonical and derived inputs when a gate consumes them. Mutable planning/status outputs are
   operational metadata, not a substitute acceptance input.
4. Reuse an already compatible check route. If a frozen setup would need changing, stop that
   dependency for the existing explicit setup-revision/independent-audit route. Never relax a
   parser, replace a bound report or rebaseline a failure merely to use this pilot. Keep that
   workstream on its authorized legacy route unless a proper new revision is approved.
5. Enumerate and create only the authorized current-run canonical-record directories, register
   exact paths/identities, and start the publisher before delegating a pilot leaf. The ledger
   must name its actual repository and direct-child external run directories. It cannot read
   unrelated repositories, adopt another author's report or invent missing approval.

Each pilot leaf packet adds these fields to the normal complete packet:

```text
Reporting mode: dashboard-pilot-v1
Dashboard project: <absolute repository>/ai-dashboard/live/project.json
Invocation ID: <stable unique registration ID>
Record artifact: <absolute current run>/<unique invocation>.json
Report artifact: <absolute current run>/<unique invocation>.md
```

Its registration must match the exact agent display name, run ID, stable project-wide slice ID,
target revision and both paths. `Report artifact:` remains mandatory; in this mode it names the
generated compatibility output, not the leaf's write location. Absent opt-in means the existing
protocol without this exception. Missing/mismatched pilot fields are `BLOCKED / PROTOCOL`, not
permission to fall back mid-invocation or author both formats.

## Canonical Lifecycle

The leaf reads AGENTS, the protocol, this document and its approved inputs. It authors a valid
`STARTED` JSON record before substantive work, with its actual objective and activity and null
outcome/reason/continuation. This replaces its ordinary STARTED Markdown write, not its checks.
The original minimum scope/check declaration remains required: `scopeDecision`, included/excluded
`scope`, and `plannedCheck` are typed fields, not optional narrative or new author-selected gates.

Update the same JSON at meaningful phase changes: starting validation, a blocker, a help/review
request, or an actual scope transition. Do not emit records on each compiler correction, token,
file save or speculative thought. Record observable work and decisions, not private reasoning.
The leaf keeps the same implementation ownership and ordinary local repair policy.

After the required checks, finalize that same record once: `state: FINALIZED`, non-working
activity, the actual outcome/reason/continuation, evidence references and the full required
report in `body`. A failed/partial result remains so; publication is not acceptance. The final
chat still leads with the ordinary outcome fields and links both canonical and compatibility
paths. If generated output is missing or stale, report that limitation; never claim publication
or hand-author the missing Markdown. Vanguard can reconcile by one authorized publisher pass.

Finalized canonical bytes and their generated report are immutable. Corrections/recovery use a
new registered invocation, retaining the old result and consumed budgets. Published communication
entries are append-only even before finalization; add a response or correction with a new ID.
The publisher rejects changed owners/targets, removed registrations/entries, changed finalized
records, unowned/tampered reports, wrong reply participants, schema failures and path escapes.
These checks are not a filesystem sandbox or proof the author's substantive claims are true.

## Work Plan And Exchanges

Vanguard records known milestones and slices, keeping progress separate from activity. Stable
slice IDs survive evening/run boundaries; invocation IDs identify attempts, not extra completed
features. Each slice links its milestone, requirements, dependencies, owner and evidence.

Forecasts are explicitly tentative. `forecastTotal: null` and `breakdownComplete: false` mean
the total remains TBD. Never manufacture a count or quietly omit remaining approved work.
A complete breakdown must account for its known slices; an evidence reference is required for
a completion claim, but Vanguard must still independently establish the actual required gates.

Help/review entries name a unique ID, recipient, specific scope, concern and message. Review
requests also explain the changed area/delta, including the prior review/baseline reference in
`evidence`, or an explicit initial-review statement in `delta`. The author's worry is a focus,
not permission to ignore other concrete affected risks or waive required whole-change checks.

Vanguard remains the router. Requests do not invoke another agent, grant writes or grant new
approval. It carries the request ID, canonical source and exact scope into the receiver's normal
packet. A participating receiver writes a `reply` in its own record with `replyTo` referencing
the original request. A reply is not automatically a resolved finding or accepted review.
Legacy participants remain on their normal reporting route; link their reports without forging
a structured reply on their behalf. The dashboard exposes exchanges and evidence links rather
than hiding them in orchestration logs.

## Publisher Operations

Vanguard's only added terminal exception is this exact trusted entry point, with the approved
absolute ledger path and `--once` or `--watch`. No inline script, arbitrary Node program, child
command, installer, product validator, Git action or service follows from this exception.

```powershell
& $approvedNode $approvedPublisher --project $approvedProjectLedger --watch
```

`--watch` is an owned long-running local file watcher, not a web server. Use an asynchronous
terminal, record its handle in run control, and stop only that owned publisher at pause/sign-off.
Do not infer activity from stale STARTED records or stop another process. `--once` is a one-shot
publication/reconciliation operation. Publication writes only registered generated reports and
the fixed dashboard data/cache paths; it executes no recorded commands or product checks.

Input changes are debounced, validated and published. Invalid input stops the watcher and leaves
the last accepted snapshot available. A failed/uncertain publication blocks dependent evidence
consumption until reconciled; no automatic workaround, report overwrite or silent retry follows.
The exclusive publication lock rejects overlap; a stale lock is inspected rather than deleted
automatically. Never remove the integrity cache to adopt or rewrite existing reports.

The page refreshes its pilot view from the local published file. Its timestamps describe recorded
updates, not an agent heartbeat; stale updates remain visible. Older finalized details become
compact archive references after three days, while communications and original canonical/Markdown
records remain accessible. Nothing is deleted by this presentation boundary or by stopping a watcher.
Run retention and independent review obligations remain the existing protocol's responsibility.

## Acceptance And Rollout

Offline validation covers schema rejection, exact path/owner/target binding, append-only exchanges,
finalized immutability, generated report headers, file-watcher publication, local browser refresh,
slice forecasts and exchange drill-down. These are synthetic tool tests, not a live agent pilot.

The first real pilot is one bounded Logger slice in a separate Vanguard session with fresh authority.
Observe author STARTED/phase/final transitions, a scoped request and independent response, parent
acceptance, accurate idle/blocker state and durable source links. Keep required verification policy
unchanged. Record repeated review scope/reasons and reporting effort for the owner's assessment.
Only after that observation should another scoped maintenance change expand the participating roster
or revise verification policy. Reverting to legacy reporting also uses a new authorized invocation or
run boundary; it never rewrites existing pilot records or their bound gate inputs.
