// @example A volume fader with 11 detents and the ruler's numerals printed under the groove
import { Slider } from 'dial-react';

export default function SliderBasic() {
  return <Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />;
}
