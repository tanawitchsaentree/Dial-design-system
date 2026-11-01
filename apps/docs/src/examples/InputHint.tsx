// @example hint prints a short line under the well; Thai marks fit inside the well's line box
import { Input, Stack } from 'dial-react';

export default function InputHint() {
  return (
    <Stack gap="lg">
      <Input label="Device name" hint="Shown on the unit and in the app." defaultValue="Hallway lamp" />
      <Input label="ชื่ออุปกรณ์" hint="แสดงบนเครื่องและในแอป" defaultValue="เครื่องฟอกอากาศ ห้องนอนผู้ใหญ่" />
    </Stack>
  );
}
