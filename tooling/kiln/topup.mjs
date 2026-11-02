// topup: what a verify top-up must re-measure, and how its results join the last full run's (K-13).
//
// dial closed M1 with seven full verifies of about 75 minutes each, because every one-line fix changed the
// source hash and the milestone refused the run before it. A top-up keeps the full run and re-measures only
// what the changes since then can reach:
//   classify   maps each file changed since the full run to the book routes it reaches. A component's files
//              reach its page; a system/conformance file reaches the components it names; files every page
//              reads (tokens, the shell and shared book code, the engine, kiln.config) are "shared" and need a
//              full run, which the top-up refuses to fake.
//   merge*     joins the full run's results with the top-up's: results on the re-measured routes come from
//              the top-up, every other route keeps the full run's, and a failure that cannot be traced to a
//              route keeps the gate red. The merged file says it is merged (topup.base, topup.routes).
// Pure functions, proven by topup.proof.mjs; verify.mjs --topup drives them.

// files written after a run that describe it; no step reads them for a measurement
const METADATA = /^system\/(STATE|NEXT|REVIEW|RETRO|PLAYBOOK)\.md$/;
// read only by steps that always run in full in a top-up (design-md, rationale), never by a page
const NO_PAGE = /^(apps\/lab\/|system\/DECISIONS\.md$|system\/sheets\/)/;
// book code that serves one component's page, by file name, and the shared ones in the same folder
const DEPTH_SHARED = new Set(['StyleTab', 'UsageTab', 'subjects', 'layout', 'forms', 'types', 'index']);

const pascalToSlug = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * @param files      paths relative to the system root, changed since the full run
 * @param components [{ name, slug, path }] from componentPages
 * @param checkText  (file) => source of a system/conformance file, for the names it checks
 * @param coveredIn  conformance-names.coveredIn
 * @param reach      { route: [component names rendered there] }, recorded by the full run's evidence step
 * @param importers  { Name: [components that import Name] }, from the React source
 * @returns { routes, checks, components, shared, noPage, metadata }
 *
 * A component does not live only on its own page (dial, K-13): the book's own controls render on almost
 * every page and component pages embed each other, so a changed component reaches every route where it, or a
 * component that imports it, rendered in the full run. With no reach map, a component change is shared.
 */
export function classify(files, { components, checkText, coveredIn, reach = null, importers = {} }) {
  const byName = new Map(components.map((c) => [c.name, c]));
  const bySlug = new Map(components.map((c) => [c.slug, c]));
  const routes = new Set(), checks = new Set(), touched = new Set(), shared = [], noPage = [], metadata = [];
  const component = (f, c) => { if (!c) { shared.push(f); return; } touched.add(c.name); };
  for (const f of files) {
    let m;
    if (METADATA.test(f)) metadata.push(f);
    else if ((m = f.match(/^packages\/react\/src\/components\/([A-Za-z0-9]+)\//))) component(f, byName.get(m[1]) ?? bySlug.get(pascalToSlug(m[1])));
    else if ((m = f.match(/^apps\/docs\/src\/depth\/([\w-]+)\.tsx$/)) && !DEPTH_SHARED.has(m[1])) { const c = bySlug.get(m[1]); if (c) routes.add(c.path); else shared.push(f); }
    else if ((m = f.match(/^system\/conformance\/([^/]+\.mjs)$/))) {
      checks.add(m[1]);
      for (const n of coveredIn(checkText(f) ?? '', [...byName.keys()])) { const c = byName.get(n); if (c) routes.add(c.path); }
    } else if (NO_PAGE.test(f)) noPage.push(f);
    else shared.push(f);
  }
  // a changed component reaches what imports it, transitively
  const all = new Set(touched);
  for (let grew = true; grew;) { grew = false; for (const n of [...all]) for (const i of importers[n] ?? []) if (!all.has(i)) { all.add(i); grew = true; } }
  if (all.size && !reach) shared.push(`(no reach map from a full run, so ${[...touched].join(', ')} may render anywhere)`);
  else for (const n of all) {
    const c = byName.get(n); if (c) routes.add(c.path);
    for (const [r, names] of Object.entries(reach ?? {})) if (names.includes(n)) routes.add(r);
  }
  return { routes: [...routes].sort(), checks: [...checks].sort(), components: [...all].sort(), shared, noPage, metadata };
}

/** { Name: [importers] } from each component folder's sources: `from '../Name'` or `'../Name/Name'`. */
export function importersFrom(sources) {
  const out = {};
  for (const [name, text] of Object.entries(sources)) for (const m of String(text).matchAll(/from\s+['"]\.\.\/([A-Z][A-Za-z0-9]*)(?:\/[^'"]*)?['"]/g)) if (m[1] !== name) (out[m[1]] ??= new Set()).add(name);
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v].sort()]));
}

/** Does a problem line belong to one of the routes? Lines start with the route ("/components/chip: …",
 *  "/components/chip/code (motion): …", "[normal] docs /components/chip/code dark: …"). */
export function onRoutes(line, routes) {
  const s = String(line);
  return routes.some((r) => {
    for (const at of [0, s.indexOf(` ${r}`) + 1]) {
      if (at < 0 || (at > 0 && !/^\[[^\]]+\] docs $/.test(s.slice(0, at)))) continue;
      const next = s[at + r.length];
      if (s.startsWith(r, at) && (next === undefined || '/ :('.includes(next))) return true;
    }
    return false;
  });
}

/** gates.json: base = the full run's, part = the top-up's (limited to `routes`). */
export function mergeGates(base, part, routes, meta = {}) {
  const baseBy = new Map((base?.results ?? []).map((r) => [r.id, r]));
  const out = [];
  for (const p of part.results) {
    const b = baseBy.get(p.id); baseBy.delete(p.id);
    if (p.skipped) { out.push(b ?? p); continue; } // nothing it checks changed: the full run's result stands
    if (!b || b.ok) { out.push(p); continue; }
    // the full run was red: its problems on re-measured routes are replaced, the rest stay
    const kept = (b.problems ?? []).filter((x) => !onRoutes(x, routes));
    const untraced = !b.problems; // a red with no list (an expect) cannot be traced to a route
    if (untraced && p.ok) { out.push(p); continue; } // the gate's own global check ran again and passed
    if (untraced) { out.push(p); continue; }
    const problems = [...kept, ...(p.problems ?? [])];
    const ok = problems.length === 0 && p.ok;
    out.push({ ...p, ok, problems: problems.length ? problems : undefined, detail: ok ? p.detail : `${problems.length} problems (merged with the full run): ${problems.slice(0, 4).join(' | ')}` });
  }
  for (const b of baseBy.values()) out.push(b); // a gate the top-up did not run at all keeps its full result
  out.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const passed = out.filter((r) => r.ok).length;
  return { ...part, partial: false, passed, total: out.length, results: out, topup: { base: meta.base ?? null, routes, at: part.generatedAt, baseGeneratedAt: base?.generatedAt ?? null } };
}

/** evidence.json: the harness is measured again in full by every run; docs pages only on `routes`. */
export function mergeEvidence(base, part, routes, meta = {}) {
  const keep = (list) => (list ?? []).filter((x) => !/^\[[^\]]+\] harness /.test(x) && !onRoutes(x, routes));
  const failures = [...keep(base?.failures), ...(part.failures ?? []).filter((x) => x !== 'NOTHING MEASURED, so nothing was proven' || !base)];
  const excepted = [...keep(base?.excepted), ...(part.excepted ?? [])];
  return {
    ...base, ...part,
    docsPage: base?.docsPage ?? part.docsPage,
    failures, excepted,
    summary: { ...(base?.summary ?? {}), ...(part.summary ?? {}), gatingFailures: failures.length, excepted: excepted.length },
    partial: false, limitedTo: undefined,
    topup: { base: meta.base ?? null, routes, at: part.generatedAt, baseGeneratedAt: base?.generatedAt ?? null, note: 'docs pages off these routes keep the full run\'s measurement; their inputs did not change' },
  };
}
