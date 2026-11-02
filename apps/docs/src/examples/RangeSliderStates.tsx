// @example A disabled range loses both caps' height and cannot be moved
import { RangeSlider } from 'dial-react';

export default function RangeSliderStates() {
  return <RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale disabled formatValue={(v) => `${v} °C`} />;
}
