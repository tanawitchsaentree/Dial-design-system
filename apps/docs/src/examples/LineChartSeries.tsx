// @example Three lines told apart by solid, dashed and dotted strokes and by circle, square and diamond marks
import { LineChart } from 'dial-react';

export default function LineChartSeries() {
  return (
    <LineChart
      label="Temperature this week"
      unit="°C"
      categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
      series={[
        { label: 'Indoor', values: [20.5, 21, 21.5, 20.8, 21.2, 22, 21.6] },
        { label: 'Outdoor', values: [8, 6, 9, 12, 10, 7, 5] },
        { label: 'Target', values: [21, 21, 21, 21, 21, 21, 21] },
      ]}
    />
  );
}
