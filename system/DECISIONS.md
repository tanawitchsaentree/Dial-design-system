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
