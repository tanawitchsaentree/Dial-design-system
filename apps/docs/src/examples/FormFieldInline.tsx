// @example The inline layout prints the Label in a column at the start with the control beside it
import { FormField, Stack } from 'dial-react';

const well = { boxSizing: 'border-box', inlineSize: '100%', minBlockSize: 'var(--ds-control-md)', paddingInline: 'var(--ds-gap-xl)', font: 'inherit', color: 'var(--ds-text-primary)', background: 'var(--ds-surface-sunken)', border: 'var(--ds-width-hairline) solid var(--ds-line-ring)', borderRadius: 'var(--ds-corner-media)' } as const;

export default function FormFieldInline() {
  return (
    <Stack gap="lg">
      <FormField layout="inline" label="Wake up" optional>
        <input style={well} type="time" defaultValue="06:30" />
      </FormField>
      <FormField layout="inline" label="Heating" hint="Applies to all rooms.">
        <input style={well} type="text" defaultValue="Auto" />
      </FormField>
    </Stack>
  );
}
