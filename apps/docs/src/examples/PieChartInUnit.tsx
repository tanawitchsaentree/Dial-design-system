// @example A donut on a unit body with the one orange key apart from it
import { Button, PieChart, Stack } from 'dial-react';

export default function PieChartInUnit() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Stack gap="xl">
        <PieChart
          label="Time on each mode"
          slices={[
            { name: 'Comfort', value: 14 },
            { name: 'Eco', value: 7 },
            { name: 'Night', value: 3 },
          ]}
          formatValue={(v) => `${v} h`}
        />
        <Button kind="primary">Set a schedule</Button>
      </Stack>
    </div>
  );
}
