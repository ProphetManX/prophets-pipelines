// Author checks executed by the parent, not a claimed UI RED baseline.
// Evaluate this entire expression on a dashboard page loaded with the candidate app.js.
// The parent must await page.reload() in a finally block, including on assertion failure.
(async () => {
  const checks = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const equal = (actual, expected, message) =>
    assert(JSON.stringify(actual) === JSON.stringify(expected),
      `${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  const check = async (name, body) => {
    try {
      await body();
      checks.push(name);
    } catch (error) {
      throw new Error(`${name}: ${error.message}`);
    }
  };

  const lead = "fixture-lead";
  const a = "fixture-tests-a";
  const b = "fixture-tests-b"; // Same role and slice as A, but a distinct delegation.
  const c = "fixture-build-c";
  const d = "fixture-review-d"; // A routine-only delegation for the key filter.
  const e = "fixture-build-e"; // Unlinked worker, same role and slice as C.
  const roles = new Map([
    [lead, "lead"], [a, "tests"], [b, "tests"], [c, "build"], [d, "review"], [e, "build"],
  ]);
  const verdict = "Changes requested; boundary review still needed";
  const redNote = "Expected regression failure before implementation; exact identity not certified.";
  const makeEvent = (id, reporter, eventType, counterparty = null, extra = {}) => ({
    event_id: id,
    slice_id: "shared-slice",
    invocation_id: reporter,
    role: roles.get(reporter),
    counterparty_invocation_id: counterparty,
    counterparty_role: roles.get(counterparty) || null,
    event_type: eventType,
    status: "in_progress",
    summary: `Original event ${id}: unique full summary sentinel.`,
    created_at: new Date(Date.UTC(2026, 9, 24, 12, 0, id)).toISOString(),
    gaps: [`Historical gap ${id} remains a report, not a verdict.`],
    evidence: [{
      kind: "report", uri: `fixture-event-${id}.txt`, summary: `Reference ${id}`,
      check_result: "present_not_independently_verified",
      expected_outcome: "pass", expectation_note: "",
    }],
    ...extra,
  });
  const run = {
    run_id: "in-memory-reporting-checks",
    project_name: "Disposable dashboard fixture",
    objective: "No API writes and no real journal data",
    requirements_ref: "Owner-approved reporting upgrade",
    created_at: "2026-10-24T12:00:00.000Z",
    slices: [{
      slice_id: "shared-slice", title: "Reporting", acceptance: "Preserve original history",
      required_evidence: ["test_result", "review"], status: "in_progress",
    }],
    invocations: [...roles].map(([id, role]) => ({
      invocation_id: id, slice_id: "shared-slice", role,
      started_at: "2026-10-24T12:00:00.000Z", last_reported_at: null, status: "registered",
    })),
    events: [
      makeEvent(1, lead, "handoff_sent", a),
      makeEvent(2, a, "handoff_received", lead),
      makeEvent(3, a, "invocation_started"),
      makeEvent(4, lead, "handoff_sent", b),
      makeEvent(5, b, "handoff_received", lead),
      makeEvent(6, b, "invocation_started"),
      makeEvent(7, lead, "handoff_sent", d),
      makeEvent(8, d, "handoff_received", lead),
      makeEvent(9, d, "invocation_started"),
      makeEvent(10, lead, "review_requested", d),
      makeEvent(11, c, "note"),
      makeEvent(12, lead, "review_returned", a, {
        status: "claimed_complete", review_verdict: verdict,
        summary: "Approved. Ready for implementation. Prose must not override the explicit verdict.",
      }),
      makeEvent(13, lead, "review_returned", b, {
        // Legacy event deliberately omits review_verdict despite approval-shaped prose.
        summary: "Approved. Ready for implementation. No structured verdict was recorded.",
      }),
      makeEvent(14, a, "evidence_attached", null, {
        evidence: [{
          kind: "test_result", uri: "expected-red.trx", summary: "Mechanical expected failure",
          check_result: "expected_red_observed; not independently verified",
          expected_outcome: "red", expectation_note: redNote,
        }],
      }),
      makeEvent(15, e, "note"),
      makeEvent(16, c, "phase_changed"),
      makeEvent(17, a, "completion_claimed", null, { status: "claimed_with_gaps" }),
      makeEvent(18, b, "phase_changed"),
      makeEvent(19, lead, "note"),
    ],
  };
  const original = JSON.stringify(run);
  const expectedMembers = new Map([
    [a, [17, 14, 12, 3, 2, 1]],
    [b, [18, 13, 6, 5, 4]],
    [d, [10, 9, 8, 7]],
  ]);
  const originalIds = run.events.map(event => event.event_id);
  const model = buildModel(run);
  const items = delegationItems(model, model.events);
  const group = (list, worker) => list.find(item => item.worker === worker);
  const feedRows = () => [...detailElement.querySelectorAll("#feed .feed > details.event")];
  const groupRow = worker => feedRows().find(row =>
    row.dataset.anchor === group(delegationItems(current.model, current.model.events), worker)?.key);
  const eventRowFor = id => {
    const summary = [...detailElement.querySelectorAll("#feed summary[data-key]")].find(element =>
      element.dataset.key === `member:${id}` || element.dataset.key === `feed:${id}`);
    assert(summary, `Original event ${id} has no rendered row`);
    return summary.parentElement;
  };
  const open = async row => {
    assert(row instanceof HTMLDetailsElement, "Expected an actual details element");
    if (row.open) return;
    await new Promise(resolve => {
      row.addEventListener("toggle", resolve, { once: true });
      row.open = true;
    });
  };
  const memberIds = row => [...row.querySelectorAll(".delegation-body > details > summary[data-key]")]
    .map(summary => Number(summary.dataset.key.slice("member:".length)));
  const openGroups = async () => {
    for (const row of feedRows().filter(row => row.classList.contains("delegation"))) await open(row);
  };
  const assertOriginalBody = async event => {
    const row = eventRowFor(event.event_id);
    await open(row);
    const body = row.querySelector(".event-body");
    assert(body, `Event ${event.event_id} body was not rendered`);
    const text = body.textContent;
    assert(text.includes(event.summary), `Event ${event.event_id} lost its original prose`);
    assert(text.includes(`${event.role} ${event.invocation_id}`),
      `Event ${event.event_id} lost its actual reporter`);
    assert(text.includes(event.created_at), `Event ${event.event_id} lost its original timestamp`);
    assert(text.includes(`event #${event.event_id}`), `Event ${event.event_id} lost its ID`);
    equal(row.querySelector("summary .time").title, event.created_at, "Timestamp tooltip");
    if (event.counterparty_invocation_id) {
      assert(text.includes(event.counterparty_invocation_id),
        `Event ${event.event_id} lost its counterparty`);
    }
    for (const gap of event.gaps) assert(text.includes(gap), `Event ${event.event_id} lost a gap`);
    for (const evidence of event.evidence) {
      const evidenceText = [...body.querySelectorAll(".evidence")].map(node => node.textContent).join("\n");
      assert(evidenceText.includes(evidence.uri) && evidenceText.includes(evidence.check_result),
        `Event ${event.event_id} lost its evidence URI/check`);
    }
  };
  const rawIds = () => feedRows().map(row => Number(row.dataset.anchor));
  const show = (raw, keyOnly = false, invocation = "") => {
    view.raw = raw;
    view.keyOnly = keyOnly;
    view.invocation = invocation;
    fillFeed(); // Actual production selection, grouping and DOM rendering.
  };

  // Prevent polling/in-flight detail loads from replacing the in-memory fixture.
  // Save browser state defensively; the parent's finally/reload is the final cleanup.
  const saved = {
    current, selectedRun, polling, hidden: detailElement.hidden,
    raw: view.raw, keyOnly: view.keyOnly, invocation: view.invocation,
    toggled: new Set(view.toggled),
    children: [...detailElement.childNodes],
  };
  polling = true;
  selectedRun = "";
  detailRequest++;
  view.toggled.clear();
  current = { model };
  detailElement.hidden = false;
  detailElement.replaceChildren(feedSection());
  try {
    await check("three explicit Lead-linked 4+ event delegations collapse independently", () => {
      equal(items.filter(item => item.worker).length, 3, "Delegation count");
      for (const [worker, ids] of expectedMembers) {
        const matching = items.filter(item => item.worker === worker);
        equal(matching.length, 1, `One group for ${worker}`);
        equal(matching[0].members.map(event => event.event_id), ids, `${worker} original membership`);
      }
    });
    await check("unrelated workers stay separate and no original event is merged away", () => {
      for (const id of [11, 15, 16, 19]) {
        const item = items.find(candidate => candidate.members.some(event => event.event_id === id));
        assert(item && !item.worker, `Unlinked event ${id} must remain standalone`);
        equal(item.members.map(event => event.event_id), [id], `Unlinked event ${id} membership`);
      }
      equal(items.flatMap(item => item.members.map(event => event.event_id)).sort((x, y) => x - y),
        originalIds, "Every original ID occurs exactly once");
    });
    await check("delegations and standalone events are ordered by latest event", () => {
      equal(items.map(item => item.event.event_id), [19, 18, 17, 16, 15, 11, 10], "Latest-first model");
      show(false);
      equal(feedRows().map(row => row.dataset.anchor), items.map(item => item.key), "Latest-first DOM");
    });
    await check("all nested original reporters timestamps gaps and evidence remain available", async () => {
      await openGroups();
      for (const [worker, ids] of expectedMembers) equal(memberIds(groupRow(worker)), ids, `${worker} nested history`);
      for (const event of run.events) await assertOriginalBody(event);
    });
    await check("unknown legacy verdict stays not recorded despite approval prose", () => {
      const row = eventRowFor(13);
      const chips = [...row.querySelectorAll(".verdict")];
      assert(chips.length > 0, "Legacy review must display an unspecified verdict");
      assert(chips.every(chip => chip.textContent === "Verdict: not recorded"),
        "Legacy verdict must not be inferred from prose/status");
      assert(groupRow(b).querySelector("summary .verdict").textContent.includes("not recorded"),
        "Collapsed legacy review also needs an unspecified verdict");
    });
    await check("explicit review verdict and contradictory work status remain distinct", () => {
      const row = eventRowFor(12);
      equal(row.querySelector("summary .verdict").textContent, `Verdict: ${verdict}`, "Explicit verdict");
      equal(row.querySelector("summary .status-claimed_complete").textContent, "claimed_complete", "Work status");
      assert([...row.querySelectorAll(".verdict")].every(chip => chip.textContent === `Verdict: ${verdict}`),
        "Original review verdict must survive expansion");
      equal(groupRow(a).querySelector("summary .verdict").textContent, `Verdict: ${verdict}`, "Grouped verdict");
      assert(groupRow(a).querySelector("summary").textContent.includes("claimed_with_gaps"),
        "Latest work status must remain separate from the historical review verdict");
    });
    await check("expected RED label check and expectation note are visible", () => {
      const row = eventRowFor(14);
      assert(row.open && groupRow(a).open, "Expected RED details must be expanded");
      assert(row.querySelector("summary .expected-red").textContent.includes("Expected RED"),
        "Missing expected RED label");
      const evidence = row.querySelector(".event-body .evidence").textContent;
      assert(evidence.includes(redNote), "Expected RED note was lost");
      assert(evidence.includes("expected_red_observed; not independently verified"),
        "Expected RED must not be relabeled as verified passing evidence");
    });
    await check("raw mode exposes every original ID and full original bodies", async () => {
      show(true);
      equal(rawIds(), [...originalIds].reverse(), "Raw original IDs");
      assert(!detailElement.querySelector("#feed .delegation"), "Raw view must not collapse events");
      for (const event of run.events) await assertOriginalBody(event);
    });
    await check("key filter retains complete history inside included delegations", async () => {
      show(false, true);
      await openGroups();
      for (const worker of [a, b]) {
        equal(memberIds(groupRow(worker)), expectedMembers.get(worker), `${worker} complete key-group history`);
        for (const id of expectedMembers.get(worker)) await assertOriginalBody(run.events.find(event => event.event_id === id));
      }
      assert(!groupRow(d), "Routine-only delegation should be hidden by the key filter");
      show(true, true);
      equal(rawIds(), [19, 18, 17, 16, 15, 14, 13, 12, 11], "Raw key-event IDs");
    });
    await check("worker filter retains Lead relays and all member history without peers", async () => {
      for (const worker of [a, b]) {
        show(false, true, worker);
        equal(feedRows().length, 1, `Only ${worker} delegation`);
        await open(groupRow(worker));
        equal(memberIds(groupRow(worker)), expectedMembers.get(worker), `${worker} filtered grouped history`);
        for (const id of expectedMembers.get(worker)) await assertOriginalBody(run.events.find(event => event.event_id === id));
        show(true, false, worker);
        equal(rawIds(), expectedMembers.get(worker), `${worker} filtered raw history including relays`);
      }
    });
    await check("appending an event preserves group key and group/member open state", async () => {
      show(false);
      const before = group(items, a).key;
      await open(groupRow(a));
      await open(eventRowFor(12));
      const updated = { ...run, events: [...run.events, makeEvent(20, a, "note")] };
      current = { model: buildModel(updated) };
      fillFeed();
      const after = group(delegationItems(current.model, current.model.events), a);
      equal(after.key, before, "Stable delegation key");
      equal(feedRows()[0].dataset.anchor, before, "Updated delegation moves to latest-first position");
      assert(groupRow(a).open, "Expanded delegation must remain open after refresh");
      assert(eventRowFor(12).open, "Expanded original member must remain open after refresh");
      equal(memberIds(groupRow(a)), [20, ...expectedMembers.get(a)], "Appended and original member IDs");
      for (const id of expectedMembers.get(a)) await assertOriginalBody(run.events.find(event => event.event_id === id));
    });
    await check("raw view includes appended event without rewriting historical fixture", () => {
      show(true);
      equal(rawIds(), [20, ...[...originalIds].reverse()], "Raw IDs after append");
      equal(JSON.stringify(run), original, "Original historical fixture is unchanged");
    });
    return { check_count: checks.length, checks, original_event_count: 19, final_event_count: 20 };
  } finally {
    // Drain native details toggle tasks before restoring the original view state.
    await new Promise(resolve => window.setTimeout(resolve, 0));
    current = saved.current;
    selectedRun = saved.selectedRun;
    polling = saved.polling;
    view.raw = saved.raw;
    view.keyOnly = saved.keyOnly;
    view.invocation = saved.invocation;
    view.toggled.clear();
    for (const key of saved.toggled) view.toggled.add(key);
    detailElement.replaceChildren(...saved.children);
    detailElement.hidden = saved.hidden;
  }
})()
