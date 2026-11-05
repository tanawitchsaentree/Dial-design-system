// @example Long and Thai text wraps in the printed line, and maxLength limits what the field takes
import { Editable, Stack } from 'dial-react';

export default function EditableLongText() {
  return (
    <Stack gap="lg">
      <Editable label="Schedule name" defaultValue="Weekday mornings, heating up before everyone wakes and down again once the house is empty" maxLength={120} />
      <Editable label="ชื่อห้อง" defaultValue="ห้องนั่งเล่นชั้นล่างที่มีหน้าต่างบานใหญ่" placeholder="ยังไม่ได้ตั้งค่า" editLabel="แก้ไขชื่อห้อง" saveLabel="บันทึกชื่อห้อง" cancelLabel="ยกเลิกการแก้ไข" />
    </Stack>
  );
}
