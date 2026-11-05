// @example Centred along the line only: the top edge stays put and the part sits in the middle
import { Center, Text } from 'dial-react';

export default function CenterInline() {
  return (
    <div className="demo-box demo-full">
      <Center axis="inline">
        <Text>Heating is off</Text>
      </Center>
    </div>
  );
}
