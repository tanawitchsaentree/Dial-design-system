// @example Thai words in the title and the content keep their line height and wrap inside the panel
import { Popover, Text } from 'dial-react';

export default function PopoverThai() {
  return (
    <Popover label="เกี่ยวกับไส้กรองน้ำ" title="ไส้กรองน้ำ">
      <Text tone="secondary">เปลี่ยนทุกสามเดือน ไฟจะติดเมื่อเหลืออีกสิบวัน</Text>
    </Popover>
  );
}
