# NEXT — the handoff

## How to open it
- Book: `pnpm run docs:build` then `cd apps/docs && npx vite preview --port 4317 --strictPort` →
  http://localhost:4317/ (Direction page: /direction). Port 4173 (`pnpm run docs:preview`) is held by
  another project's server (Pane); see BACKLOG K-4. Stop the preview when done.
- Anchor lab: http://localhost:4317/lab/anchor/index.html, or open `apps/lab/anchor/index.html` as a file.
- Lab contrast + screenshots: `node apps/lab/anchor/check.mjs` → `apps/lab/anchor/shots/`.

## Where it stopped
Phase 0–4 done; anchor round rendered (kiln state phase=5), waiting for the user's pick of A, B, C or D
(`apps/lab/anchor/index.html`, cards `[data-anchor="a".."d"]`). `system/refs/ref-01.png` is still not on
disk (temp screenshot was deleted), so every value is estimated from chat. Nothing in packages/ changed yet; tokens are still SEED
(`tokens.allowSeed: true`, `baseTheme: "dark"` kept because seed `$value` is dark — Phase 2 flips it
to `"light"` when it rewrites tokens).

## Verify
2026-11-01 `pnpm run verify:quick` 14/14 green (quick, not recorded). Full verify not run. Lab
contrast: 0 text below 4.5:1 in light and dark. `pnpm run docs:build` green (warning K-5).

## Next, in order
1. Check `system/refs/ref-01.png` (and ref-02.png). If missing, stop and tell the user in one line.
2. Measure ratios from pixels (radius/short side, inset, grille pitch, display:face share, knob:face,
   shadow offset) and replace every "(estimated from chat…)" in CONCEPT.md and `.kiln/cache.json`.
3. Re-render the four cards with measured values (`apps/lab/anchor/index.html` inline style + `anchor.js`),
   re-run `node apps/lab/anchor/check.mjs`. Wait for the user's pick (the only visual question).
   Then `node tooling/kiln/anchor-likeness.mjs --record apps/lab/anchor/index.html --selector '[data-anchor="<pick>"]'`,
   lock via `kiln:lock-decision`, set `docs.anchor` in kiln.config.json.
4. `kiln_state.py advance --data '{..."approved": true}'` only after the user's real pick.
5. Phase 2 tokens (matte ABS row: height 5px, gloss 0.2, roughness 3px, mass 1.4; one light top-left),
   `allowSeed: false`, `baseTheme: "light"`. Then wave 1 via `kiln:production-run`.

## Known problems not fixed yet
- ref images missing (see above).
- `pnpm` is enabled via `corepack enable pnpm` on this machine (was not installed globally).

## Do not
- Do not use the Braun name or logo anywhere. Do not spread orange beyond one primary control per unit.
- Do not pick the anchor for the user. Do not ask the user any other question before the M1 review.
- No `npm publish`, no `git push`, no credentials.
