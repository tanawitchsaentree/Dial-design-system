// @example The ruler always shows its ticks; scale prints the numerals under the groove
import { Slider, Stack } from 'dial-react';

export default function SliderScale() {
  return (
    <Stack gap="lg">
      <Slider label="Bass" min={-5} max={5} step={1} defaultValue={0} />
      <Slider label="Treble" min={-5} max={5} step={1} defaultValue={2} scale />
    </Stack>
  );
}
