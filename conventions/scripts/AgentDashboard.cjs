"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { createRequire } = require("node:module");
const toolModules = process.env.DASHBOARD_TEST_TOOLS || path.join(process.env.LOCALAPPDATA || "", "ProphetsWay", "DashboardTools", "packages", "node_modules");
const Ajv = createRequire(path.join(toolModules, "package.json"))("ajv");
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "agent-dashboard.schema.json"), "utf8"));
const ajv = new Ajv({ strict: false, allErrors: true });
ajv.addSchema(schema);
const validators = Object.fromEntries(["project", "record"].map((kind) => [kind, ajv.compile({ $ref: `${schema.$id}#/$defs/${kind}` })]));
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
const identity = (value) => path.resolve(value).toLowerCase();
const canonicalJson = (value) => JSON.stringify(value, (_key, entry) => entry && typeof entry === "object" && !Array.isArray(entry)
    ? Object.fromEntries(Object.keys(entry).sort().map((key) => [key, entry[key]])) : entry);

function check(condition, message) { if (!condition) throw new Error(message); }
function safePath(candidate) {
    check(path.isAbsolute(candidate), "All registered filesystem paths must be absolute.");
    const resolved = path.resolve(candidate);
    check(!resolved.split(/[\\/]/).some((part) => part.toLowerCase() === ".git"), "Git internals are never dashboard paths.");
    let current = resolved;
    while (true) {
        if (fs.existsSync(current)) check(!fs.lstatSync(current).isSymbolicLink(), "Links and junctions are not permitted in dashboard paths.");
        const parent = path.dirname(current);
        if (parent === current) break;
        current = parent;
    }
    return resolved;
}
function beneath(root, candidate) {
    const result = safePath(candidate);
    const relative = path.relative(safePath(root), result);
    check(relative && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative), "Registered path escapes its permitted root.");
    return result;
}
function readJson(file, maximumBytes = 2 * 1024 * 1024) {
    safePath(file);
    const stat = fs.statSync(file);
    check(stat.isFile() && stat.size <= maximumBytes, "Dashboard input is not a bounded regular file.");
    const raw = fs.readFileSync(file);
    let value;
    try { value = JSON.parse(raw.toString("utf8").replace(/^\uFEFF/, "")); }
    catch { throw new Error(`Invalid JSON in ${path.basename(file)}; no publication accepted.`); }
    return { value, hash: digest(raw), file };
}
function validate(kind, value) {
    check(validators[kind](value), `Invalid ${kind} schema: ${ajv.errorsText(validators[kind].errors, { dataVar: kind })}`);
    check(Number.isFinite(Date.parse(value.updatedAt)) && Date.parse(value.updatedAt) <= Date.now() + 60000, "Invalid or future record timestamp.");
}
function unique(items, title) {
    const mapping = new Map();
    for (const item of items) {
        check(!mapping.has(item.id), `Duplicate ${title} identity.`);
        mapping.set(item.id, item);
    }
    return mapping;
}
function reference(root, file) {
    return path.relative(root, file).split(path.sep).map(encodeURIComponent).join("/");
}
function escapedJson(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function writeAtomic(file, content) {
    safePath(file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temporary = `${file}.${crypto.randomUUID()}.tmp`;
    try {
        fs.writeFileSync(temporary, content, { encoding: "utf8", flag: "wx" });
        fs.renameSync(temporary, file);
    } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}
function markdown(record, sourceHash, recordPath, reportPath, reportingMode) {
    const oneLine = (value) => String(value).replace(/[\r\n]/g, " ");
    const parts = [`# ${oneLine(record.objective)}`, "", `<!-- ${reportingMode}:${record.invocationId} -->`, "",
        `**State:** ${record.state}`, `**Record status:** ${record.state}`, ""];
    if (record.state === "FINALIZED") parts.push(`Outcome: ${record.outcome}`, `Reason: ${record.reason}`, `Continuation: ${record.continuation}`, "");
    parts.push(`**Agent:** ${record.agent}`, `**Target:** ${oneLine(record.targetRevision)}`, `**Invocation:** ${record.invocationId}`,
        `**Slice:** ${record.sliceId}`, `**Scope decision:** ${record.scopeDecision}`, `**Planned check:** ${oneLine(record.plannedCheck)}`, `**Updated:** ${record.updatedAt}`,
        `**Canonical record:** [JSON](${reference(path.dirname(reportPath), recordPath)})`, `**Source SHA-256:** ${sourceHash}`, "");
    if (record.verdict) parts.push(`**Scoped verdict:** ${oneLine(record.verdict)}`, "");
    parts.push("## Scope", "", `Included: ${record.scope.included.map(oneLine).join("; ")}`, "", `Excluded: ${record.scope.excluded.map(oneLine).join("; ") || "None recorded; existing charter limits still apply."}`, "",
        "## Summary", "", record.summary || "No summary recorded yet.", "", "## Report", "", record.body || "Invocation started; no completion claimed.", "");
    if (record.evidence.length) parts.push("## Evidence References", "", ...record.evidence.map((entry) => `- ${oneLine(entry)}`), "");
    if (record.communications.length) {
        parts.push("## Help And Review Exchanges", "");
        for (const entry of record.communications) {
            parts.push(`### ${entry.id}: ${oneLine(entry.subject)}`, "", `Kind: ${entry.kind}; to: ${oneLine(entry.to)}; reply to: ${entry.replyTo || "none"}`, "",
                `Scope: ${entry.scope.map(oneLine).join("; ") || "See referenced request."}`, "", `Changed area: ${entry.delta || "Not applicable."}`, "",
                `Concern: ${entry.concern || "See referenced request."}`, "", entry.message || "Awaiting response.", "");
        }
    }
    const content = parts.join("\n");
    return reportingMode === "dashboard-v1" ? content + "\n" : content.trimEnd() + "\n";
}

function publishProject(projectFile) {
    const projectInput = readJson(safePath(projectFile));
    const project = projectInput.value;
    validate("project", project);
    const repository = safePath(project.repositoryRoot);
    const dashboard = path.join(repository, "ai-dashboard");
    check(identity(projectFile) === identity(path.join(dashboard, "live", "project.json")), "Project ledger must be ai-dashboard/live/project.json in its own repository.");
    check(project.projectId === path.basename(repository), "Project identity must match its repository folder.");
    const dataRoot = safePath(path.join(dashboard, "data"));
    const runRoot = safePath(path.join(path.dirname(repository), ".agent-runs"));
    const milestones = unique(project.milestones, "milestone");
    const slices = unique(project.slices, "slice");
    const runs = unique(project.runs, "run");
    const invocations = unique(project.invocations, "invocation");
    for (const item of [...project.milestones, ...project.slices]) {
        check(item.progress !== "complete" || item.evidence.length, "Completed work requires evidence references; this does not independently verify them.");
    }
    for (const slice of project.slices) {
        check(milestones.has(slice.milestoneId), "Slice refers to an unknown milestone.");
        check(slice.dependencies.every((dependency) => slices.has(dependency) && dependency !== slice.id), "Slice dependency is unknown or self-referential.");
        check(!slice.forecast || (slice.progress === "pending" && slice.activity === "idle"), "A forecast slice cannot claim execution or completion.");
    }
    function visitSlice(slice, stack = new Set()) {
        check(!stack.has(slice.id), "Slice dependency cycle detected.");
        const next = new Set(stack).add(slice.id);
        for (const dependency of slice.dependencies) visitSlice(slices.get(dependency), next);
    }
    project.slices.forEach((slice) => visitSlice(slice));
    for (const milestone of project.milestones) {
        const known = project.slices.filter((slice) => slice.milestoneId === milestone.id).length;
        check(milestone.forecastTotal === null || milestone.forecastTotal >= known, "Forecast total cannot be smaller than the known slice count.");
        check(!milestone.breakdownComplete || milestone.forecastTotal === known, "A complete breakdown must state the exact known slice total.");
    }
    for (const run of project.runs) {
        beneath(runRoot, run.directory);
        check(path.basename(run.directory) === run.id && identity(path.dirname(run.directory)) === identity(runRoot), "Run identity must name one direct child of the external run root.");
        beneath(run.directory, run.authority);
        check(fs.statSync(run.authority).isFile(), "The run must link an existing authority record; its approval still needs independent verification.");
    }
    fs.mkdirSync(dataRoot, { recursive: true });
    const lockFile = path.join(dataRoot, "pilot-publication.lock");
    safePath(lockFile);
    const lock = fs.openSync(lockFile, "wx");
    try {
        const cacheFile = path.join(dataRoot, "pilot-publication-state.json");
        const previous = fs.existsSync(cacheFile) ? readJson(cacheFile).value : { registrations: {}, records: {}, reportHashes: {}, communications: {} };
        for (const [id, registered] of Object.entries(previous.registrations)) {
            check(invocations.has(id) && canonicalJson(invocations.get(id)) === canonicalJson(registered), "Published invocation registrations cannot be changed or removed.");
        }
        const state = { registrations: {}, records: {}, reportHashes: {}, communications: {} };
        const destinations = new Set([identity(projectFile), identity(cacheFile), identity(lockFile), identity(path.join(dataRoot, "pilot-data.js"))]);
        const inputs = [projectInput];
        const outputs = [];
        const records = [];
        const exchanges = [];
        const sourceDirectories = new Set([path.dirname(projectFile)]);
        for (const registration of project.invocations) {
            const run = runs.get(registration.runId);
            check(run && slices.has(registration.sliceId), "Invocation refers to an unknown run or slice.");
            const canonical = beneath(run.directory, registration.recordPath);
            const report = beneath(run.directory, registration.reportPath);
            check(path.extname(canonical) === ".json" && path.extname(report) === ".md", "Canonical records must be JSON and compatibility reports Markdown.");
            for (const destination of [canonical, report]) {
                check(!destinations.has(identity(destination)), "Input/output paths must not alias.");
                destinations.add(identity(destination));
            }
            state.registrations[registration.id] = registration;
            check(fs.existsSync(path.dirname(canonical)), "Create the registered canonical-record directory before starting the publisher.");
            sourceDirectories.add(path.dirname(canonical));
            if (!fs.existsSync(canonical)) {
                check(!previous.records[registration.id], "A previously published canonical record is missing.");
                check(!fs.existsSync(report), "An unstarted invocation cannot adopt an existing report.");
                records.push({ ...registration, state: "NOT_STARTED", activity: "idle", summary: "Registered; no author record yet.", report: null });
                continue;
            }
            const input = readJson(canonical, 256 * 1024);
            const record = input.value;
            validate("record", record);
            for (const [field, expected] of Object.entries({ invocationId: registration.id, agent: registration.agent, runId: registration.runId,
                sliceId: registration.sliceId, targetRevision: registration.targetRevision })) check(record[field] === expected, "Record identity differs from its registered owner or target.");
            const prior = previous.records[registration.id];
            check(!prior?.finalized || prior.hash === input.hash, "A finalized canonical record changed; preserve it and use a new invocation.");
            check(!prior || Date.parse(record.updatedAt) >= Date.parse(prior.updatedAt), "Record timestamps cannot move backwards.");
            check(!prior || canonicalJson(record.communications.slice(0, prior.communicationIds.length).map((entry) => entry.id)) === canonicalJson(prior.communicationIds), "Published communication order is append-only.");
            if (record.state === "FINALIZED") {
                check((record.reason === "NONE") === ["COMPLETE", "NO_CHANGE"].includes(record.outcome), "Outcome and reason are inconsistent.");
            }
            const projectionMode = prior?.projectionMode || (prior ? "dashboard-pilot-v1" : project.reportingMode);
            const content = markdown(record, input.hash, canonical, report, projectionMode);
            check(!prior?.finalized || previous.reportHashes[registration.id] === digest(content), "A finalized compatibility projection changed; preserve the existing report.");
            if (fs.existsSync(report)) {
                check(previous.reportHashes[registration.id] && digest(fs.readFileSync(report)) === previous.reportHashes[registration.id], "Compatibility report is unowned or has changed outside the publisher.");
            } else check(!previous.reportHashes[registration.id], "A previously published compatibility report is missing.");
            for (const communication of record.communications) {
                check(!state.communications[communication.id], "Communication IDs must be unique across invocations.");
                const binding = { owner: record.invocationId, hash: digest(canonicalJson(communication)) };
                check(!previous.communications[communication.id] || canonicalJson(previous.communications[communication.id]) === canonicalJson(binding), "Published communications are append-only; write a new reply instead of editing history.");
                state.communications[communication.id] = binding;
                exchanges.push({ ...communication, from: record.agent, invocationId: record.invocationId, runId: record.runId, sliceId: record.sliceId,
                    updatedAt: record.updatedAt, report: reference(dashboard, report) });
            }
            state.records[registration.id] = { hash: input.hash, finalized: record.state === "FINALIZED", updatedAt: record.updatedAt, communicationIds: record.communications.map((entry) => entry.id), projectionMode };
            state.reportHashes[registration.id] = digest(content);
            inputs.push(input);
            if (!fs.existsSync(report) || previous.reportHashes[registration.id] !== state.reportHashes[registration.id]) outputs.push({ file: report, content });
            records.push({ ...record, sourceHash: input.hash, source: reference(dashboard, canonical), report: reference(dashboard, report) });
        }
        for (const id of Object.keys(previous.communications)) check(state.communications[id], "Published communications cannot be removed.");
        for (const exchange of exchanges) {
            if (!exchange.replyTo) continue;
            const request = exchanges.find((entry) => entry.id === exchange.replyTo);
            check(request && request.kind !== "reply", "Reply must reference an existing request.");
            check(request.to === exchange.from && exchange.to === request.from, "Reply participants must match the request.");
        }
        for (const input of inputs) check(digest(fs.readFileSync(input.file)) === input.hash, "Input changed during publication; no new snapshot accepted.");
        const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
        const current = records.filter((record) => record.state !== "FINALIZED" || Date.parse(record.updatedAt) >= cutoff);
        const archived = records.filter((record) => !current.includes(record)).map(({ invocationId, agent, runId, sliceId, objective, state, activity, outcome, reason, continuation, updatedAt, report, source }) =>
            ({ invocationId, agent, runId, sliceId, objective, state, activity, outcome, reason, continuation, updatedAt, report, source, archived: true }));
        const data = { schemaVersion: 1, mode: project.reportingMode, projectId: project.projectId, publishedAt: new Date().toISOString(),
            projectUpdatedAt: project.updatedAt, projectSource: reference(dashboard, projectFile), projectHash: projectInput.hash,
            milestones: project.milestones, slices: project.slices, invocations: current, archivedInvocations: archived, communications: exchanges };
        for (const output of outputs) writeAtomic(output.file, output.content);
        writeAtomic(cacheFile, JSON.stringify(state, null, 2) + "\n");
        writeAtomic(path.join(dataRoot, "pilot-data.js"), `window.AI_DASHBOARD_PILOT = ${escapedJson(data)};\n`);
        return { data, watched: [...sourceDirectories], files: [projectFile, ...project.invocations.map((invocation) => invocation.recordPath)] };
    } finally { fs.closeSync(lock); fs.unlinkSync(lockFile); }
}

function runCli() {
    const args = process.argv.slice(2);
    check(args.length === 3 && args[0] === "--project" && ["--once", "--watch"].includes(args[2]), "Usage: node AgentDashboard.cjs --project <absolute project.json> --once|--watch");
    const projectFile = safePath(args[1]);
    const dashboard = safePath(path.dirname(path.dirname(projectFile)));
    check(identity(projectFile) === identity(path.join(dashboard, "live", "project.json")) && path.basename(dashboard) === "ai-dashboard", "Health reporting requires the canonical dashboard ledger path.");
    const healthFile = safePath(path.join(dashboard, "data", "publisher-health.js"));
    const healthProject = path.basename(path.dirname(dashboard));
    let result;
    const health = (status, reason) => writeAtomic(healthFile, `window.AI_DASHBOARD_HEALTH = ${escapedJson({
        schemaVersion: 1, projectId: healthProject, status, reason, updatedAt: new Date().toISOString(),
        lastAcceptedAt: result?.data.publishedAt || null
    })};\n`);
    try {
        result = publishProject(projectFile);
        health(args[2] === "--watch" ? "watching" : "stopped", args[2] === "--watch" ? "watching-records" : "one-shot-complete");
    } catch (error) {
        try { health("blocked", "publication-rejected"); } catch { console.error("Publisher health could not be written; treat its previous status as stale."); }
        throw error;
    }
    console.log(`Published ${result.data.invocations.length} current invocation records and ${result.data.communications.length} exchanges.`);
    if (args[2] === "--once") return;
    const watchers = new Map();
    let pending;
    let heartbeat;
    let closed = false;
    const close = (status = "stopped", reason = "owner-stop") => {
        if (closed) return;
        closed = true;
        clearTimeout(pending);
        clearInterval(heartbeat);
        for (const watcher of watchers.values()) watcher.close();
        watchers.clear();
        try { health(status, reason); } catch { console.error("Publisher health could not be written; treat its previous status as stale."); }
    };
    const refreshWatchers = () => {
        for (const directory of result.watched) {
            if (watchers.has(directory)) continue;
            const watcher = fs.watch(directory, (_event, filename) => {
                if (!filename || !result.files.some((file) => identity(file) === identity(path.join(directory, filename.toString())))) return;
                clearTimeout(pending);
                pending = setTimeout(() => {
                    try {
                        result = publishProject(projectFile);
                        health("watching", "watching-records");
                        refreshWatchers();
                        console.log(`Published ${result.data.invocations.length} current invocation records and ${result.data.communications.length} exchanges.`);
                    } catch (error) { close("blocked", "publication-rejected"); console.error(`Dashboard publisher stopped: ${error.message}`); process.exitCode = 1; }
                }, 250);
            });
            watcher.on("error", (error) => { close("blocked", "watcher-failed"); console.error(`Dashboard watcher stopped: ${error.message}`); process.exitCode = 1; });
            watchers.set(directory, watcher);
        }
    };
    try { refreshWatchers(); }
    catch (error) { close("blocked", "watcher-failed"); throw error; }
    heartbeat = setInterval(() => {
        try { health("watching", "watching-records"); }
        catch { close("blocked", "health-write-failed"); console.error("Dashboard publisher stopped because health publication failed."); process.exitCode = 1; }
    }, 15000);
    console.log("Watching registered canonical records only. Ctrl+C stops this publisher.");
    process.once("SIGINT", () => close());
    process.once("SIGTERM", () => close());
}

module.exports = { publishProject };
if (require.main === module) {
    try { runCli(); }
    catch (error) { console.error(`Dashboard publication refused: ${error.message}`); process.exitCode = 1; }
}
