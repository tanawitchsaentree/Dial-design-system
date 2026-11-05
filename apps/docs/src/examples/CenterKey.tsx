// @example A lone primary key centred in an empty unit, with the one orange part left alone
import { Button, Center, Stack, Text } from 'dial-react';

export default function CenterKey() {
  return (
    <div className="demo-box demo-full" style={{ blockSize: 'var(--ds-space-24)' }}>
      <Center>
        <Stack gap="md" align="center">
          <Text>Nothing is scheduled</Text>
          <Button kind="primary">Add a schedule</Button>
        </Stack>
      </Center>
    </div>
  );
}
