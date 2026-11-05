// @example variant="standalone" puts the link on its own line, 44px tall, with the rule under the words only
import { Link, Stack } from 'dial-react';

export default function LinkStandalone() {
  return (
    <Stack gap="xs">
      <Link href="#lamps" variant="standalone">All lamps</Link>
      <Link href="#schedules" variant="standalone">All schedules</Link>
    </Stack>
  );
}
