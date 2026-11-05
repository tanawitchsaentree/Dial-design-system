// @example One item takes the spare room between two keys that keep their size
import { Button, Flex, FlexItem, Text } from 'dial-react';

export default function FlexGrow() {
  return (
    <div className="demo-box demo-card">
      <Flex gap="sm" align="center">
        <FlexItem shrink={false}><Button kind="key">Back</Button></FlexItem>
        <FlexItem grow><Text>Living room, 21 degrees</Text></FlexItem>
        <FlexItem shrink={false}><Button kind="key">Next</Button></FlexItem>
      </Flex>
    </div>
  );
}
