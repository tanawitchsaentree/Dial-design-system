// @example Required, optional and glyph marks on a short form, set once per field
import { FormField, Stack } from 'dial-react';

const well = { boxSizing: 'border-box', inlineSize: '100%', minBlockSize: 'var(--ds-control-md)', paddingInline: 'var(--ds-gap-xl)', font: 'inherit', color: 'var(--ds-text-primary)', background: 'var(--ds-surface-sunken)', border: 'var(--ds-width-hairline) solid var(--ds-line-ring)', borderRadius: 'var(--ds-corner-media)' } as const;

export default function FormFieldMarks() {
  return (
    <Stack gap="lg">
      <FormField label="Owner" required>
        <input style={well} defaultValue="Mira" />
      </FormField>
      <FormField label="Nickname" optional>
        <input style={well} />
      </FormField>
      <FormField label="Room code" required mark="glyph" hint="Four digits on the back of the unit.">
        <input style={well} inputMode="numeric" />
      </FormField>
    </Stack>
  );
}
