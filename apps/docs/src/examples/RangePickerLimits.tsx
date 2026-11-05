// @example min and max close the ends, isDateDisabled blocks single days, and a hint says the longest stay
import { RangePicker } from 'dial-react';

const weekend = (iso: string) => [0, 6].includes(new Date(`${iso}T00:00:00Z`).getUTCDay());

export default function RangePickerLimits() {
  return (
    <RangePicker
      label="Stay"
      min="2026-11-04"
      max="2026-12-18"
      isDateDisabled={weekend}
      hint="Weekends are booked. Up to 14 nights."
      defaultValue={{ start: '2026-11-09', end: '2026-11-13' }}
      today="2026-11-04"
    />
  );
}
