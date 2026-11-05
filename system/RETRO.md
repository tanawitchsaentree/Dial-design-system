# RETRO — what the user caught, and which step made it

One entry per criticism. The fix is a change to the step that produced the result (derivation,
concept, anchor round, tooling), not only a new check.

### R-001: The book is a generic dark docs shell, not a crafted dial object
- **Date:** 2026-11-01
- **User said:** "ตัว doc ภาพรวมมันหม่นๆ … อยากให้ธีมสีมันเป็นธีมสีของ bauhouse … ไม่ใช่แค่ static doc แบบ ดำ ขาว แล้วก็โชว์ของ … ความงามอยู่ในทุกอย่าง ทุกอนู ทุกมิติ ตั้งแต่การจัดวาง ตัวหนังสือ ขนาด ตำแหน่ง … มันคือการ Craft" (screenshot: /components/display in dark, following the OS setting)
- **What was wrong:** the docs shell kept the starter's neutral chrome (Pane's layout, pills, plain lists) and only took dial's colours. It opened in dark from the OS setting, so the first look was murky charcoal, not the warm-white base. Components were shown on flat ground like specimens; the page itself had no lineage: no inset, no printing logic, no unit rhythm, no one loud thing.
- **Step that produced it:** Phase 2/docs: the shell was treated as infrastructure (kiln docs-engine content model) and never derived from CONCEPT.md like a component. No lab round for the book itself.
- **What changed in that step:** the book shell is derived like an identity component: default_to_avoid (generic docs shell), Rams/Braun print references (Braun product leaflets and manuals, Vitsoe), ≥3 shell variants in apps/lab/book/, agent pick logged in REVIEW.md. The book opens in its base theme (light warm-white ABS); dark stays a choice. The page becomes a dial object: page grid from the unit inset, headings and labels set like printing on a case, nav as a printed index with an ink mark, the live demo on a plastic unit stage, code in a recessed window, one orange part per page at most (the demo's own primary control).
- **Check that now catches it:** the book shell's own derivation file (apps/lab/book/derivation.json) and REVIEW row; screenshots of every shell variant in light and dark before the pick.

### R-002: Select panel cut its option words
- **Date:** 2026-11-02
- **User said:** "แน่ใจนะว่าเสร็จ" with a screenshot of the Size select open: "sm", "md" cut at the panel's right edge.
- **What was wrong:** the panel was pinned to the trigger's width (inset-inline: 0) while each option reserves a tick column, so short triggers (Size, Theme) clipped their words. M1 was reported done on gates alone; no gate opened a popup and looked at its words.
- **Step that produced it:** the Select derivation/QA step checked keyboard, size and marks, not the open panel's content at small trigger widths; the milestone report trusted gates over eyes.
- **What changed in that step:** the panel is at least the trigger's width and the menu minimum, and grows to its longest option (max-content, nowrap). Visual sweep of every component page is part of closing a milestone.
- **Check that now catches it:** system/conformance/select.mjs "every option word shows in full inside the open panel" (proven red on the old CSS: "cut Dark, Light | cut md").

### R-003: A "Demo backdrop" choice nobody needs
- **Date:** 2026-11-02
- **User said:** "มีทำไมวะ" (screenshot of the Appearance panel: Demo backdrop Page / Raised / Field)
- **What was wrong:** the starter's backdrop picker (made for systems on photographs) was kept, although INTAKE 8 says plain surfaces only; its three keys also stood at different heights.
- **Step that produced it:** the R-001 shell redesign restyled the starter's Appearance panel instead of asking whether dial needs it.
- **What changed in that step:** the Appearance menu and panel are removed from the top bar; the book shows every example on the plain page. A shell part the intake does not ask for is removed, not restyled.
- **Check that now catches it:** G-ST1/G-T1 still pass with no backdrop control; the top bar holds only the mark, the wordmark and the theme words.

### R-004: Spacing between a control and its stage, and interactions that snap
- **Date:** 2026-11-02
- **User said:** "spacing เหี้ยมาก" (screenshot of /foundations/grid Anatomy: the Breakpoint select sits flush on the stage) and "dropdown ก็แข็งๆ มันต้องให้ smooth มากๆๆๆๆๆ ไม่ใช่แค่นี้เว้ย ทุก interaction ย้ำว่า ทุก interaction ที่มีการเปลี่ยนแปลง" (screenshot of the Show hit areas select open).
- **What was wrong:** `.gx-anatomy` had no gap, so the control touched the stage it drives. Select's panel appeared and vanished in one frame, the chevron flipped at once and the active row snapped; other state changes across the library may snap the same way.
- **Step that produced it:** the Select derivation read P6 ("only a state change moves anything") as "nothing animates" and wrote "the panel appears and goes at once"; G-MO4 let an overlay with no motion pass ("arrives with no motion: G-MO1/G-MO2 own the quiet case") and no gate checked the other state changes. No gate measured the distance between a control and a stage.
- **What changed in that step:** P6 is read as written: every change of state moves, on the motion tokens (in on the decelerating curve, out faster on the accelerating one); a derivation may not answer "nothing animates" for a state change (D-008). Doc pages put the section step (24px) between a control and the stage it drives.
- **Check that now catches it:** G-MO5 (every change an interaction makes is carried by a transition or animation on the element that changes), G-MO4 red on an overlay that arrives in one frame, G-SP2 (a control and a stage stand at least 24px apart); each proven red on the build the user saw.

### R-005: A black box for focus, a screen-ink progress fill, two icon languages
- **Date:** 2026-11-02
- **User said:** "ไม่ชอบ focus ring" (Brightness slider: a heavy black rectangle round the whole fader and its ticks), "น้ำหนักสีมันดู digital เกินไปเมื่อเทียบกับ ภาพรวม สีมันแข็ง" (Wash progress: a flat charcoal fill), "icon ควรจะ digital เท่าๆกัน" (dot-matrix transport keys beside stroked − and + keys on the same unit).
- **What was wrong:** focus.ring was the deepest ink drawn round the focusable box, which for a fader or a switch is the whole row; Progress filled with grille.hole-on, the screen's ink, so a level read as a display, not a part; the dot-matrix set (Icon, wave 4) was adopted by the docs' media keys but every component kept its own stroked glyphs (TimePicker, Select, Menu, List, Chip, Toast, Banner, Snackbar, Sheet, Checkbox, PullToRefresh, MediaPlayer, Queue, Slot, SceneCard, Input).
- **Step that produced it:** Phase 2 set focus once from P3 ("the same dark ring") and no derivation asked where the ring sits on a part that moves; the Progress derivation took "a lit level uses ink" from the Grille; the Icon derivation (wave 4) made the set but no step migrated the glyphs already drawn, and no gate looked for a second icon language.
- **What changed in that step:** focus.ring is secondary printing ink and sits on the moving part (cap, lever, knob, key), never round a row (lab apps/lab/focus pick B, D-009); Progress fills with a resin rod in line.ring lit on its upper edge (lab apps/lab/progress pick B); a new icon set replaces every glyph a component draws, and a component may not draw its own icon.
- **Check that now catches it:** G-IC2 (every small glyph in the book is the dot-matrix Icon), G-FR2 (a slider's or switch's ring is drawn round its moving part, never round a wide row), conformance progress "fill is the resin tone, not ink"; each proven red on the build the user saw.

### R-006: Printing that floats on the plastic instead of belonging to it
- **Date:** 2026-11-03
- **User said:** "สี ui ที่บอกต่างๆบนนี้ มันดูแปลกแยกไม่เป็นส่วนหนึ่งกับชิ้นงานเลยมันโดดๆ ไม่ใช่แก้ด้วยการปรับจางลง ให้มัน blend นะหาเทคนิคดีๆาใช้" (Volume slider: ticks, numerals, label, the level and the cap line).
- **What was wrong:** the ink was a neutral grey with no relation to the warm ABS body, laid on as flat colour with no depth; the level light sat on top of the groove instead of inside it; the cap's index was a stroke drawn on the glass.
- **Step that produced it:** Phase 2 picked printing tones for contrast only (abs.800/700, charcoal.50/100) and P5 said "printing is flat" without saying how print sits in the material; the faders' derivation put the fill above the groove's shadow.
- **What changed in that step:** the ink takes the body's own hue (pad ink, abs.800 #3F382D, abs.700 #554D41, charcoal.50 #ECE7DD, charcoal.100 #D6D0C4) and every unit's printing carries print.seat, the lit lip of a shallow pad-print recess under the single top-left light; the groove's shadow is drawn over the level (groove::after), so the light is inside the recess; the cap's index is a cut with a lit far edge. Lab apps/lab/print (zoom.png), pick F; B and C (blend modes) lost the numerals, D blurred in dark (D-010).
- **Check that now catches it:** conformance "printing on a unit is seated" (text-shadow print.seat on fader, rotary, meter, legend, switch, card printing; groove shadow above the fill), proven red on the build the user saw.

### R-007: Hardcoded values in the book that the lint never looked at
- **Date:** 2026-11-03
- **User said:** "ตรวจทั้งเว็บว่ามีตรงไหน hardcoded ไม่ใช่ token"
- **What was wrong:** components were clean, but the book (apps/docs/src) held 250 raw values: 105 in docs.css and depth.css (px sizes, em type, scale(1.25), raw opacity, a dead hex gradient), 46 media queries on widths that are not the breakpoint tokens (860/1100/480), 143 raw demo frame widths in 85 example files, plus raw line-heights and z-index the lint could not see. Rotary's knob sizes (44/72/108) and the gap fallbacks in Wiring and ExplainMode were numbers in component code.
- **Step that produced it:** `tooling/no-hardcode-lint.mjs` scanned packages/react/src only, so the book passed as "clean"; its rules had no family for unitless line-height, z-index, font-weight or durations, and none for media queries.
- **What changed in that step:** the lint (v5) scans apps/docs/src, checks media widths against the breakpoint tokens in range syntax, flags raw inline-style values but lets tokens through, and covers line-height, z-index, font-weight and durations (self-test 33/33). New tokens: layout.frame-{narrow,xs,sm,md,phone,lg}, layout.article, control.knob-{sm,md,lg}, type.leading-flush. Demo frames shrink to their column (min(100%, frame)).
- **Check that now catches it:** `pnpm run lint` (verify's lint step) over 530 files, clean; G-R1, G-S1–G-S6, G-S3, G-OV1, G-SP2 green after the change.

### R-008: Play and pause swapped their glyph in one frame
- **Date:** 2026-11-03
- **User said:** "จังหวะกด play, pause ไม่มีความเป็น animation, transition เลย" (speaker unit, dot-matrix transport keys)
- **What was wrong:** Icon drew a glyph as one path, so a new `name` replaced the whole drawing in a frame; Badge swapped its lamp shape the same way; the Grille's holes snapped as the level moved.
- **Step that produced it:** the Icon derivation optimised for one node per glyph and never considered a glyph changing; G-MO5 judged colours, shadows, opacity and transforms, not an SVG's own geometry.
- **What changed in that step:** Icon draws the whole 7 × 7 field and lights the glyph's holes, so a new name morphs (shared dots stay, others sink or rise, motion.dot-scale); Badge keeps every lamp shape in its window and cross-fades; Grille holes fade over motion.segment; MediaPlayer uses one morphing Icon. G-MO5 (kiln 2.9.2) reads SVG geometry, so a glyph swap in one frame is red.
- **Check that now catches it:** G-MO5 (proof "glyph swaps in one frame" red), conformance Icon "a new glyph morphs…" (24 dots caught part-way), Badge "each tone has its own glyph shape".

### R-009
- **Date:** 2026-11-04
- **User said:** "content ตรงกลางอ่านยากมาก บีบ ภาพรวม text size volume มันแกว่ง" (Principles page, 1333px)
- **What was wrong:** running text in the main column came in three sizes (lede 18px, body 16px, tables 14px) and started at two left edges (lede x=304, section text x=520 behind a 168px hanging label column), and the section text was held to 512px (32em) inside a 773px column.
- **Step that produced it:** the book-shell derivation copied a leaflet's hanging spec column and a larger lede without measuring the reading column they left; nothing checked that running text keeps one size and one edge.
- **What changed in that step:** one reading width `--read: 68ch` for every running line, the lede at the reading size (the title carries the hierarchy), section labels stacked above their text so lede, sections and tables share one left edge (lab apps/lab/reading A/B/C, pick B, by agent). Measured after: lede and body 16px, x=304, 605px, on Principles and Button; 327px at 375px.
- **Check that now catches it:** none yet: K-16 in BACKLOG (a gate for one running-text size and one left edge in main). G-S1/2/3/5/6 and G-RW1 green on /principles and /components/button.

## R-010 · 2026-11-04 · TimePicker prints white digits over the drawn figures
- **Complaint (user, with screenshot):** a small white "22" and "32" sat over the segment figures in "Night mode starts".
- **Step that made it:** component CSS. The segment TimePicker hides the field's own digits with `color: transparent`, but the browser prints a selected value in its own selected-text colour, which is white. `.field::selection` cleared only the background (R-005/D-010 work on print seat touched `text-shadow`, not selection).
- **What changed:** `.field::selection` now clears colour and text-shadow too (text kind keeps its ink). Gate: TimePicker conformance "a selected value prints no text of its own over the drawn figures", proven red on the build before the fix and green after.
