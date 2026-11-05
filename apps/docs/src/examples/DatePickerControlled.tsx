// @example Controlled with value and onValueChange, and the committed day printed under the field
import { useState } from 'react';
import { DatePicker } from 'dial-react';

export default function DatePickerControlled() {
  const [day, setDay] = useState<string | null>('2026-11-12');
  return (
    <div>
      <DatePicker label="Check-in" value={day} onValueChange={setDay} today="2026-11-04" />
      <p>You chose {day ?? 'no day'}.</p>
    </div>
  );
}
