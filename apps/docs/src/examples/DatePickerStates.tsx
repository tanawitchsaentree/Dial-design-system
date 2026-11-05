// @example An error from the page, a read-only date and a disabled picker, each told by more than colour
import { DatePicker } from 'dial-react';

export default function DatePickerStates() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-xl)' }}>
      <DatePicker label="Return date" error="Return must be after check-in." defaultValue="2026-11-02" today="2026-11-04" />
      <DatePicker label="Booked on" readOnly defaultValue="2026-10-28" today="2026-11-04" />
      <DatePicker label="Birthday" disabled today="2026-11-04" />
    </div>
  );
}
