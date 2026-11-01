// @example Printing on a unit: the name on top, a note, and the wordmark and model name on the bottom inset line
import { Heading, Stack, Text } from 'dial-react';

export default function TextInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Heading level={3}>Bedroom heater</Heading>
        <Text size="label" tone="secondary" numeric>Target 19.0° · eco from 22:30</Text>
        <Stack direction="row" gap="md" align="end">
          <Text as="span" size="caption" weight="medium">dial</Text>
          <Text as="span" size="micro" tone="secondary">hc 21 heater</Text>
        </Stack>
      </Stack>
    </div>
  );
}
