// @example Tabular figures keep times and readings at a fixed width, so the column stays put
import { Stack, Text } from 'dial-react';

const rows = [['Kitchen lamp', '18:40'], ['Heater eco', '23:00'], ['Washer done', '11:15']];

export default function TextNumeric() {
  return (
    <Stack gap="xs">
      {rows.map(([what, when]) => (
        <Stack key={what} direction="row" gap="md">
          <Text as="span" size="label" numeric>{when}</Text>
          <Text as="span" size="label" tone="secondary">{what}</Text>
        </Stack>
      ))}
    </Stack>
  );
}
