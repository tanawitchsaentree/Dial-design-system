# STATE — working memory ของ system นี้

> **เปิดดู:** `pnpm run docs:build && pnpm run docs:preview` → http://localhost:4173/direction
> **Anchor lab:** http://localhost:4173/lab/anchor/index.html หรือ `open apps/lab/anchor/index.html`
> ตรวจ contrast lab: `node tooling/kiln/anchor-contrast.mjs`

- **System:** dial (dial-tokens, dial-react) · kiln 2.7.2
- **Phase ปัจจุบัน:** waves 1–4 built (48 components) · แก้ผล full verify ครั้งแรกของ wave 4 (i18n, evidence, gates 62/75) → full verify ใหม่ → milestone M2, M3
- **งานล่าสุดที่เสร็จ:** 2026-11-02 แก้ทุกข้อที่ full verify รอบ wave 4 เจอ (ดู log); targeted gates 13/13 บน route ที่แก้
- **งานถัดไป:** verify:changed → full verify (บันทึก) → `pnpm run milestone` M2 → ตั้ง M3 → milestone M3 → user review REVIEW.md + book
- **Wave ปัจจุบัน:** 4 built · ทุก wave ของ home-iot (1–3) + wave 4 concept depth เสร็จ
- **Wave 5 (2026-11-04):** ครบทุก wave ของ docs/CATALOG.md · 123 components (+75 ตัวในวันนี้) · verify:quick 14/14 ยกเว้นรอบสุดท้ายแก้ Onboarding exit แล้วรัน conformance 890/890 · ต่อไป: full verify + milestone
- **ค้าง/blocked:** ค่าสีและสัดส่วนยังเป็นค่าประมาณ (ref-01.png ไม่มี); ไม่ publish (Phase 8 เป็นของ user)
## Log ย่อ (ใหม่สุดบน ≤15 บรรทัด)
- 2026-11-04 R-005..R-008 + hardcoded audit (R-007) fixed; full verify 2026-11-03 recorded 18/21 (reds since fixed, timeouts from Spotlight load); targeted: conformance 385/385 by parts, tone 229/229, gates rerun green (CL1 IC1 IC2 SP2 BR1 MS1 AN1 OV1 LK1 CH1 MO5 NT2 axe×2); kiln 2.9.3
- 2026-11-02 full verify wave 4 แดง 3 ขั้น → แก้: i18n 31 คำเข้า messages.ts; Environment style crash (why.json ไม่มี motion); ExplainMode render loop 60fps (โน้ตสลับ key/วางข้าง ทุกเฟรม) → damping; Wiring จุดปลายสายทับคำ; glass matte ไม่มี glow/halo (RT 4.2→ผ่าน); Tabs mark fade (G-MO3); Skeleton/Slot/PTR/Legend axe; kiln 2.7.2 (K-16 G-S3 clip, K-17 G-NT2 printed radio, K-18 spec-capture size)
- 2026-11-02 wave 4 done: D-007 glass, Legend, Wiring, ExplainMode, SceneCard, Slot, Tray, Icon; home concept scene
- 2026-11-02 D-007 glass accent material (recipe A frosted tinted resin, lab apps/lab/glass): tokens color.glass/frost/glass.*, 9 components (Slider/RangeSlider/Scrubber tint prop, Chip, SegmentedControl, Switch, Badge, Button/IconButton aria-pressed); gates 7/7, conformance 386/386, tone 229/229
- 2026-11-02 Icon (wave 4): ชุด dot 7×7 46 glyph, lab D (วัดที่ 16px 1x: ทุกจุด ≥3:1), /foundations/icons ใช้ชุดใหม่
- 2026-11-02 user refs (OP-XY, superlunar, SK 4 manual, glass caps, Yoto, Sytren, N200) → D-006; wave 4 started; R-003 backdrop picker removed
- 2026-11-02 wave 3 done (7 components); D-005 user logo as dial mark (favicon, PWA icons, top bar)
- 2026-11-02 wave 2 done (10 components), G-MO3 Switch + G-TT1 picker fixed; wave 3 started; verify deferred to end of wave 3
- 2026-11-02 user: "ทำต่อไปเรื่อยให้ครบทุก wave"; kiln 2.7 synced, M2/M3 defined, wave 2 started
- 2026-11-02 R-002 Select clip + single-variant label fixed; visual sweep 21 pages ×2 themes; verify 20/20, milestone 44/44 (engine 2.5.4)
- 2026-11-02 M1 done: verify 20/20, milestone 44/44; advisory ว่าง; REVIEW rows ครบ
- 2026-11-01 R-001 book shell ใหม่ (leaflet A + home hero), D-004 page #FCFBF9
- 2026-11-01 full verify 16/20 → triage; K-11 smoke-import แก้ในเครื่อง (27/27); แจ้ง kiln session เรื่อง K-8..K-11
- 2026-11-01 batch 1 (9 components) verify:quick 14/14, commit c065409; K-9 docs.css lede p, K-10 G-SL1 vs Rotary
- 2026-11-01 user: "ตัดสินใจเองแล้วไปต่อเลยไม่ต้องถาม" → ทำ wave 1 ต่อใน session เดิม; Button เสร็จ (template), D-003 FORM.md, PLAYBOOK.md

- 2026-11-04: R-009 book reading column (one size 16px, one left edge, 68ch; section labels stacked). Shell gates green on /principles, /components/button. Full verify still owed for M2/M3.
