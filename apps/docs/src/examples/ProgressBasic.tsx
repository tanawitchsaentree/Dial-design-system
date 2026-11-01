// @example A washer cycle, where ink fills the groove from the start of the line
import { Progress } from 'dial-react';

export default function ProgressBasic() {
  return <Progress label="Washer" value={55} valueText="38 min left" style={{ maxInlineSize: 320 }} />;
}
