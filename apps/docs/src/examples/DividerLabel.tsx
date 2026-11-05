// @example A lowercase word printed on the seam, a short way in from its start
import { Divider, Stack, Text } from 'dial-react';

export default function DividerLabel() {
  return (
    <Stack gap="lg">
      <Text>Heating</Text>
      <Divider label="schedule" />
      <Text>Day 21, night 18</Text>
    </Stack>
  );
}
