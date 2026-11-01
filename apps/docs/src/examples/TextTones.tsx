// @example Two inks: primary for what you read first, secondary for notes and units
import { Stack, Text } from 'dial-react';

export default function TextTones() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="xs">
        <Text size="label" weight="medium">Washer</Text>
        <Text size="caption" tone="secondary">Cotton 40° · spin 1200</Text>
      </Stack>
    </div>
  );
}
