// @example A skip link that stays hidden until the keyboard lands on it, then shows as a raised key
import { Link, Text, VisuallyHidden } from 'dial-react';

export default function VisuallyHiddenSkipLink() {
  return (
    <div>
      <VisuallyHidden focusable>
        <Link href="#main">Skip to the content</Link>
      </VisuallyHidden>
      <Text>Press Tab once to see the skip key at the top corner.</Text>
    </div>
  );
}
