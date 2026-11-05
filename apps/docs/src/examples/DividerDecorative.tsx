// @example A decorative seam is hidden from assistive tech when the regions already have headings
import { Divider, Heading, Stack, Text } from 'dial-react';

export default function DividerDecorative() {
  return (
    <Stack gap="lg">
      <Heading level={3}>Heating</Heading>
      <Text>Set to 21 degrees.</Text>
      <Divider decorative />
      <Heading level={3}>Lighting</Heading>
      <Text>Dimmed to 40 percent.</Text>
    </Stack>
  );
}
