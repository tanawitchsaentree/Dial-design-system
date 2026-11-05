// @example A seam between two regions of one unit, cut with a shade edge over a lit edge
import { Divider, Stack, Text } from 'dial-react';

export default function DividerBasic() {
  return (
    <Stack gap="lg">
      <Text>Heating</Text>
      <Divider />
      <Text>Lighting</Text>
    </Stack>
  );
}
