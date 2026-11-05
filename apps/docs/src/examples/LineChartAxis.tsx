// @example The value axis fitted to the data, started at zero, and fixed to a range you choose
import { LineChart, Stack } from 'dial-react';

const hours = ['08', '10', '12', '14', '16', '18'];
const humidity = [{ label: 'Humidity', values: [46, 48, 51, 49, 52, 50] }];

export default function LineChartAxis() {
  return (
    <Stack gap="xl">
      <LineChart size="sm" label="Fitted to the data" unit="%" categories={hours} series={humidity} />
      <LineChart size="sm" zero label="Starts at zero" unit="%" categories={hours} series={humidity} />
      <LineChart size="sm" min={0} max={100} ticks={3} label="Fixed from 0 to 100" unit="%" categories={hours} series={humidity} />
    </Stack>
  );
}
