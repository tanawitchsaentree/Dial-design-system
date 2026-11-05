// @example A chart on a unit body with the one orange key apart from it
import { BarChart, Button, Stack } from 'dial-react';

export default function BarChartInUnit() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Stack gap="xl">
        <BarChart
          label="Water used"
          categories={['Mon', 'Tue', 'Wed']}
          series={[
            { name: 'Hot', values: [40, 55, 35] },
            { name: 'Cold', values: [80, 60, 90] },
          ]}
          formatValue={(v) => `${v} l`}
        />
        <Button kind="primary">Save the report</Button>
      </Stack>
    </div>
  );
}
