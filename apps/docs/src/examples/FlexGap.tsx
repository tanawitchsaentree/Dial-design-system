// @example gap comes from the five steps of the token scale, never a number
import { Flex } from 'dial-react';

export default function FlexGap() {
  return (
    <Flex gap="lg">
      <span>Living room</span>
      <span>Hallway</span>
      <span>Kitchen</span>
    </Flex>
  );
}
