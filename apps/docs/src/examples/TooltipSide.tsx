// @example The tag stands below the part, and flips on its own when there is no room above
import { Icon, IconButton, Stack, Tooltip } from 'dial-react';

export default function TooltipSide() {
  return (
    <Stack direction="row" gap="sm">
      <Tooltip content="More for Kitchen lamp" side="bottom"><IconButton label="More for Kitchen lamp"><Icon name="more" /></IconButton></Tooltip>
      <Tooltip content="Play" side="top"><IconButton label="Play"><Icon name="play" /></IconButton></Tooltip>
    </Stack>
  );
}
