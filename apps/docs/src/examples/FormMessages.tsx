// @example Your own words: messages replaces the built-in sentences and summaryTitle the heading, here in Thai
import { Form, FormItem, FormSubmit, Input, Stack } from 'dial-react';

export default function FormMessages() {
  return (
    <Form
      summaryTitle={() => 'ช่องที่ต้องแก้ก่อนส่ง'}
      sendingLabel="กำลังส่ง"
      messages={{ valueMissing: (label) => `กรอก${label}`, typeMismatch: (label) => `${label}ไม่ถูกต้อง` }}
      onSubmit={() => undefined}
    >
      <Stack gap="lg">
        <FormItem name="room">
          <Input label="ชื่อห้อง" required />
        </FormItem>
        <FormItem name="mail">
          <Input label="อีเมล" type="email" required defaultValue="abc" />
        </FormItem>
        <div>
          <FormSubmit>บันทึก</FormSubmit>
        </div>
      </Stack>
    </Form>
  );
}
