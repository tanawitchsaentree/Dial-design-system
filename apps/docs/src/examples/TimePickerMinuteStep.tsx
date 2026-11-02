// @example minuteStep 5: the arrow keys and set keys move the minute five at a time; typed minutes stay exact
import { TimePicker } from 'dial-react';

export default function TimePickerMinuteStep() {
  return <TimePicker label="Heating comes on at" defaultValue="06:15" minuteStep={5} hint="Steps of 5 minutes. Type 07 for an exact minute." />;
}
