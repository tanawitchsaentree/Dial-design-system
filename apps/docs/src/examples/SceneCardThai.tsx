// @example Thai names, steps and announcements, with the foot word and the slot's words passed in
import { Card, SceneCard, Slot, Stack } from 'dial-react';

const card = { kind: 'ฉาก', picked: (n: string) => `หยิบ ${n} แล้ว เลือกช่องแล้วกด Enter หรือกด Escape เพื่อวางคืน`, putBack: (n: string) => `วาง ${n} คืนแล้ว` };
const slot = { legend: 'การ์ดฉาก', running: 'กำลังทำงาน', empty: 'ว่าง', name: (l: string, s: string | null) => (s ? `ช่อง${l} มี ${s}` : `ช่อง${l} ว่าง`), inserted: (s: string, l: string) => `ใส่ ${s} ใน${l}แล้ว`, removed: (s: string, l: string) => `เอา ${s} ออกจาก${l}แล้ว`, pickFirst: (l: string) => `หยิบการ์ดฉากก่อน แล้วกดช่อง${l}` };

export default function SceneCardThai() {
  return (
    <Stack gap="xl">
      <Stack direction="row" gap="md">
        <SceneCard value="movie" name="ดูหนัง" steps={['ไฟ 20%', 'ม่านปิด']} words={card} />
        <SceneCard value="sleep" name="เข้านอน" steps={['ปิดไฟทั้งหมด', 'แอร์ 26°']} words={card} />
      </Stack>
      <Card padding="unit" wordmark="dial" model="scene 1" style={{ inlineSize: 'max-content', maxInlineSize: '100%' }}>
        <Slot label="ห้องนั่งเล่น" words={slot} />
      </Card>
    </Stack>
  );
}
