# Owner Decision Profile R1

**Owner:** G. Gordon Nasseri (ProphetManX). **Revision:** R1. **Recorded:** 2026-09-21.
**Basis:** the stand-in interview in the Toolbelt Keeper conversation, questions Q01-Q10 and the
owner's additional design, documentation and learning preferences. The owner authorized creation and
wiring after those answers and confirmed the other agent window had finished working.

This is a decision reference, not a personality diagnosis, an imitation of the human, a set of BPA
requirements, or a grant of operation authority. It distinguishes confirmed preferences from contextual
examples and tentative conclusions. See [the delegation protocol](agent-protocol-v2.md#owner-delegation).

R1 remains fixed after this maintenance. Future owner-approved learning creates a new revision;
previous runs retain their exact path/revision and generated SHA-256 identity. Never silently replace a
run's pinned profile. Toolbelt Keeper maintains profile revisions in a separate idle maintenance session.
This document is a shared protocol dependency, not an auto-loaded instruction or a new skill bundle.

## How To Apply It

- Current explicit project decisions and the approved target take precedence over general preferences.
  Conflicting or ambiguous authority needs the owner; do not choose whichever sentence permits progress.
- A preference helps choose within approved design and delegated decision classes. It does not grant
  files, operations, a new workflow, changed acceptance, a waived review or extra time.
- Distinguish a desired outcome from its implementation, cost concern and permission to build it.
  Hypothetical interview examples are not settled product requirements.
- Do not ask again about an unchanged settled decision. Do ask about a new responsibility, consequential
  coupling, missing policy or an exception the profile does not resolve.
- State the applicable rule ID, source question and concrete consequence. Recommendations are inputs
  to judgment, not votes or presumed approval. No numeric confidence threshold creates authority.

## Confirmed Preferences

### P01 - Owner Designs The System

The owner wants to understand and design major components, their interfaces and how workflows fit
together, while delegating coding. Human comprehension and future debugging are goals. AI may support
that understanding, but code must remain maintainable by humans rather than requiring AI to interpret it.

Within a discussed design, independently reviewed names/signatures and routine members may be delegated.
A whole new kind of interaction, responsibility or behavioral promise needs the owner. Member count is
not a useful proxy: a small signature can change architecture, while several members may express an
already-approved capability. This preference alone does not change a contract author's write grant.

**Sources:** additional design thoughts; Q08.

### P02 - Personal Review Usually Does Not Stop Progress

After component A satisfies required independent reviews and verification without major design
problems, work may start on already-designed component B while the owner's personal code review waits.
That review supports understanding and sanity checking; expected tweaks are usually inside A, not its
coupling with B. Explicit owner hold points still bind. Unresolved required reviews or design changes
cannot be relabeled as a pending personal review to keep moving.

**Source:** Q08, selection A with the design-completion conditions.

### P03 - Prefer Shared Implementations

Strongly prefer removing duplication, including near-duplicates whose meaningful differences can be
expressed through a few clear parameters. Some added complexity or learning effort is acceptable when
it produces genuine reuse, reduces code footprint and improves the design. Do not default to duplicate
methods just because the shared form takes more explanation. Human-readable does not mean never clever.

Useful abstractions need intuitive names, focused explanation and appropriate tests. This is not a
request for speculative frameworks or an unrelated refactor during a bounded fix.

**Source:** Q07, selection B.

### P04 - Documentation Matches Its Job

Use intuitive variable/function names and concise inline comments. About seven words expresses a
glanceable-comment preference, not a word-count rule or a ban on explaining complex logic. More involved
abstractions can justify more explanation. README/Markdown and public interface documentation may be
substantial when teaching usage and contracts. Avoid repetitive large comment blocks in implementations.

**Sources:** additional documentation thoughts; Q07's clarification about clever/shared code.

### P05 - Urgency Depends On Actual Users And Severity

When nobody is blocked, prefer the correct forward design over a temporary fix that will soon be
removed. For a live application, a major user blocker can justify restoring service with a bounded
patch before the durable fix. A small bug may remain until the proper fix is ready. Evaluate current
impact, time to restore, time to fix and risk; the age or historical adoption of another library is not
evidence about today's incident. Neither urgency nor this preference grants production access.

**Source:** Q02, selection C with the live-user and severity distinctions.

### P06 - Recovery Respects Intended Ownership

Recovery depends on the utility's purpose, importance and consequences. Prefer explicitly chosen
retry behavior rather than universal automatic retries. A deliberately limited quick-start fallback
can be appropriate; silently changing a developer's intentionally configured destination is different.

The Logger example: defaults help before the developer establishes real destinations; a permitted
alternate default location may be tried. Failure of a developer-configured file destination should
throw so the developer can handle their chosen environment. This is not a general one-retry policy,
permission to relocate configured output, or a replacement for the project's detailed failure rules.

**Source:** Q01, qualified selection C.

### P07 - Optional Features Must Earn Their Complexity

Consider optional diagnostics and similar features when credible risks justify them, including risks
forecast during design rather than already observed incidents. Keep overhead, library complexity and
consumer obligations small. Optionality helps but does not make a feature free.

The BaseDataAccess decision reflected the owner's long practical experience with a small, stable
contracts surface. Do not generalize it into "never diagnostics" or require every new project to wait
for a production failure. Material new scope still needs its own approval.

**Source:** Q03, between A and C rather than an unconditional selection.

### P08 - Teaching Projects Keep Choices Explicit

Favor visible, explicit setup and implementation selection in teaching code. Supporting more choices
does not by itself justify hiding selection in environment/configuration lookup. Personal historical
convenience is not the standard for a teaching artifact. Distinguish consumer-runner convenience from
changes to the teaching project; do not invent a separate runner merely to apply this preference.

**Source:** Q04, leaning A after clarifying the Example/EFTools purpose.

### P09 - Preserve Conditional Decisions And Their Alternatives

Record "choose X because P; prefer Y if P is absent" as a condition and named alternative, not a
permanent dislike of Y. Within explicit run delegation, verified evidence disproving P may permit the
stand-in to choose the already-stated Y. Quote the original branch and the evidence; do not infer a
branch from an explanation that never offered one. An unconditional rejection still needs the owner.

**Source:** Q05, selection B. No tool refusal or missing operation approval is a conditional preference.

### P10 - Learn Reasons Without Repeated Interrogation

Use concrete questions and observable examples. Capture the owner's reason and exception along with
the answer. If the reason is missing, ask one focused follow-up rather than a broad personality question;
do not ask "why" again when the answer already explains it. Learn from corrections and accepted
recommendations, especially cases where a recommendation was rejected.

Distinguish a correction to one decision from a general rule. New generalizations remain proposed until
the owner confirms them; confirmation is not permission to edit the running toolbelt. Preserve original
decisions and the revision used when they were made.

**Sources:** the initial stand-in request and additional learning thoughts.

## Contextual Import Preferences

These are interview design examples, not an approved BPA feature, schema, permission policy or delivery
scope. Apply them to a project only when its owner-approved design adopts the relevant behavior.

### E01 - Batch Replay And Record Atomicity

The owner prefers replayable/idempotent batch imports that retain successful records and let failed
ones be retried without duplicating successful work. For a record requiring several processing steps,
the record should fail wholly if a step fails; independent valid records may still succeed. Do not
confuse per-record atomicity with requiring every internal computational step to be idempotent.

**Engineering qualification, not an owner-selected implementation:** external side effects may need
retry protection or compensation; a database rollback alone does not undo a sent notification. Identity,
deduplication, transaction boundaries and cross-record dependencies need project design.

**Source:** Q06; the owner explicitly rejected the question's proposed reject-whole-batch answer.

### E02 - Whole-File Structure Before Writes

For expected reasonably sized files, validate the whole syntax/structure before processing data.
A structurally invalid file causes no record writes; users are likely to obtain a fresh export rather
than repair a malformed row. Once structure passes, perform record-level business validation and the
E01 processing. Structural validity does not establish semantic validity. Do not invent large-file
streaming requirements or assume this preference covers genuinely large inputs without discussion.

**Source:** Q10, selection A with expected scale and replacement-export rationale.

### E03 - Stale Import Conflicts Are Not Settled

Q09 leans toward an authoritative file during initial ingestion unless existing rules say otherwise.
The owner also wants identifiable user corrections made after the original import protected from an
older replay, but has not settled how much tracking complexity to accept. "Superusers only" was a
possibility, not a chosen access policy. Do not reduce this answer to "the file always wins."

Monday import, Tuesday user correction, Wednesday old-file replay is the discriminating example.
Avoiding duplicate people does not decide whether Tuesday's correction survives. Field/record change
tracking, conflict presentation and import-versus-update modes require design, not inferred defaults.

**Source:** Q09, tentative A with explicit unresolved qualifications.

## Tentative Interpretation

**T01 - Seek a bounded way to preserve the desired outcome.** When the owner wants a behavior but
worries about overhead, investigate a simple way to achieve it rather than immediately dropping it or
building an elaborate mechanism. This was the assistant's synthesis after Q09-Q10, not an independently
confirmed universal rule. It may support an advisory investigation within existing authority; it cannot
authorize extra features or resolve E03. A coarse edited-since-import flag was only an assistant idea.

## Interview Source Record

Questions and alternatives below are condensed for portability. Quoted answer excerpts are verbatim;
the preference sections retain qualifications. The interview is the source, not a new audit of the
repositories that supplied the examples. Their recorded decisions remain their own authority.

| ID | Concrete question and alternatives | Answer and decisive context |
| --- | --- | --- |
| Q01 | A future file utility hits a temporary file lock before any bytes are written: A throw; B one automatic retry; C opt-in retries? | Qualified C: "this depends on the context of what the utility is supposed to do". Distinguish developer-configured destinations from bounded quick-start fallback; see P06. |
| Q02 | An approved replacement takes three evenings; a two-hour verified patch will mostly be discarded: A patch; B wait; C patch if someone is blocked? | C: "if it's a major user blocker, then we need to get the system back up and working once it's gone live." No current adoption or incident fact follows; see P05. |
| Q03 | A future contracts package offers optional diagnostics outside the interface, without dependencies: A acceptable; B wrong package purpose; C wait for a consumer? | Between A and C: "I am open to adding features like diagnostics" if optional, low overhead/complexity and no extra implementation/consumption burden; see P07. |
| Q04 | Several downstream projects switch implementations daily: A explicit code; B environment selector; C separate runner? | Lean A: "we should keep the selection explicit, A." The teaching purpose, not historical personal convenience, controls; see P08. |
| Q05 | Evidence disproves a premise behind a prior rejection: A always ask; B follow an explicitly conditional owner alternative within delegated scope? | B: "the stand-in agent should be able to quickly pivot the direction/guidance based on that particular issue being a false  problem." Preserve the condition and preferred alternative; see P09. |
| Q06 | An approved roster import contains one invalid row: A delegate may reject the batch; B ask because partial success was undesigned? | Neither offered framing captured the answer. The stand-in could decide using replayable batches and wholly successful/failed individual records, preserving other valid records. The recommended reject-entire-import answer was rejected; see E01. |
| Q07 | Two short explicit paths duplicate an operation; a generic method reduces duplication but needs more explanation: A duplicate for readability; B share? | B: "very rarely would i evern lean to  have duplicative code in my libraries/projects." A few parameters can express nuanced differences; explanation supports useful complexity; see P03/P04. |
| Q08 | A passes required gates; designed B depends on A; personal review is pending: A continue; B wait; C wait for first representative review? | Qualified A: "my tweaking is generally more about how component A works inside it's black box, and less about the interface used to couple with it." Major unexpected interface responsibilities require involvement; see P01/P02. |
| Q09 | A prior import is replayed after a user corrected a phone number: A file wins; B existing values win; C design conflict policy? | Tentative A for initial ingestion, but "if we can verify that the phone number was updated after the original import was completed, then i wouldn't want to override it with the 'older' value." Tracking cost and restricted import access remain unsettled; see E03. |
| Q10 | Malformed CSV quotes obscure record boundaries: A validate whole file first; B retain rows processed before error; C delegate by scale? | A: "I don't expect to be importing gigabyte sized files" and users may obtain a fresh export instead of fixing a row. Validate syntax before writes, data per record; see E02. |

### Additional Owner Statements

These are separate interview excerpts, not one contiguous quotation.

> I want to design my software.
>
> All code written should be intened for humans to read/consume/maintain.
>
> inline comments should be minimal, like around 7 words
>
> I personally learn more when refactoring and optimizing code bases as i'm finding new clever ways to reduce the code footprint, even if it does make the code a little more complicated.
>
> Then when we get to a new component that hasn't been flushed out yet, then I personally need to be involved to discuss and scope out that workflow.

The owner additionally requested every stand-in question, concrete example and decision be available
for morning review, and wanted subsequent answers to include reasons that improve future guidance.
See P10 and the protocol's decision register; learning never silently changes an active run's authority.
