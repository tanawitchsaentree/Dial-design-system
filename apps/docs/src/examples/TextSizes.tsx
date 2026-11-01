// @example Five size steps, from the model name on the case to reading prose
import { Stack, Text } from 'dial-react';

export default function TextSizes() {
  return (
    <Stack gap="sm">
      <Text size="micro">micro · 11px · model name and scale numerals</Text>
      <Text size="caption">caption · 13px · wordmark and short notes</Text>
      <Text size="label">label · 14px · names a control or a reading</Text>
      <Text size="body">body · 15px · a sentence inside a unit</Text>
      <Text size="reading">reading · 16px · prose on a sheet, capped at the measure</Text>
    </Stack>
  );
}
