// @example Controlled with value and onValueChange, and the month followed with month and onMonthChange
import { useState } from 'react';
import { Calendar } from 'dial-react';

export default function CalendarControlled() {
  const [day, setDay] = useState<string | null>('2026-11-12');
  const [month, setMonth] = useState('2026-11');
  return (
    <div>
      <Calendar value={day} onValueChange={setDay} month={month} onMonthChange={setMonth} today="2026-11-04" />
      <p>You chose {day ?? 'no day'}. Showing {month}.</p>
    </div>
  );
}
