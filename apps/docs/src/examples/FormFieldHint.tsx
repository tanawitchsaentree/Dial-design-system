// @example required prints the word Required beside the name and sets aria-required on the control
import { FormField } from 'dial-react';

const well = { boxSizing: 'border-box', inlineSize: '100%', minBlockSize: 'var(--ds-control-md)', paddingInline: 'var(--ds-gap-xl)', font: 'inherit', color: 'var(--ds-text-primary)', background: 'var(--ds-surface-sunken)', border: 'var(--ds-width-hairline) solid var(--ds-line-ring)', borderRadius: 'var(--ds-corner-media)' } as const;

export default function FormFieldHint() {
  return (
    <FormField label="Room name" required>
      <input style={well} defaultValue="Living room" />
    </FormField>
  );
}
