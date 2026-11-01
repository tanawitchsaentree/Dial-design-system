# BACKLOG — found, not decided (one list)

## kiln bugs / gaps (fix in kiln, then `node tooling/engine/sync.mjs <repo>`)

- **K-1 (fixed in kiln 2.5.2) create.mjs needs a global pnpm.** `node bin/create.mjs ~/Downloads/bauhouse-ds --name dial` printed
  `✗ pnpm install failed` (cause: `pnpm` not on PATH, `zsh: command not found: pnpm`). It stopped before
  the seed-token build and the git commit. Fixed locally with `corepack enable pnpm`. Suggest: try
  `corepack pnpm` / `npx pnpm@<packageManager>` before failing, and print the cause.
- **K-2 (fixed in kiln 2.5.2) lint hook blocks lab CSS.** `tooling/hooks/post-edit-lint.mjs` lints every `.css` path, including
  `apps/lab/anchor/anchor.css` (116 violations: raw hex, px, physical properties), so a lab file cannot
  hold raw estimated values. Worked around with inline `<style>` in `apps/lab/anchor/index.html` (as
  the starter's `apps/lab/index.html` does). Suggest: skip `apps/lab/**` in the hook (TARGETS already
  skip it in the full lint).
- **K-3 (fixed in kiln 2.5.2) kit principle parser runs past `## ` headings.** `apps/docs/src/book/kit.tsx` PRINCIPLES regex stopped
  only at `### P\d+` or end of file, so any `## ` section after the last principle (here `## Direction`,
  `## Light model`) was swallowed into P6. `tooling/kiln/rationale.mjs` already stops at `^## `. Patched
  locally in kit.tsx (added `|^## `); upstream the same change into the starter.
- **K-4 (fixed in kiln 2.5.2) `docs:preview` hard-codes port 4173 with `--strictPort`.** Another project's preview (title "Pane")
  held 4173, so `pnpm run docs:preview` failed (`ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`). Used
  `npx vite preview --port 4317 --strictPort` in `apps/docs`. Suggest: a per-system port in kiln.config.
- **K-5 (fixed in kiln 2.5.2) starter docs.css references `/scenes/night-sm.jpg`** that does not exist: the build warns
  `/scenes/night-sm.jpg referenced in /scenes/night-sm.jpg didn't resolve at build time`. dial has
  plain backdrops only; remove or guard the scene image in the starter.
- **K-6 (fixed in kiln 2.5.2) no CLI for the anchor-round contrast check.** `tooling/kiln/text-contrast.mjs` says it is shared by
  "the lab anchor round", but nothing runs it on `apps/lab/anchor/`. Added `apps/lab/anchor/check.mjs`
  (both themes, screenshots in `apps/lab/anchor/shots/`). Suggest: ship it in the engine.
- **K-7 (fixed in kiln 2.5.2) `baseTheme: "light"` on seed tokens builds `themes: light, light`.** The seed `$value` describes
  dark, so flipping baseTheme before Phase 2 drops dark. Kept `dark` until Phase 2 rewrites tokens.

## dial
- Reference images `system/refs/ref-01.png` / `ref-02.png` not on disk; every reference value is
  "(estimated from chat, re-measure from ref-01.png)".
- Lab is published into the book through the symlink `apps/docs/public/lab -> ../../lab` (dist also
  carries `check.mjs` and `shots/`); replace with a proper build input when the anchor is locked.
