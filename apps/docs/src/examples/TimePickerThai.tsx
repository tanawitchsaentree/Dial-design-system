// @example Thai labels and hint. The label line box holds tone marks over upper vowels, and the fields keep their width
import { Stack, TimePicker } from 'dial-react';

export default function TimePickerThai() {
  return (
    <Stack gap="lg" align="start">
      <TimePicker label="เริ่มโหมดกลางคืน" defaultValue="22:30" hint="ไฟห้องนั่งเล่นจะหรี่ลงเอง" hourLabel="ชั่วโมง" minuteLabel="นาที" keyLabels={['ลดชั่วโมง', 'เพิ่มชั่วโมง', 'ลดนาที', 'เพิ่มนาที']} />
      <TimePicker label="ปิดเครื่องปรับอากาศ" kind="text" hourCycle="12" defaultValue="05:45" periodWords={['AM', 'PM']} hourLabel="ชั่วโมง" minuteLabel="นาที" periodLabel="ช่วงเวลา" />
    </Stack>
  );
}
