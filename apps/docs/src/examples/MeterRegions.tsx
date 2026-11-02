// @example low and high split the scale into named regions, told by a glyph and a word
import { Meter, Stack } from 'dial-react';

export default function MeterRegions() {
  return (
    <Stack gap="lg">
      <Meter label="Battery" value={14} low={20} high={80} formatValue={(v) => `${v} %`} />
      <Meter label="Battery" value={56} low={20} high={80} formatValue={(v) => `${v} %`} />
      <Meter label="Battery" value={92} low={20} high={80} formatValue={(v) => `${v} %`} />
    </Stack>
  );
}
