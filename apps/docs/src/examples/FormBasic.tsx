// @example A room form: press Send with the name empty and the window at the top counts the problem and links to the field
import { Form, FormItem, FormSubmit, Input, Stack } from 'dial-react';

export default function FormBasic() {
  return (
    <Form onSubmit={() => undefined}>
      <Stack gap="lg">
        <FormItem name="room">
          <Input label="Room name" required hint="Shown on the home screen." />
        </FormItem>
        <FormItem name="target">
          <Input label="Target" type="number" min={10} max={30} unit="°C" defaultValue="21" />
        </FormItem>
        <div>
          <FormSubmit>Save room</FormSubmit>
        </div>
      </Stack>
    </Form>
  );
}
