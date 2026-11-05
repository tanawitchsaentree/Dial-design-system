// @example Thai titles and text keep their line height in the callout, and the count and keys use your own words
import { useState } from 'react';
import { Button, Onboarding, Stack } from 'dial-react';

export default function OnboardingThai() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="lg" align="start">
      <Stack direction="row" gap="md" align="center">
        <Button id="ob-th-heat">เครื่องทำความร้อน</Button>
        <Button id="ob-th-lamp">โคมไฟ</Button>
      </Stack>
      <Button onClick={() => setOpen(true)}>เริ่มแนะนำ</Button>
      <Onboarding
        open={open}
        onOpenChange={setOpen}
        backLabel="ย้อนกลับ"
        nextLabel="ถัดไป"
        doneLabel="เสร็จสิ้น"
        skipLabel="ข้าม"
        formatCount={(n, total) => `ขั้นที่ ${n} จาก ${total}`}
        steps={[
          { target: 'ob-th-heat', title: 'เครื่องทำความร้อน', text: 'เปิดหรือปิดหม้อน้ำของห้องนี้ แล้วตั้งอุณหภูมิที่ต้องการ' },
          { target: 'ob-th-lamp', title: 'โคมไฟ', text: 'หรี่หรือเร่งแสงโคมไฟ กดค้างเพื่อตั้งระดับ' },
        ]}
      />
    </Stack>
  );
}
