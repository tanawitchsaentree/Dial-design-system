#!/usr/bin/env node
// verify — runs every check a system has, in order, and records the run.
//
// Three things went wrong with a hand-written `a && b && c` chain in Pane, and this replaces it:
//   1. The chain stopped at the first red, so one run showed one problem and the rest stayed unknown.
//      Here every step runs; a step only skips when a step it needs (a build) failed.
//   2. Gates ran with `--only <the ones that passed>`, so a new red gate never showed. Here gates run
//      in full; a gate that cannot pass yet goes in docs.advisory with a reason, visibly.
//   3. Source was edited while a 60-minute run was going, and the green that came back described code
//      that no longer existed. Here the source is hashed before and after; a changed hash marks the
//      run invalid.
// The run is written to system/reports/verify-latest.json; tooling/kiln/milestone.mjs reads it.
//
// Usage: node tooling/kiln/verify.mjs            full run (60–90 min with a browser on every page)
//        node tooling/kiln/verify.mjs --quick    builds, lint, types, reasons, conformance (minutes)
//        node tooling/kiln/verify.mjs --topup    after a full run: every non-browser step, and the browser steps
//                                                only on the routes the changes since that run reach, merged
//                                                into its results (K-13: dial ran seven 75-minute full runs to
//                                                close M1, one per one-line fix). Refuses when a change reaches
//                                                every page; the milestone accepts the full run plus the top-up.
// Browser steps run at nice 19 so the machine stays usable. Never edit source during a full run.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT, sourceHash, sourceManifest, manifestDiff, docsConfig, componentPages, routes as allRoutes } from './config.mjs';
import { classify, importersFrom, mergeGates, mergeEvidence } from './topup.mjs';
import { coveredIn } from './conformance-names.mjs';

const QUICK = process.argv.includes('--quick');
const TOPUP = process.argv.includes('--topup');
// --changed: every step, but the browser steps only on the routes the changed files reach. Minutes
// instead of an hour while working; recorded as kind "changed", which a milestone never accepts.
const CHANGED = process.argv.includes('--changed');
import { execSync } from 'node:child_process';
function changedRoutes() {
  const files = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).split('\n').map((l) => l.slice(3).trim()).filter(Boolean);
  const slug = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const out = new Set(); let all = false;
  for (const f of files) {
    let m;
    if ((m = f.match(/packages\/react\/src\/components\/(\w+)\//))) out.add(`/components/${slug(m[1])}`);
    else if ((m = f.match(/apps\/docs\/src\/depth\/([\w-]+)\.tsx$/)) && !['StyleTab', 'UsageTab', 'subjects', 'layout', 'forms', 'types', 'index'].includes(m[1])) out.add(`/components/${m[1]}`);
    else if (/^(apps\/lab|system\/(REVIEW|RETRO|STATE|NEXT|DECISIONS)|docs\/)/.test(f)) continue;
    else all = true; // tokens, the shell, shared book code: everything can change
  }
  return all ? null : [...out];
}
if (CHANGED) {
  const r = changedRoutes();
  if (r && r.length) { process.env.KILN_ROUTES = r.join(','); console.log(`--changed: browser steps limited to ${r.join(', ')}`); }
  else if (r) { console.log('--changed: nothing that reaches a page changed'); }
  else console.log('--changed: tokens or shared files changed, so every route is checked');
}
const REPORTS = path.join(ROOT, 'system', 'reports'), BASE = path.join(REPORTS, 'base');
const readJson = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
let TOP = null; // the top-up plan: what changed since the full run and what it reaches
if (TOPUP) {
  const fullRun = readJson(path.join(REPORTS, 'verify-latest.json'));
  const baseMan = readJson(path.join(BASE, 'manifest.json'));
  const refuse = (why) => { console.log(`✗ verify --topup: ${why}`); process.exit(1); };
  if (!fullRun || fullRun.kind !== 'full') refuse('there is no recorded full run to top up (pnpm run verify first)');
  if (!baseMan || baseMan.hash !== fullRun.sourceHash) refuse(`the full run (${fullRun.sourceHash}) left no file manifest; it predates kiln 2.7, so run one full verify first`);
  if (fullRun.sourceChanged) refuse('the full run was edited while it ran; run a full verify again');
  const C = docsConfig();
  const files = manifestDiff(baseMan.files, sourceManifest());
  if (!files.length) { console.log('✓ verify --topup: nothing changed since the full run, so the full run stands'); process.exit(fullRun.ok ? 0 : 1); }
  const compDir = path.join(ROOT, 'packages/react/src/components');
  const sources = {};
  if (existsSync(compDir)) for (const n of readdirSync(compDir)) { const d = path.join(compDir, n); try { sources[n] = readdirSync(d).filter((f) => /\.(tsx?|mjs)$/.test(f)).map((f) => readFileSync(path.join(d, f), 'utf8')).join('\n'); } catch {} }
  const components = componentPages(C).map((pg) => ({ name: pg.title, slug: pg.slug, path: pg.path }));
  const cls = classify(files, { components, checkText: (f) => (existsSync(path.join(ROOT, f)) ? readFileSync(path.join(ROOT, f), 'utf8') : ''), coveredIn, reach: readJson(path.join(BASE, 'reach.json'))?.routes ?? null, importers: importersFrom(sources) });
  if (cls.shared.length) refuse(`${cls.shared.length} changed file${cls.shared.length > 1 ? 's' : ''} reach${cls.shared.length > 1 ? '' : 'es'} every page, so only a full run measures them:\n  ${cls.shared.slice(0, 12).join('\n  ')}`);
  // a route inside a component's chapter re-runs the whole chapter, so conformance checks the component too
  const cb = C.componentsBase ?? '/components';
  const runRoutes = [...new Set(cls.routes.map((r) => (r.startsWith(`${cb}/`) ? r.split('/').slice(0, cb.split('/').length + 1).join('/') : r)))].sort();
  const every = allRoutes(C);
  const reached = every.filter((r) => runRoutes.some((w) => r === w || r.startsWith(`${w}/`)));
  if (reached.length > every.length / 2 && !process.argv.includes('--anyway')) refuse(`the changes reach ${reached.length} of ${every.length} routes (${cls.components.join(', ') || 'several pages'}), more than half: a full run costs about the same and proves more (--topup --anyway to go on)`);
  const names = new Set(components.filter((c) => runRoutes.includes(c.path)).map((c) => c.name));
  const checkDir = path.join(ROOT, 'system', 'conformance');
  const checkFiles = existsSync(checkDir) ? readdirSync(checkDir).filter((f) => f.endsWith('.mjs') && (cls.checks.includes(f) || [...coveredIn(readFileSync(path.join(checkDir, f), 'utf8'), [...names])].length)) : [];
  TOP = { base: fullRun.sourceHash, baseOk: fullRun.ok, files, routes: runRoutes, reached: reached.length, of: every.length, checks: checkFiles, components: cls.components };
  process.env.KILN_ROUTES = runRoutes.length ? runRoutes.join(',') : '/__kiln_none__';
  process.env.KILN_CHECKS = checkFiles.length ? checkFiles.join(',') : '__kiln_none__';
  console.log(`--topup on ${fullRun.sourceHash}: ${files.length} changed file${files.length > 1 ? 's' : ''}; browser steps on ${reached.length}/${every.length} routes${runRoutes.length ? ` (${runRoutes.slice(0, 6).join(', ')}${runRoutes.length > 6 ? ', …' : ''})` : ''}; ${checkFiles.length} check file${checkFiles.length === 1 ? '' : 's'}`);
}
const SYS = JSON.parse(readFileSync(path.join(ROOT, 'system', 'kiln.config.json'), 'utf8'));
const pkg = (dir) => JSON.parse(readFileSync(path.join(ROOT, dir, 'package.json'), 'utf8')).name;
const DOCS = pkg(SYS.docs?.app ?? 'apps/docs');
const REACT = pkg('packages/react');
const TOKENS = pkg('packages/tokens');

// [id, command, { needs, after, browser, quick }]: needs = must have passed; after = runs once those ran, pass or fail,
// so a red evidence run still lets the gates and tone run and report everything in one pass
const STEPS = [
  ['tokens', ['pnpm', '--filter', TOKENS, 'build'], { quick: true }],
  ['engine', ['node', 'tooling/kiln/sync.mjs', '--check'], { quick: true }],
  ['lint', ['node', 'tooling/no-hardcode-lint.mjs'], { quick: true }],
  ['barrel', ['node', 'tooling/generate-barrel.mjs', '--check'], { quick: true }],
  ['token-contract', ['node', 'tooling/kiln/token-contract.mjs'], { needs: ['tokens'], quick: true }],
  ['rationale', ['node', 'tooling/kiln/rationale.mjs'], { needs: ['tokens'], quick: true }],
  ['i18n', ['node', 'tooling/kiln/i18n-lint.mjs'], { quick: true }],
  ['meta', ['node', 'tooling/kiln/meta.mjs'], { quick: true }],
  ['design-md', ['node', 'tooling/kiln/design-md.mjs'], { needs: ['tokens'], quick: true }],
  ['agent-setup', ['node', 'tooling/kiln/agent-setup.mjs'], { quick: true }],
  ['build', ['sh', '-c', `pnpm --filter ${REACT} build && pnpm --filter ${DOCS} build`], { needs: ['tokens', 'meta', 'design-md', 'agent-setup'], quick: true }],
  // the book typechecks against the built package's types, so it runs after the build (a fresh clone has no dist yet)
  ['typecheck', ['sh', '-c', `pnpm --filter ${REACT} typecheck && pnpm --filter ${DOCS} exec tsc --noEmit -p .`], { needs: ['build'], quick: true }],
  // it bundles the built package, so it waits for the build (a fresh clone has no dist; kiln 2.5.1)
  ['treeshake', ['node', 'tooling/kiln/treeshake-probe.mjs'], { needs: ['build'], quick: true }],
  ['smoke-import', ['node', 'tooling/smoke-import.mjs'], { needs: ['build'] }],
  ['spec-capture', ['node', 'tooling/kiln/spec-capture.mjs'], { needs: ['build'], browser: true }],
  ['evidence', ['node', 'tooling/kiln/evidence.mjs'], { needs: ['build'], browser: true }],
  ['conformance', ['node', 'tooling/kiln/conformance.mjs', '--no-build'], { needs: ['build'], browser: true, quick: true }],
  // conformance.json, specs.json and evidence.json are read by the book, so it is built again before anything reads the pages
  ['rebuild', ['pnpm', '--filter', DOCS, 'build'], { needs: ['build'], after: ['spec-capture', 'evidence', 'conformance'] }],
  ['gates', ['node', 'tooling/kiln/gates.mjs', '--report'], { needs: ['rebuild'], browser: true }],
  ['tone', ['node', 'tooling/kiln/tone-gate.mjs'], { needs: ['rebuild'], browser: true }],
  // a contact sheet of every live demo for the milestone review; fails only when it could not look (K-13)
  ['sweep', ['node', 'tooling/kiln/sweep.mjs'], { needs: ['rebuild'], browser: true }],
];

const C0 = docsConfig();
function newestPartial(since) {
  const fs = existsSync(REPORTS) ? readdirSync(REPORTS).filter((f) => /^evidence-partial-.*\.json$/.test(f)) : [];
  const fresh = fs.map((f) => path.join(REPORTS, f)).map((f) => [f, readJson(f)]).filter(([, j]) => j && Date.parse(j.generatedAt) >= since - 1000).sort((a, b) => Date.parse(b[1].generatedAt) - Date.parse(a[1].generatedAt));
  return fresh[0]?.[0] ?? null;
}
function mergeStep(what, baseFile, partFile, outFile, merge, good) {
  const base = readJson(baseFile), part = partFile ? readJson(partFile) : null;
  if (!base || !part) { console.log(`✗ ${what}: cannot merge (${!base ? 'no full-run copy in system/reports/base' : 'no result from this run'})`); return { ok: false, reds: [`${what}: nothing to merge`], note: 'not merged' }; }
  const m = merge(base, part, TOP.routes, { base: TOP.base });
  writeFileSync(outFile, JSON.stringify(m, null, 2) + '\n');
  const reds = (what === 'gates' ? m.results.filter((x) => !x.ok).map((x) => `${x.id} ${String(x.detail ?? '').slice(0, 140)}`) : m.failures).slice(0, 30);
  const ok = good(m);
  console.log(`${ok ? '✓' : '✗'} ${what} merged with the full run ${TOP.base}: ${reds.length ? `${reds.length} red` : 'green'} (re-measured ${TOP.routes.length} route${TOP.routes.length === 1 ? '' : 's'})`);
  return { ok, reds, note: `merged with full run ${TOP.base} on ${TOP.routes.length} routes` };
}
const before = sourceHash();
const started = new Date();
const status = {};
const steps = [];
for (const [id, cmd, o] of STEPS) {
  if (QUICK && !o.quick) continue;
  if (TOP && !TOP.routes.length && (id === 'evidence' || id === 'conformance' || id === 'sweep')) { status[id] = 'pass'; steps.push({ id, status: 'pass', note: 'top-up: no changed file reaches a page' }); console.log(`- ${id}: nothing to re-measure`); continue; }
  const blocked = (o.needs ?? []).filter((n) => n in status && status[n] !== 'pass');
  if (blocked.length) { status[id] = 'skipped'; steps.push({ id, status: 'skipped', because: blocked }); console.log(`- ${id}: skipped, needs ${blocked.join(', ')}`); continue; }
  const full = o.browser ? ['nice', '-n', '19', ...cmd] : cmd;
  const t0 = Date.now();
  console.log(`\n▶ ${id}: ${cmd.join(' ')}`);
  // stream every line as it comes, so a long step (evidence, gates) shows its progress live
  const r = await new Promise((resolve) => {
    const child = spawn(full[0], full.slice(1), { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let buf = '';
    const take = (d) => { const t = d.toString(); buf += t; process.stdout.write(t.replace(/^(?=.)/gm, `  [${id}] `)); };
    child.stdout.on('data', take); child.stderr.on('data', take);
    child.on('close', (status) => resolve({ status, out: buf }));
  });
  const out = r.out;
  status[id] = r.status === 0 ? 'pass' : 'fail';
  // a top-up's evidence and gates measured part of the book; joined with the full run's they say what the
  // book is now, and that joined result, not the part, decides the step
  let merged = null;
  if (TOP && id === 'evidence') merged = mergeStep('evidence', path.join(BASE, 'evidence.json'), newestPartial(t0), path.join(C0.abs(C0.app), 'public', 'evidence.json'), mergeEvidence, (m) => m.failures.length === 0);
  if (TOP && id === 'gates') { const adv = C0.advisory ?? {}; merged = mergeStep('gates', path.join(BASE, 'gates.json'), path.join(C0.abs(C0.app), 'public', 'gates.json'), path.join(C0.abs(C0.app), 'public', 'gates.json'), mergeGates, (m) => m.results.every((x) => x.ok || x.id in adv)); }
  if (merged) status[id] = merged.ok ? 'pass' : 'fail';
  const reds = out.split('\n').filter((l) => /^\s*✗/.test(l)).slice(0, 30);
  steps.push({ id, status: status[id], seconds: Math.round((Date.now() - t0) / 1000), reds: merged ? merged.reds : reds, tail: out.split('\n').filter(Boolean).slice(-6), ...(merged ? { merged: merged.note } : {}) });
  console.log(`${status[id] === 'pass' ? '✓' : '✗'} ${id} (${Math.round((Date.now() - t0) / 1000)}s)`);
}
const afterManifest = sourceManifest();
const after = sourceHash(ROOT, afterManifest);
const ok = steps.every((s) => s.status === 'pass') && before === after;
const run = { kind: QUICK ? 'quick' : TOPUP ? 'topup' : CHANGED ? 'changed' : 'full', ...(TOP ? { base: TOP.base, files: TOP.files, reached: `${TOP.reached}/${TOP.of}`, checks: TOP.checks, components: TOP.components } : {}), routes: process.env.KILN_ROUTES?.split(',') ?? 'all', startedAt: started.toISOString(), finishedAt: new Date().toISOString(), sourceHash: after, sourceChanged: before !== after, ok, steps };
mkdirSync(path.join(ROOT, 'system', 'reports'), { recursive: true });
writeFileSync(path.join(ROOT, 'system', 'reports', `verify-${QUICK ? 'quick' : TOPUP ? 'topup' : CHANGED ? 'changed' : 'latest'}.json`), JSON.stringify(run, null, 2) + '\n');
// a full run leaves what a top-up needs: the file manifest it measured, and copies of the results a top-up
// merges into (later top-ups replace public/, so they always merge into the full run's, never each other's)
if (run.kind === 'full' && !run.sourceChanged) {
  mkdirSync(BASE, { recursive: true });
  writeFileSync(path.join(BASE, 'manifest.json'), JSON.stringify({ hash: after, at: run.finishedAt, files: afterManifest }) + '\n');
  for (const [from, to] of [[path.join(C0.abs(C0.app), 'public', 'evidence.json'), 'evidence.json'], [path.join(C0.abs(C0.app), 'public', 'gates.json'), 'gates.json'], [path.join(REPORTS, 'reach.json'), 'reach.json']]) if (existsSync(from)) copyFileSync(from, path.join(BASE, to));
}

console.log('\n' + steps.map((s) => `${s.status === 'pass' ? '✓' : s.status === 'skipped' ? '-' : '✗'} ${s.id}`).join('  '));
if (before !== after) console.log('✗ source changed while verify ran, so this result describes code that no longer exists. Run again without editing.');
console.log(`${ok ? '✓' : '✗'} verify (${run.kind}${TOP ? ` on ${TOP.base}` : ''}): ${steps.filter((s) => s.status === 'pass').length}/${steps.length} steps`);
process.exit(ok ? 0 : 1);
