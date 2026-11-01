// @example The unit's one orange knob, turned by drag or arrow keys, with its value and label printed below
import { Rotary } from 'dial-react';

export default function RotaryBasic() {
  return <Rotary label="Temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} />;
}
