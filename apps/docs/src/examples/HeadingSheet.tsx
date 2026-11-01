// @example A level 4 heading names a group of settings inside a sheet
import { Heading, Stack, Text } from 'dial-react';

export default function HeadingSheet() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Heading level={3}>Heater settings</Heading>
        <Stack gap="xs">
          <Heading level={4}>Night setback</Heading>
          <Text size="body">Drops the target by two degrees from the eco time until morning.</Text>
        </Stack>
        <Stack gap="xs">
          <Heading level={4}>Frost guard</Heading>
          <Text size="body">Keeps the room above 7° while you are away.</Text>
        </Stack>
      </Stack>
    </div>
  );
}
