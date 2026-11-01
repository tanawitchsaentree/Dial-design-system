// @example Indeterminate: with no value, a still row of ink ticks says Working
import { Progress } from 'dial-react';

export default function ProgressIndeterminate() {
  return <Progress label="Descaling" valueText="Working, about 20 min" style={{ maxInlineSize: 320 }} />;
}
