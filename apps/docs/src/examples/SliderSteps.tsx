// @example step sets the detents; formatValue prints the unit
import { Slider, Stack } from 'dial-react';

export default function SliderSteps() {
  return (
    <Stack gap="lg">
      <Slider label="Brightness" min={0} max={100} step={10} defaultValue={60} scale formatValue={(v) => `${v} %`} />
      <Slider label="Colour temperature" min={2700} max={6500} defaultValue={4000} formatValue={(v) => `${Math.round(v)} K`} />
    </Stack>
  );
}
