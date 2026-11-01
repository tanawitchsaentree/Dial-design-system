// @example The two kinds, a plastic key and the one orange key
import { Button, Stack } from 'dial-react';

export default function ButtonKinds() {
  return (
    <Stack direction="row" gap="sm">
      <Button>Turn off</Button>
      <Button kind="primary">Turn on</Button>
    </Stack>
  );
}
