// @example Thai key words and lamp, with the group named in Thai
import { Badge, Button, IconButton, Tray } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function TrayThai() {
  return (
    <Tray label="ปุ่มเล่นเพลง">
      <IconButton label="เพลงก่อนหน้า"><svg {...icon}><path d="M18 6l-8 6 8 6zM6 6v12" /></svg></IconButton>
      <IconButton label="เพลงถัดไป"><svg {...icon}><path d="M6 6l8 6-8 6zM18 6v12" /></svg></IconButton>
      <Button>สุ่มเพลง</Button>
      <Badge tone="positive">ออนไลน์</Badge>
    </Tray>
  );
}
