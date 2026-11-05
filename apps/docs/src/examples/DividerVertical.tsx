// @example A vertical seam between two side-by-side regions, stretched to the row height
import { Divider, Stack, Text } from 'dial-react';

export default function DividerVertical() {
  return (
    <Stack direction="row" gap="xl" align="stretch">
      <Text>Day</Text>
      <Divider orientation="vertical" />
      <Text>Night</Text>
    </Stack>
  );
}
