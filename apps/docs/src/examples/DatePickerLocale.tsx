// @example locale sets the typed order and the Calendar words; the format words are passed in the same language
import { DatePicker } from 'dial-react';

export default function DatePickerLocale() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-xl)' }}>
      <DatePicker
        label="วันที่เริ่ม"
        locale="th"
        weekStart={0}
        defaultValue="2026-11-12"
        today="2026-11-04"
        chooseLabel="เลือกวันที่"
        formatWords={{ day: 'วว', month: 'ดด', year: 'ปปปป' }}
        hint="พิมพ์วัน/เดือน/ปี"
      />
      <DatePicker label="Beginn" locale="de" defaultValue="2026-11-12" today="2026-11-04" chooseLabel="Datum wählen" formatWords={{ day: 'TT', month: 'MM', year: 'JJJJ' }} />
    </div>
  );
}
