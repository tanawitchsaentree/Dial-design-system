// @example The two tones side by side: a neutral hint and an error with a glyph
import { HelperText, Stack } from 'dial-react';

export default function HelperTextTones() {
  return (
    <Stack gap="md">
      <HelperText>Used to name the room in the schedule.</HelperText>
      <HelperText tone="error">This name is already taken.</HelperText>
    </Stack>
  );
}
