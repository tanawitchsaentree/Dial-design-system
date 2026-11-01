// @example Four levels, display, headline, title and emphasis, each one size step apart
import { Heading, Stack } from 'dial-react';

export default function HeadingLevels() {
  return (
    <Stack gap="sm">
      <Heading level={1}>Home</Heading>
      <Heading level={2}>Living room</Heading>
      <Heading level={3}>Ceiling lamp</Heading>
      <Heading level={4}>Schedule</Heading>
    </Stack>
  );
}
