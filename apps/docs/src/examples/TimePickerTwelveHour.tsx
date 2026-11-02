// @example hourCycle 12 runs the hour from 1 to 12 and prints AM and PM, the current one marked with its lamp
import { Stack, TimePicker } from 'dial-react';

export default function TimePickerTwelveHour() {
  return (
    <Stack gap="lg" align="start">
      <TimePicker label="Night mode starts" hourCycle="12" defaultValue="22:30" />
      <TimePicker label="Night mode ends" hourCycle="12" kind="text" defaultValue="06:15" />
    </Stack>
  );
}
