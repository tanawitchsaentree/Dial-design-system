// @example knob="key" pairs a legend with a plastic knob for a second dial, and knobSize sets the knob to 44, 72 or 108px
import { Legend, Stack } from 'dial-react';

export default function LegendKnobs() {
  return (
    <Stack direction="row" gap="xl" align="center">
      <Legend knob="key" knobSize="sm" label="Spin" options={['400', '800', '1200', '1400']} defaultValue="800" />
      <Legend layout="arc" knobSize="lg" label="Oven" options={['off', 'top', 'fan', 'grill', 'bottom']} defaultValue="fan" />
    </Stack>
  );
}
