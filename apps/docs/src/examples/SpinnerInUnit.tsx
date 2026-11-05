// @example Where a Display will stand, the Spinner holds the place while the heating answers
import { Spinner, Stack, Text } from 'dial-react';

export default function SpinnerInUnit() {
  return (
    <div className="demo-box demo-card" role="group" aria-label="Heating">
      <Stack gap="md">
        <Text>Living room heating</Text>
        <Spinner size="md" label="Asking the heating" showLabel />
      </Stack>
    </div>
  );
}
