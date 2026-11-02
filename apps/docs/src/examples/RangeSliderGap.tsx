// @example minGap keeps the caps apart, so the band is never narrower than two degrees
import { RangeSlider } from 'dial-react';

export default function RangeSliderGap() {
  return <RangeSlider label="Comfort band" min={14} max={26} step={1} minGap={2} defaultValue={[20, 22]} scale formatValue={(v) => `${v} °C`} />;
}
