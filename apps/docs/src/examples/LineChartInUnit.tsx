// @example A chart beside the figure it explains, with the orange key apart from both
import { Button, LineChart, Stack, Stat } from 'dial-react';

export default function LineChartInUnit() {
  return (
    <Stack gap="xl">
      <Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" />
      <LineChart
        label="Energy by hour"
        unit="kWh"
        size="sm"
        categories={['06', '09', '12', '15', '18', '21']}
        series={[{ label: 'Energy', values: [0.4, 1.6, 2.2, 1.9, 3.8, 2.5] }]}
      />
      <Button kind="primary">Open the report</Button>
    </Stack>
  );
}
