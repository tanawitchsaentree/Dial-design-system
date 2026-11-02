// @example While the washer runs its programme cannot change. The knob loses its height and the words fade, every one still printed
import { Legend } from 'dial-react';

export default function LegendDisabled() {
  return <Legend disabled label="Programme" options={['cotton', 'synthetics', 'wool', 'rinse']} defaultValue="wool" />;
}
