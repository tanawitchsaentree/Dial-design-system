// @example A bare control wrapped by giving FormItem a label, so the FormField wires the id, hint and error
import { Form, FormItem, FormSubmit, Stack } from 'dial-react';

const well = { boxSizing: 'border-box', inlineSize: '100%', minBlockSize: 'var(--ds-control-md)', paddingInline: 'var(--ds-gap-xl)', font: 'inherit', color: 'var(--ds-text-primary)', background: 'var(--ds-surface-sunken)', border: 'var(--ds-width-hairline) solid var(--ds-line-ring)', borderRadius: 'var(--ds-corner-media)' } as const;

export default function FormLabelled() {
  return (
    <Form onSubmit={() => undefined} summaryLevel={3}>
      <Stack gap="lg">
        <FormItem name="from" label="Warm from" required hint="Local time, for example 06:30.">
          <input type="time" style={well} />
        </FormItem>
        <FormItem name="days" label="Days" required>
          <input type="number" min={1} max={7} style={well} defaultValue="9" />
        </FormItem>
        <div>
          <FormSubmit>Save schedule</FormSubmit>
        </div>
      </Stack>
    </Form>
  );
}
