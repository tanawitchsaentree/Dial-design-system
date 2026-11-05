// @example A tag names a key that has no printed word of its own
import { Icon, IconButton, Tooltip } from 'dial-react';

export default function TooltipTop() {
  return <Tooltip content="Next track"><IconButton label="Next track"><Icon name="next" /></IconButton></Tooltip>;
}
