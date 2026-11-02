#!/usr/bin/env node
// Proof for topup.mjs (K-13): a top-up re-measures every route a change reaches, refuses when a change
// reaches everything, and its merge never drops a failure it did not re-measure.
// Usage: node tooling/engine/topup.proof.mjs   (exit 1 when any case is wrong)
import { classify, importersFrom, onRoutes, mergeGates, mergeEvidence } from './topup.mjs';
import { coveredIn } from './conformance-names.mjs';

const components = ['Button', 'Select', 'Toast', 'Card', 'Dialog', 'Chip'].map((name) => {
  const slug = name.toLowerCase();
  return { name, slug, path: `/components/${slug}` };
});
const reach = {
  '/': ['Button', 'Select'],
  '/foundations/color': ['Select'],
  '/components/select/code': ['Select'],
  '/components/dialog/code': ['Dialog', 'Card', 'Button'],
  '/components/chip/code': ['Chip'],
};
const importers = importersFrom({
  Toast: "import { Button } from '../Button';\nimport { IconButton } from '../IconButton/IconButton';",
  Dialog: "import { Card } from '../Card/Card';",
  Button: "import x from './Button.module.css';",
});
const checks = { 'system/conformance/16-overlays.mjs': "for (const name of ['Dialog', 'Toast']) await check(name, 'x', () => {});" };
const ctx = { components, checkText: (f) => checks[f], coveredIn, reach, importers };
const c = (files, over = {}) => classify(files, { ...ctx, ...over });

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const cases = [
  // dial R-002: one CSS line in Select reached every page with a theme picker, not only Select's own
  ['a book control reaches every page it renders on', () => eq(c(['packages/react/src/components/Select/Select.module.css']).routes, ['/', '/components/select', '/components/select/code', '/foundations/color'])],
  ['a change follows its importers', () => eq(c(['packages/react/src/components/Button/Button.tsx']).components, ['Button', 'Toast'])],
  ['an embedded component reaches its host page', () => c(['packages/react/src/components/Card/Card.module.css']).routes.includes('/components/dialog/code')],
  ['with no reach map a component change is shared', () => c(['packages/react/src/components/Chip/Chip.tsx'], { reach: null }).shared.length === 1],
  ['tokens are shared', () => eq(c(['packages/tokens/src/semantic.json']).shared, ['packages/tokens/src/semantic.json'])],
  ['the engine is shared', () => c(['tooling/kiln/gates.mjs']).shared.length === 1],
  ['REVIEW, STATE and RETRO are metadata', () => { const r = c(['system/REVIEW.md', 'system/STATE.md', 'system/RETRO.md']); return r.metadata.length === 3 && !r.routes.length && !r.shared.length; }],
  ['DECISIONS and the lab reach no page', () => { const r = c(['system/DECISIONS.md', 'apps/lab/anchor/a.tsx']); return r.noPage.length === 2 && !r.routes.length && !r.shared.length; }],
  ['a check file reaches the pages of what it names, looped or not', () => { const r = c(['system/conformance/16-overlays.mjs']); return eq(r.routes, ['/components/dialog', '/components/toast']) && eq(r.checks, ['16-overlays.mjs']); }],
  ['a depth page reaches its own page', () => eq(c(['apps/docs/src/depth/chip.tsx']).routes, ['/components/chip'])],
  ['shared depth code is shared', () => c(['apps/docs/src/depth/StyleTab.tsx']).shared.length === 1],
  // problem lines are traced to routes exactly
  ['route lines', () => onRoutes('/components/chip/code (motion): x', ['/components/chip']) && onRoutes('/components/chip: x', ['/components/chip']) && onRoutes('[normal] docs /components/chip/code dark: "a" 2.1', ['/components/chip'])],
  ['a longer slug is another route', () => !onRoutes('/components/chips/code: x', ['/components/chip']) && !onRoutes('[normal] docs /components/chips/code dark: "a"', ['/components/chip'])],
  ['prose naming a route is not on it', () => !onRoutes('Button: see /components/chip for x', ['/components/chip'])],
];

// merges: a failure on a route the top-up did not re-measure survives; one it re-measured is replaced
const g = (results) => ({ generatedAt: 't', results: results.map((r, i) => ({ order: i, ...r })) });
const base = g([
  { id: 'G-A', ok: false, problems: ['/components/chip/code: jumps', '/components/card/code: jumps'], detail: '2 problems' },
  { id: 'G-B', ok: false, problems: ['/components/chip/code: snaps'], detail: '1' },
  { id: 'G-C', ok: true },
  { id: 'G-D', ok: false, detail: 'no built tokens json' },
  { id: 'G-E', ok: false, problems: ['/components/card: x'] },
]);
const part = g([{ id: 'G-A', ok: true }, { id: 'G-B', ok: true }, { id: 'G-C', ok: true, skipped: true }, { id: 'G-D', ok: true }, { id: 'G-E', ok: true, skipped: true }]);
const m = mergeGates(base, part, ['/components/chip'], { base: 'h0' });
const by = Object.fromEntries(m.results.map((r) => [r.id, r]));
cases.push(
  ['merged gate keeps the red it did not re-measure', () => !by['G-A'].ok && eq(by['G-A'].problems, ['/components/card/code: jumps'])],
  ['merged gate clears the red it re-measured', () => by['G-B'].ok],
  ['a skipped gate keeps the full result', () => by['G-C'].ok && !by['G-E'].ok],
  ['a global red that ran again and passed is cleared', () => by['G-D'].ok],
  ['merged gates say so', () => m.partial === false && m.topup.base === 'h0' && m.passed === 3],
);
const ev = mergeEvidence(
  { generatedAt: 'b', failures: ['[normal] docs /components/chip/code dark: "a" 2', '[normal] docs /components/card/code dark: "b" 2', '[normal] harness dark/ui: "c" 1'], excepted: [], docsPage: { normal: {} }, summary: { gatingFailures: 3 } },
  { generatedAt: 'p', failures: [], excepted: [], harness: { normal: {} }, summary: { gatingFailures: 0 }, partial: true },
  ['/components/chip'], { base: 'h0' },
);
cases.push(['merged evidence keeps only what was not re-measured', () => eq(ev.failures, ['[normal] docs /components/card/code dark: "b" 2']) && ev.partial === false && ev.summary.gatingFailures === 1]);

let wrong = 0;
for (const [name, run] of cases) {
  let ok; try { ok = run(); } catch (e) { ok = false; console.log(`  ${e.message}`); }
  if (!ok) wrong++;
  console.log(`${ok ? '✓' : '✗'} ${name}`);
}
console.log(`${wrong ? '✗' : '✓'} topup: ${cases.length - wrong}/${cases.length} cases as expected`);
process.exit(wrong ? 1 : 0);
