// @example A hint under the orange key: the cap names the shortcut and stays plastic and ink
import { Button, Kbd, Stack } from 'dial-react';

export default function KbdWithKey() {
  return (
    <Stack gap="md">
      <Button kind="primary">Save schedule</Button>
      <p>
        Or press <Kbd>Enter</Kbd>.
      </p>
    </Stack>
  );
}
