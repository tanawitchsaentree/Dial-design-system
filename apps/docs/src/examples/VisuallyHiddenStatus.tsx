// @example Extra words after a visible one: the sighted reader sees 3 offline and the screen reader hears 3 offline devices
import { Badge, VisuallyHidden } from 'dial-react';

export default function VisuallyHiddenStatus() {
  return (
    <Badge count={3}>
      offline
      <VisuallyHidden> devices</VisuallyHidden>
    </Badge>
  );
}
