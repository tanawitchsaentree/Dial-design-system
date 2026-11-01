// @example Two weights only: medium names a part, regular says the rest
import { Stack, Text } from 'dial-react';

export default function TextWeights() {
  return (
    <Stack gap="xs">
      <Text size="label" weight="medium">Living room lamp</Text>
      <Text size="caption" tone="secondary">Dimmed to 40% since 19:30</Text>
    </Stack>
  );
}
