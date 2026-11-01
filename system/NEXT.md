# NEXT — the handoff

## Where it stopped
Phase 0–4 done (kiln state machine phase=5). Stopped before the anchor round: `system/refs/ref-01.png`
is not on disk (temp screenshot was deleted). Nothing in packages/ changed yet; tokens are still SEED
(`tokens.allowSeed: true`, `baseTheme: "dark"` kept because seed `$value` is dark — Phase 2 flips it
to `"light"` when it rewrites tokens).

## Verify
Not run yet. `pnpm run tokens:build` green on seed (307 tokens, dark+light).

## Next, in order
1. Check `system/refs/ref-01.png` (and ref-02.png). If missing, stop and tell the user in one line.
2. Measure ratios from pixels (radius/short side, inset, grille pitch, display:face share, knob:face,
   shadow offset) and replace every "(estimated from chat…)" in CONCEPT.md and `.kiln/cache.json`.
3. Anchor round: device card, 4 variants in `apps/lab/anchor/` (axes: display:grille ratio, knob size,
   shadow depth, label placement). Read `docs/style-recipes/tactile.md` + `tactile-lab.html` in kiln 2.5.1.
   User picks (only visual question). Then `anchor-likeness.mjs --record`, lock via `kiln:lock-decision`.
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
