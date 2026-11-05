// @example Two parts with the figure and caption in the hole set by hand
import { PieChart } from 'dial-react';

export default function PieChartTwoParts() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <PieChart
        label="Battery"
        centerValue="72%"
        centerLabel="Charged"
        slices={[
          { name: 'Charged', value: 72 },
          { name: 'Free', value: 28 },
        ]}
        formatValue={(v) => `${v} %`}
      />
    </div>
  );
}
