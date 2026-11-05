// @example Rows that run from the start edge, with the room names on the left and each value at the end of its bar
import { BarChart } from 'dial-react';

export default function BarChartHorizontal() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <BarChart
        orientation="horizontal"
        label="Hours the heating ran today"
        categories={['Living room', 'Bedroom', 'Kitchen', 'Hall']}
        series={[{ name: 'Hours', values: [9, 6, 4.5, 2] }]}
        formatValue={(v) => `${v} h`}
      />
    </div>
  );
}
