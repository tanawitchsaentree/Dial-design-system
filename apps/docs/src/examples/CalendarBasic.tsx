// @example A month of printed days: an index bar under today and the chosen day cut into a recessed window
import { Calendar } from 'dial-react';

export default function CalendarBasic() {
  return <Calendar defaultMonth="2026-11" defaultValue="2026-11-12" today="2026-11-04" />;
}
