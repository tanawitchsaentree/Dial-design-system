// @example A sensor with no readings keeps its block and prints a flat rule
import { Sparkline, Stack } from 'dial-react';

export default function SparklineEmpty() {
  return (
    <Stack gap="md">
      <Sparkline label="Garage temperature, last 7 days" unit="°C" values={[9, 8, 8.5, 7, 6.5, 7.5, 8]} />
      <Sparkline label="Cellar temperature, last 7 days" values={[]} />
    </Stack>
  );
}
