// @example The time a night schedule starts, with hour and minute as figures in a well and a pair of set keys under each
import { TimePicker } from 'dial-react';

export default function TimePickerBasic() {
  return <TimePicker label="Night mode starts" defaultValue="22:30" />;
}
