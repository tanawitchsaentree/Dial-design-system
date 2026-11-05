// @example A Label above a bare control, with the id and aria-describedby wired by the field
import { FormField } from 'dial-react';

const well = { boxSizing: 'border-box', inlineSize: '100%', minBlockSize: 'var(--ds-control-md)', paddingInline: 'var(--ds-gap-xl)', font: 'inherit', color: 'var(--ds-text-primary)', background: 'var(--ds-surface-sunken)', border: 'var(--ds-width-hairline) solid var(--ds-line-ring)', borderRadius: 'var(--ds-corner-media)' } as const;

export default function FormFieldBasic() {
  return (
    <FormField label="Room name" hint="Shown on the home screen.">
      <input style={well} defaultValue="Living room" />
    </FormField>
  );
}
