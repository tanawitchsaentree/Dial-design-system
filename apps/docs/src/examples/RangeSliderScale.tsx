// @example The ruler always shows its ticks, and scale prints the numerals under the groove
import { RangeSlider, Stack } from 'dial-react';

export default function RangeSliderScale() {
  return (
    <Stack gap="lg">
      <RangeSlider label="Quiet hours" min={0} max={24} step={2} defaultValue={[8, 16]} formatValue={(v) => `${v}:00`} />
      <RangeSlider label="Quiet hours" min={0} max={24} step={2} defaultValue={[8, 16]} scale formatValue={(v) => `${v}:00`} />
    </Stack>
  );
}
