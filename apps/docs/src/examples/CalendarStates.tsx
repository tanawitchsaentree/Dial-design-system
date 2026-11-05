// @example readOnly keeps focus and the arrow keys but chooses nothing; disabled turns the whole month off
import { Calendar } from 'dial-react';

export default function CalendarStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-gap-2xl)' }}>
      <Calendar readOnly defaultMonth="2026-11" defaultValue="2026-11-12" today="2026-11-04" />
      <Calendar disabled defaultMonth="2026-11" defaultValue="2026-11-12" today="2026-11-04" />
    </div>
  );
}
