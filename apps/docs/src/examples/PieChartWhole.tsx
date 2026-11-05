// @example A whole disc of three parts, with no hole and so no total in the middle
import { PieChart } from 'dial-react';

export default function PieChartWhole() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <PieChart
        variant="pie"
        label="Where the water goes"
        slices={[
          { name: 'Washing', value: 52 },
          { name: 'Showers', value: 33 },
          { name: 'Taps', value: 15 },
        ]}
        formatValue={(v) => `${v} l`}
      />
    </div>
  );
}
