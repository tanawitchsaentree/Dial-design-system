// @example The two sizes: small holes for a row of a list, medium holes for a Spinner that stands alone
import { Spinner, Stack } from 'dial-react';

export default function SpinnerSizes() {
  return (
    <Stack gap="lg">
      <Spinner size="sm" label="Small" showLabel />
      <Spinner size="md" label="Medium" showLabel />
    </Stack>
  );
}
