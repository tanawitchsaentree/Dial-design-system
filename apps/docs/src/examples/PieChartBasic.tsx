// @example A donut of five parts, each on its own pattern, with a printed name and share on a leader and a legend of names
import { PieChart } from 'dial-react';

export default function PieChartBasic() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <PieChart
        label="Heating by room"
        slices={[
          { name: 'Living room', value: 380 },
          { name: 'Bedrooms', value: 240 },
          { name: 'Kitchen', value: 180 },
          { name: 'Bathroom', value: 120 },
          { name: 'Hall', value: 80 },
        ]}
        formatValue={(v) => `${v} kWh`}
      />
    </div>
  );
}
