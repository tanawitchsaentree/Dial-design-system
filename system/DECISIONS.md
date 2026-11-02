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
