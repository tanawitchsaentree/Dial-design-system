// @example visited prints a link already read one ink step lighter, with a dotted rule
import { Link, Text } from 'dial-react';

export default function LinkVisited() {
  return (
    <Text>
      You read <Link href="#manual" visited>the manual</Link> on Monday. <Link href="#rules">Heating rules</Link> is new.
    </Text>
  );
}
