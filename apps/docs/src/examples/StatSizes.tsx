// @example The three sizes of the figure: small, medium and large
import { Stack, Stat } from 'dial-react';

export default function StatSizes() {
  return (
    <Stack gap="xl">
      <Stat size="sm" label="Humidity" value="48" unit="%" />
      <Stat size="md" label="Humidity" value="48" unit="%" />
      <Stat size="lg" label="Humidity" value="48" unit="%" />
    </Stack>
  );
}
