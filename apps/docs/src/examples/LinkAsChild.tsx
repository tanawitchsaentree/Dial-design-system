// @example asChild hands the link styles to your router link, which keeps its own navigation
import { Link, Text } from 'dial-react';

export default function LinkAsChild() {
  return (
    <Text>
      Back to <Link asChild><a href="#rooms" onClick={(e) => e.preventDefault()}>Rooms</a></Link>.
    </Text>
  );
}
