// @example A flexible spacer takes the room that is left and pushes the key to the far end of the row
import { Button, Spacer, Stack, Text } from 'dial-react';

export default function SpacerFlexible() {
  return (
    <Stack direction="row" align="center">
      <Text>Heating</Text>
      <Spacer axis="inline" flexible />
      <Button kind="primary">Save</Button>
    </Stack>
  );
}
