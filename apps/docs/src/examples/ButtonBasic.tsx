// @example One orange key for the unit's main action, body-coloured keys for the rest
import { Button, Stack } from 'dial-react';

export default function ButtonBasic() {
  return (
    <Stack direction="row" gap="sm">
      <Button kind="primary">Start wash</Button>
      <Button>Schedule</Button>
      <Button>Cancel</Button>
    </Stack>
  );
}
