// @example A send that takes two seconds: the key goes flat and says Sending, and a second press is ignored
import { useState } from 'react';
import { Form, FormItem, FormSubmit, Input, Stack, Text } from 'dial-react';

export default function FormAsync() {
  const [sent, setSent] = useState('');
  return (
    <Form
      onSubmit={async (values) => {
        await new Promise((done) => setTimeout(done, 2000));
        setSent(`Saved ${String(values.room)}.`);
      }}
    >
      <Stack gap="lg">
        <FormItem name="room">
          <Input label="Room name" required defaultValue="Living room" />
        </FormItem>
        <div>
          <FormSubmit>Save room</FormSubmit>
        </div>
        <Text>{sent}</Text>
      </Stack>
    </Form>
  );
}
