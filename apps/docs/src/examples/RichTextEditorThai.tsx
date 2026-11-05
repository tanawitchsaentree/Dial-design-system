// @example Thai text with its own words for the keys; the line boxes stay tall enough for the marks
import { RichTextEditor } from 'dial-react';

export default function RichTextEditorThai() {
  return (
    <RichTextEditor
      label="บันทึกสำหรับผู้ดูแลบ้าน"
      lang="th"
      defaultValue="<p>ตั้งฮีตเตอร์ห้องโถงไว้ที่ <strong>18 องศา</strong> จนถึงวันศุกร์</p>"
      placeholder="เขียนที่นี่"
      words={{ toolbar: 'จัดรูปแบบ', bold: 'ตัวหนา', italic: 'ตัวเอียง', link: 'ลิงก์', bulletList: 'รายการหัวข้อย่อย', numberList: 'รายการเลขลำดับ', heading: 'หัวเรื่อง', boldMark: 'ห', italicMark: 'อ', linkMark: 'ลิงก์', headingMark: 'ช', address: 'ที่อยู่เว็บ', apply: 'ใช้', cancel: 'ยกเลิก', removeLink: 'เอาลิงก์ออก' }}
    />
  );
}
