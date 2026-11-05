// @example The three window heights: small, medium and large
import { LineChart, Stack } from 'dial-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const power = [{ label: 'Power', values: [0.4, 1.2, 0.9, 2.1, 1.5] }];

export default function LineChartSizes() {
  return (
    <Stack gap="xl">
      <LineChart size="sm" label="Power, small" unit="kW" categories={days} series={power} />
      <LineChart size="md" label="Power, medium" unit="kW" categories={days} series={power} />
      <LineChart size="lg" label="Power, large" unit="kW" categories={days} series={power} />
    </Stack>
  );
}
