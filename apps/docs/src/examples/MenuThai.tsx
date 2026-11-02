// @example Thai actions, where the panel grows to its longest action so no word is cut
import { Menu } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'เปลี่ยนชื่อ' },
  { value: 'move', label: 'ย้ายไปห้องนั่งเล่นชั้นบน' },
  { value: 'remove', label: 'ลบออกจากบ้าน', destructive: true },
];

export default function MenuThai() {
  return <Menu label="ตัวเลือกของโคมไฟ" items={ACTIONS} align="start" />;
}
