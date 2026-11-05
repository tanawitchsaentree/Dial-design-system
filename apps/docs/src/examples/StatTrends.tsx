// @example The three directions of a change, each told by a glyph and a word and never by colour
import { Stack, Stat } from 'dial-react';

export default function StatTrends() {
  return (
    <Stack gap="xl">
      <Stat label="Water today" value="182" unit="L" change="12 L" trend="up" compare="since yesterday" />
      <Stat label="Gas today" value="3.1" unit="m³" change="0.4 m³" trend="down" compare="since yesterday" />
      <Stat label="Solar today" value="6.0" unit="kWh" change="0 kWh" trend="flat" compare="since yesterday" />
    </Stack>
  );
}
