// @example A cap on the inline size: the centred part stops at the md container width
import { Center, Text } from 'dial-react';

export default function CenterMaxSize() {
  return (
    <div className="demo-box demo-full">
      <Center axis="inline" size="md">
        <Text>This note stays at a width the eye can scan, however wide the page is.</Text>
      </Center>
    </div>
  );
}
