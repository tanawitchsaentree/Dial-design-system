// @example The label printed beside the holes, so a wait is told in words as well as by the trail
import { Spinner, Stack } from 'dial-react';

export default function SpinnerLabelled() {
  return (
    <Stack gap="md">
      <Spinner label="Asking the hub" showLabel />
      <Spinner label="Saving the schedule" showLabel />
    </Stack>
  );
}
