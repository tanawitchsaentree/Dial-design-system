// @example weekStart sets the first column, 0 for Sunday through 6 for Saturday; the default is Monday
import { Calendar } from 'dial-react';

export default function CalendarWeekStart() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-gap-2xl)' }}>
      <Calendar weekStart={1} defaultMonth="2026-11" today="2026-11-04" />
      <Calendar weekStart={0} defaultMonth="2026-11" today="2026-11-04" />
    </div>
  );
}
