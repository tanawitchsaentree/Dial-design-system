// @example readOnly shows a booked range for reading, disabled switches the wells and the key off
import { RangePicker, Stack } from 'dial-react';

export default function RangePickerStates() {
  const range = { start: '2026-11-09', end: '2026-11-17' };
  return (
    <Stack gap="lg">
      <RangePicker label="Booked" readOnly defaultValue={range} today="2026-11-04" />
      <RangePicker label="Closed" disabled defaultValue={range} today="2026-11-04" />
    </Stack>
  );
}
