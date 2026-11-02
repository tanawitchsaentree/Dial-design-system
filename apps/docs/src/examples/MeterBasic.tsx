// @example A battery level, read on a printed scale with one ink needle
import { Meter } from 'dial-react';

export default function MeterBasic() {
  return <Meter label="Battery" value={64} formatValue={(v) => `${v} %`} />;
}
