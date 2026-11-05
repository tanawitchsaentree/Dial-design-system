// @example Read-only keeps the recess; disabled loses it
import { Stack, Textarea } from 'dial-react';

export default function TextareaStates() {
  return (
    <Stack gap="lg">
      <Textarea label="Read-only note" readOnly defaultValue="Set by the owner." rows={2} />
      <Textarea label="Disabled note" disabled defaultValue="Not taking input right now." rows={2} />
    </Stack>
  );
}
