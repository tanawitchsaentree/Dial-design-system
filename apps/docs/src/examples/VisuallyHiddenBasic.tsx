// @example Words that only a screen reader prints: a link says where it goes in full while the face shows one word
import { Link, VisuallyHidden } from 'dial-react';

export default function VisuallyHiddenBasic() {
  return (
    <Link href="#heating">
      Heating
      <VisuallyHidden>, opens the heating rules</VisuallyHidden>
    </Link>
  );
}
