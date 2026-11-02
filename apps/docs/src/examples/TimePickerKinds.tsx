// @example kind is segment (the default, 7-segment figures and set keys) or text (grotesk figures, no keys)
import { Stack, TimePicker } from 'dial-react';

export default function TimePickerKinds() {
  return (
    <Stack gap="lg" align="start">
      <TimePicker label="Lights dim at" kind="segment" defaultValue="21:45" />
      <TimePicker label="Lights dim at" kind="text" defaultValue="21:45" />
    </Stack>
  );
}
