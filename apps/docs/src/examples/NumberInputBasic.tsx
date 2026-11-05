// @example A number in a recessed window with a minus key and a plus key either side, and a unit after the figure
import { NumberInput, Stack } from 'dial-react';

export default function NumberInputBasic() {
  return (
    <Stack gap="lg">
      <NumberInput label="Target temperature" unit="°C" min={5} max={30} step={0.5} defaultValue={21.5} />
      <NumberInput label="Delay start by" unit="min" min={0} max={120} step={5} defaultValue={30} />
    </Stack>
  );
}
