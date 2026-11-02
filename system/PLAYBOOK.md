# PLAYBOOK — how one dial component is built (template: Button, commit after 5ccc41b)

Read first: `CLAUDE.md` (iron rules), `system/CONCEPT.md` (P1–P6), `system/FORM.md` (class table),
`system/DECISIONS.md` (D-001 anchor A, D-002 tokens, D-003 form). Template files to copy the shape of:
`packages/react/src/components/Button/*`, `apps/lab/button/index.html`, `apps/docs/src/depth/button.tsx`,
`apps/docs/src/examples/Button*.tsx`, `system/conformance/button.mjs`, and the Button chapter in
`apps/docs/src/book/components-data.tsx`. Tactile recipe:
`~/.claude/plugins/cache/kiln-marketplace/kiln/2.5.2/docs/style-recipes/tactile.md`.

## Order (hooks enforce it)
1. **Lab**: `apps/lab/<slug>/index.html`, ≥3 genuinely different variants (silhouette or mechanism, never
   decoration), linking `../../../packages/tokens/build/css/tokens.css`. Screenshot it and look.
2. **why.json first** (`<Name>.why.json`): concept (≥12 words), kind, default_to_avoid[] (pattern must
   contain the component's own name in lowercase words, e.g. "icon button"; why_not ≥8 words),
   references[] ({source}), derivation[] ≥3 steps from ≥2 principles — `consequence` is an EXACT
   substring of that principle's Therefore text for that axis in CONCEPT.md (one line per principle),
   `form` ≥8 words; variants {lab, options ≥3, picked, by:"agent", reason ≥12 words};
   interactive controls: `mechanism` {kind key|rocker|rotary|fader|lever, detents?, sweep?, travel,
   spring {mass 1.4, stiffness 520, damping 46}}; parts/states/motion keyed exactly as the CSS has them
   (classes; :hover→"hover", [data-state=on]→"data-state=on", [aria-checked=true]→"aria-checked=true",
   "@media prefers-reduced-motion: reduce", "@media forced-colors: active"; transitioned properties),
   each {p, axis, why ≥8 words, no taste words}. The principle must speak to that axis (P1 type, P2
   nothing silent… check CONCEPT: "not affected" axes cannot be cited).
3. **REVIEW row**: append `| 2026-11-01 | <Name> | <picked> | <lab path + options> | <why, quoting P#> |`
   to `system/REVIEW.md`.
4. **Code**: `<Name>.module.css` (tokens only, logical properties, no raw px/hex — the lint hook blocks;
   `var(--ds-…)` names are in `packages/tokens/build/css/tokens.css`), `<Name>.tsx` (forwardRef,
   `data-component="<Name>"`, JSDoc on every prop, native element or Radix/React Aria behaviour if needed —
   ask the orchestrator before adding a dependency), `index.ts`.
5. **Docs**: 5+ examples `apps/docs/src/examples/<Name>*.tsx` (first line `// @example …`), depth file
   `apps/docs/src/depth/<slug>.tsx` exporting `<SLUG_CONST>: Depth` (U1–U14, see `depth/types.ts`;
   `variants`/`sizes` keys must equal the TS union options), chapter literal + subject line in
   `/tmp/dialgen/reg/<slug>-chapter.txt` and `-subject.txt`, conformance `system/conformance/<slug>.mjs`
   (keyboard map, target ≥44px, focus ring, mechanism; conformance runs with reducedMotion "reduce" —
   use `page.emulateMedia({ reducedMotion: 'no-preference' })` to test travel, then set it back).
6. **Register**: `node tooling/register-component.mjs <Name> --chapter … --subject … --changelog "First release: …"`
   (serialise: `until mkdir /tmp/dial-reg.lock 2>/dev/null; do sleep 1; done; …; rmdir /tmp/dial-reg.lock`).
7. **Check only your component**: `node tooling/kiln/rationale.mjs | grep -E "<Name>|✓ rationale"`,
   `node tooling/no-hardcode-lint.mjs packages/react/src/components/<Name>/*.css`,
   `pnpm --filter dial-react typecheck`. The orchestrator runs verify:quick and conformance per batch.

## Rules that bite
- One orange part per unit (P1): only `action.accent` for the primary control; rim `action.accent-rim`.
- Text ≥4.5:1 (use text.primary/secondary on plastic; display.* inks on windows). Non-text edges ≥3:1 (line.ring).
- Press = height → 0 in motion.press, return motion.release; no hover lift, no scale.
- Status = glyph + word, never colour alone. No Braun name or mark anywhere.
- Never write component CSS/TSX through Bash (`cat >`, sed): the derivation guard blocks it. Use Write/Edit.
- Book prose is English, plain, short sentences (tone gate). Replies to the user are Thai.

## Since kiln 2.7 (wave 2 onward)
- New gates to run on your routes: G-PC1 (an open popup is never cut by a clipping parent or the screen edge),
  G-MO3/G-MO4 (toggle and overlay motion), plus G-IN1, G-NC1, G-RH1, G-TT1, G-NT2, G-K6, G-K8, G-SV1 (add your
  component's state rows to apps/docs/src/system/states.tsx). Look with eyes: `node tooling/kiln/sweep.mjs` writes
  system/reports/sweep/index.html (every demo, light and dark, popups open) — open your component's cells.
- Book prose must pass the tone gate: `node tooling/kiln/tone-gate.mjs` (route filter in its header). No label
  colons ("Default: …"), no "not X but Y", no dashes in prose, also in JSDoc and conformance check titles.
- Chapters need ≥ (variant dimensions + 3) demos; depth files reach ≥0.5× Carbon words (G-K6, data in
  tooling/kiln/data/carbon-depth.json); overflow renders carry data-overflow-demo; CHANGELOG entry under the version heading.
- Never claim done from gates alone: screenshot your demos light + dark, open every popup, read the words.
- Do not run full `pnpm run verify` (75 min). The orchestrator runs one full verify per wave.
