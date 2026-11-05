// @example A sensor with no reading prints a dash in the same window, so the layout does not move
import { Stack, Stat } from 'dial-react';

export default function StatEmpty() {
  return (
    <Stack gap="xl">
      <Stat label="Hallway temperature" value="19.5" unit="°C" />
      <Stat label="Garage temperature" value={null} unit="°C" />
    </Stack>
  );
}
