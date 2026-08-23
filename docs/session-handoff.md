---
written: 2026-08-23T14:10:00
head:
  prophets-pipelines: 63dd56b              # main — HEAD UNMOVED since last night. DIRTY ×2: stages/deploy-release.yml AND this file. Measured this run
  ProphetsWay.BaseDataAccess: 48fa10c      # main — 3.2.0-504.Alpha PUBLISHED from this commit at 2026-08-23T04:45. Carried, not re-measured
  ProphetsWay.EFTools: b18052a             # main. DIRTY: ProphetsWay.EFTools.sln — STILL DISCARD, see last night's correction. Carried
  ProphetsWay.Example: 76860c1             # carried, not re-measured this run
  ProphetsWay.Logger: 66bfa3c              # carried
  ProphetsWay.Utilities: bb7bcaa           # master — carried
  ProphetsWay.Hasher: 4b286ae              # master — carried
  ProphetsWay.BPA: 4c0ba1f                 # main — untracked .toolbelt-stress-* fixtures only. Carried
status: live                               # CHECKPOINT 2026-08-23 14:10, mid-session, written for a VS Code relaunch. NOT a clean wrap — reconcile against git
---

# Session Handoff

> 🚨🚨 **READ FIRST — TWO UNCOMMITTED FILES IN `prophets-pipelines`, AND THIS IS ONE OF THEM.**
> Measured 2026-08-23 14:10 with `git status --short` and `git diff --stat` in
> `C:\Projects\ProphetManX\prophets-pipelines`:
>
> | File | Delta | Why it must not be lost |
> |---|---|---|
> | `stages/deploy-release.yml` | **+34 / −35** (69 lines touched) | The complete, twice-audited, owner-approved release-stage change set. **Not committed.** |
> | `docs/session-handoff.md` | **+420 / −1536** | **This file.** `HEAD` still holds the `live` checkpoint of 2026-08-22 23:55. The `fresh` sign-off written at 00:47 — everything below the checkpoint block — **exists only in the working tree.** Losing it loses last night's entire record. |
>
> **`HEAD` is `63dd56b`, unmoved since last night. Nothing was staged, committed or pushed.** Committing
> is the owner's decision — but these two files are the session. The Source Control UI not rendering them
> was a **VS Code display glitch**; `git status` sees both on disk and the repository state is sound.

---

## ⏱ CHECKPOINT — 2026-08-23 14:10 · `live`

**Everything from here to the horizontal rule marked *END OF CHECKPOINT* is today. Last night's `fresh`
sign-off is preserved verbatim below it — both nights survive in this file, and only in this file.**

### Where We Are

One repo, one file, one defect chased to ground. `ProphetsWay.BaseDataAccess` **3.2.0-504.Alpha published
successfully** overnight, which **closed last night's blocking question A** and unblocked the EFTools
follow-on. A `409 Conflict` in the `Deploy Alpha` log then drove a full session on
`prophets-pipelines/stages/deploy-release.yml` — **three `Pipeline Engineer` laps behind two
`Pipeline Auditor` gates** — ending in a ready-to-commit change set that also fixes a **silent, unrelated
defect that had been shipping empty GitHub releases.**

### Current Focus

**Nothing is mid-edit.** `stages/deploy-release.yml` is complete and gated. The next action is a **commit
decision**, not more work.

---

### 🔬 THE MEASURED FINDING — the session's most valuable output

> **`nuget.exe` 6.4.0 auto-pushes a co-located `.snupkg`. MEASURED, not inferred.**

From the **`Push NuGet Alpha Package`** step log — `ProphetsWay.BaseDataAccess` 3.2.0-504.Alpha,
`Deploy Alpha`, **2026-08-23T04:45**:

```text
[command]...nuget.exe push D:\a\1\a\Alpha\ProphetsWay.BaseDataAccess.3.2.0-504.Alpha.nupkg ...
Pushing ...3.2.0-504.Alpha.nupkg to 'https://www.nuget.org/api/v2/package'...
  Created https://www.nuget.org/api/v2/package/ 503ms
Your package was pushed.
Pushing ...3.2.0-504.Alpha.snupkg to 'https://www.nuget.org/api/v2/symbolpackage'...
  Created https://www.nuget.org/api/v2/symbolpackage/ 207ms
Your package was pushed.
```

**The command line names only the `.nupkg`.** The `.snupkg` push was unprompted and returned **`Created`**
(HTTP 201) — so **symbols published successfully**, and the feed **does** expose a symbol endpoint. The
explicit second push then `409`'d against symbols the feed had accepted ~200 ms earlier. The agent also
resolved **6.4.0 from tool cache before any pin existed**, so pinning holds observed behaviour rather than
changing it.

**The owner's opening hypothesis was wrong and was corrected:** nuget.org fully supports a `.nupkg` and a
`.snupkg` at the same version. This was never a one-package-per-version limit.

#### 🧭 Process lesson — record this, it is why the gate exists

The lead first argued auto-push was proven **"by elimination"** from the 409. **`Pipeline Auditor` refuted
that:** a nuget.org `409 pending validation` is returned **both** when a symbol package is already in
flight **and** when the parent package version is still validating — and the parent had been pushed
seconds earlier, so the 409 alone eliminated **nothing**. The auditor also noted the discriminator was
**free**, because nuget.exe names every file it uploads. The owner pulled the log and it settled in one
read. **A lead's inference was wrong, an adversarial gate caught it, and a free measurement replaced it.**

---

### The change set — `stages/deploy-release.yml`, uncommitted

**The reported symptom.** `Push NuGet Alpha Symbol Package` failed `409 Conflict — "another copy of this
symbols package pending validation"`, printing two red `##[error]` lines. **`continueOnError: true` held,
so the release did not fail.**

**Three behavioural changes vs `HEAD`, all in one file:**

| # | Change | Why |
|---|---|---|
| 1 | **`NuGetToolInstaller@1`, `versionSpec: '6.4.0'`** — fatal, placed **first** inside the `PostTargetToNuGet` guard | Governs every `NuGetCommand@2` and precedes the irreversible GitHub steps. Pins the *observed* behaviour |
| 2 | **`DownloadBuildArtifacts@0` for `{PackageType}` hoisted** above both GitHub release invocations, renamed `Download {PackageType} Artifact` | Fixes the silent defect below |
| 3 | **Deleted** the `Detect/Stage {PackageType} Symbol Package` PowerShell step **and** the explicit `Push NuGet {PackageType} Symbol Package` task | A **full revert of `63dd56b`'s symbol machinery** — nuget.exe already does it. `HasSymbolPackage` now has **no reader left in any YAML** |

**Net: three tasks collapse to one.** `Push NuGet {PackageType} Package` is **byte-unchanged** — verified
by the lead running `git diff` filtered to non-comment lines.

### 🔴 The silent defect this also fixes — unrelated to symbols, and the strongest reason to take the change

`steps/create-github-release.yml` globs `.../{PackageType}/*.nupkg` for its `assets`, but the download that
populates that folder **previously ran *after* the release steps.** On the hosted agent every consumer
defaults to, **every Beta and Release GitHub release for `BaseDataAccess`, `EFTools` and `Logger` was
created with no package attached** — silently, green. The hoist fixes it. **Both auditor passes rated this
the strongest reason to take the change set.**

### Settled owner decisions — quoted, not paraphrased

> *"go ahead and address all three findings, nothing is so large or intertwined that we can't do all three
> at the same time"*

> *"yes, have the pipeline engineer do the fixes, i'm ok with the risk that the symbols don't get included
> somehow, i'll own that decision."*

---

### Closed today

| Item | Outcome |
|---|---|
| **Open Question A** — did 3.2.0 publish, did symbols push? | ✅ **CLOSED.** The alpha publish **fired and succeeded**; **symbols published**; the release never failed. FR 8's Source Link work is **live** — `IncludeSymbols` / `SymbolPackageFormat=snupkg` confirmed in `ProphetsWay.BaseDataAccess.csproj` **lines 33–34** |
| **Open Question B** — amend `63dd56b`? | ⚪ **Largely MOOT.** Its defective message described a change that is now **reverted**. Amending a message for undone work is probably wasted effort. **Owner's call, but the stakes collapsed** |
| Last night's item 1 | Done — this is what item 1 asked for |

---

### Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| **0** | **Commit `stages/deploy-release.yml` and this handoff** — two separate commits | owner + `Commit Author` | Both are uncommitted and this file is the sole copy of last night's record. **Do this before anything else** |
| 1 | **Decide auditor finding A2** — `continueOnError: true` on the Beta `GitHubRelease@1 action: 'delete'` | owner | **Medium, NOT approved.** That task is **fatal and non-idempotent**: a Release stage failing at or after it **can never be re-run to green** |
| 2 | **EFTools follow-on** — reference BaseDataAccess **3.2.0**, delete the **10 `CS8766` suppression pairs across 8 library files**, absorb the `CS8767` wave | `Implementer` | **NOW UNBLOCKED** — it was gated on the 3.2.0 publish, which is confirmed fired |
| 3 | **File the F10 non-equivalence finding** into `ProphetsWay.EFTools/docs/api-contract.md` (~2049 and ~5206) | `Contract Reviewer`, then `Interface Architect` | Carried from last night. The document **still asserts the equivalence disproved on 08-22** |
| 4 | **Refresh `prophets-pipelines/AGENTS.md`** — its Known Gaps table **predates all of today** | `Repo Analyst` | Gap 5/6/7 re-verified present; nothing there knows the symbol machinery was reverted |
| 5 | **Tag and publish EFTools 3.0.0** | owner | Merged since 08-22; nuget.org still serves **2.2.0** |
| 6 | `Purpose Refiner` on **FR 8** | `Purpose Refiner` | Its index row still reads *"the pipeline push step is still owed"* — the measured finding now settles the whole question |
| 7 | **`ProphetsWay.EFTools` `LocalTestsOnly: 'yes'`** — narrow with a `--filter` rather than removing the flag | `Pipeline Engineer` | See the new finding below |

**Exact invocation for a fresh start:**

```
@Vanguard — Read prophets-pipelines/docs/session-handoff.md first; its 2026-08-23 checkpoint is at the top
and last night's sign-off is preserved below it. TWO FILES ARE UNCOMMITTED in prophets-pipelines
(stages/deploy-release.yml and docs/session-handoff.md) — commit those first, separately.
Then run the EFTools follow-on that deletes the 10 CS8766 suppression pairs: BaseDataAccess 3.2.0
published successfully overnight, so that work is unblocked.
```

---

### Open Questions — Blocking

| # | Question | Blocks | Raised |
|---|---|---|---|
| **A2** | **Approve `continueOnError: true` on the Beta `GitHubRelease@1 action: 'delete'`?** Auditor finding, **Medium**, unapproved | A re-runnable Release stage. Today a failure at or after it is unrecoverable | 08-23 |

### Open Questions — Non-Blocking

| # | Question | Raised |
|---|---|---|
| **B′** | Amend `63dd56b`'s message at all, now that its change is reverted? | 08-23 |
| **C** | **Which EFTools test subset can run headless?** Undecided — needed to size the `--filter` for item 7 | 08-23 |
| — | *All of last night's non-blocking questions **a–f** remain open and are listed in the preserved section below.* | |

---

### Still Open — pipeline

| Item | State |
|---|---|
| **Auditor finding A2** | **Medium, NOT approved.** Fatal, non-idempotent `action: 'delete'`. Remedy proposed, awaiting the owner |
| **F2 hazard** | **Recorded in a comment, deliberately unfixed.** The surviving push has **no `continueOnError`** and the symbol half rides inside it — a feed rejecting a `.snupkg` fails the step **after** the `.nupkg` is public, **stranding a version.** This is the risk the owner explicitly owned in the quote above |
| **F6** | `IncludeSymbols` is on **only** `ProphetsWay.BaseDataAccess` — **not** EFTools, **not** Logger. For those two, *"no symbols produced"* and *"produced and silently dropped"* look identical |
| **`AGENTS.md` gaps 5, 6, 7** | All **re-verified present and untouched**: hardcoded `gitHubConnection` discarding its own parameter; `local/local-pipeline.yml` passing an **undeclared** `PostTargetToNuGet`; `local/app-variables.yml` omitting `LocalTestsOnly` and carrying stale values |
| **`prophets-pipelines/AGENTS.md` is stale** | Its Known Gaps table predates this entire session |

### 🆕 New finding — flagged twice by `Pipeline Auditor`

**`ProphetsWay.EFTools` sets `LocalTestsOnly: 'yes'`, which compiles the test task out of both PR and CI.
Its CI reported success through the entire 3.x redesign without executing one of its 270 tests.**
Per its own `AGENTS.md`, **seven of eight** locally-written test classes now build a **SQLite in-memory**
context and need no database at all, so the recorded justification has decayed. **Likely remedy: a
`--filter` narrowing rather than removing the flag** — see non-blocking question C.

---

### In Flight

| Item | State | Where |
|---|---|---|
| `stages/deploy-release.yml` change set | **Complete, gated, uncommitted** | `prophets-pipelines` |
| EFTools follow-on — drop the 10 `CS8766` pairs | Specified, unstarted, **now unblocked** | `ProphetsWay.EFTools/ProphetsWay.EFTools/` |
| F10 non-equivalence, filed into the contract | Found, **still not filed** | `ProphetsWay.EFTools/docs/api-contract.md` ~2049, ~5206 |
| EFTools 3.0.0 tag + publish | Merged, unpublished | owner / Azure DevOps |
| FR 8 status move | **Unblocked** — question A is answered | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` |
| A2 remedy | Proposed, **unapproved** | `prophets-pipelines/stages/deploy-release.yml` |

### Uncommitted Changes

| Repo | File | Delta | Description |
|---|---|---|---|
| **`prophets-pipelines`** | `stages/deploy-release.yml` | +34 / −35 | ✅ **Commit this.** The complete, twice-audited, owner-approved change set |
| **`prophets-pipelines`** | `docs/session-handoff.md` | +420 / −1536 | ✅ **Commit this.** **Sole copy of last night's sign-off** plus today's checkpoint |
| **`ProphetsWay.EFTools`** | `ProphetsWay.EFTools.sln` | +84 / −0 | 🚩 **STILL DISCARD** — `git checkout --`. Carried from last night, not re-measured this run |
| **`ProphetsWay.BPA`** | `.toolbelt-stress-*` | untracked | Owner's to remove. Carried |

**Nothing was staged, committed or pushed by this checkpoint.**

---

### 🤖 Agent protocol observations — worth keeping

- **`Pipeline Auditor` has no terminal.** It **said so plainly across three runs rather than fabricating a
  `git diff`.** One lead packet **wrongly asserted it did** have one. The correct workaround — used
  successfully — is for the **lead** to run `git diff` and paste it into the packet.
- **`Pipeline Engineer` cannot invoke sub-agents either.** It could not reach `Pipeline Auditor` on its
  own, so **the lead must run the gate.**
- **Every receipt artifact this session was written correctly and matched its final report.** The protocol
  introduced on 08-22 is holding.

### Verification Record — this checkpoint

**Ran** in `C:\Projects\ProphetManX\prophets-pipelines`: `git status --short` (both files confirmed
modified on disk), `git log -1 --format='%h %cI %s'` (**`63dd56b`, 2026-08-23T00:14:31−04:00**, unmoved),
`git diff --stat` (**454 insertions / 1571 deletions across 2 files**, from which the per-file split above
is derived). **Opened:** this handoff in full before editing it.
**Not re-measured — carried from last night or reported by the owner:** the seven other repos' SHAs, the
`ProphetsWay.EFTools.sln` delta, the `Deploy Alpha` log text, the `.csproj` line numbers, and the
`git diff` of `stages/deploy-release.yml` filtered to non-comment lines.

---

<!-- ══════════════════ END OF CHECKPOINT — 2026-08-23 ══════════════════
     Everything below is the 2026-08-22 → 08-23 sign-off, PRESERVED VERBATIM.
     It exists nowhere else — HEAD still holds the 23:55 checkpoint it replaced.
     Do not delete it until this file is committed.
     ═══════════════════════════════════════════════════════════════════ -->

# ⬇ PRESERVED — the 2026-08-22 → 08-23 sign-off

> ⚠️ **Historical as of 2026-08-23 14:10.** Its blocking question **A is now closed** and question **B is
> largely moot** — see the checkpoint above. Everything else below still stands.

> ✅ **SIGN-OFF — 2026-08-22 → 2026-08-23.** This supersedes the **three `live` checkpoints** written
> during 2026-08-22 (09:41, 22:15 and 23:55). There is now **one** entry for that session, not three.
> Everything those checkpoints held open about laps 3 and 4, the name-collision gate, the F10 blocker
> and the `notes-from-eftools-3.0.0` merge is **closed and landed**. Do not resurrect their wording.
>
> 🔧 **A shell WAS available this time.** Every git fact, file count, version value and consumer-impact
> claim below was **measured**, not reported. Where a figure is the owner's report — test runs, which
> need a local SQL Server — it is labelled as such. See *Verification Record* near the end for exactly
> what was opened and run.
>
> ⚠️ **Two claims in the sign-off brief were wrong and are corrected below**, both in ways that matter:
> the uncommitted `.sln` is **not** benign Visual Studio churn, and the session's highest-value finding
> **was never filed** into the document it contradicts.

---

## Where We Are

**Two releases were prepared this session and both are merged to `main`; neither is published.**
`ProphetsWay.EFTools` **3.0.0** — the four-lap EF Core rewrite — landed via **PR #19** (`b18052a`).
`ProphetsWay.BaseDataAccess` **3.2.0** — nullable annotations plus Source Link — landed via **PR #40**
(`48fa10c`). A symbol-push fix landed in `prophets-pipelines` (`63dd56b`). The agent toolbelt was
repaired mid-session after four silent-subagent failures.

**Every repo is committed and pushed.** The only working-tree change in the workspace is one `.sln`,
and it must be discarded rather than committed.

## Current Focus

**Nothing is mid-edit.** The session ended at a clean boundary in every repo. The next move is a
**check, not a build**: whether the BaseDataAccess 3.2.0 publish fired, and what the `Deploy Alpha`
log says about the symbol push.

---

## Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Check whether the BaseDataAccess 3.2.0 publish fired**, then read the `Deploy Alpha` log for the symbol-push outcome | owner — portal | Gates item 7 and the FR 8 status. The owner expects it to fire today |
| 2 | **Discard `ProphetsWay.EFTools.sln`** — `git checkout -- ProphetsWay.EFTools.sln` | owner | It is **not** VS churn. See the correction below. Committing it breaks the solution build |
| 3 | **File the F10 non-equivalence finding** into `ProphetsWay.EFTools/docs/api-contract.md` | `Contract Reviewer`, then `Interface Architect` | The document **still asserts the equivalence this session disproved**, in two places. See the correction below |
| 4 | **EFTools follow-on** — reference BaseDataAccess 3.2.0, delete the **10 `CS8766` suppression pairs across 8 library files**, absorb the `CS8767` wave | `Implementer` | This is *why* the owner reversed FR 10's sequencing. It is what lets EFTools 3.0.0 ship clean |
| 5 | **Tag and publish EFTools 3.0.0** | owner | Merged since 2026-08-22; nuget.org still serves **2.2.0** |
| 6 | **Decide what to do about `63dd56b`'s commit message** | owner | Amend + force-push `main`, or leave it and rely on this file. Owner's call — see below |
| 7 | `Purpose Refiner` on **FR 8**, once item 1's outcome is known | `Purpose Refiner` | Its index row still reads *"the pipeline push step is still owed"* — that step **now exists**. Only `Purpose Refiner` may move the status |

**Exact invocation for a fresh start:**

```
@Vanguard — EFTools 3.0.0 and BaseDataAccess 3.2.0 are both merged to main and neither is published.
Read prophets-pipelines/docs/session-handoff.md first. Start by confirming the 3.2.0 publish fired,
then run the EFTools follow-on that deletes the 10 CS8766 suppression pairs.
```

---

## 🔴 Defect — `prophets-pipelines` commit `63dd56b` has the wrong message

**Measured, not inherited.** `git log -1 --format='%s'` returns a **207-character** sentence (the brief
estimated 175); `%b` returns **zero characters**. The subject is:

> *"Body covers the minimatch reason, why the one-glob edit was rejected, the ordering fix from the
> audit, and — per AGENTS.md's requirement — every consuming repo enumerated with what each will
> actually do."*

That is the lead's **description of** the message, pasted in place of the message.

**The change itself is correct and was independently audited.** `git show --stat` confirms exactly
`stages/deploy-release.yml | 27 +++`, one file, +27/−0 — precisely what was intended. **Only the record
is lost**, and it is lost in the one repo whose `AGENTS.md` explicitly requires a template change to
enumerate its affected consumers.

**Options, owner's call:**

- **Leave it** and rely on this handoff as the record. Zero risk.
- **Amend and force-push `main`.** Rewrites shared history. Deliberately not done at midnight.

### The intended message, reconstructed and verified — use this verbatim if amending

Every factual claim in the block below was re-verified against the files on 2026-08-23.

```text
Push the symbol package alongside the NuGet package in the release stage

The release stage pushed '*.nupkg' only. That glob does not match '*.snupkg' —
minimatch requires a literal '.' before 'nupkg', so a symbol package produced by
a project setting IncludeSymbols was built, uploaded as a build artifact, and
then silently never pushed to the feed.

Adds a detection step plus a symbols-only push, both non-fatal.

Why not the one-glob edit ('*.*nupkg' or a brace pattern):

The push is NuGetCommand@2, which runs nuget.exe rather than 'dotnet nuget push',
and there is no NuGetToolInstaller@1 in this pipeline, so the agent's bundled
nuget.exe version is whatever the pool supplies. Adjacent-symbol behaviour is
version-dependent: some nuget.exe versions push a co-located .snupkg
automatically. If that happens and an explicit second push follows, the feed
returns 409 Conflict and the release fails. If the feed has no symbol endpoint
at all, the push errors and the release fails. The governing constraint is that
this cannot fail a release, so the symbol push is conditioned on detection and
carries continueOnError.

Ordering, from the Pipeline Auditor pass:

The detect step is placed BEFORE the package push, not after it. The auditor
returned "safe to merge with one hardening" and this is it. Previously the
detect step ran after the publish and unprotected — a script throw would have
published the package, failed the stage, and made the re-run fail on a duplicate
version conflict. Detection must never fail a release it cannot un-publish.

Consuming repos — zero edits required in any of them:

  ProphetsWay.BaseDataAccess  PostTargetToNuGet 'yes', and the ONLY repo with
                              <IncludeSymbols>true</IncludeSymbols>. This is the
                              repo the change exists for. Detect finds 1, pushes.
  ProphetsWay.EFTools         PostTargetToNuGet 'yes', no IncludeSymbols. Detect
                              logs 0, push step is skipped by its condition.
  ProphetsWay.Logger          PostTargetToNuGet 'yes', no IncludeSymbols. Same.
  ProphetsWay.Example         PostTargetToNuGet is commented out, so the whole
                              block is removed at template-compile time.
  ProphetsWay.Hasher          Standalone legacy pipeline; does not consume these
                              templates at all.
  ProphetsWay.Utilities       Has no pipeline of any kind.

Unresolvable from any file: whether the feed exposes a symbol-publish endpoint.
Only a real release settles it. Built so that "no" costs a warning rather than a
failure. Read the Deploy Alpha log on the next release.
```

---

## 🔴 CORRECTION — the uncommitted `ProphetsWay.EFTools.sln` is NOT Visual Studio churn

**The brief said "almost certainly Visual Studio on open." It is not, and committing it would break the
solution build.** `git diff --numstat` reports **+84 / −0**, and the added lines include two project
entries pointing **outside the repository**:

| Added project | Path recorded in the `.sln` | Exists on disk? |
|---|---|---|
| `consumer` | `..\..\..\Users\Proph\AppData\Local\Temp\bda-consumer-probe\consumer.csproj` | ❌ **No** — verified with `Test-Path` |
| `Probe` | `..\..\..\Users\Proph\AppData\Local\Temp\fr10-probe-annotated\Probe.csproj` | ❌ **No** — verified with `Test-Path` |

Both are **BaseDataAccess FR 10 verification probes** — the scratch projects built this session to prove
the `CS8767` / `CS8766` behaviour against a nullable-enabled consumer. They were added to the EFTools
solution, their temp directories have since been cleaned up, and the `.sln` now references two dangling
paths. The remaining added lines are the x64/x86 platform configurations Visual Studio wrote to
accommodate them.

> 🔁 **This is a recurrence, not a novelty.** The 2026-08-20 session logged the identical incident — a
> scratch `OrderProbe` project added to the tracked `.sln` and then deleted, breaking the solution build.
> `git checkout --` was the right fix then and is the right fix now.

**Blast radius if committed:** `dotnet build ProphetsWay.EFTools.sln` fails for everyone, the owner
included. **CI would not catch it** — `steps/restore-build-test.yml` builds `**/*.csproj`, never the
`.sln`.

**Action: `git checkout -- ProphetsWay.EFTools.sln` in `ProphetsWay.EFTools`.** Do not commit it, and do
not hand-edit it back into shape.

---

## 🔴 CORRECTION — the session's highest-value finding was NOT filed

The brief records the finding correctly but presents it as settled work. **It is not written down
anywhere durable, and the document it contradicts still asserts the opposite.**

**The finding:** F10 offers two remedies for a failed `Insert` and calls them equivalent. **They are not.**
"Stamp the item, restore in a `finally`" is sound only where nothing happens after `SaveChanges` returns.
`SaveChanges` can **succeed** and a later step throw — at which point the `finally` restores the caller's
timestamps while the row *is* stored, leaving the caller holding a real database identifier beside a
rolled-back `CreatedDate`. Neither stored nor not-stored. **A `finally` cannot un-store a row.** This
proved the specification wrong on its own terms, which is a stronger class of finding than a code defect.

**`ProphetsWay.EFTools/docs/api-contract.md` still says the opposite, in two places — both opened and read
on 2026-08-23:**

| Line | What it still says |
|---|---|
| **~2049** | *"**Both remedies are sanctioned by F10 and neither branch is required to adopt the other's.** The asymmetry is in the mechanism, not in the contract"* |
| **~5206** | *"**The second remedy is legitimate here, unlike in A35.** … Here the throw comes from `SaveChanges`, which is strictly after the assignment, so the `finally` has something to restore. **Both remedies deliver the obligation; neither is mandated.**"* |

The second passage is the exact reasoning the finding refutes — it treats a throw out of `SaveChanges` as
the only failure shape, while F10's own obligation paragraph already binds *"an exception out of anything
the member does after reading `item`."* **The document contradicts itself and does not know it.**

**Action:** item 3 in *Next Session*. `Contract Reviewer` confirms the contradiction, `Interface Architect`
makes the edit. **The keyless branch's choice of remedy one is correct and must not be changed** — what is
wrong is the sentence licensing remedy two as equivalent.

### The second defect, which made the first reachable

**`EntityGraph.RemoveFromInverseNavigations` raised `TargetException`** — it read a *collection* navigation
as if it were a single principal. Fixed this session. This is what turned the post-`SaveChanges` window
from theoretical into reachable, and **neither defect was caught by an existing test.**

---

## EFTools 3.0.0 — merged, not published

**Merged to `main` via PR #19 as `b18052a`** — a squash merge of **83 files, +21,184 / −1,077**. Verified
with `git show --stat`.

| Fact | Measured value |
|---|---|
| Library source files | **15**, one flat folder, **zero subfolders** — down from 39 |
| Preprocessor directives in the library | **zero** |
| Target frameworks | `net10.0` only, all three projects (ratified exception **D7**) |
| `app-variables.yml` | **3 / 0 / 0** |
| Published on nuget.org | **2.2.0** — 3.0.0 is **not tagged and not published** |

**Laps 3 and 4 both happened this session.** Lap 3 added the keyless families (`RootNonIdDao`,
`BaseNonIdDao`, `RootSoftNonIdDao`, `BaseSoftNonIdDao`), a real `CompanyResourceDao`, and extracted
`EntityGraph` out of `BaseDao`'s privates. Lap 4 was a **pure deletion — 24 files, 773 lines, and no
modification to any surviving file**, which is why it moved no test count.

**Final numbers — owner-run on 2026-08-22, not re-measured here** (the full suite needs a local SQL Server):

| Measurement | Result |
|---|---|
| `dotnet build ProphetsWay.EFTools.sln` | **0 errors / 0 warnings** |
| Lap gate `--filter "Area=Keyless\|Area=Insert"` | **68 / 68** — SQLite only, reproducible anywhere |
| Full `ProphetsWay.EFTools.Tests` | **270 total / 259 passed / 11 failed** |
| `ProphetsWay.Example.Tests` | **164 / 164** on both `net10.0` and `net48` |

**The 11 failures are pre-existing and named:** 10 × `EFSnapshotDeepCopyTests` (that upstream class in its
entirety — `ApplyIncludes` defaults to identity per **OD-1 / A18** and no EF DAO overrides it) plus
`EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`, a SQL Server timeout.
**Neither is a regression; do not "fix" either to reduce a red count.**

---

## BaseDataAccess 3.2.0 — merged, awaiting publish

**Merged to `main` via PR #40 as `48fa10c`** — 12 files, +954 / −88. **The owner is waiting on the NuGet
publish to fire and expects it today. That is the first thing to check.**

### FR 10 — nullable annotations · status **Done**

Verified by opening `ProphetsWay.BaseDataAccess.csproj`:

```xml
<TargetFrameworks>netstandard2.0;net10.0</TargetFrameworks>
<LangVersion>9.0</LangVersion>          <!-- pinned, NOT `latest` -->
<Nullable>annotations</Nullable>        <!-- annotations, NOT `enable` -->
```

Annotated: `T? Get(T item)`, `IList<T> GetAll(T? item)`, `IList<T> GetPaged(T? item, int, int)`,
`int GetCount(T? item)`, `TEntityType? Get<TEntityType>(object? id)`, `T? Id`, and the `string?` /
`Exception?` surface. **Metadata-only — not binary-breaking**, but source-affecting for nullable-enabled
consumers.

**Four owner rulings that must survive:**

| # | Ruling |
|---|---|
| **(b)** | Truthful `T? item` on the type selectors, **knowingly accepting the `CS8767` wave** it creates in implementations |
| **(c)** | `IList<T>` and `GetCount` stay **non-nullable** |
| **(d)** | `object? id` and `T? Id` |
| **Reading A** | `Insert` / `Update` / `Delete` take non-null — *"null doesn't make any sense as input"* |

Plus: accept the **unpoliced non-null return**; add **no guard** in a metadata-only release.

> 📌 **`<Nullable>annotations</Nullable>` removes "neutral" as an option — a plain `T` becomes an
> assertion.** That finding corrected a claim the lead had already made to the owner. It is the reason
> ruling (b) had to be taken explicitly rather than defaulted into.

### FR 8 — Source Link · status **Scheduled**, not Done

**Its decline rested on not wanting a dependency, and that ground turned out to be empirically dead:**
`Microsoft.SourceLink.GitHub` ships **inside SDK 10.0.400**, so **no `PackageReference` was added.**
Verified from extracted artifacts — the `.nuspec` carries a resolved commit SHA and both PDBs carry the
document map.

**Recorded `Scheduled` rather than `Done` because the push step was outstanding at the time.** That step
now exists (`63dd56b`), so **the FR 8 index row is stale** — it still reads *"the pipeline push step is
still owed."* Only `Purpose Refiner` may move it, and it should not move until item 1 proves the symbols
actually reach the feed.

**Numbers — owner-run:** build 0/0 in Release on both TFMs; `dotnet pack` 0 warnings producing both a
`.nupkg` and a `.snupkg`; **116 tests on each of `net10.0` and `net48`**, 232 executions.

### FR 11 — `<Nullable>enable</Nullable>` · status **Proposed**, new

The second pass FR 10 deliberately scoped out. **Measured, which is the useful part: 17 warnings, all
internal, none on the public surface.**

---

## prophets-pipelines — the symbol push

`stages/deploy-release.yml`, **+27 / −0**. Content verified by reading the file at HEAD: the detect step
sits **ahead of** the package push and carries `continueOnError: true`; the symbols push is conditioned on
`HasSymbolPackage` and also `continueOnError`.

The full reasoning is in the reconstructed commit message above. **It is not repeated here** — if that
block is lost, this section is not a substitute.

**The one thing no file can settle: whether the feed exposes a symbol-publish endpoint.** Built so that
"no" costs a warning rather than a failure. **Read the `Deploy Alpha` log on the next release.** Three
possible outcomes:

1. **Symbols published** → FR 8 moves to `Done`.
2. **Warning but green** → the feed has no symbol endpoint; FR 8 stays `Scheduled`; decide whether to keep
   producing a `.snupkg` at all.
3. **Anything else** → unexpected; treat as a finding.

---

## Toolbelt — repaired mid-session, in two passes

`Interface Architect` went silent **twice**; `Repo Analyst` and `Implementer` **once each**. The owner ran
`Toolbelt Keeper`.

**The brief described this as one pass over six agents. `git show --stat` shows it was two, and the second
generalized it:**

| Commit | Time | Scope |
|---|---|---|
| `dfe98d7` | 14:11 | **Six agents** + `agent-toolbelt.md` — `purpose-refiner`, `repo-analyst`, `solution-architect`, `vanguard`, `api-designer`, `interface-architect`. **No receipts yet** — `git grep -l 'Receipt artifact'` at that commit returns **0 files** |
| `78ebdb0` | 20:06 | **27 files** — extended one-shot delegated modes to **all 26 agents** and introduced the **receipt artifact** protocol under `%TEMP%`. Measured: **26 of 28** toolbelt files carry both `Receipt artifact` and the `NO CHANGE` status vocabulary; the two that do not are the two `.prompt.md` files, correctly |

✅ **The live toolbelt and the versioned one are byte-identical.** `Get-FileHash` across
`prophets-pipelines/conventions/toolbelt/` (28 files) against `%APPDATA%\Code\User\prompts` (28 files):
**zero differences, zero missing, zero extra.** The prompts folder is **not** a git repo, so this mirror is
the only thing keeping the active agents and the source of truth aligned — re-check it whenever either
side is edited.

### The receipt protocol earned its keep immediately

`Repo Analyst` went silent after writing **754 lines across two files**. The diff looked like success. Its
receipt still read `State: STARTED` — **which is how the run was correctly identified as incomplete.** It
was: `docs/repo-profile.md` had been refreshed only through line 423 and contradicted itself below that.

> 🧭 **The original diagnosis was wrong and is recorded as such.** The "interactive charter,
> non-interactive invocation" theory was weakened when `Implementer` — which is not conversational — went
> silent too. **Output-budget exhaustion on heavy multi-file edit runs fits better.** Follow-up guidance
> was given to `Toolbelt Keeper` covering that, plus the still-uncovered executor agents, plus the note
> that **a *small* delegation cannot reproduce the failure**, so a stress fixture has to be genuinely
> heavy to be diagnostic.

---

## Open Questions — Blocking

| # | Question | Blocks | Raised |
|---|---|---|---|
| **A** | **Did the BaseDataAccess 3.2.0 publish fire, and did the symbol push succeed?** | FR 8's status; whether to keep producing a `.snupkg`; the shape of the EFTools 3.0.0 release | 08-23 |
| **B** | **Amend `63dd56b` and force-push `main`, or leave it?** A force-push rewrites shared history in the conventions repo | Nothing technically — but the record is the thing `AGENTS.md` requires | 08-23 |

## Open Questions — Non-Blocking

| # | Question | Raised |
|---|---|---|
| a | **What version does `ProphetsWay.Example` carry at tag time?** `app-variables.yml` reads 3/1/1 — a **patch** — but `TestDataAccessFactory.Use` is new public API (MINOR by house rule) and the IDENTIFIER and ROW COUNT rules were restated on five further DAO interfaces. **An implementation conforming to the 3.1.0 text can be non-conforming to this one without changing a line.** Settle before Example is tagged | 08-16 |
| b | **`ThrowIfDisposed()` is missing from 32 of `ExampleDataAccess`'s 40 forwarders** — a contract requirement with no test | 08-18 |
| c | **Source Link for `Logger`, `Hasher` and `Utilities`** — the same three-line change, now that the dependency objection is empirically dead. EFTools records its own gap as **deviation 5** | 08-16, revived 08-22 |
| d | **A31's three version-sensitive EF Core surfaces** — `IgnoreQueryFilters()` granularity, `SetValues` against shadow foreign keys, `MultipleCollectionIncludeWarning`. Nobody had a verifiable source **and nobody guessed** | 08-16 |
| e | **Should the seven `Guard=Seam` tests also carry a `Scope` trait?** A deliberate choice of a different trait key, not an omission. Cheap either way | 08-20 |
| f | Whether to state hard-delete explicitly on the five silent DAOs | earlier |
| g | ~~Should BaseDataAccess's `notes-from-eftools-3.0.0` branch be merged to `main`?~~ | ✅ **CLOSED — merged as `48fa10c`** |

---

## In Flight

**Nothing is mid-edit.** Every item below is *specified and unstarted*, not *half-written*.

| Item | State | Where |
|---|---|---|
| EFTools follow-on — drop the 10 `CS8766` pairs | Specified, unstarted. **Measured: 20 pragma lines = 10 pairs across 8 files** — `BaseDao`, `BaseGetAllDao`, `BasePagedDao`, `BaseSoftDao`, `BaseSoftGetAllDao`, `BaseSoftPagedDao` (3 lines each) plus `BaseNonIdDao`, `BaseSoftNonIdDao` (5 each) | `ProphetsWay.EFTools/ProphetsWay.EFTools/` |
| F10 non-equivalence, filed into the contract | Found, **not filed** | `ProphetsWay.EFTools/docs/api-contract.md` ~2049 and ~5206 |
| EFTools 3.0.0 tag + publish | Merged, unpublished | owner / Azure DevOps |
| BaseDataAccess 3.2.0 publish | Merged, awaiting the pipeline | owner / Azure DevOps |
| FR 8 status move | Waiting on question A | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` |

---

## Uncommitted Changes

| Repo | Files | Description |
|---|---|---|
| **`ProphetsWay.EFTools`** | `ProphetsWay.EFTools.sln` (+84/−0) | 🚩 **DISCARD, do not commit.** Two scratch FR 10 probe projects under `%TEMP%`, both now dangling, plus their x64/x86 configurations. See the correction above |
| **`ProphetsWay.BPA`** | `.toolbelt-stress-implementer/`, `.toolbelt-stress-implementer-receipt/`, `.toolbelt-stress-interface/`, `.toolbelt-stress-interface-receipt/` — all untracked | The toolbelt stress fixtures. **The owner's to remove once the diagnosis is finished** — they are the only reproduction attempt for the silent-subagent failure |
| Everything else | — | **Clean.** All seven other repos are 0 ahead / 0 behind their upstreams |

✅ **The three untracked `AGENTS.md` files that had sat in `Logger`, `Utilities` and `Hasher` for two
sessions are committed** — `66bfa3c`, `bb7bcaa`, `4b286ae`. That carried-forward item is closed.

**Committing is the owner's decision. Nothing was staged, committed or pushed by this wrapup.**

---

## Decisions Made This Session — and where each was filed

| Decision | Filed in |
|---|---|
| FR 10 ruling **(b)** — truthful `T? item`, accepting the `CS8767` wave | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` § 10 *"The four contract judgements"* |
| FR 10 ruling **(c)** — non-nullable `IList<T>` and `GetCount` | same |
| FR 10 ruling **(d)** — `object? id` / `T? Id` | same |
| FR 10 **Reading A** — `Insert`/`Update`/`Delete` take non-null | same |
| Accept the unpoliced non-null return; no guard in a metadata-only release | same |
| FR 8's decline **reversed** — the dependency objection was empirically false | `…/feature-requests.md` § 8 *"The owner's reversal"* |
| FR 10 **sequencing reversed** — annotate BaseDataAccess *before* EFTools ships | `…/feature-requests.md` § 10 index row |
| v3.2.0 scoped as **metadata and packaging only**, hence MINOR | `…/feature-requests.md` § *Release Eligibility — v3.2.0* |
| The `.snupkg` push must **never fail a release**; the one-glob edit rejected | `prophets-pipelines/stages/deploy-release.yml` inline comments — **and the full reasoning only here**, because of the commit-message defect |
| Detect-before-push ordering, per `Pipeline Auditor` | same |
| Delegated one-shot modes + receipt artifacts across 26 agents | `prophets-pipelines/conventions/toolbelt/*.agent.md` |
| **F10's two remedies are not equivalent** | ❌ **NOWHERE — this is the filing gap. See item 3** |

---

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| **`steps/create-github-release.yml` attaches only `*.nupkg`** | Same minimatch bug, different destination — symbols will not reach GitHub releases. **Verified at HEAD.** The same file also hardcodes `gitHubConnection: 'ProphetsWay@GitHub'` while declaring and discarding its own `GitHubConnectionName` parameter (`AGENTS.md` known gap 5) | With the next `prophets-pipelines` pass — fix both in one commit |
| **FR 11** — the `<Nullable>enable</Nullable>` second pass | 17 warnings, all internal, none public. Measured, not estimated | After 3.2.0 publishes |
| **EFTools A26 / OD-7** — detach-on-failure coverage | Deferred at lap 4 | Any lap touching `Insert`'s failure path |
| **EFTools A24 / OD-4 / A37** — navigation handling coverage | 🚩 **Blocked, not merely deferred: no keyless fixture entity declares a navigation property**, so there is nothing to test against. The new `Binder`/`Slip` fixture may unblock it | When a fixture entity gains a navigation |
| **EFTools A28** — query-filter coverage | Deferred at lap 4 | Next EFTools test pass |
| **A39 is specified but unimplemented** — the keyless half has no throw site wrapping its compiled predicate | Found late; not a correctness break today | Next EFTools implementation lap |
| **The EFTools obligation recount** — 152 counted vs 151 published | F3's re-cut moved both sides and **is ruled out as the cause**, so the discrepancy is still unexplained. Recount from zero rather than adjust | Next `Contract Reviewer` pass |
| **Two stale `<remarks>` in `FailedInsertWriteBackTests.cs`** describing pre-fix source in the present tense | Cosmetic; the tests themselves are correct | Next test-file touch |
| **A vestigial `global::System.Guid`** in `AlternateKeyGuardSpikeTests.cs` **line 125** | Verified present. It was necessary when `ProphetsWay.EFTools.Guid` shadowed `System.Guid`; **lap 4 deleted that namespace**, so the qualification is now noise | Next test-file touch |
| **`purpose-and-scope.md` is not updated for FR 9, 10 or 11** | Only `Purpose Refiner` writes that file, and this session was scoped elsewhere. **Do not read the absence of a row there as a scope ruling** | Next `Purpose Refiner` pass |
| **`ProphetsWay.BPA`** | A deliberate empty scaffold. Not neglect | When the owner starts it |
| **The `public new` fix on `TransactionDao` / `ResourceDao`** | Invisible today only because `ExampleDataAccess` holds them as interfaces. Against the now-`virtual` bases, `new` is the wrong keyword | Next `ProphetsWay.Example` pass — **upstream, never from the EFTools side** |
| **`CompanyDao.GetCustomCompanyFunction` bypasses the read hooks** | Pre-existing; reads `Dataset` directly, skipping `ApplyReadFilter` / `ApplyStableOrder` | same |
| **M5–M11 test obligations** | A conscious scope decision from lap 1, still unwritten. **M10's trap:** its assertion must never say *which lookup* failed — A8 step 4 permits two resolver strategies and `HiddenKeyed` fails at a different step under each | Any lap touching identifier resolution |
| **EFTools deviation 3 — remove the SqlServer and InMemory package references** | The **code** half is done (zero `UseSqlServer` / `UseInMemoryDatabase` in the library); the **packaging** half is breaking | The provider-neutrality lap |

---

## Standing Guardrails

- 🚩 **Never add a scratch project to a tracked `.sln`.** Twice now — `OrderProbe` on 08-20, `consumer` and
  `Probe` on 08-22. Build probes in a temp directory with their own `.sln`, or `dotnet build` the `.csproj`
  directly. `git checkout --` is the fix, not hand-editing.
- **A green build is not evidence a subagent reported, and a diff is not evidence a run completed.**
  Check the receipt.
- **Never delete `TestSeam.cs` to reduce a red count.** A green EFTools suite is meaningful *only* while it
  is on disk; deleting it makes the run look dramatically better and proves nothing.
- **Do not "fix" `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`.**
  `Scope=Characterization`, failing correctly.
- **Do not "fix" the 10 `EFSnapshotDeepCopyTests` failures by overriding `ApplyIncludes` on an EF DAO.**
  Identity is the specified default per **OD-1 / A18**.
- **Never edit anything under `ProphetsWay.EFTools/ProphetsWay.Example/`** — it is a pinned submodule at
  `61d9e7d`. Edit upstream in `ProphetsWay.Example` and advance the pointer.
- **Never bump a version in any `app-variables.yml`.** Owner's decision, in every repo.
- **`ConventionShowcaseTests` and `ExceptionPassthroughShowcaseTests` stay excluded** — `Scope=Dispatcher`;
  they belong to `ProphetsWay.BaseDataAccess` and their DALs are deliberately mis-wired.
- **Every test carries exactly one `Scope`, and the trait sum is the check.** A mismatch means a test is
  untraited or double-traited, which is the defect the partition exists to prevent.
- **A `Scope=Contract` assertion must trace to a stated rule.** There is no enforcement mechanism; it holds
  only because whoever writes one asks the question.
- **Editing the toolbelt means editing `prophets-pipelines/conventions/toolbelt/`, then re-syncing
  `%APPDATA%\Code\User\prompts`.** The prompts folder is unversioned. The two were byte-identical at
  sign-off.

---

## Process Notes Worth Carrying

**Agents corrected the lead repeatedly this session, and that is the system working — not friction to
engineer out.** Every one of these was a case where the specialist was right and the coordinator wrong:

| Agent | What it caught |
|---|---|
| `Changelog Author` | A break was **compile-time, not runtime** |
| `Test Designer` | An arrangement the lead passed it **could not fail** |
| `Repo Analyst` | Its **own draft's** SQLite / SQL Server error |
| `README Author` | Declined a *"299 → 97"* proof **it could not verify** |
| `Contract Reviewer` | The README contradiction at a **fifth prose site nobody had counted** |
| `Commit Author` | Corrected file counts **twice**, and found **two extra `CS8767` cases** |
| `Implementer` | Proved a documented fix **described the wrong diagnostic sequence** |

Two rules fall out of the session and are worth keeping:

- **A green build is not evidence a subagent reported, and a diff is not evidence a run completed.**
- **`<Nullable>annotations</Nullable>` removes "neutral" as an option** — a plain `T` becomes an assertion.

---

## Verification Record — what this wrapup actually opened and ran

**Ran:** `git rev-parse --abbrev-ref HEAD`, `git log -1 --format`, `git rev-list --left-right --count
@{u}...HEAD` and `git status --porcelain -uall` across **all eight repos**; `git show --stat` on `48fa10c`,
`b18052a`, `63dd56b`, `78ebdb0`, `dfe98d7`; `git log --since=2026-08-22`; `git diff --numstat` and
`git diff -U0` on `ProphetsWay.EFTools.sln`; `git grep -l 'Receipt artifact' dfe98d7`; `Get-FileHash`
across the 28 toolbelt files against the 28 prompts files; `Test-Path` on both probe `.csproj` paths;
`Select-String` counts for `CS8766` pragmas, `Major`/`Minor`/`Patch`, `LangVersion`, `Nullable`,
`PostTargetToNuGet` and `IncludeSymbols`.

**Opened:** `stages/deploy-release.yml`, `steps/create-github-release.yml`,
`ProphetsWay.BaseDataAccess/docs/feature-requests.md` (index and both eligibility tables),
`ProphetsWay.BaseDataAccess/CHANGELOG.md` (head), `ProphetsWay.EFTools/docs/api-contract.md`
(lines 2035–2060 and 5157–5240), and the outgoing handoff.

**Not re-measured — owner-reported, and labelled as such wherever used:** every test-run figure. The full
EFTools suite requires a local SQL Server carrying `ProphetsWay.Example`; the lap gate
(`Area=Keyless|Area=Insert`, 68/68) does not, and is the reproducible one.

---

## Recent Sessions

### 2026-08-22 → 08-23 — *two releases prepared, one toolbelt repaired*

**The longest session so far, and the only one to close two release lines at once.** EFTools 3.0.0 merged
via **PR #19** (83 files, +21,184/−1,077) after laps 3 and 4 — the keyless families, `CompanyResourceDao`,
`EntityGraph` extracted, then a **pure 24-file / 773-line deletion** that changed no surviving file and
moved no test count. The library went **39 source files → 15**, EF6 gone, `net10.0` only, **zero
preprocessor directives.** BaseDataAccess 3.2.0 merged via **PR #40**, carrying FR 10 (nullable
annotations, `LangVersion 9.0`, `Nullable annotations`, four owner rulings) and FR 8's csproj half — whose
decline was **reversed on an empirical finding: `Microsoft.SourceLink.GitHub` ships inside SDK 10.0.400**,
so no dependency was added after all.

**Two real defects were found and fixed, neither by an existing test** — F10's post-`SaveChanges` window,
and `EntityGraph.RemoveFromInverseNavigations` raising `TargetException` by reading a collection navigation
as a single principal. **The first proved the specification wrong on its own terms**, and that finding is
the session's highest-value output — **and it was never filed**; `api-contract.md` still asserts the
equivalence it disproved, at ~2049 and ~5206.

`prophets-pipelines` gained a symbol push (`stages/deploy-release.yml`, +27/−0) after `Pipeline Auditor`
returned *safe to merge with one hardening* — detect **before** the irreversible push, `continueOnError` on
both. **Its commit `63dd56b` carries a 207-character description-of-a-message as its subject and an empty
body**, which is the session's one process failure and lands in the one repo whose `AGENTS.md` requires
consumer enumeration.

**The toolbelt was repaired in two passes** — six agents at 14:11, then all 26 plus receipt artifacts at
20:06. **The receipts paid off within hours:** `Repo Analyst` went silent after 754 lines and its diff
looked like success, but the receipt still read `STARTED` — which is how the run was correctly called
incomplete. **The original "interactive charter" diagnosis was wrong**; output-budget exhaustion fits
better, since the non-conversational `Implementer` failed the same way.

**Ended clean everywhere but one file:** `ProphetsWay.EFTools.sln`, +84/−0, carrying two dangling FR 10
probe projects — **a recurrence of the 08-20 `OrderProbe` incident, and to be discarded, not committed.**
The three long-outstanding untracked `AGENTS.md` files were finally committed.

### 2026-08-20 — *laps 1 and 2, both committed and pushed*

**The headline: building found more than reviewing did, by an order of magnitude.** Three review cycles
over a 5,261-line contract produced diminishing findings; **two implementation laps produced twenty-two**,
several of them latent data-loss bugs. **The owner's call to stop polishing and start building was
vindicated.** Prefer another lap over another review pass when the two compete. Lap 1 shipped three new
`<TEntity,TKey>` bases and **25/25 on the new `Area=KeyPredicate` trait**, with **thirteen specification
defects** as its payload. Lap 2 shipped the three `BaseSoft*` families and converted `DepartmentDao` at
**299 → 97 lines**, suite **200/173/27**, zero regressions across both laps. `Area` was established as a
second trait dimension — which is what lets a lap prove itself **without a local SQL Server**. One
incident: a scratch `OrderProbe` project added to the tracked `.sln` broke the solution build.

### 2026-08-19

**Entirely Stage 2.** `api-contract.md` Revision 8 → 10 over three review→revise cycles. **No code, no
lap.** Q10 inverted the plan so `Contract Reviewer` ran before the shape pass — vindicated by five blocking
findings on rev 8. **Q14 closed by measurement** — the first measured fact in the chain, and it produced an
unasked-for finding that shrank A35's blast radius substantially. `Interface Architect` **rejected a bad
instruction from the coordinator's brief and was right to.**

### 2026-08-18

`ProphetsWay.Example` PR #21 merged (`61d9e7d`) and the EFTools submodule pointer advanced onto it — **the
blocker cleared**. `TestSeam.cs`'s `[ModuleInitializer]` points the upstream suite at the EF DAL, and the
guard was then **hardened against its own auditor**. **All 11 findings closed, four validated by applying
the cheat, watching the guard fail, and reverting.** **57/94 → 123/28.**

### 2026-08-16 → 08-17

Documentation re-verified against source across four repos, producing three findings that mattered more
than the corrections: `ProphetsWay.Hasher`'s `AGENTS.md` was instructing agents to make a binary-breaking
namespace change; `ProphetsWay.BaseDataAccess`'s behavioural-contracts index was missing an entire section
the EFTools 3.x design had been drafted off; and `ProphetsWay.Example`'s version line is 3.1.1 where three
documents said 3.1.0. **No terminal that session** — the owner ran every command, and two agents correctly
stopped rather than guess.
