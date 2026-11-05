// @example Every word is a prop, so the tray can speak another language, here Thai with its stacked marks
import { Dropzone } from 'dial-react';

export default function DropzoneThai() {
  return (
    <Dropzone
      multiple
      title="วางไฟล์ที่นี่"
      overTitle="ปล่อยเพื่อเพิ่มไฟล์"
      hint="หรือเลือกไฟล์จากอุปกรณ์นี้"
      overHint="ไฟล์จะถูกเพิ่มเมื่อปล่อยเมาส์"
      chooseLabel="เลือกไฟล์"
      addedLabel={(n) => `เพิ่มแล้ว ${n} ไฟล์`}
      rejectedLabel={(n) => `ไม่รับ ${n} ไฟล์`}
    />
  );
}
