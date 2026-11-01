// @example A page outline with one level 1, a level 2 per room and a level 3 per unit
import { Heading, Stack, Text } from 'dial-react';

export default function HeadingPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Home</Heading>
      <Stack gap="sm">
        <Heading level={2}>Kitchen</Heading>
        <Heading level={3}>Hob light</Heading>
        <Text size="label" tone="secondary">On · 60%</Text>
      </Stack>
      <Stack gap="sm">
        <Heading level={2}>Bedroom</Heading>
        <Heading level={3}>Heater</Heading>
        <Text size="label" tone="secondary" numeric>19.0° · eco from 22:30</Text>
      </Stack>
    </Stack>
  );
}
