# STATE — working memory ของ system นี้

> **เปิดดู:** book → `cd ~/Downloads/bauhouse-ds/apps/docs && npx vite preview --port 4317 --strictPort` แล้วเปิด http://localhost:4317/direction
> (ต้อง `pnpm run docs:build` ก่อนถ้าแก้ source; `pnpm run docs:preview` ใช้ port 4173 ซึ่งตอนนี้มี server ของ Pane ยึดอยู่)
> **Anchor lab:** http://localhost:4317/lab/anchor/index.html หรือเปิดไฟล์ตรง `open ~/Downloads/bauhouse-ds/apps/lab/anchor/index.html`
> ตรวจ contrast lab: `node apps/lab/anchor/check.mjs` (จาก root)

- **System:** dial (dial-tokens, dial-react) · kiln 2.5.1
- **Phase ปัจจุบัน:** 5 (anchor round) — `.kiln/state.json` phase=5 · **รอ user เลือก anchor (A–D)**
- **งานล่าสุดที่เสร็จ:** anchor lab 4 แบบ (light+dark, ตัวหนังสือ 0 ตัวต่ำกว่า 4.5:1, worst 5.52 light / 6.51 dark); book เปิดได้ มีหน้า /direction; verify:quick 14/14
- **งานถัดไป:** ref-01.png → วัดใหม่ → render ใหม่; รอ anchor pick → lock → Phase 2 tokens
- **Wave ปัจจุบัน:** — · **Component ผ่าน QA:** 0 (starter layout: Container, Grid, Stack)
- **ค้าง/blocked:** `system/refs/ref-01.png` ยังไม่มี (ค่าทั้งหมด estimated from chat); anchor pick ของ user
## Log ย่อ (ใหม่สุดบน ≤15 บรรทัด)
- 2026-11-01 anchor lab A–D + check.mjs; book: overview/foundation ledes, /direction; BACKLOG K-1..K-7
- 2026-11-01 Phase 0–4 เสร็จ ค่าจาก reference ทั้งหมดเป็น "(estimated from chat, re-measure from ref-01.png)"
- 2026-11-01 repo สร้างจาก kiln 2.5.1 starter, commit 84e457b; pnpm เปิดผ่าน corepack
