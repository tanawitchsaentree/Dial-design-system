// @example Fixed room inside a row, one extra large step between two words
import { Spacer, Stack, Text } from 'dial-react';

export default function SpacerInline() {
  return (
    <Stack direction="row" gap="xs" align="center">
      <Text>Day</Text>
      <Spacer axis="inline" size="xl" />
      <Text>Night</Text>
    </Stack>
  );
}
