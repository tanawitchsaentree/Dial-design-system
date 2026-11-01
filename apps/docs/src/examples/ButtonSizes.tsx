// @example md for keys in a unit, lg for the main action of a sheet
import { Button, Stack } from 'dial-react';

export default function ButtonSizes() {
  return (
    <Stack direction="row" gap="sm" align="center">
      <Button size="md">Pause</Button>
      <Button size="lg" kind="primary">Start heating</Button>
    </Stack>
  );
}
