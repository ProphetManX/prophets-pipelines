"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const tools = process.env.DASHBOARD_TEST_TOOLS || path.join(process.env.LOCALAPPDATA, "ProphetsWay", "DashboardTools", "packages", "node_modules");
const requireTool = createRequire(path.join(tools, "package.json"));
const Ajv = requireTool("ajv");
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "agent-dashboard.schema.json"), "utf8"));
const validator = new Ajv({ strict: false, allErrors: true });
validator.addSchema(schema);
const validateRecord = validator.compile({ $ref: `${schema.$id}#/$defs/record` });
const validateProject = validator.compile({ $ref: `${schema.$id}#/$defs/project` });
let checks = 0;
function check(name, action) {
    action();
    checks++;
    console.log(`PASS: ${name}`);
}
function recordFixture() {
    return {
        schemaVersion: 1, invocationId: "author-01", agent: "Implementer v2", runId: "pilot-run",
        sliceId: "M5-synthetic", targetRevision: "synthetic-r1", state: "STARTED", updatedAt: new Date().toISOString(),
        activity: "working", objective: "Synthetic report validation only", summary: "", outcome: null,
        scopeDecision: "PROCEED", scope: { included: ["Synthetic reporting fixture"], excluded: ["All product work"] }, plannedCheck: "Offline reporting checks only",
        reason: null, continuation: null, verdict: null, body: "", evidence: [], communications: []
    };
}
check("valid STARTED record", () => assert.ok(validateRecord(recordFixture()), JSON.stringify(validateRecord.errors)));
check("STARTED cannot claim completion", () => assert.equal(validateRecord({ ...recordFixture(), outcome: "COMPLETE" }), false));
check("FINALIZED requires outcomes and a body", () => assert.equal(validateRecord({ ...recordFixture(), state: "FINALIZED" }), false));
check("extra fields cannot grant authority", () => assert.equal(validateRecord({ ...recordFixture(), skipRequiredReview: true }), false));
check("STARTED preserves the planned-check requirement", () => assert.equal(validateRecord({ ...recordFixture(), plannedCheck: "" }), false));
check("reporting roles exactly match Vanguard's leaf allowlist", () => {
    const charter = fs.readFileSync(path.join(__dirname, "..", "toolbelt", "proj-a-vanguard-v2.agent.md"), "utf8");
    const header = requireTool("yaml").parse(charter.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
    assert.deepEqual([...schema.$defs.projectAgent.enum].sort(), [...header.agents].sort());
});
for (const agent of schema.$defs.projectAgent.enum) {
    check(`canonical reporting accepts ${agent}`, () => assert.ok(validateRecord({ ...recordFixture(), agent }), JSON.stringify(validateRecord.errors)));
}
for (const agent of ["Vanguard v2", "Toolbelt Keeper v2", "Unknown Agent", "Test Auditor"]) {
    check(`canonical leaf reporting rejects ${agent}`, () => assert.equal(validateRecord({ ...recordFixture(), agent }), false));
}
check("review request requires changed scope and concern", () => {
    const fixture = recordFixture();
    fixture.communications.push({ id: "review-01", kind: "review-request", to: "Code Reviewer v2", replyTo: null,
        subject: "Synthetic review", scope: [], delta: "", concern: "", message: "", evidence: [] });
    assert.equal(validateRecord(fixture), false);
    Object.assign(fixture.communications[0], { scope: ["Synthetic.cs"], delta: "Changed one branch", concern: "Boundary handling" });
    assert.ok(validateRecord(fixture), JSON.stringify(validateRecord.errors));
});
check("reply requires a referenced request", () => {
    const fixture = recordFixture();
    fixture.communications.push({ id: "reply-01", kind: "reply", to: "Implementer v2", replyTo: null,
        subject: "Synthetic reply", scope: [], delta: "", concern: "", message: "Reviewed", evidence: [] });
    assert.equal(validateRecord(fixture), false);
});
check("idle project with no run grants no execution", () => assert.ok(validateProject({
    schemaVersion: 1, reportingMode: "dashboard-pilot-v1", projectId: "Synthetic", repositoryRoot: "C:/Synthetic",
    updatedAt: new Date().toISOString(), milestones: [], slices: [], runs: [], invocations: []
}), JSON.stringify(validateProject.errors)));
console.log(`PASS: ${checks} reporting-schema checks. Synthetic data only; no project run was started.`);

const os = require("node:os");
const { publishProject } = require("./AgentDashboard.cjs");
const root = fs.mkdtempSync(path.join(os.tmpdir(), "prophetsway-dashboard-pilot-"));
const repository = path.join(root, "Synthetic");
const run = path.join(root, ".agent-runs", "pilot-run");
const ledger = path.join(repository, "ai-dashboard", "live", "project.json");
const canonical = path.join(run, "author-01.json");
const report = path.join(run, "01-author.md");
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
fs.mkdirSync(path.dirname(ledger), { recursive: true });
fs.mkdirSync(run, { recursive: true });
fs.writeFileSync(path.join(run, "authority.md"), "Synthetic test authority, not a project-operation grant.\n");
const project = {
    schemaVersion: 1, reportingMode: "dashboard-pilot-v1", projectId: "Synthetic", repositoryRoot: repository,
    updatedAt: new Date().toISOString(),
    milestones: [{ id: "M5", title: "Synthetic milestone", progress: "partial", activity: "idle", forecastTotal: null, breakdownComplete: false, evidence: [] }],
    slices: [{ id: "M5-synthetic", milestoneId: "M5", title: "Synthetic slice", progress: "pending", activity: "idle", forecast: false, owner: "Implementer v2", dependencies: [], requirements: [], evidence: [] }],
    runs: [{ id: "pilot-run", directory: run, authority: path.join(run, "authority.md") }],
    invocations: [{ id: "author-01", agent: "Implementer v2", runId: "pilot-run", sliceId: "M5-synthetic", targetRevision: "synthetic-r1", recordPath: canonical, reportPath: report }]
};
check("legacy pilot still rejects newly rolled-out roles", () => {
    const legacy = structuredClone(project);
    legacy.invocations[0].agent = "Test Auditor v2";
    assert.equal(validateProject(legacy), false);
});
check("new reporting mode accepts the complete leaf roster", () => {
    for (const agent of schema.$defs.projectAgent.enum) {
        const current = structuredClone(project);
        current.reportingMode = "dashboard-v1";
        current.invocations[0].agent = agent;
        assert.ok(validateProject(current), `${agent}: ${JSON.stringify(validateProject.errors)}`);
    }
});
try {
    write(ledger, project);
    check("registered but unstarted work is not running", () => {
        const result = publishProject(ledger);
        assert.equal(result.data.invocations[0].state, "NOT_STARTED");
        assert.equal(fs.existsSync(report), false);
    });
    const record = recordFixture();
    write(canonical, record);
    check("STARTED publishes a generated Markdown report", () => {
        const result = publishProject(ledger);
        assert.equal(result.data.invocations[0].state, "STARTED");
        assert.match(fs.readFileSync(report, "utf8"), /\*\*State:\*\* STARTED/);
        assert.ok(!fs.readFileSync(report, "utf8").includes("Outcome: COMPLETE"));
    });
    check("changed registration is refused", () => {
        write(ledger, { ...project, invocations: [{ ...project.invocations[0], targetRevision: "other-r2" }] });
        assert.throws(() => publishProject(ledger), /registrations cannot be changed/);
        write(ledger, project);
    });
    check("registration key order is not treated as changed scope", () => {
        const reordered = structuredClone(project);
        reordered.invocations[0] = Object.fromEntries(Object.entries(reordered.invocations[0]).reverse());
        write(ledger, reordered);
        publishProject(ledger);
        write(ledger, project);
    });
    check("wrong record owner is refused", () => {
        write(canonical, { ...record, agent: "Code Reviewer v2" });
        assert.throws(() => publishProject(ledger), /identity differs/);
        write(canonical, record);
    });
    record.communications.push({ id: "request-01", kind: "review-request", to: "Code Reviewer v2", replyTo: null,
        subject: "Synthetic branch review", scope: ["Synthetic.cs:Example"], delta: "Changed one branch; initial review, no predecessor.",
        concern: "Boundary handling", message: "Check the changed branch and affected callers.", evidence: [] });
    write(canonical, record);
    check("review scope and concern reach the dashboard", () => {
        const result = publishProject(ledger);
        assert.equal(result.data.communications[0].concern, "Boundary handling");
        assert.match(fs.readFileSync(report, "utf8"), /Changed one branch/);
    });
    check("published requests cannot be rewritten", () => {
        const altered = structuredClone(record);
        altered.communications[0].concern = "Different history";
        write(canonical, altered);
        assert.throws(() => publishProject(ledger), /append-only/);
        write(canonical, record);
    });
    Object.assign(record, { state: "FINALIZED", activity: "idle", outcome: "COMPLETE", reason: "NONE", continuation: "CONTINUE", summary: "Synthetic complete result", body: "No product code or tests were executed." });
    write(canonical, record);
    check("FINALIZED report preserves ordinary gate headers", () => {
        publishProject(ledger);
        const markdown = fs.readFileSync(report, "utf8");
        assert.match(markdown, /\*\*State:\*\* FINALIZED/);
        assert.match(markdown, /Outcome: COMPLETE\nReason: NONE\nContinuation: CONTINUE/);
        assert.match(markdown, /Source SHA-256/);
    });
    check("republication leaves finalized report bytes unchanged", () => {
        const before = fs.readFileSync(report);
        publishProject(ledger);
        assert.deepEqual(fs.readFileSync(report), before);
    });
    check("pre-rollout publication caches retain their legacy projection", () => {
        const cachePath = path.join(repository, "ai-dashboard", "data", "pilot-publication-state.json");
        const cached = JSON.parse(fs.readFileSync(cachePath, "utf8"));
        for (const entry of Object.values(cached.records)) delete entry.projectionMode;
        write(cachePath, cached);
        const before = fs.readFileSync(report);
        publishProject(ledger);
        assert.deepEqual(fs.readFileSync(report), before);
        assert.equal(JSON.parse(fs.readFileSync(cachePath, "utf8")).records["author-01"].projectionMode, "dashboard-pilot-v1");
    });
    check("a changed finalized projection is rejected before report replacement", () => {
        const cachePath = path.join(repository, "ai-dashboard", "data", "pilot-publication-state.json");
        const original = fs.readFileSync(cachePath);
        const cached = JSON.parse(original.toString("utf8"));
        cached.records["author-01"].projectionMode = "dashboard-v1";
        write(cachePath, cached);
        const before = fs.readFileSync(report);
        assert.throws(() => publishProject(ledger), /finalized compatibility projection changed/);
        assert.deepEqual(fs.readFileSync(report), before);
        fs.writeFileSync(cachePath, original);
    });
    check("finalized canonical edits are refused", () => {
        write(canonical, { ...record, summary: "Changed after finalization" });
        assert.throws(() => publishProject(ledger), /finalized canonical record changed/);
        write(canonical, record);
    });
    check("externally changed compatibility report is refused", () => {
        const before = fs.readFileSync(report);
        fs.appendFileSync(report, "Unowned edit\n");
        assert.throws(() => publishProject(ledger), /changed outside the publisher/);
        fs.writeFileSync(report, before);
    });
    check("path traversal cannot register a product file", () => {
        const altered = structuredClone(project);
        altered.invocations.push({ ...project.invocations[0], id: "escape", recordPath: path.join(repository, "product.json"), reportPath: path.join(run, "escape.md") });
        write(ledger, altered);
        assert.throws(() => publishProject(ledger), /escapes its permitted root/);
        assert.equal(fs.existsSync(path.join(repository, "product.json")), false);
        write(ledger, project);
    });
    check("incomplete forecast cannot claim an exact complete breakdown", () => {
        const altered = structuredClone(project);
        altered.milestones[0].breakdownComplete = true;
        write(ledger, altered);
        assert.throws(() => publishProject(ledger), /complete breakdown/);
        write(ledger, project);
    });
    check("completed slice requires evidence references", () => {
        const altered = structuredClone(project);
        altered.slices[0].progress = "complete";
        write(ledger, altered);
        assert.throws(() => publishProject(ledger), /requires evidence/);
        write(ledger, project);
    });
    check("malformed input preserves the last published snapshot", () => {
        const snapshot = path.join(repository, "ai-dashboard", "data", "pilot-data.js");
        const before = fs.readFileSync(snapshot);
        fs.writeFileSync(canonical, "{");
        assert.throws(() => publishProject(ledger), /Invalid JSON/);
        assert.deepEqual(fs.readFileSync(snapshot), before);
        write(canonical, record);
    });
    check("no extra source or authority files are changed", () => {
        assert.equal(fs.readFileSync(path.join(run, "authority.md"), "utf8"), "Synthetic test authority, not a project-operation grant.\n");
        assert.deepEqual(fs.readdirSync(run).sort(), ["01-author.md", "author-01.json", "authority.md"]);
    });
    const reviewerPath = path.join(run, "reviewer-01.json");
    const reviewerReport = path.join(run, "02-reviewer.md");
    project.invocations.push({ ...project.invocations[0], id: "reviewer-01", agent: "Code Reviewer v2", recordPath: reviewerPath, reportPath: reviewerReport });
    const reviewer = { ...recordFixture(), invocationId: "reviewer-01", agent: "Code Reviewer v2", communications: [{
        id: "reply-01", kind: "reply", to: "Implementer v2", replyTo: "request-01", subject: "Synthetic response", scope: [], delta: "", concern: "", message: "Synthetic review result; no real approval.", evidence: []
    }] };
    write(ledger, project);
    write(reviewerPath, reviewer);
    check("a reviewer owns its linked reply without rewriting the request", () => {
        const source = fs.readFileSync(canonical);
        const result = publishProject(ledger);
        assert.equal(result.data.communications.length, 2);
        assert.equal(result.data.communications[1].replyTo, "request-01");
        assert.deepEqual(fs.readFileSync(canonical), source);
    });
    check("a reply cannot impersonate a different recipient", () => {
        const altered = structuredClone(reviewer);
        altered.communications.push({ ...altered.communications[0], id: "wrong-reply", to: "Other Agent" });
        write(reviewerPath, altered);
        assert.throws(() => publishProject(ledger), /participants must match/);
        write(reviewerPath, reviewer);
    });
    check("linked paths are rejected before any output", () => {
        const target = path.join(root, "link-target");
        const link = path.join(run, "linked");
        fs.mkdirSync(target);
        fs.symlinkSync(target, link, "junction");
        const altered = structuredClone(project);
        altered.invocations.push({ ...altered.invocations[0], id: "link-escape", recordPath: path.join(link, "record.json"), reportPath: path.join(run, "link-report.md") });
        write(ledger, altered);
        assert.throws(() => publishProject(ledger), /Links and junctions/);
        assert.deepEqual(fs.readdirSync(target), []);
        write(ledger, project);
    });
    check("old finalized detail becomes an archive reference without deletion", () => {
        const historical = { ...recordFixture(), invocationId: "old-01", updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), state: "FINALIZED", activity: "idle",
            outcome: "COMPLETE", reason: "NONE", continuation: "CONTINUE", body: "Historical synthetic report." };
        const oldPath = path.join(run, "old-01.json");
        const oldReport = path.join(run, "03-old.md");
        project.invocations.push({ ...project.invocations[0], id: "old-01", recordPath: oldPath, reportPath: oldReport });
        write(ledger, project);
        write(oldPath, historical);
        const result = publishProject(ledger);
        assert.equal(result.data.archivedInvocations[0].invocationId, "old-01");
        assert.equal(result.data.invocations.some((entry) => entry.invocationId === "old-01"), false);
        assert.ok(fs.existsSync(oldPath) && fs.existsSync(oldReport));
    });
    check("full rollout publishes every role through the unchanged report pipeline", () => {
        const before = fs.readFileSync(report);
        project.reportingMode = "dashboard-v1";
        for (const [index, agent] of schema.$defs.projectAgent.enum.entries()) {
            const id = `rollout-${index}`;
            const source = path.join(run, `${id}.json`);
            const derived = path.join(run, `${id}.md`);
            project.invocations.push({ ...project.invocations[0], id, agent, recordPath: source, reportPath: derived });
            write(source, { ...recordFixture(), invocationId: id, agent });
        }
        write(ledger, project);
        const result = publishProject(ledger);
        assert.equal(result.data.mode, "dashboard-v1");
        for (const [index, agent] of schema.$defs.projectAgent.enum.entries()) {
            assert.ok(result.data.invocations.some((entry) => entry.invocationId === `rollout-${index}` && entry.agent === agent));
            assert.ok(fs.readFileSync(path.join(run, `rollout-${index}.md`), "utf8").includes(`**Agent:** ${agent}`));
        }
        assert.deepEqual(fs.readFileSync(report), before);
    });
    check("Commit Author's fenced message survives byte-for-byte", () => {
        const index = schema.$defs.projectAgent.enum.indexOf("Commit Author v2");
        const id = `rollout-${index}`;
        const message = "Preserve exact message bytes\r\n\r\n\tSynthetic detail\r\n";
        const authoredBody = "```text\r\n" + message + "```\r\n\r\nNot committed by me: synthetic reporting fixture only.\r\n";
        const final = { ...recordFixture(), invocationId: id, agent: "Commit Author v2", state: "FINALIZED", activity: "idle",
            outcome: "COMPLETE", reason: "NONE", continuation: "CONTINUE", body: authoredBody };
        write(path.join(run, `${id}.json`), final);
        publishProject(ledger);
        const output = fs.readFileSync(path.join(run, `${id}.md`), "utf8");
        assert.equal((output.match(/```text\r\n([\s\S]*?)```/) || [])[1], message);
        assert.ok(output.includes(authoredBody));
    });
    check("specialist verdict and decision fields remain in their own report bodies", () => {
        const bodies = {
            "Test Auditor v2": "Mode: validation-setup\nVerdict: Ready for baseline\nSubject: synthetic-r1\nCoverage: fixture only, not product execution.\n",
            "Owner Delegate v2": "Decision mode: advise\nDecision status: ADVISORY\nAuthority: none - advisory only\nQuestion: Synthetic illustration only.\n",
            "Repository Operator v2": "Operator mode: checkpoint_commit\nResult: No command executed by this synthetic fixture.\nAuthorization: No real operation authorized.\n",
            "Session Scribe v2": "Mode: wrapup\nHandoff status: live\nPending owners: synthetic example only.\n",
            "Security Reviewer v2": "Verdict: Synthetic fixture, no security clearance\nCoverage: no product scanned.\nDependency scan: not performed in this fixture.\n"
        };
        for (const [agent, body] of Object.entries(bodies)) {
            const id = `rollout-${schema.$defs.projectAgent.enum.indexOf(agent)}`;
            write(path.join(run, `${id}.json`), { ...recordFixture(), invocationId: id, agent, state: "FINALIZED", activity: "idle",
                outcome: "COMPLETE", reason: "NONE", continuation: "CONTINUE", body });
        }
        publishProject(ledger);
        for (const [agent, body] of Object.entries(bodies)) {
            const id = `rollout-${schema.$defs.projectAgent.enum.indexOf(agent)}`;
            assert.ok(fs.readFileSync(path.join(run, `${id}.md`), "utf8").includes(body), agent);
        }
    });
    check("one-shot publication reports an intentionally stopped publisher", () => {
        const command = require("node:child_process").spawnSync(process.execPath, [path.join(__dirname, "AgentDashboard.cjs"), "--project", ledger, "--once"], { encoding: "utf8" });
        assert.equal(command.status, 0, command.stderr);
        const healthText = fs.readFileSync(path.join(repository, "ai-dashboard", "data", "publisher-health.js"), "utf8");
        const health = JSON.parse(healthText.slice("window.AI_DASHBOARD_HEALTH = ".length).trim().slice(0, -1));
        assert.equal(health.status, "stopped");
        assert.equal(health.reason, "one-shot-complete");
        assert.ok(health.lastAcceptedAt);
    });
    check("rejected publication exposes health without changing accepted data or reports", () => {
        const snapshotPath = path.join(repository, "ai-dashboard", "data", "pilot-data.js");
        const accepted = fs.readFileSync(snapshotPath);
        const original = fs.readFileSync(canonical);
        const projected = fs.readFileSync(report);
        write(canonical, { ...JSON.parse(original.toString("utf8")), summary: "Unapproved post-finalization change" });
        const command = require("node:child_process").spawnSync(process.execPath, [path.join(__dirname, "AgentDashboard.cjs"), "--project", ledger, "--once"], { encoding: "utf8" });
        assert.equal(command.status, 1);
        const healthText = fs.readFileSync(path.join(repository, "ai-dashboard", "data", "publisher-health.js"), "utf8");
        const health = JSON.parse(healthText.slice("window.AI_DASHBOARD_HEALTH = ".length).trim().slice(0, -1));
        assert.equal(health.status, "blocked");
        assert.equal(health.reason, "publication-rejected");
        assert.deepEqual(fs.readFileSync(snapshotPath), accepted);
        assert.deepEqual(fs.readFileSync(report), projected);
        fs.writeFileSync(canonical, original);
    });
    console.log(`PASS: ${checks} schema/publication checks. Only newly owned temporary fixtures were used.`);
} finally { fs.rmSync(root, { recursive: true, force: true }); }
