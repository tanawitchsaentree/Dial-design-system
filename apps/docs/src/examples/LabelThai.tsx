// @example A Thai name with its own words for the mark, and a long name that wraps without moving the mark
import { Label } from 'dial-react';

export default function LabelThai() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-lg)', inlineSize: '100%' }}>
      <Label htmlFor="label-thai-a" required requiredText="จำเป็น" help="ไม่เกิน 350 ตัวอักษร">ชื่อห้องนั่งเล่น</Label>
      <Label htmlFor="label-thai-b" optional optionalText="ไม่บังคับ">ชื่อห้องสำหรับแขกที่พักชั้นบนของบ้านหลังใหญ่</Label>
    </div>
  );
}
