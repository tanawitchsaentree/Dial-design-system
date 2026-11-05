// @example Three rows drawn on one scale with the same min and max, so heights can be compared
import { Sparkline, Stack } from 'dial-react';

export default function SparklineScale() {
  return (
    <Stack gap="md">
      <Sparkline min={0} max={100} label="Kitchen battery, last 7 days" unit="%" values={[90, 84, 80, 71, 66, 60, 52]} />
      <Sparkline min={0} max={100} label="Hall battery, last 7 days" unit="%" values={[40, 38, 37, 36, 34, 33, 31]} />
      <Sparkline min={0} max={100} label="Garage battery, last 7 days" unit="%" values={[20, 20, 19, 19, 18, 18, 17]} />
    </Stack>
  );
}
