// The controls the docs need (playgrounds, filters, the live demo pickers). They are dial's own
// Select and Slider (USER-STANDARDS #13, gate G-N1), so every playground is also a demo of the system.
import { Select, Slider } from 'dial-react';

export function Range({ label, min, max, step, value, onChange, unit = '' }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="pg-control">
      <Slider label={label} min={min} max={max} step={step} value={value} onValueChange={onChange} formatValue={(v) => `${v}${unit}`} />
    </div>
  );
}

export function Choice<T extends string>({ label, value, options, onChange, hideLabel }: { label: string; value: T; options: Array<[T, string]>; onChange: (v: T) => void; hideLabel?: boolean }) {
  return (
    <div className="pg-control">
      <Select
        size="md"
        label={hideLabel ? <span className="visually-hidden">{label}</span> : label}
        options={options.map(([v, l]) => ({ value: v, label: l }))}
        value={value}
        onValueChange={(v) => onChange(v as T)}
      />
    </div>
  );
}
