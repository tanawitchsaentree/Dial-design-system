// @example A unit's name as a level 3 heading, with a note printed under it
import { Heading, Stack, Text } from 'dial-react';

export default function HeadingBasic() {
  return (
    <Stack gap="xs">
      <Heading level={3}>Living room heater</Heading>
      <Text size="label" tone="secondary">Holding 21.5°</Text>
    </Stack>
  );
}
