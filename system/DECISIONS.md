# DECISIONS — long-term memory ของ system นี้
> เขียนผ่าน /lock-decision เท่านั้น · แก้ของเก่า = supersede + ประเมิน impact
## Format
### D-{nnn}: {หัวข้อ}
- **วันที่:** · **Phase:** 
- **เลือก:** / **เพราะ:** / **ตัวเลือกที่ตัดทิ้ง:** / **กระทบ:**
---
### D-001: Anchor = device card A (display-led)
- **วันที่:** 2026-11-01 · **Phase:** anchor round (kiln phase 5)
- **เลือก:** แบบ A (user เลือกเอง "ชอบแบบ a"): LCD กว้างเต็มบน, ลูกบิดส้มใหญ่ 36% ของด้านสั้น, เงาตื้น (height 3px), ป้าย wordmark ซ้ายล่าง + ชื่อรุ่นขวาล่างบนเส้น inset, จอ:ตะแกรง ≈ 70:30, ปุ่ม FM/AM สีตัวเครื่อง, fader มีสเกลไม้บรรทัด
- **เพราะ:** P2 จอบอกสถานะเป็นอย่างแรกที่อ่าน; P1 ลูกบิดใหญ่ = one loud thing ชัดที่สุด; P6 เงาตื้นไม่ทำให้ unit ลอย; P5 ป้ายอยู่ตำแหน่งการพิมพ์บนตัวเครื่องตาม reference
- **ตัวเลือกที่ตัดทิ้ง:** B grille-led (ตะแกรงแย่งพื้นที่จอ), C fader-led + เงาลึก 8px + ป้ายบน, D OLED player (อาจกลับมาเป็น display variant ของ media card ใน wave 2–3)
- **กระทบ:** ค่ายังเป็น estimated from chat → ต้องวัดใหม่จาก ref-01.png แล้ว `anchor-likeness.mjs --record` ใหม่; tokens Phase 2 (material height 3px สำหรับ unit, radius, inset, knob size), Card/DeviceCard, Rotary, Key, Fader, Display(LCD), Grille, G-AN1 (`system/anchor/anchor-likeness.json`, `docs.anchor.route` ตั้งเมื่อ DeviceCard อยู่ใน book)

### D-002: Tokens ของ dial (Phase 2, ค่าประมาณ)
- **วันที่:** 2026-11-01 · **Phase:** 2 Foundations
- **เลือก:** user สั่ง "ประมาณ": ใช้ค่าประมาณจากรูปในแชทไปก่อน (ref-01.png ยังไม่มี) · baseTheme light (warm white ABS #E8E6E1 บน page F3F2EF, lightened in D-004), dark = charcoal #2F2F2D · ink #2E2D2A/#4A4844 · orange #EC6A2C เป็น `action.accent` ตัวเดียว, hover #F27D42 (ink 6.2:1), rim #C9531C (3.55:1 กับตัวเครื่อง) · LCD #C7CBBD/ink #2F322D · OLED #141414/#F2F2F0 · type Helvetica-like grotesk 2 weights (400/500), scale ratio 1.2 จาก 15px · radius ratio 0.16, inset 0.077, knob 0.36 · matte ABS: height 5px, unit height 3px (anchor A), rough 3px, gloss 0.2 · spring m 1.4 k 520 c 46 (ζ≈0.85, settle≈245ms), detents 11/270° · press 65ms, enter 160ms, exit 240ms, stagger 0, hover lift 0 · allowSeed false
- **เพราะ:** P1–P6 ใน CONCEPT.md; ทุก group มี kiln.why; contrast ทุกคู่ข้อความ ≥4.5:1 ทั้งสองธีม (24 คู่, /tmp script ใน session นี้; ดู NEXT)
- **ตัวเลือกที่ตัดทิ้ง:** ส้มเข้มขึ้นให้ 3:1 กับตัวเครื่อง (ทำให้ ink บนส้มต่ำกว่า 4.5:1) → ใช้ rim แทน · weight semibold (P5 อนุญาต 2 weight) · scale.press < 1 (key ยุบลงตามความสูง ไม่หด)
- **กระทบ:** เมื่อมี ref-01.png ต้องวัดใหม่: primitive color.abs/charcoal/orange/lcd, ratio.*, material.*, shadow.* → rebuild tokens, re-render anchor + `anchor-likeness --record`, re-run contrast ทุกคู่ และ G-AN1

### D-003: Form language (system/FORM.md)
- **วันที่:** 2026-11-01 · **Phase:** wave 1 start (form-language)
- **เลือก:** ห้า class: control (round/capsule key, rotary disc + index, fader cap in groove, rocker), input (recessed well), surface (radius = 0.16 × short side capped at corner.panel, inner = outer − inset), display (recessed window, grille holes, printed lamp + word), separator (1px seam); NEVER rules ต่อ class; matte ABS + spring m1.4/k520/c46
- **เพราะ:** P1–P6 + tactile recipe; user ให้ agent ตัดสินเองทั้งหมดหลัง anchor ("ตัดสินใจเองแล้วไปต่อเลยไม่ต้องถาม", 2026-11-01)
- **ตัวเลือกที่ตัดทิ้ง:** flat pill + intent fills, bordered 8px input, white card 12–16px soft shadow, iOS-clone switch
- **กระทบ:** ทุก component ใน wave 1+; ถ้าแก้ class ไหน ต้อง re-derive สมาชิกของ class นั้น (why.json derivation + lab + REVIEW)

### D-004: Page a step lighter (amends D-002)
- **วันที่:** 2026-11-01 · **Phase:** M1 gates
- **เลือก:** `color.abs.50` (surface.page, light) F3F2EF → F8F7F5 → #FCFBF9; the body (#E8E6E1) stays, so anchor A's body is unchanged. F8F7F5 was 1.17:1 flat but G-EL1 measured 1.12:1 past the unit's own shadow, so the page went one more step (1.21:1 flat, passes as measured).
- **เพราะ:** G-EL1: a unit must stand 1.15:1 from what is under it; it was 1.07:1. P6 (a unit never floats higher than its material allows): the lightest fix is the ground, not a deeper shadow (CLAUDE.md rule 14). The reference also shows the page lighter than the bodies.
- **ตัวเลือกที่ตัดทิ้ง:** darker body (moves the anchor), deeper shadow (against P6)
- **กระทบ:** G-AN1 rim on the page; re-record `system/anchor/anchor-likeness.json` only if G-AN1 goes red. At #FCFBF9 G-AN1 passes: body L 0.9251 C 0.0071 unchanged, rim 1.165:1 against the recorded 1.056:1, inside the allowed delta. Also field.column/on-column changed by the shell fix (G-NT1): field.column abs.700/charcoal.200, on-column abs.0/abs.900

### D-005: dial mark (user's logo)
- **วันที่:** 2026-11-02 · **Phase:** wave 3
- **เลือก:** the user's logo (two ink dots + one orange arc, `system/brand/dial-logo.png`, favicon `system/brand/dial-favicon.png`) is dial's mark: favicon, PWA icons (mark on a warm-white ABS tile, radius 0.16), and a 20px mark beside the "dial" wordmark in the book's top bar (ink dots #2E2D2A light / #EDEBE6 dark; the arc stays orange)
- **เพราะ:** user supplied it ("จัดการหน่อย"); it carries P1 itself: grey printing and one orange part
- **ตัวเลือกที่ตัดทิ้ง:** text-only wordmark
- **กระทบ:** apps/docs/public icons + manifest, App.tsx top bar, docs.css .brand-mark; regenerate from system/brand if the logo changes

### D-006: Concept depth: P7 legend, P8 relations, P9 glass (wave 4)
- **วันที่:** 2026-11-02 · **Phase:** wave 4
- **เลือก:** three principles drawn from the user's references (OP-XY printed legends, superlunar schematic face, SK 4 manual, translucent fader caps, Yoto cards, Sytren tray, N200 top key): P7 The legend is the state; P8 Relations are drawn; P9 Glass is for the part that moves (one accent material: frosted glass tinted in the value's own range, small moving parts only)
- **เพราะ:** user: "มองให้ถึงแก่น concept … ไม่ใช่แค่ภาพเหมือน product braun แต่ทำผ่าน ux ที่ tailor"; "การเลือกเอา element เล็กมาทำเป็นกระจก ด้วยโทนสีที่อยู่ในระยะเดียวกัน"; "จัดไป"
- **ตัวเลือกที่ตัดทิ้ง:** colour-blocked function zones (breaks P1), glass bodies or panels (Pane's glass, not dial), childish pixel faces (INTAKE 6)
- **กระทบ:** tokens (glass accent material), Slider/RangeSlider/Scrubber caps, Chip, SegmentedControl, Switch lamp, Badge lamp; new Legend, Wiring, ExplainMode, SceneCard/Slot, Tray, Icon (dot matrix); book home

### D-007: Glass, the one accent material (recipe A, frosted tinted resin)
- **วันที่:** 2026-11-02 · **Phase:** wave 4
- **เลือก:** recipe A จาก `apps/lab/glass/` — frosted tinted resin ที่ถูกส่องจากด้านหลังด้วยค่า: cap/latched key/lamp เป็นกระจกฝ้าโทนเดียวกับช่วงของค่า (warm amber #D9A55B, cool steel #7FA0B8, neutral ink grey #8A8780; dark #D2A465/#86A3B9/#BDBAB3), body alpha 0.42 light / 0.34 dark, edge 0.70, glow ด้านใน, lit hairline บนซ้าย; groove หลัง cap เติม tint ที่ opacity 0.62 จนถึงกลาง cap; recipe blur 3px, saturate 1.4, brightness 1.05 / 0.92 (dark) ผ่าน tokens `frost.*` → `glass.*` (G-GR1); lamp ที่ติดเป็นเม็ดแก้วสีเข้มขึ้น (light) / อ่อนลง (dark) ของช่วงเดียวกัน. ใช้กับ Slider, RangeSlider, Scrubber (prop `tint` warm|cool|neutral, default neutral), Chip และ SegmentedControl ที่ latched, Switch lamp, Badge lamp ที่ติด, Button/IconButton เฉพาะ aria-pressed (kind key; primary ไม่เป็นกระจก). body, card, panel, sheet ยังเป็น matte ABS. reduced transparency และ forced colours กลับเป็น matte (`glass.<range>.matte`, build ตั้ง blur 0)
- **เพราะ:** P9 "a glass part is lit through from behind by the value it holds" — มีแค่ A ที่ cap ถูกส่องจาก groove; P9/P1 "stays a quiet tone near the plastic; it never becomes a second orange" — amber hue ~40° chroma ต่ำ ต่างจาก orange ~20°; P6 ไม่มี gradient ไม่มี glow นอกตัวชิ้น (inset เท่านั้น); ตัวหนังสือบนกระจก text.primary 7.4–8.8:1 light, 5.4–6.2:1 dark. tactile recipe: "one material and at most one accent material" — glass คือ accent material เดียว; G-MT1 ไม่กระทบเพราะกระจกอยู่บนชิ้นเล็ก ไม่ใช่ surface (`[data-surface]`)
- **ตัวเลือกที่ตัดทิ้ง:** B clear acrylic + tinted edge (จางจน cap ไม่เด่นเป็นชิ้นที่ขยับ), C milky opal tint only when on (ใน dark key ที่ latched สว่างที่สุดใน unit และตัวหนังสือขาวบน opal ต่ำกว่า 4.5:1), glass bodies/panels (D-006)
- **กระทบ:** tooling/dial/gen-tokens.py (color.glass.*, frost.*, semantic glass.*), 9 components ข้างบน + why.json + docs (depth, chapters, ตัวอย่าง *Tint/*Glass/*Lamp(s)/*Latched) + conformance; ถ้าเปลี่ยน tint ต้อง re-check contrast ตัวหนังสือบน `glass.<range>.matte` ทั้งสองธีม

### D-008: ทุกการเปลี่ยน state เคลื่อน (P6 อ่านตามที่เขียน)
- **วันที่:** 2026-11-02 · **Phase:** wave 4 (R-004)
- **เลือก:** ทุก interaction ที่เปลี่ยนสิ่งที่มองเห็น (เปิด/ปิด popup, active row, chevron, fill, shadow, สี, ขนาด, การโผล่/หาย) เคลื่อนบน motion token: เข้าด้วย `motion.release`/`motion.enter` บน `motion.easing` (decelerate), ออกด้วย `motion.exit` บน `motion.easing-exit` (accelerate, ≤ 0.6 × ขาเข้า); overlay เข้าด้วย fade + rise สั้นๆ จากด้านที่มันงอก; reduced motion เหลือ fade สี/opacity เท่านั้น ไม่มีระยะทาง
- **เพราะ:** P6 "Surfaces stay put; only a state change moves anything" — state change ต้องเคลื่อน, พื้นผิวที่อยู่นิ่งไม่เคลื่อน; P3 กลไกของเครื่องมีมวล ไม่มีอะไรกระโดดในเฟรมเดียว; user 2026-11-02 "ทุก interaction ที่มีการเปลี่ยนแปลง ต้อง smooth"
- **ตัวเลือกที่ตัดทิ้ง:** "Nothing animates: the panel appears and goes at once" (Select derivation เดิม, อ่าน P6 ผิด); animation ตอน idle/entry choreography ของหน้า (P6 ยังห้าม)
- **กระทบ:** Select และทุก component ที่ G-MO5 จับว่า snap + why.json motion ของแต่ละตัว + docs ที่เขียนว่า "at once"; engine kiln: G-MO5 ใหม่, G-MO4 แดงเมื่อ overlay มาในเฟรมเดียว, G-SP2 ระยะ control–stage

### D-009: Focus ring = secondary printing ink on the part that moves; one icon language
- **วันที่:** 2026-11-02 · **Phase:** wave 4 (R-005)
- **เลือก:** `focus.ring` = color.abs.700 / color.charcoal.100 (text.secondary ink), 2px at one ring's offset, วาดรอบชิ้นที่ขยับ (cap ของ Slider/Scrubber/RangeSlider, lever cap ของ Switch, knob ของ Rotary, ตัว key) ไม่ใช่กรอบรอบทั้งแถว; Progress fill = `line.ring` + glass.lit ขอบบน (resin rod); ทุก glyph ใน component และใน book ใช้ dot-matrix `Icon` ชุดเดียว
- **เพราะ:** P3 focus ต้องไม่พึ่งสีส้มและเห็นได้ ≥3:1 (abs.700 บน sunken ≈7:1, charcoal.100 บน charcoal.850 ≈10:1); P5/P4 พิมพ์บนพลาสติก ไม่ใช่จอ; P4 Icon คือรูของ Grille ระดับไอคอน ภาษาเดียวทั้งเครื่อง; user 2026-11-02
- **ตัวเลือกที่ตัดทิ้ง:** focus A (ink ลึกสุดรอบทั้ง fader, ของเดิม), C (ink ลึกสุดรอบชิ้น, ยังหนัก), D (halo กระจก, รั่วออกเป็นกรอบ); Progress A (ink เต็ม, digital), C (lit glass lamp, ยังหนัก), D (frosted fill, <3:1)
- **กระทบ:** tooling/dial/gen-tokens.py focus.ring, Slider/Scrubber/Switch focus CSS, Progress CSS + why + docs, 16 components' glyphs → Icon, docs examples' glyphs → Icon; gates G-IC2, G-FR2

### D-010: Printing is pad ink pressed into the plastic
- **วันที่:** 2026-11-03 · **Phase:** wave 4 (R-006)
- **เลือก:** หมึกพิมพ์ใช้ hue ของตัวพลาสติก (abs.800 #3F382D, abs.700 #554D41; dark charcoal.50 #ECE7DD, charcoal.100 #D6D0C4) + token `print.seat` (shadow.seat `0 1px 0 #FFFDF8B3` / seat-dark `0 -1px 0 #00000073`) บนทุกตัวหนังสือ ตัวเลข ขีด scale บน unit; เงาร่อง (elevation.well) วาดทับแสงของค่าใน groove (`groove::after`) ให้แสงอยู่ในร่อง; ขีด index บน cap เป็นรอยตัดที่มีขอบสว่างด้านไกล
- **เพราะ:** P4/P5 งานพิมพ์บนเครื่องคือหมึกที่กดลงในเนื้อ ไม่ใช่สีที่วางทับ; แสงเดียวจากซ้ายบน (P3) ให้ขอบล่างของรอยพิมพ์สว่าง; contrast ไม่ลด (6.0–11.2:1); user 2026-11-03 "ให้มัน blend … ไม่ใช่แก้ด้วยการปรับจางลง"
- **ตัวเลือกที่ตัดทิ้ง:** B multiply/screen blend (ตัวเลขหายใน light), C B+deboss (เหมือนกัน), D หมึกอุ่น + spread (dark เบลอ); การลด contrast (user ห้าม)
- **กระทบ:** gen-tokens.py (abs.700/800, charcoal.50/100, shadow.seat, print.seat), Slider/RangeSlider/Scrubber/Rotary/Meter/Legend/Switch/Card/Progress CSS, conformance; ทุกที่ใช้ text.primary/secondary อุ่นขึ้นเล็กน้อย
- **ขยายทั้งระบบ (user 2026-11-03 "เปลี่ยนทั้งระบบ"):** tokens.css ออก rule จาก token `print.seat` — `:where([data-component]) { text-shadow: var(--ds-print-seat) }`, ปุ่ม/ช่องกรอกรับ inherit (UA ของ button ตั้ง none), `Icon` ได้ lip เดียวกันเป็น drop-shadow, forced-colors ปิด; ยกเว้นด้วย `--ds-print-seat: none` บนหน้าจอ (Display lcd/oled, MediaPlayer window, Skeleton window) และ key สีส้ม (.primary), และ `print.seat-on-light` บนการ์ดสว่าง (SceneCard, Slot face); conformance card "everything printed on a unit is seated"
