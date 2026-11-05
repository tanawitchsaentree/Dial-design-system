// @example validate checks what a constraint cannot say, here two fields that must match, and onSubmit can hand back a server problem
import { Form, FormItem, FormSubmit, Input, Stack } from 'dial-react';

export default function FormValidate() {
  return (
    <Form
      validate={(v) => (v.pin !== v.again ? { again: 'The two codes do not match.' } : undefined)}
      onSubmit={async (v) => (v.pin === '0000' ? { pin: 'That code is too easy to guess.' } : undefined)}
    >
      <Stack gap="lg">
        <FormItem name="pin">
          <Input label="Door code" type="password" required minLength={4} defaultValue="0000" />
        </FormItem>
        <FormItem name="again">
          <Input label="Repeat the code" type="password" required defaultValue="0001" />
        </FormItem>
        <div>
          <FormSubmit>Set code</FormSubmit>
        </div>
      </Stack>
    </Form>
  );
}
