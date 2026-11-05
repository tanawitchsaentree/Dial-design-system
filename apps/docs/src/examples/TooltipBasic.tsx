// @example A key named by a small plastic tag on hover, keyboard focus and a resting finger
import { Icon, IconButton, Stack, Tooltip } from 'dial-react';

export default function TooltipBasic() {
  return (
    <Stack direction="row" gap="sm">
      <Tooltip content="Previous track"><IconButton label="Previous track"><Icon name="previous" /></IconButton></Tooltip>
      <Tooltip content="Play"><IconButton label="Play" kind="primary"><Icon name="play" /></IconButton></Tooltip>
      <Tooltip content="Next track"><IconButton label="Next track"><Icon name="next" /></IconButton></Tooltip>
    </Stack>
  );
}
