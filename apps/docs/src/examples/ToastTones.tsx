// @example The four tones, each with its own glyph and word, and none of them orange
import { Stack, Toast } from 'dial-react';

export default function ToastTones() {
  return (
    <Stack gap="md">
      <Toast tone="neutral" onClose={() => {}}>Schedule saved for tomorrow</Toast>
      <Toast tone="positive" onClose={() => {}}>Lamp turned off</Toast>
      <Toast tone="warning" onClose={() => {}}>Filter needs cleaning soon</Toast>
      <Toast tone="critical" onClose={() => {}}>Washer didn’t answer</Toast>
    </Stack>
  );
}
