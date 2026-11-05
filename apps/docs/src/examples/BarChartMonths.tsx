// @example Twelve categories in a narrow column, where values that do not fit a bar are left to the readout and the table
import { BarChart } from 'dial-react';

export default function BarChartMonths() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <BarChart
        label="Energy by month"
        categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        series={[{ name: 'kWh', values: [420, 380, 310, 240, 180, 120, 90, 100, 170, 260, 340, 410] }]}
        formatValue={(v) => `${v}`}
      />
    </div>
  );
}
