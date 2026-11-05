// @example A note field, the label printed above a recessed well that is several lines tall
import { Textarea } from 'dial-react';

export default function TextareaBasic() {
  return <Textarea label="Note for the night schedule" defaultValue="Keep the bedroom at 17 °C after 23:00." />;
}
