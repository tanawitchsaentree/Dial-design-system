// @example Another language: every built-in word and the filter are passed in, here Thai
import { CommandPalette } from 'dial-react';

const commands = [
  { id: 'lamps-off', label: 'ปิดไฟทุกดวง', section: 'ห้อง', shortcut: ['L'] },
  { id: 'heat-down', label: 'ลดความร้อนเหลือ 18', section: 'ห้อง' },
  { id: 'settings', label: 'เปิดการตั้งค่า', section: 'แอป' },
];

export default function CommandPaletteWords() {
  return (
    <CommandPalette
      modal={false}
      defaultOpen
      hotkey={false}
      commands={commands}
      label="แผงคำสั่ง"
      placeholder="พิมพ์คำสั่ง"
      listLabel="คำสั่ง"
      emptyText="ไม่พบคำสั่ง"
      resultsText={(n) => (n === 0 ? 'ไม่พบคำสั่ง' : `${n} คำสั่ง`)}
    />
  );
}
