---
name: pw-tdd
description: "Run requirements-led Test Driven Development with separate test and implementation authors and independent review. Use for approved new features, behavior changes, regression fixes and their test fixtures."
user-invocable: false
---
# Requirements-Led TDD

## Before the red phase

Read repository guidance, exact approved behavior/contract revision, target paths, actual baseline and runner. Identify existing sufficient coverage. Confirm the test fixture and required checks can run. The assignment—not this skill—grants write and execution scope.

## Specification author

1. Translate only approved, observable behavior into discriminating test cases.
2. Include material boundary/failure cases and valid extensible inputs required by the design. Do not manufacture rejection rules or turn illustrative examples into allowlists.
3. Use isolated, reproducible fixtures with cleanup. Do not depend on a user's real data, live service or shared machine state unless expressly required and authorized.
4. Run the exact focused tests and record real discovery, identities, counts, failures and skips.
5. For new behavior, demonstrate expected behavioral red before implementation when the existing project can compile. A compiler error alone is not behavioral red. Already-sufficient green coverage needs no artificial red.
6. Ask a separate reviewer whether a materially wrong implementation could pass and whether every restriction is in the accepted design.

## Implementation author

1. Read the audited specifications and immutable accepted requirements.
2. Implement the smallest complete behavior without editing tests, test helpers, filters or evidence criteria.
3. Run focused checks and repair ordinary implementation mistakes while the target is unchanged.
4. If a test contradicts an approved requirement, report the exact assertion/requirement to the coordinator. Never silently change the contract or test to get green.
5. A test-specification correction requires permission in the assignment, an exact documented delta, fresh execution and distinct independent review. A product behavior change requires owner approval.
6. Run the required final checks. Nonzero exit, zero tests, unexpected skips, missing evidence or stale inputs are not success.

## Independent review

Review the actual target and test changes against the approved revision. Identify weak assertions, unapproved constraints, fake pass paths, meaningful gaps, changed public surface and evidence mismatch. Do not edit the work being reviewed. A reviewer verdict is not a different required specialist gate.

Preserve previous evidence and test membership. Do not require identical results after an approved expectation change; inspect its exact delta and all unaffected regressions.
