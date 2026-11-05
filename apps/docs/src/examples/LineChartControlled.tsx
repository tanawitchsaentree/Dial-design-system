// @example The cursor held by your own state, so another part of the unit can print the point it is on
import { useState } from 'react';
import { LineChart, Stack, Text } from 'dial-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const kwh = [8.2, 7.9, 9.4, 12.4, 10.1, 6.3, 5.8];

export default function LineChartControlled() {
  const [index, setIndex] = useState<number | null>(3);
  return (
    <Stack gap="md">
      <LineChart
        label="Energy this week"
        unit="kWh"
        categories={days}
        series={[{ label: 'Energy', values: kwh }]}
        index={index}
        onIndexChange={setIndex}
      />
      <Text>{index === null ? 'No day chosen.' : `${days[index]} used ${kwh[index]} kWh.`}</Text>
    </Stack>
  );
}
