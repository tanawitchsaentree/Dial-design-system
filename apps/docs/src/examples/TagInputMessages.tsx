// @example Every built-in word is a prop, here in Thai, so the remove keys and refusals speak the page's language
import { TagInput } from 'dial-react';

export default function TagInputMessages() {
  return (
    <TagInput
      label="ห้อง"
      defaultValue={['ห้องครัว', 'ห้องนอน']}
      placeholder="เพิ่มห้อง"
      max={3}
      removeLabel={(t) => `ลบ ${t}`}
      duplicateMessage={(t) => `${t} มีอยู่แล้ว`}
      maxMessage={(n) => `ได้ไม่เกิน ${n} ห้อง`}
      addedMessage={(t) => `เพิ่ม ${t} แล้ว`}
      removedMessage={(t) => `ลบ ${t} แล้ว`}
    />
  );
}
