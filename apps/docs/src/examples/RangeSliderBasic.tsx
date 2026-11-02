// @example A heating band from 18 to 22 °C, two caps in one ruler groove
import { RangeSlider } from 'dial-react';

export default function RangeSliderBasic() {
  return <RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale formatValue={(v) => `${v} °C`} />;
}
