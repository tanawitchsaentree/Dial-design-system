// @example min, max and isDateDisabled refuse a typed date and dim the day on the Calendar
import { DatePicker } from 'dial-react';

const weekend = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return d === 0 || d === 6;
};

export default function DatePickerLimits() {
  return (
    <DatePicker
      label="Delivery day"
      hint="Weekdays between 4 and 30 November."
      min="2026-11-04"
      max="2026-11-30"
      isDateDisabled={weekend}
      defaultValue="2026-11-10"
      today="2026-11-04"
    />
  );
}
