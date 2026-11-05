// @example Every state: empty, at the limit, invalid with a message, read-only and disabled
import { NumberInput, Stack } from 'dial-react';

export default function NumberInputStates() {
  return (
    <Stack gap="lg">
      <NumberInput label="Empty" unit="min" min={0} max={90} placeholder="0 to 90" />
      <NumberInput label="At the limit" unit="min" min={0} max={90} defaultValue={90} hint="The plus key is flat at 90." />
      <NumberInput label="Invalid" unit="min" min={0} max={90} defaultValue={45} error="A cycle under 60 minutes cannot run the heat dry." />
      <NumberInput label="Read-only" unit="min" defaultValue={45} readOnly />
      <NumberInput label="Disabled" unit="min" defaultValue={45} disabled />
    </Stack>
  );
}
