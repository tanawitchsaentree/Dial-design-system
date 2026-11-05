// @example One line of indoor temperature over a week, with round ticks on the value axis
import { LineChart } from 'dial-react';

export default function LineChartBasic() {
  return (
    <LineChart
      label="Indoor temperature this week"
      unit="°C"
      categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
      series={[{ label: 'Indoor', values: [20.5, 21, 21.5, 20.8, 21.2, 22, 21.6] }]}
    />
  );
}
