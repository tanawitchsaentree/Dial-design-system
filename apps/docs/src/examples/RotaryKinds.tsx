// @example The two kinds, the orange primary knob and a body-coloured key knob for a secondary dial
import { Rotary, Stack } from 'dial-react';

export default function RotaryKinds() {
  return (
    <Stack direction="row" gap="xl" align="end">
      <Rotary label="Temperature" min={16} max={26} defaultValue={20} formatValue={(v) => `${v} °C`} />
      <Rotary kind="key" size="sm" label="Fan" min={0} max={5} defaultValue={2} />
    </Stack>
  );
}
