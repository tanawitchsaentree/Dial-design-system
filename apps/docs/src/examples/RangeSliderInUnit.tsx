// @example In a unit, the orange knob sets the target and the range sets the band around it
import { RangeSlider, Rotary, Stack } from 'dial-react';

export default function RangeSliderInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md" align="center">
        <Rotary label="Target" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} />
        <RangeSlider label="Allowed band" min={14} max={26} step={1} defaultValue={[19, 23]} formatValue={(v) => `${v} °C`} />
      </Stack>
    </div>
  );
}
