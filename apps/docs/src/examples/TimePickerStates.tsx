// @example Not set, invalid with words and a glyph, read only and disabled
import { Stack, TimePicker } from 'dial-react';

export default function TimePickerStates() {
  return (
    <Stack gap="lg" align="start">
      <TimePicker label="Quiet hours start" kind="text" hint="Not set yet. Type the hour, then the minute." />
      <TimePicker label="Quiet hours end" kind="text" defaultValue="22:00" error="End is before the start. Pick a time after 23:00." />
      <TimePicker label="Set by the building" kind="text" defaultValue="23:00" readOnly />
      <TimePicker label="Away mode starts" kind="text" defaultValue="08:00" disabled />
    </Stack>
  );
}
