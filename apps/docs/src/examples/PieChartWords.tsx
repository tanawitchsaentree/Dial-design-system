// @example The built-in words and the share format replaced, here in German with shares in one decimal
import { PieChart } from 'dial-react';

export default function PieChartWords() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <PieChart
        label="Heizung nach Raum"
        words={{
          roleDescription: 'Kreisdiagramm',
          hint: 'Mit den Pfeiltasten zwischen den Teilen wechseln.',
          part: 'Raum',
          value: 'Wert',
          share: 'Anteil',
          total: 'Gesamt',
          readout: (name, value, share) => `${name}: ${value}, ${share}`,
        }}
        slices={[
          { name: 'Wohnzimmer', value: 380 },
          { name: 'Schlafzimmer', value: 240 },
          { name: 'Küche', value: 180 },
        ]}
        formatValue={(v) => `${v} kWh`}
        formatShare={(s) => `${(s * 100).toFixed(1)} %`}
      />
    </div>
  );
}
