---
name: pw-pragmatic-engineering
description: "Apply smallest-complete-solution engineering to implementation, tests, refactoring and review. Use when deciding whether to add validation, abstraction, preflight, configuration, fallback or error handling; avoid speculative restrictions without cutting correctness."
user-invocable: false
---
# Pragmatic Engineering

Implement the smallest complete solution to the approved behavior—not the fewest lines at any cost and not an imagined future framework.

## Decide proportionately

Before adding a validation branch, restriction, abstraction, configuration switch, preflight, retry or fallback, ask:

1. Which approved behavior, real invariant, or concrete evidenced failure does it protect?
2. Is the same obligation already enforced at a more appropriate boundary?
3. Would this reject a valid use or encode a changeable environment fact as a hard-coded list?
4. Can ordinary new configurations use the existing generic path?
5. Is there a smaller complete design that preserves the required guarantee?

If the need is speculative, omit it or identify it as an optional, nonblocking future idea. Do not add mechanisms merely because they might become useful.

## Validation and errors

- Validate public inputs where a documented contract, safe operation, or well-understood failure requires it. Do not narrow accepted values to the examples, a developer's preferences, or the easiest implementation.
- Internal code can rely on a guarantee already established at the proper boundary; duplicated validation should have a concrete purpose.
- For an extensible list of equivalent targets, keep target-specific facts in one configuration source and use generic behavior. An ordinary additional target should not require editing several allowlists or validation algorithms.
- Preserve useful failures, actionable diagnostics, security boundaries, isolation and rollback obligations that the accepted design actually requires.
- Never swallow a failure, fake success, return a success-shaped fallback, or weaken a valid test to make a path appear simpler.
- Distinguish a real error-prevention guarantee from a preflight that cannot guarantee the later operation will succeed.

## TDD and review

- Derive tests from approved observable behavior and material failure risks, not guesses at the implementation.
- Include openness/extensibility cases when the requirement promises them. A valid unfamiliar identifier is a positive test, not a rejection candidate.
- The implementation author does not revise specifications to obtain green. A demonstrable test/requirement conflict follows the explicit independent correction and review path; a changed product behavior returns to the owner.
- Reviewers question both absent safeguards and restrictions without a contract or evidenced risk. Hypothetical hardening preferences are not blocking defects.
- In published libraries, a genuinely public contract merits correct, robust behavior. That does not imply rejecting every unfamiliar or extensible input.

## Examples

**Over-restrictive:** deployment code supports arbitrary named pools, but each validator separately enumerates the two original pools. Adding a third equivalent pool requires editing ten files.

**Proportionate:** define each pool once; generic checks validate the inputs the deployment operation actually requires. Adding an equivalent pool changes its configuration, not the validation algorithm. Add separate behavior only when the new pool actually differs.

**Not a shortcut:** a required dependency is null, so code silently substitutes an empty object and claims success.

**Complete and proportionate:** reject or surface the missing required dependency clearly at the ownership boundary and preserve unrelated independent work.

These are judgment examples, not universal API contracts. The project's accepted requirements remain authoritative.
