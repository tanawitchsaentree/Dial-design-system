// @example Fahrenheit, and a reading whose range and region words are set by hand
import { Environment } from 'dial-react';

export default function EnvironmentCustom() {
  return (
    <Environment
      room="Greenhouse"
      temperature={78.8}
      unit="°F"
      readAt="14:20"
      readings={[
        { kind: 'humidity', value: 72, low: 50, high: 85, optimum: 70, regionLabels: { low: 'Dry', mid: 'Good', high: 'Wet' } },
        { kind: 'air', label: 'Light', value: 18, max: 40, low: 8, high: 30, optimum: 20, regionLabels: { low: 'Dim', mid: 'Good', high: 'Bright' }, formatValue: (v) => `${v} klx` },
      ]}
    />
  );
}
