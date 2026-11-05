// @example A link inside a sentence takes the size and ink of the text around it, with one thin rule under the words
import { Link, Text } from 'dial-react';

export default function LinkBasic() {
  return (
    <Text>
      Set the night level in <Link href="#heating-rules">heating rules</Link> and read the <Link href="#manual">manual</Link> for the rest.
    </Text>
  );
}
