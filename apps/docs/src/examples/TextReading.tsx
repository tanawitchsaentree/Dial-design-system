// @example Reading prose on a sheet, capped at the measure, with a note in the lighter ink
import { Stack, Text } from 'dial-react';

export default function TextReading() {
  return (
    <Stack gap="sm">
      <Text size="reading">The heater holds the room at the target and drops two degrees at night. You can change the night setback, or turn it off, from the schedule.</Text>
      <Text size="caption" tone="secondary">The setback starts at the time set for eco.</Text>
    </Stack>
  );
}
