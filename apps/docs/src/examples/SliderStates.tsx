// @example A disabled fader loses the cap's height and cannot be moved
import { Slider } from 'dial-react';

export default function SliderStates() {
  return <Slider label="Fan speed" min={0} max={5} step={1} defaultValue={2} scale disabled />;
}
