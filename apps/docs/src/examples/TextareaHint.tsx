// @example hint prints a short line under the well; Thai marks fit inside the well's line box
import { Stack, Textarea } from 'dial-react';

export default function TextareaHint() {
  return (
    <Stack gap="lg">
      <Textarea label="Note" hint="Shown to everyone in the home." defaultValue="Guests arrive on Friday." />
      <Textarea label="บันทึก" hint="แสดงให้ทุกคนในบ้านเห็น" defaultValue="แขกมาถึงวันศุกร์ เปิดฮีตเตอร์ห้องรับรองไว้ก่อน" />
    </Stack>
  );
}
