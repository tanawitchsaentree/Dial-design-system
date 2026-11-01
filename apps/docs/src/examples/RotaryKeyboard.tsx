// @example Arrow keys turn the knob one detent; Home and End reach the ends
import { Rotary } from 'dial-react';

export default function RotaryKeyboard() {
  return <Rotary label="Fan speed" min={0} max={5} defaultValue={2} formatValue={(v) => (v === 0 ? 'Off' : `Speed ${v}`)} />;
}
