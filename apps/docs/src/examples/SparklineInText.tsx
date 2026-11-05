// @example A small line inside a sentence, next to a Stat, with the orange key apart from both
import { Button, Sparkline, Stack, Stat, Text } from 'dial-react';

export default function SparklineInText() {
  return (
    <Stack gap="xl">
      <Text size="body">
        Heating ran <Sparkline size="sm" label="Heating power, last 7 days" unit="kW" values={[0.4, 0.5, 2.2, 2, 0.9, 1.2, 1.8]} /> most of Wednesday.
      </Text>
      <Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" />
      <Button kind="primary">Open the report</Button>
    </Stack>
  );
}
