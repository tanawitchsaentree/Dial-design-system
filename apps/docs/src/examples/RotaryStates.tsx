// @example A timer in steps of five minutes, and a disabled knob that has lost its height
import { Rotary, Stack } from 'dial-react';

export default function RotaryStates() {
  return (
    <Stack direction="row" gap="xl" align="end">
      <Rotary label="Timer" min={0} max={60} step={5} defaultValue={20} formatValue={(v) => `${v} min`} />
      <Rotary kind="key" label="Spin" min={400} max={1400} step={200} defaultValue={800} disabled />
    </Stack>
  );
}
