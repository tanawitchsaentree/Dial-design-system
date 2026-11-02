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
