// @example locale sets the month and weekday words through Intl, so Thai and German need no strings from you
import { Calendar } from 'dial-react';

export default function CalendarLocale() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-gap-2xl)' }}>
      <Calendar locale="th" weekStart={0} defaultMonth="2026-11" defaultValue="2026-11-12" today="2026-11-04" previousLabel="เดือนก่อน" nextLabel="เดือนถัดไป" />
      <Calendar locale="de" defaultMonth="2026-11" defaultValue="2026-11-12" today="2026-11-04" previousLabel="Voriger Monat" nextLabel="Nächster Monat" />
    </div>
  );
}
