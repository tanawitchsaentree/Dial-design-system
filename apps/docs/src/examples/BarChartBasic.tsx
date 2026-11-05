// @example Two series over four days in a recessed window, each told by a pattern and a printed number
import { BarChart } from 'dial-react';

export default function BarChartBasic() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <BarChart
        label="Energy by day, kWh"
        categories={['Mon', 'Tue', 'Wed', 'Thu']}
        series={[
          { name: 'Heating', values: [12, 18, 9, 15] },
          { name: 'Hot water', values: [6, 7, 11, 5] },
        ]}
        formatValue={(v) => `${v} kWh`}
      />
    </div>
  );
}
