// @example Browser constraints worded by the form: required, pattern, minimum length and range, each with its own message
import { Form, FormItem, FormSubmit, Input, Stack, Textarea } from 'dial-react';

export default function FormConstraints() {
  return (
    <Form onSubmit={() => undefined}>
      <Stack gap="lg">
        <FormItem name="email">
          <Input label="Email" type="email" required defaultValue="not-an-email" />
        </FormItem>
        <FormItem name="code">
          <Input label="Hub code" required pattern="[A-Z]{3}-[0-9]{3}" hint="Three capitals, a dash, three digits." defaultValue="ab-12" />
        </FormItem>
        <FormItem name="note">
          <Textarea label="Note" minLength={20} rows={3} defaultValue="Too short" />
        </FormItem>
        <FormItem name="target">
          <Input label="Target" type="number" min={10} max={30} unit="°C" defaultValue="45" />
        </FormItem>
        <div>
          <FormSubmit>Save</FormSubmit>
        </div>
      </Stack>
    </Form>
  );
}
