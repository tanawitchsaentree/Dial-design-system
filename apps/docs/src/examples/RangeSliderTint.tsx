// @example tint lights the band between the caps in the value's own range
import { RangeSlider, Stack } from 'dial-react';

export default function RangeSliderTint() {
  return (
    <Stack gap="lg">
      <RangeSlider label="Heating band" tint="warm" min={14} max={26} step={1} defaultValue={[18, 22]} formatValue={(v) => `${v} °C`} />
      <RangeSlider label="Cooling band" tint="cool" min={16} max={30} step={1} defaultValue={[22, 26]} formatValue={(v) => `${v} °C`} />
    </Stack>
  );
}
