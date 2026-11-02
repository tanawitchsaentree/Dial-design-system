// @example A speaker's sources printed in a row with no knob. The words are one radio group. Tab reaches the lit word and the arrow keys walk it
import { Legend } from 'dial-react';

export default function LegendRow() {
  return <Legend layout="row" control="none" label="Source" options={['radio', 'library', 'line in']} defaultValue="library" />;
}
