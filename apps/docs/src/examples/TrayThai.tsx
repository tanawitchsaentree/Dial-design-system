// @example Thai key words and lamp, with the group named in Thai
import { Badge, Button, Icon, IconButton, Tray } from 'dial-react';


export default function TrayThai() {
  return (
    <Tray label="ปุ่มเล่นเพลง">
      <IconButton label="เพลงก่อนหน้า"><Icon name="previous" /></IconButton>
      <IconButton label="เพลงถัดไป"><Icon name="next" /></IconButton>
      <Button>สุ่มเพลง</Button>
      <Badge tone="positive">ออนไลน์</Badge>
    </Tray>
  );
}
