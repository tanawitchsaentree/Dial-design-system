// @example A heading sits first on the unit's top inset line, above the keys
import { Button, Heading, Stack, Text } from 'dial-react';

export default function HeadingInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Heading level={3}>Washer</Heading>
        <Text size="label" tone="secondary" numeric>Cotton 40° · 38 min left</Text>
        <Stack direction="row" gap="sm">
          <Button kind="primary">Pause</Button>
          <Button>Stop</Button>
        </Stack>
      </Stack>
    </div>
  );
}
