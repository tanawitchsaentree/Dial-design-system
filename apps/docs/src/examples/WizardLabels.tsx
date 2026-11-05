// @example Your own words on the keys and a level-3 heading, for a Wizard inside a sheet in another language
import { Wizard, WizardStep } from 'dial-react';

export default function WizardLabels() {
  return (
    <Wizard
      headingLevel={3}
      backLabel="ย้อนกลับ"
      nextLabel="ถัดไป"
      finishLabel="เสร็จสิ้น"
      stepLabel={(n, total) => `ขั้นตอนที่ ${n} จาก ${total}`}
      keysLabel="ขั้นตอน"
    >
      <WizardStep title="ทั่วไป">ชื่อและคำอธิบายของห้อง</WizardStep>
      <WizardStep title="ตรวจสอบ">ตรวจสอบสรุปแล้วกดเสร็จสิ้น</WizardStep>
    </Wizard>
  );
}
