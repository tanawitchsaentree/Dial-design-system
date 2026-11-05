// @example An error sets aria-invalid on the control and prints a glyph and words under it
import { useState } from 'react';
import { FormField } from 'dial-react';

const well = { boxSizing: 'border-box', inlineSize: '100%', minBlockSize: 'var(--ds-control-md)', paddingInline: 'var(--ds-gap-xl)', font: 'inherit', color: 'var(--ds-text-primary)', background: 'var(--ds-surface-sunken)', border: 'var(--ds-width-hairline) solid var(--ds-line-ring)', borderRadius: 'var(--ds-corner-media)' } as const;

export default function FormFieldError() {
  const [value, setValue] = useState('99');
  const bad = Number(value) > 30;
  return (
    <FormField label="Target temperature" required hint="Between 5 and 30 °C." error={bad ? 'Too warm. Choose 30 °C or less.' : undefined}>
      <input style={well} inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} />
    </FormField>
  );
}
