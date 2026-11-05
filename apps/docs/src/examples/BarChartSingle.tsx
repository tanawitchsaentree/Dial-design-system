// @example One series over a week, so there is no legend and the bars share one pattern
import { BarChart } from 'dial-react';

export default function BarChartSingle() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <BarChart
        label="Washer cycles this week"
        categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        series={[{ name: 'Cycles', values: [1, 0, 2, 1, 0, 3, 2] }]}
        formatTick={(v) => String(v)}
      />
    </div>
  );
}
