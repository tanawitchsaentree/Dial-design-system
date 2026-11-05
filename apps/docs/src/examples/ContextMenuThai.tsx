// @example Thai actions, where the panel grows to its longest action so no word is cut
import { ContextMenu, Text } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'เปลี่ยนชื่อ' },
  { value: 'move', label: 'ย้ายไปห้องนั่งเล่นชั้นบน' },
  { value: 'remove', label: 'ลบออกจากบ้าน', destructive: true },
];

export default function ContextMenuThai() {
  return (
    <ContextMenu items={ACTIONS} label="การทำงานของโคมไฟห้องครัว" tabIndex={0} className="demo-box demo-card">
      <Text>โคมไฟห้องครัว</Text>
    </ContextMenu>
  );
}
