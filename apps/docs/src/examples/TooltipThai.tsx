// @example A Thai name keeps its marks above and below the line, and the tag grows to hold it
import { Icon, IconButton, Tooltip } from 'dial-react';

export default function TooltipThai() {
  return (
    <Tooltip content="เปิดไฟห้องนั่งเล่น">
      <IconButton label="เปิดไฟห้องนั่งเล่น"><Icon name="play" /></IconButton>
    </Tooltip>
  );
}
