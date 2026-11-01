// @example A disabled key loses its height; a full-width key spans its unit
import { Button, Stack } from 'dial-react';

export default function ButtonStates() {
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="sm">
        <Button disabled>Schedule</Button>
        <Button kind="primary" disabled>Start wash</Button>
      </Stack>
      <Button kind="primary" full>Start wash</Button>
    </Stack>
  );
}
