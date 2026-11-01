// @example sm for a reading in a list row, md for a unit, lg for the reading a sheet is about
import { Display, Stack } from 'dial-react';

export default function DisplaySizes() {
  return (
    <Stack gap="md">
      <Display size="sm" label="Kettle" value="85" unit="°C" digits={3} />
      <Display size="md" label="Kettle" value="85" unit="°C" digits={3} />
      <Display size="lg" label="Kettle" value="85" unit="°C" digits={3} />
    </Stack>
  );
}
