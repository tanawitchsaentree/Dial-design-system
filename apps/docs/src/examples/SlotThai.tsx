// @example Thai words for the legend, the lamp and every announcement
import { Card, SceneCard, Slot, Stack } from 'dial-react';

const slot = { legend: 'การ์ดฉาก', running: 'กำลังทำงาน', empty: 'ว่าง', name: (l: string, s: string | null) => (s ? `ช่อง${l} มี ${s}` : `ช่อง${l} ว่าง`), inserted: (s: string, l: string) => `ใส่ ${s} ใน${l}แล้ว`, removed: (s: string, l: string) => `เอา ${s} ออกจาก${l}แล้ว`, pickFirst: (l: string) => `หยิบการ์ดฉากก่อน แล้วกดช่อง${l}` };

export default function SlotThai() {
  return (
    <Stack gap="xl">
      <SceneCard value="party" name="ปาร์ตี้" steps={['ไฟสี 60%', 'ลำโพงเปิด']} words={{ kind: 'ฉาก' }} />
      <Stack direction="row" gap="lg">
        <Card padding="unit" wordmark="dial" model="scene 1"><Slot label="ห้องนั่งเล่น" words={slot} /></Card>
        <Card padding="unit" wordmark="dial" model="scene 1"><Slot label="ห้องครัว" words={slot} defaultScene={{ value: 'cook', name: 'ทำอาหาร', steps: ['ไฟครัว 100%'] }} /></Card>
      </Stack>
    </Stack>
  );
}
