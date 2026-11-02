// @example optimum names the preferred region, and the glyph says how far the reading is from it
import { Meter, Stack } from 'dial-react';

const AIR = { low: 'Clean', mid: 'Fair', high: 'Poor' };

export default function MeterOptimum() {
  return (
    <Stack gap="lg">
      <Meter label="Air quality" value={22} max={150} low={50} high={100} optimum={0} regionLabels={AIR} formatValue={(v) => `${v} AQI`} />
      <Meter label="Air quality" value={74} max={150} low={50} high={100} optimum={0} regionLabels={AIR} formatValue={(v) => `${v} AQI`} />
      <Meter label="Air quality" value={128} max={150} low={50} high={100} optimum={0} regionLabels={AIR} formatValue={(v) => `${v} AQI`} />
    </Stack>
  );
}
