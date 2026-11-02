// @example A washer's programmes printed in a column beside its knob. Turn the knob and the lit word walks; press a word and the knob turns to it
import { Legend } from 'dial-react';

export default function LegendBasic() {
  return <Legend label="Programme" options={['cotton', 'synthetics', 'wool', 'quick 30', 'rinse', 'spin']} defaultValue="cotton" />;
}
