// @example valueText prints the reading in the words people use, such as water hardness in degrees
import { Meter } from 'dial-react';

const WATER = { low: 'Soft', mid: 'Medium', high: 'Hard' };

export default function MeterValueText() {
  return <Meter label="Water hardness" value={16} max={30} low={8.4} high={14} optimum={6} regionLabels={WATER} valueText="16 °dH" />;
}
