// @example A column when the children stack, with the same gap steps as a row
import { Flex } from 'dial-react';

export default function FlexColumn() {
  return (
    <Flex direction="column" gap="sm">
      <span>Night schedule</span>
      <span>Away mode</span>
    </Flex>
  );
}
