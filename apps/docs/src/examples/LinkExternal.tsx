// @example external prints the dot-matrix mark at the end, opens a new tab and announces it
import { Link, Stack, Text } from 'dial-react';

export default function LinkExternal() {
  return (
    <Stack gap="xs">
      <Text>
        Read the <Link href="#vendor-manual" external>vendor manual</Link> before you reset the hub.
      </Text>
      <Link href="#support" variant="standalone" external>Support site</Link>
    </Stack>
  );
}
