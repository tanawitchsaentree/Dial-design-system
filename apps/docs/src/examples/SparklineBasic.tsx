// @example A week of power use as a small ink line with a solid dot on the last reading
import { Sparkline } from 'dial-react';

export default function SparklineBasic() {
  return <Sparkline label="Power, last 7 days" unit="kW" values={[0.4, 0.5, 2.2, 2, 0.9, 1.2, 1.8]} />;
}
