// @example A label, a changing reading in tabular figures, and a note in the lighter ink
import { Stack, Text } from 'dial-react';

export default function TextBasic() {
  return (
    <Stack gap="xs">
      <Text size="label" weight="medium">Living room</Text>
      <Text size="body" numeric>21.5° now · target 22.0°</Text>
      <Text size="caption" tone="secondary">Eco from 23:00</Text>
    </Stack>
  );
}
