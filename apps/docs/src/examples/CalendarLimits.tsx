// @example min and max close the ends of the range, and isDateDisabled blocks single days such as weekends
import { Calendar } from 'dial-react';

const isWeekend = (iso: string) => {
  const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
};

export default function CalendarLimits() {
  return <Calendar defaultMonth="2026-11" today="2026-11-04" min="2026-11-04" max="2026-12-18" isDateDisabled={isWeekend} />;
}
