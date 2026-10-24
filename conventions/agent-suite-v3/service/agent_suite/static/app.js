"use strict";

const runsElement = document.getElementById("runs");
const detailElement = document.getElementById("detail");
const connectionElement = document.getElementById("connection");
let selectedRun = window.location.hash.slice(1);
let detailRequest = 0;
let polling = false;

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = String(text);
  if (className) element.className = className;
  return element;
}

function article(title, className) {
  const element = node("article", undefined, className);
  element.append(node("h3", title));
  return element;
}

async function loadRuns() {
  connectionElement.textContent = "Loading journal…";
  try {
    const response = await fetch("/api/runs", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    runsElement.replaceChildren();
    for (const run of data.runs) {
      const button = node("button", undefined, "run-button");
      button.type = "button";
      button.append(node("strong", `${run.project_name} · ${run.run_id}`));
      button.append(node("span", `${run.slice_count} slices · ${run.event_count} events · ${run.created_at}`));
      button.addEventListener("click", () => {
        if (selectedRun === run.run_id) loadRun(selectedRun);
        else window.location.hash = run.run_id;
      });
      runsElement.append(button);
    }
    if (data.runs.length === 0) runsElement.append(node("p", "No runs have been registered."));
    if (selectedRun) await loadRun(selectedRun);
    connectionElement.textContent = `Journal connected · refreshed ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    connectionElement.textContent = `Journal unavailable: ${error.message}. This does not indicate agent or product status.`;
  }
}

async function loadRun(runId) {
  const request = ++detailRequest;
  detailElement.hidden = false;
  try {
    const response = await fetch(`/api/runs/${encodeURIComponent(runId)}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const run = await response.json();
    if (request !== detailRequest || runId !== selectedRun) return;
    detailElement.replaceChildren(node("h2", `${run.project_name} · ${run.run_id}`));
    detailElement.append(node("p", run.objective));
    detailElement.append(node("p", `Requirements: ${run.requirements_ref || "not supplied"} · ${run.created_at}`));

    const work = node("div", undefined, "work");
    work.append(node("h3", "Slices"));
    for (const slice of run.slices) {
      const card = article(slice.title, "slice");
      card.append(node("p", `Last reported status: ${slice.status}`));
      card.append(node("p", slice.acceptance));
      card.append(node("p", `Required evidence: ${slice.required_evidence.join(", ") || "none specified"}`));
      work.append(card);
    }
    detailElement.append(work);

    const workers = node("div", undefined, "workers");
    workers.append(node("h3", "Worker invocations"));
    for (const invocation of run.invocations) {
      const card = article(`${invocation.role} · ${invocation.invocation_id}`, "slice");
      card.append(node("p", invocation.last_reported_at
        ? `Last reported: ${invocation.status} · ${invocation.last_reported_at}`
        : "Registered · awaiting first report"));
      card.append(node("p", `Slice: ${invocation.slice_id} · registered ${invocation.started_at}`));
      workers.append(card);
    }
    if (run.invocations.length === 0) workers.append(node("p", "No worker invocations registered."));
    detailElement.append(workers);

    const timeline = node("div", undefined, "timeline");
    timeline.append(node("h3", "Activity"));
    for (const event of run.events) {
      const card = article(`${event.event_type} · ${event.status}`, event.gaps.length ? "event gaps" : "event");
      card.append(node("p", event.summary));
      const exchange = event.counterparty_invocation_id
        ? ` ↔ ${event.counterparty_role || "worker"} ${event.counterparty_invocation_id}`
        : "";
      card.append(node("p", `${event.role} ${event.invocation_id}${exchange} · ${event.slice_id} · ${event.created_at}`));
      for (const gap of event.gaps) card.append(node("p", `Gap: ${gap}`));
      for (const evidence of event.evidence) {
        card.append(node("p", `${evidence.kind}: ${evidence.uri} — ${evidence.check_result}`));
      }
      timeline.append(card);
    }
    if (run.events.length === 0) timeline.append(node("p", "No activity has been reported."));
    detailElement.append(timeline);
  } catch (error) {
    if (request !== detailRequest || runId !== selectedRun) return;
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
  detailRequest++;
  detailElement.replaceChildren();
  detailElement.hidden = !selectedRun;
  if (selectedRun) loadRun(selectedRun).catch(error => {
    connectionElement.textContent = `Journal detail unavailable: ${error.message}`;
  });
});
document.getElementById("refresh").addEventListener("click", refresh);
refresh();
window.setInterval(refresh, 5000);
