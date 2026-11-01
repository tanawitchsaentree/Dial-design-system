# STATE — working memory ของ system นี้

> **เปิดดู:** `pnpm run docs:build && pnpm run docs:preview` → http://localhost:4173/direction
> **Anchor lab:** http://localhost:4173/lab/anchor/index.html หรือ `open apps/lab/anchor/index.html`
> ตรวจ contrast lab: `node tooling/kiln/anchor-contrast.mjs`

- **System:** dial (dial-tokens, dial-react) · kiln 2.5.1
- **Phase ปัจจุบัน:** 5 (anchor round) — `.kiln/state.json` phase=5 · anchor = **A** (D-001, user pick)
- **งานล่าสุดที่เสร็จ:** anchor lab 4 แบบ (light+dark, ตัวหนังสือ 0 ตัวต่ำกว่า 4.5:1, worst 5.52 light / 6.51 dark); book เปิดได้ มีหน้า /direction; verify:quick 14/14
- **งานถัดไป:** วัดค่าจาก ref-01.png → render A ใหม่ + record anchor ใหม่ → Phase 2 tokens (allowSeed false) → wave 1
- **Wave ปัจจุบัน:** — · **Component ผ่าน QA:** 0 (starter layout: Container, Grid, Stack)
- **ค้าง/blocked:** `system/refs/ref-01.png` ยังไม่มี: lock tokens รอไฟล์นี้ (brief: วัดจาก pixel จริง ห้ามเดา)
## Log ย่อ (ใหม่สุดบน ≤15 บรรทัด)
- 2026-11-01 user เลือก anchor A → D-001; anchor-likeness recorded (L 0.9251 C 0.0071 rim 1.056:1, estimated)
- 2026-11-01 anchor lab A–D + check.mjs; book: overview/foundation ledes, /direction; BACKLOG K-1..K-7
- 2026-11-01 Phase 0–4 เสร็จ ค่าจาก reference ทั้งหมดเป็น "(estimated from chat, re-measure from ref-01.png)"
- 2026-11-01 repo สร้างจาก kiln 2.5.1 starter, commit 84e457b; pnpm เปิดผ่าน corepack
