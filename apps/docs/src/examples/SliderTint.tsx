// @example tint picks the glass range of the value; the cap and the light behind it share one hue
import { Slider, Stack } from 'dial-react';

export default function SliderTint() {
  return (
    <Stack gap="lg">
      <Slider label="Heating" tint="warm" min={14} max={26} step={1} defaultValue={21} formatValue={(v) => `${v} °C`} />
      <Slider label="Cooling" tint="cool" min={16} max={28} step={1} defaultValue={20} formatValue={(v) => `${v} °C`} />
      <Slider label="Volume" min={0} max={10} step={1} defaultValue={7} />
    </Stack>
  );
}
