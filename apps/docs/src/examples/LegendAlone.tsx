// @example A lamp's scenes printed in a column with no knob, for a unit whose one knob already sets the brightness
import { Legend } from 'dial-react';

export default function LegendAlone() {
  return <Legend control="none" label="Scene" options={['reading', 'evening', 'night light', 'all on']} defaultValue="evening" />;
}
