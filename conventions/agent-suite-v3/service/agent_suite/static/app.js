"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";
const ROUTINE_TYPES = new Set(["handoff_sent", "handoff_received", "invocation_started", "review_requested"]);
const MARKERS = new Map([
  ["review_returned", { shape: "diamond", name: "review returned" }],
  ["completion_claimed", { shape: "square", name: "completion claimed" }],
  ["evidence_attached", { shape: "circle", name: "evidence attached" }],
  ["decision_needed", { shape: "hexagon", name: "decision needed" }],
  ["blocked", { shape: "up", name: "blocked" }],
  ["interrupted", { shape: "down", name: "interrupted" }],
  ["failed", { shape: "cross", name: "failed" }],
]);
const SHAPES = {
  diamond: [[0, -6], [6, 0], [0, 6], [-6, 0]],
  up: [[0, -6], [6, 5], [-6, 5]],
  down: [[0, 6], [6, -5], [-6, -5]],
  hexagon: [[6, 0], [3, 5.2], [-3, 5.2], [-6, 0], [-3, -5.2], [3, -5.2]],
  cross: [[-1.8, -6], [1.8, -6], [1.8, -1.8], [6, -1.8], [6, 1.8], [1.8, 1.8], [1.8, 6], [-1.8, 6], [-1.8, 1.8], [-6, 1.8], [-6, -1.8], [-1.8, -1.8]],
};
const CHART = { gutter: 88, right: 30, top: 8, row: 22, gap: 4, pad: 4, axis: 26, minBar: 10, barGap: 3, minWidth: 560 };
const TICK_STEPS = [1, 5, 10, 15, 30, 60, 120, 180, 360, 720, 1440, 10080, 43200].map(minutes => minutes * 60000);

const runsElement = document.getElementById("runs");
const detailElement = document.getElementById("detail");
const connectionElement = document.getElementById("connection");
const view = { keyOnly: false, raw: false, invocation: "", toggled: new Set() };
let selectedRun = window.location.hash.slice(1);
let detailRequest = 0;
let polling = false;
let runsSnapshot = "";
let runSnapshot = "";
let current = null;
let resizeTimer = 0;

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = String(text);
  if (className) element.className = className;
  return element;
}

function svgNode(tag, attributes, text) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  if (text !== undefined) element.textContent = String(text);
  return element;
}

function token(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

function chip(status) {
  return node("span", status || "unknown", `chip status-${token(status)}`);
}

function clip(text, length) {
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function typeName(type) {
  return String(type).replace(/_/g, " ");
}

function toMs(value) {
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function clock(ms, seconds) {
  return new Date(ms).toLocaleTimeString([], { timeStyle: seconds ? "medium" : "short" });
}

function stamp(ms) {
  return new Date(ms).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" });
}

function dateTime(value) {
  const ms = toMs(value);
  return ms === null ? String(value || "") : new Date(ms).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function duration(ms) {
  if (ms < 60000) return `${Math.round(ms / 1000)} s`;
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ${minutes % 60} min`;
  return `${Math.floor(hours / 24)} d ${hours % 24} h`;
}

function ago(ms) {
  const elapsed = Date.now() - ms;
  return elapsed < 45000 ? "just now" : `${duration(elapsed)} ago`;
}

function agoNode(ms) {
  const element = node("time", ago(ms), "ago");
  element.dateTime = new Date(ms).toISOString();
  element.dataset.time = String(ms);
  return element;
}

function refreshAgo() {
  for (const element of detailElement.querySelectorAll("time.ago")) element.textContent = ago(Number(element.dataset.time));
}

function headline(text) {
  const flat = String(text || "").replace(/\s+/g, " ").trim();
  const sentence = flat.match(/^.{12,}?[.!?](?=\s|$)/);
  return clip(sentence ? sentence[0] : flat, 160);
}

function countBy(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function plural(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

// Drops the id prefix shared by every invocation and any date token, so "logger-m5-inbound-review-20261024-r7" reads "review-r7".
// Labels that still collide keep their date token, and only then fall back to the full id.
function shortLabels(ids) {
  const parts = ids.map(id => id.split("-"));
  let shared = 0;
  if (parts.length > 1) {
    const limit = Math.min(...parts.map(list => list.length)) - 1;
    while (shared < limit && parts.every(list => list[shared] === parts[0][shared])) shared++;
  }
  const stripped = parts.map(list => list.slice(shared));
  const labels = new Map(ids.map((id, index) => [id, stripped[index].filter(part => !/^\d{8}$/.test(part)).join("-") || id]));
  let counts = countBy([...labels.values()]);
  ids.forEach((id, index) => {
    if (counts.get(labels.get(id)) > 1) labels.set(id, stripped[index].join("-") || id);
  });
  counts = countBy([...labels.values()]);
  for (const id of ids) if (counts.get(labels.get(id)) > 1) labels.set(id, id);
  return labels;
}

// The Lead relays worker results, so an event the Lead reports about a counterparty belongs to that worker.
function ownerOf(event) {
  return event.role === "lead" && event.counterparty_invocation_id ? event.counterparty_invocation_id : event.invocation_id;
}

function who(model, role, id) {
  const label = model.label(id);
  const name = role || "worker";
  return label.startsWith(name) ? label : `${name} · ${label}`;
}

function actorText(model, event) {
  const actor = who(model, event.role, event.invocation_id);
  return event.counterparty_invocation_id
    ? `${actor} ↔ ${who(model, event.counterparty_role, event.counterparty_invocation_id)}`
    : actor;
}

function buildModel(run) {
  const ids = new Set(run.invocations.map(item => item.invocation_id));
  for (const event of run.events) {
    ids.add(event.invocation_id);
    if (event.counterparty_invocation_id) ids.add(event.counterparty_invocation_id);
  }
  const labels = shortLabels([...ids]);
  const events = run.events
    .map(event => ({ ...event, ms: toMs(event.created_at), owner: ownerOf(event) }))
    .sort((a, b) => (b.ms ?? -Infinity) - (a.ms ?? -Infinity) || b.event_id - a.event_id);
  const byId = new Map(run.invocations.map(item => [item.invocation_id, {
    ...item,
    startedMs: toMs(item.started_at),
    reported: Boolean(item.last_reported_at),
    owned: [],
    first: null,
    last: null,
  }]));
  for (const event of events) {
    const worker = byId.get(event.owner);
    if (!worker) continue;
    worker.owned.push(event);
    if (event.ms === null) continue;
    worker.first = worker.first === null ? event.ms : Math.min(worker.first, event.ms);
    worker.last = worker.last === null ? event.ms : Math.max(worker.last, event.ms);
  }
  for (const worker of byId.values()) {
    if (worker.first === null) worker.first = worker.last = worker.startedMs;
  }
  const timed = events.filter(event => event.ms !== null);
  return {
    run,
    events,
    byId,
    workers: [...byId.values()],
    label: id => labels.get(id) || id,
    latest: events[0] || null,
    firstMs: timed.length ? timed[timed.length - 1].ms : null,
    lastMs: timed.length ? timed[0].ms : null,
    multiDay: new Set(timed.map(event => new Date(event.ms).toDateString())).size > 1,
  };
}

function markSelectedRun() {
  for (const button of runsElement.querySelectorAll(".run-button")) {
    if (button.dataset.run === selectedRun) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  }
}

function renderRuns(runs) {
  runsElement.replaceChildren();
  for (const run of runs) {
    const button = node("button", undefined, "run-button");
    button.type = "button";
    button.dataset.run = run.run_id;
    button.append(node("strong", `${run.project_name} · ${run.run_id}`));
    button.append(node("span", `${plural(run.slice_count, "slice")} · ${plural(run.event_count, "event")} · ${dateTime(run.created_at)}`));
    button.addEventListener("click", () => {
      if (selectedRun === run.run_id) {
        loadRun(selectedRun).catch(error => {
          connectionElement.textContent = `Journal detail unavailable: ${error.message}`;
        });
      } else {
        window.location.hash = run.run_id;
      }
    });
    runsElement.append(button);
  }
  if (runs.length === 0) runsElement.append(node("p", "No runs have been registered."));
  markSelectedRun();
}

async function loadRuns() {
  connectionElement.textContent = "Loading journal…";
  try {
    const response = await fetch("/api/runs", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    if (text !== runsSnapshot) {
      runsSnapshot = text;
      renderRuns(JSON.parse(text).runs);
    }
    if (selectedRun) await loadRun(selectedRun);
    connectionElement.textContent = `Journal connected · refreshed ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    connectionElement.textContent = `Journal unavailable: ${error.message}. This does not indicate agent or product status.`;
  }
}

function byKey(key) {
  return detailElement.querySelector(`[data-key="${CSS.escape(key)}"]`);
}

// Open/closed state lives in view.toggled so it survives the re-render that follows each journal change.
function rememberedDetails(key, openByDefault, className, summary) {
  const details = node("details", undefined, className);
  details.open = openByDefault !== view.toggled.has(key);
  summary.dataset.key = key;
  details.append(summary);
  details.addEventListener("toggle", () => {
    if (details.open === openByDefault) view.toggled.delete(key);
    else view.toggled.add(key);
  });
  return details;
}

function verdictChip(event) {
  const label = event.review_verdict || "not recorded";
  const element = node("span", `Verdict: ${label}`, "chip verdict");
  element.title = "Reported review verdict, separate from work status; not independent journal approval.";
  return element;
}

function delegationItems(model, events) {
  const delegated = new Set(model.events.filter(event =>
    event.counterparty_role === "lead" && event.role !== "lead" && ROUTINE_TYPES.has(event.event_type) ||
    event.role === "lead" && event.counterparty_invocation_id && ROUTINE_TYPES.has(event.event_type))
    .map(event => event.owner));
  const groups = new Map();
  const items = [];
  for (const event of events) {
    if (!delegated.has(event.owner) || model.byId.get(event.owner)?.role === "lead") {
      items.push({ event, members: [event], key: String(event.event_id) });
      continue;
    }
    let item = groups.get(event.owner);
    if (!item) {
      item = { event, members: [], worker: event.owner, key: `delegation:${event.owner}` };
      groups.set(event.owner, item);
      items.push(item);
    }
    item.members.push(event);
  }
  return items;
}

function delegationRow(model, item) {
  const latest = item.event;
  const outcome = item.members.find(event => !ROUTINE_TYPES.has(event.event_type)) || latest;
  const summary = node("summary");
  const time = node("span", latest.ms === null ? "—" : clock(latest.ms, true), "time");
  time.title = `Latest event: ${latest.created_at}`;
  const meta = node("span", undefined, "meta");
  meta.append(node("span", `Delegation · ${model.label(item.worker)}`, "type"));
  meta.append(node("span", `Last report: ${outcome.status}`, `chip status-${token(outcome.status)}`));
  const review = item.members.find(event => event.event_type === "review_returned");
  if (review) meta.append(verdictChip(review));
  const gaps = item.members.reduce((count, event) => count + event.gaps.length, 0);
  meta.append(node("span", plural(item.members.length, "event"), "badge"));
  if (gaps) meta.append(node("span", `${gaps} historical ${gaps === 1 ? "gap" : "gaps"}`, "badge gap"));
  const main = node("span", undefined, "main");
  main.append(meta, node("span", headline(outcome.summary), "headline"));
  summary.append(time, main);
  const row = rememberedDetails(`feed:${item.key}`, false, "event delegation", summary);
  const fill = () => {
    if (row.querySelector(".delegation-body")) return;
    const body = node("div", undefined, "delegation-body");
    body.append(node("p", "Original events · newest first. Work status and reported review verdict are separate; historical gaps remain visible.", "hint"));
    for (const event of item.members) body.append(eventRow(model, event, `member:${event.event_id}`, false));
    row.append(body);
  };
  row.addEventListener("toggle", () => { if (row.open) fill(); });
  if (row.open) fill();
  return row;
}

function eventBody(event) {
  const body = node("div", undefined, "event-body");
  body.append(node("p", event.summary, "full"));
  const exchange = event.counterparty_invocation_id
    ? ` ↔ ${event.counterparty_role || "worker"} ${event.counterparty_invocation_id}`
    : "";
  body.append(node("p", `${event.event_type} · ${event.role} ${event.invocation_id}${exchange} · slice ${event.slice_id} · event #${event.event_id} · ${event.created_at}`, "detail muted"));
  for (const gap of event.gaps) body.append(node("p", `Gap: ${gap}`, "gap"));
  if (event.event_type === "review_returned") body.append(verdictChip(event));
  for (const item of event.evidence) {
    const expected = item.expected_outcome === "red" ? ` · expected RED: ${item.expectation_note}` : "";
    body.append(node("p", `${item.kind}: ${item.uri} — ${item.check_result}${expected}`, "evidence"));
  }
  return body;
}

function eventRow(model, event, key, inCard) {
  const summary = node("summary");
  const time = node("span", event.ms === null ? "—" : (inCard ? stamp(event.ms) : clock(event.ms, true)), "time");
  time.title = event.created_at;
  const meta = node("span", undefined, "meta");
  meta.append(node("span", typeName(event.event_type), "type"));
  const work = chip(event.status);
  work.title = "Reporter work status, not the review verdict.";
  meta.append(work);
  if (event.event_type === "review_returned") meta.append(verdictChip(event));
  const redCount = event.evidence.filter(item => item.expected_outcome === "red").length;
  if (redCount) meta.append(node("span", `Expected RED ×${redCount}`, "badge expected-red"));
  meta.append(node("span", actorText(model, event), "who"));
  if (event.gaps.length) meta.append(node("span", `${event.gaps.length} ${event.gaps.length === 1 ? "gap" : "gaps"}`, "badge gap"));
  if (event.evidence.length) meta.append(node("span", `${event.evidence.length} evidence`, "badge"));
  const main = node("span", undefined, "main");
  main.append(meta, node("span", headline(event.summary), "headline"));
  summary.append(time, main);
  const kind = ROUTINE_TYPES.has(event.event_type) ? "routine" : "key";
  const row = rememberedDetails(key, false, `event ${kind}${inCard ? " in-card" : ""}`, summary);
  const fill = () => {
    if (!row.querySelector(".event-body")) row.append(eventBody(event));
  };
  row.addEventListener("toggle", () => {
    if (row.open) fill();
  });
  if (row.open) fill();
  return row;
}

function sliceCard(model, slice) {
  const card = node("article", undefined, "slice-card");
  card.append(node("h4", slice.title));
  const status = node("p", "Last reported status: ");
  status.append(chip(slice.status));
  card.append(status);

  const attached = new Map();
  for (const event of model.events) {
    if (event.slice_id !== slice.slice_id) continue;
    for (const item of event.evidence) {
      if (!attached.has(item.kind)) attached.set(item.kind, new Set());
      attached.get(item.kind).add(item.uri);
    }
  }
  const required = Array.isArray(slice.required_evidence) ? slice.required_evidence : [];
  const kinds = [...required, ...[...attached.keys()].filter(kind => !required.includes(kind))];
  if (kinds.length) {
    const evidence = node("p", undefined, "evidence-row");
    evidence.append(node("span", "Evidence attached anywhere in this slice (required kinds first; present is not verified): ", "muted"));
    for (const kind of kinds) {
      const count = attached.has(kind) ? attached.get(kind).size : 0;
      evidence.append(node("span", count ? `${kind} ×${count}` : `${kind} · none yet`, `chip kind${count ? "" : " missing"}`));
    }
    card.append(evidence);
  }

  const review = model.events.find(event => event.slice_id === slice.slice_id && event.event_type === "review_returned");
  if (review) {
    const result = node("p", "Latest reported review: ");
    result.append(verdictChip(review));
    card.append(result);
  }
  const red = model.events.flatMap(event => event.slice_id === slice.slice_id ? event.evidence : [])
    .filter(item => item.expected_outcome === "red");
  if (red.length) card.append(node("p", `${red.length} expected RED evidence references (not passing validation; expand the events for checks and expectation notes).`, "expected-red"));
  const claim = model.events.find(event => event.slice_id === slice.slice_id && event.event_type === "completion_claimed");
  if (claim) {
    card.append(node("p", "Latest completion claim (a claim, not approval):", "muted"));
    card.append(eventRow(model, claim, `claim:${claim.event_id}`, true));
  }
  const acceptance = rememberedDetails(`acceptance:${slice.slice_id}`, false, "acceptance", node("summary", "Acceptance criteria"));
  acceptance.append(node("p", slice.acceptance, "full"));
  card.append(acceptance);
  return card;
}

function latestLine(model) {
  const line = node("p", undefined, "latest");
  const event = model.latest;
  if (!event) {
    line.textContent = "No activity has been reported yet.";
    return line;
  }
  line.append("Latest report ");
  if (event.ms !== null) line.append(agoNode(event.ms), ` (${clock(event.ms, true)})`);
  line.append(" — ", node("strong", actorText(model, event)), ` ${typeName(event.event_type)} `, chip(event.status));
  if (event.event_type === "review_returned") line.append(" ", verdictChip(event));
  const text = headline(event.summary);
  if (text) line.append(node("span", ` — ${text}`, "muted"));
  return line;
}

function factList(model) {
  const list = node("dl", undefined, "facts");
  const add = (term, text) => list.append(node("dt", term), node("dd", text));
  if (model.firstMs !== null) {
    const edge = ms => (model.multiDay ? stamp(ms) : clock(ms));
    add("Activity span", `${edge(model.firstMs)} → ${edge(model.lastMs)} (${duration(model.lastMs - model.firstMs)})`);
  }
  const withGaps = model.events.filter(event => event.gaps.length).length;
  add("Events", `${model.events.length} reported · ${withGaps} with journal gaps`);
  const roles = [...countBy(model.workers.map(worker => worker.role))].map(([role, count]) => `${role} ${count}`).join(", ");
  const quiet = model.workers.filter(worker => !worker.reported).length;
  add("Workers", `${plural(model.workers.length, "invocation")}${roles ? ` (${roles})` : ""}${quiet ? ` · ${quiet} registered with no self-report yet` : ""}`);
  return list;
}

function workersTable(model) {
  const details = rememberedDetails("workers", false, "workers", node("summary", `Workers (${model.workers.length})`));
  const headRow = node("tr");
  for (const title of ["Worker", "Own last report", "Events about it"]) {
    const cell = node("th", title);
    cell.scope = "col";
    headRow.append(cell);
  }
  const head = node("thead");
  head.append(headRow);
  const body = node("tbody");
  const workers = [...model.workers].sort((a, b) =>
    (b.startedMs ?? -Infinity) - (a.startedMs ?? -Infinity) || (a.invocation_id < b.invocation_id ? -1 : 1));
  for (const worker of workers) {
    const row = node("tr");
    const name = node("td");
    const button = node("button", model.label(worker.invocation_id), "link");
    button.type = "button";
    button.title = `${worker.invocation_id}\nShow only events about this worker`;
    button.dataset.key = `worker:${worker.invocation_id}`;
    button.addEventListener("click", () => selectInvocation(worker.invocation_id, true));
    name.append(button, node("span", ` ${worker.role}`, "muted"));
    const report = node("td");
    const reportedMs = toMs(worker.last_reported_at);
    if (worker.reported) {
      report.append(chip(worker.status));
      if (reportedMs !== null) report.append(` ${clock(reportedMs)} · `, agoNode(reportedMs));
    } else {
      report.textContent = "registered · no self-report yet";
    }
    row.append(name, report, node("td", worker.owned.length));
    body.append(row);
  }
  const table = node("table", undefined, "workers-table");
  table.append(head, body);
  details.append(table);
  return details;
}

function summarySection(model) {
  const section = node("section", undefined, "panel summary");
  section.append(node("h3", "Where things stand"), latestLine(model));
  for (const slice of model.run.slices) section.append(sliceCard(model, slice));
  section.append(factList(model));
  if (model.workers.length) section.append(workersTable(model));
  return section;
}

function tickLabel(ms, step, span) {
  if (step >= 86400000) return new Date(ms).toLocaleDateString([], { month: "short", day: "numeric" });
  if (span > 20 * 3600000) return new Date(ms).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  return clock(ms);
}

function markerShape(shape, x, y) {
  if (shape === "circle") return svgNode("circle", { cx: x, cy: y, r: 4.5, class: "mark" });
  if (shape === "square") return svgNode("rect", { x: x - 4, y: y - 4, width: 8, height: 8, class: "mark" });
  const element = svgNode("polygon", { points: SHAPES[shape].map(([dx, dy]) => `${x + dx},${y + dy}`).join(" "), class: "mark" });
  if (shape === "cross") element.setAttribute("transform", `rotate(45 ${x} ${y})`);
  return element;
}

function barGroup(model, bar, y, scale) {
  const worker = bar.worker;
  const label = model.label(worker.invocation_id);
  const lines = [
    `${label} (${worker.role})`,
    worker.invocation_id,
    worker.reported ? `Own last report: ${worker.status} · ${dateTime(worker.last_reported_at)}` : "No self-report yet (registered only)",
    `${plural(worker.owned.length, "event")} about it · ${clock(worker.first, true)} → ${clock(worker.last, true)}`,
    "Click to show only its events",
  ];
  const group = svgNode("g", {
    class: `bar-group ${worker.reported ? `status-${token(worker.status)}` : "hollow"}`,
    role: "button",
    tabindex: 0,
    "aria-pressed": "false",
    "aria-label": `${label}, ${worker.role}, ${worker.reported ? `last reported ${worker.status}` : "no self-report yet"}, ${plural(worker.owned.length, "event")}. Show only its events`,
    "data-invocation": worker.invocation_id,
    "data-key": `bar:${worker.invocation_id}`,
  });
  group.append(svgNode("title", {}, lines.join("\n")));
  group.append(svgNode("rect", { x: bar.x, y, width: bar.width, height: CHART.row, rx: 4, class: "bar" }));
  const inner = label.startsWith(`${worker.role}-`) ? label.slice(worker.role.length + 1) : label;
  if (inner.length * 6.4 + 10 <= bar.width) {
    group.append(svgNode("text", { x: bar.x + 6, y: y + CHART.row / 2, class: "bar-label" }, inner));
  }
  for (const event of worker.owned) {
    const marker = MARKERS.get(event.event_type);
    if (!marker || event.ms === null) continue;
    const shape = markerShape(marker.shape, scale(event.ms), y + CHART.row / 2);
    shape.append(svgNode("title", {}, `${typeName(event.event_type)} · ${event.status} · ${clock(event.ms, true)}\n${headline(event.summary)}`));
    group.append(shape);
  }
  group.addEventListener("click", () => selectInvocation(worker.invocation_id));
  group.addEventListener("keydown", keyEvent => {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      selectInvocation(worker.invocation_id);
    }
  });
  return group;
}

function buildTimeline(model, width) {
  const workers = model.workers.filter(worker => worker.first !== null);
  if (!workers.length) return null;
  const min = workers.reduce((value, worker) => Math.min(value, worker.first), Infinity);
  let max = workers.reduce((value, worker) => Math.max(value, worker.last), -Infinity);
  if (max - min < 60000) max = min + 60000;
  const span = max - min;
  const plot = width - CHART.gutter - CHART.right;
  const scale = ms => CHART.gutter + ((ms - min) / span) * plot;

  // One lane per role; bars that overlap in time stack into extra rows inside their lane.
  const lanes = [];
  for (const worker of [...workers].sort((a, b) => a.first - b.first || a.last - b.last)) {
    let lane = lanes.find(item => item.role === worker.role);
    if (!lane) {
      lane = { role: worker.role, ends: [], bars: [] };
      lanes.push(lane);
    }
    const x = scale(worker.first);
    const barWidth = Math.max(scale(worker.last) - x, CHART.minBar);
    let row = lane.ends.findIndex(end => end + CHART.barGap <= x);
    if (row === -1) row = lane.ends.length;
    lane.ends[row] = x + barWidth;
    lane.bars.push({ worker, x, width: barWidth, row });
  }
  let bottom = CHART.top;
  for (const lane of lanes) {
    lane.y = bottom;
    lane.height = lane.ends.length * (CHART.row + CHART.gap) - CHART.gap + CHART.pad * 2;
    bottom += lane.height;
  }

  const height = bottom + CHART.axis;
  const svg = svgNode("svg", {
    class: "chart",
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    role: "group",
    "aria-label": `Timeline of ${workers.length} worker invocations in ${lanes.length} roles`,
  });
  lanes.forEach((lane, index) => {
    svg.append(
      svgNode("rect", { x: 0, y: lane.y, width, height: lane.height, class: index % 2 ? "lane lane-odd" : "lane" }),
      svgNode("text", { x: 8, y: lane.y + lane.height / 2, class: "lane-label" }, clip(lane.role, 11)),
    );
  });
  const step = TICK_STEPS.find(candidate => (candidate / span) * plot >= 110) ?? TICK_STEPS[TICK_STEPS.length - 1];
  const offset = new Date(min).getTimezoneOffset() * 60000;
  for (let tick = Math.ceil((min - offset) / step) * step + offset; tick <= max; tick += step) {
    const x = scale(tick);
    svg.append(
      svgNode("line", { x1: x, x2: x, y1: CHART.top, y2: bottom, class: "grid" }),
      svgNode("text", { x, y: bottom + 14, class: "axis-label", "text-anchor": "middle" }, tickLabel(tick, step, span)),
    );
  }
  for (const lane of lanes) {
    for (const bar of lane.bars) {
      svg.append(barGroup(model, bar, lane.y + CHART.pad + bar.row * (CHART.row + CHART.gap), scale));
    }
  }

  const legend = [node("li", "Bar color is each worker's own last self-reported status; a finished worker can still read in_progress if it never reported again.", "note")];
  for (const status of new Set(workers.filter(worker => worker.reported).map(worker => worker.status))) {
    const item = node("li");
    item.append(node("span", undefined, `swatch status-${token(status)}`), ` ${status}`);
    legend.push(item);
  }
  if (workers.some(worker => !worker.reported)) {
    const item = node("li");
    item.append(node("span", undefined, "swatch hollow"), " registered, no self-report");
    legend.push(item);
  }
  const types = new Set(workers.flatMap(worker => worker.owned.map(event => event.event_type)));
  for (const [type, marker] of MARKERS) {
    if (!types.has(type)) continue;
    const swatch = svgNode("svg", { class: "legend-mark", width: 14, height: 14, viewBox: "0 0 14 14", "aria-hidden": "true" });
    swatch.append(markerShape(marker.shape, 7, 7));
    const item = node("li");
    item.append(swatch, ` ${marker.name}`);
    legend.push(item);
  }
  return { svg, legend };
}

function syncSelection() {
  const svg = detailElement.querySelector("svg.chart");
  if (!svg) return;
  svg.classList.toggle("has-selection", Boolean(view.invocation));
  for (const group of svg.querySelectorAll(".bar-group")) {
    const selected = group.dataset.invocation === view.invocation;
    group.classList.toggle("selected", selected);
    group.setAttribute("aria-pressed", String(selected));
  }
}

function drawTimeline() {
  const host = detailElement.querySelector(".chart-host");
  const panel = host && host.closest("details");
  if (!host || !current || (panel && !panel.open)) return;
  const width = Math.max(host.clientWidth, CHART.minWidth);
  if (host.dataset.width === String(width)) return;
  const focused = host.contains(document.activeElement) ? document.activeElement.dataset.key : "";
  const chart = buildTimeline(current.model, width);
  host.dataset.width = String(width);
  host.replaceChildren(chart ? chart.svg : node("p", "No timed activity has been reported yet.", "muted"));
  detailElement.querySelector(".legend").replaceChildren(...(chart ? chart.legend : []));
  syncSelection();
  if (focused) byKey(focused)?.focus({ preventScroll: true });
}

function selectInvocation(id, forceSelect) {
  view.invocation = !forceSelect && view.invocation === id ? "" : id;
  syncSelection();
  fillFeed();
  const feed = detailElement.querySelector("#feed");
  if (!view.invocation || !feed) return;
  const top = feed.getBoundingClientRect().top;
  if (top < 0 || top > window.innerHeight * 0.6) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollBy({ top: top - window.innerHeight * 0.35, behavior: reduce ? "auto" : "smooth" });
  }
}

function timelineSection() {
  const heading = node("summary");
  heading.append(node("h3", "Timeline"));
  const panel = rememberedDetails("timeline", true, "panel timeline", heading);
  panel.append(
    node("p", "Each bar is one worker, from its first to its last reported event. Click a bar to list only the events about it.", "hint"),
    node("div", undefined, "chart-host"),
    node("ul", undefined, "legend"),
  );
  panel.addEventListener("toggle", () => {
    if (panel.open) drawTimeline();
  });
  return panel;
}

function feedSection() {
  const section = node("section", undefined, "panel");
  section.id = "feed";
  section.append(node("h3", "Activity · newest first"));
  const toggle = node("label", undefined, "check");
  toggle.title = "Hides routine bookkeeping: handoff sent, handoff received, invocation started and review requested.";
  const box = node("input");
  box.type = "checkbox";
  box.checked = view.keyOnly;
  box.dataset.key = "keyonly";
  box.addEventListener("change", () => {
    view.keyOnly = box.checked;
    fillFeed();
  });
  toggle.append(box, " Key events only");
  const rawToggle = node("label", undefined, "check");
  const raw = node("input");
  raw.type = "checkbox";
  raw.checked = view.raw;
  raw.dataset.key = "raw";
  raw.addEventListener("change", () => { view.raw = raw.checked; fillFeed(); });
  rawToggle.append(raw, " Raw events");
  rawToggle.title = "Show every original event separately instead of grouping delegations.";
  const controls = node("div", undefined, "controls");
  controls.append(toggle, rawToggle, node("span", undefined, "filter-slot"), node("span", undefined, "count"));
  section.append(controls, node("div", undefined, "feed"));
  return section;
}

function fillFeed() {
  const section = detailElement.querySelector("#feed");
  if (!section || !current) return;
  const model = current.model;
  const matching = model.events.filter(event => !view.invocation || event.owner === view.invocation);
  const items = view.raw ? matching.map(event => ({ event, members: [event], key: String(event.event_id) })) : delegationItems(model, matching);
  const visible = items.filter(item => !view.keyOnly || item.members.some(event => !ROUTINE_TYPES.has(event.event_type)));
  const rows = [];
  let day = "";
  for (const item of visible) {
    const event = item.event;
    if (model.multiDay && event.ms !== null) {
      const dayKey = new Date(event.ms).toDateString();
      if (dayKey !== day) {
        day = dayKey;
        rows.push(node("h4", new Date(event.ms).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" }), "day"));
      }
    }
    const row = item.worker ? delegationRow(model, item) : eventRow(model, event, `feed:${event.event_id}`, false);
    row.dataset.anchor = item.key;
    rows.push(row);
  }
  if (rows.length === 0) rows.push(node("p", model.events.length ? "No events match these filters." : "No activity has been reported.", "empty"));
  section.querySelector(".feed").replaceChildren(...rows);

  const slot = section.querySelector(".filter-slot");
  slot.replaceChildren();
  if (view.invocation) {
    const clear = node("button", `Only ${model.label(view.invocation)} ✕`, "filter-chip");
    clear.type = "button";
    clear.title = "Show every event again";
    clear.dataset.key = "filter-clear";
    clear.addEventListener("click", () => {
      const id = view.invocation;
      selectInvocation(id);
      byKey(`bar:${id}`)?.focus({ preventScroll: true });
    });
    slot.append(clear);
  }
  section.querySelector(".count").textContent =
    `${visible.length} ${view.raw ? "events" : "items"} · ${visible.reduce((count, item) => count + item.members.length, 0)} of ${plural(model.events.length, "event")}${view.keyOnly ? " · key activity only" : ""}`;
}

// New events land at the top of the feed. Unless the reader is at the top, keep the row they are looking at in place.
function captureAnchor() {
  const rows = [...detailElement.querySelectorAll(".feed > [data-anchor]")];
  if (!rows.length || rows[0].getBoundingClientRect().bottom > 0) return null;
  const first = rows.find(row => row.getBoundingClientRect().top >= 0);
  return first ? { key: first.dataset.anchor, top: first.getBoundingClientRect().top } : null;
}

function restoreScroll(anchor, scrollY) {
  const row = anchor && detailElement.querySelector(`.feed > [data-anchor="${CSS.escape(anchor.key)}"]`);
  if (row) window.scrollBy(0, row.getBoundingClientRect().top - anchor.top);
  else window.scrollTo(0, scrollY);
}

function renderRun(run) {
  const scrollY = window.scrollY;
  const anchor = captureAnchor();
  const focused = detailElement.contains(document.activeElement) ? document.activeElement.dataset.key : "";
  const model = buildModel(run);
  if (view.invocation && !model.byId.has(view.invocation)) view.invocation = "";
  current = { model };
  detailElement.replaceChildren(
    node("h2", `${run.project_name} · ${run.run_id}`),
    node("p", run.objective),
    node("p", `Requirements: ${run.requirements_ref || "not supplied"} · created ${dateTime(run.created_at)}`, "muted"),
    summarySection(model),
    timelineSection(),
    feedSection(),
  );
  drawTimeline();
  fillFeed();
  if (focused) byKey(focused)?.focus({ preventScroll: true });
  restoreScroll(anchor, scrollY);
}

async function loadRun(runId) {
  const request = ++detailRequest;
  detailElement.hidden = false;
  try {
    const response = await fetch(`/api/runs/${encodeURIComponent(runId)}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    if (request !== detailRequest || runId !== selectedRun) return;
    if (text !== runSnapshot) {
      runSnapshot = text;
      renderRun(JSON.parse(text));
    }
    refreshAgo();
  } catch (error) {
    if (request !== detailRequest || runId !== selectedRun) return;
    runSnapshot = "";
    current = null;
    detailElement.replaceChildren(node("p", `Could not load run: ${error.message}. Previously displayed activity may be stale.`));
    throw error;
  }
}

async function refresh() {
  if (polling) return;
  polling = true;
  try {
    await loadRuns();
  } finally {
    polling = false;
  }
}

window.addEventListener("hashchange", () => {
  selectedRun = window.location.hash.slice(1);
  markSelectedRun();
  detailRequest++;
  runSnapshot = "";
  current = null;
  view.invocation = "";
  view.toggled.clear();
  detailElement.replaceChildren();
  detailElement.hidden = !selectedRun;
  if (selectedRun) loadRun(selectedRun).catch(error => {
    connectionElement.textContent = `Journal detail unavailable: ${error.message}`;
  });
});
new ResizeObserver(() => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(drawTimeline, 150);
}).observe(detailElement);
document.getElementById("refresh").addEventListener("click", refresh);
refresh();
window.setInterval(refresh, 5000);
