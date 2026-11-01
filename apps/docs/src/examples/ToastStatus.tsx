// @example A status word of your own, still beside the tone's glyph
import { Stack, Toast } from 'dial-react';

export default function ToastStatus() {
  return (
    <Stack gap="md">
      <Toast tone="positive" status="Saved" onClose={() => {}}>Night mode starts at 23:00</Toast>
      <Toast tone="warning" status="Offline" onClose={() => {}}>Hallway lamp lost its connection</Toast>
    </Stack>
  );
}
