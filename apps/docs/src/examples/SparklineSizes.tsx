// @example The three sizes of the line: small, medium and large
import { Sparkline, Stack } from 'dial-react';

const week = [6.5, 6, 4.1, 3.2, 2, 0.6, 0.2];

export default function SparklineSizes() {
  return (
    <Stack gap="md">
      <Sparkline size="sm" label="Solar, small" unit="kWh" values={week} />
      <Sparkline size="md" label="Solar, medium" unit="kWh" values={week} />
      <Sparkline size="lg" label="Solar, large" unit="kWh" values={week} />
    </Stack>
  );
}
