// @example An error line with the dot-matrix glyph and words, told by more than red
import { HelperText, Input, Stack } from 'dial-react';

export default function HelperTextError() {
  return (
    <Stack gap="sm">
      <Input label="Target temperature" defaultValue="42" unit="°C" aria-invalid aria-describedby="ht-error" />
      <HelperText id="ht-error" tone="error">Enter a value under 30.</HelperText>
    </Stack>
  );
}
