// @example Controlled by your own state, with the key name and the two state words passed in Thai and the strength line replaced
import { useState } from 'react';
import { PasswordInput } from 'dial-react';

export default function PasswordInputControlled() {
  const [shown, setShown] = useState(false);
  return (
    <PasswordInput
      label="รหัสผ่าน"
      defaultValue="บ้านสวนริมน้ำ"
      shown={shown}
      onShownChange={setShown}
      toggleLabel="แสดงรหัสผ่าน"
      shownWord="แสดงอยู่"
      hiddenWord="ซ่อนอยู่"
      strength="fair"
      strengthText="ความแข็งแรง: ปานกลาง"
    />
  );
}
