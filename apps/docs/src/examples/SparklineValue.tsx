// @example The last value printed after the line, in tabular numerals, for rows that need the number too
import { Sparkline, Stack } from 'dial-react';

export default function SparklineValue() {
  return (
    <Stack gap="md">
      <Sparkline showValue label="Indoor, last 7 days" unit="°C" values={[20.5, 21, 21.5, 20.8, 21.2, 22, 21.6]} />
      <Sparkline showValue label="Humidity, last 7 days" unit="%" values={[52, 50, 49, 47, 48, 46, 48]} />
      <Sparkline showValue label="CO₂, last 7 days" unit="ppm" values={[420, 480, 640, 710, 590, 520, 640]} />
    </Stack>
  );
}
