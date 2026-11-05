// @example Actions with a printed glyph before each word; the words line up in one column
import { Icon, Menu } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename', icon: <Icon name="edit" size="sm" /> },
  { value: 'move', label: 'Move to room', icon: <Icon name="room" size="sm" /> },
  { value: 'schedule', label: 'Add a schedule', icon: <Icon name="schedule" size="sm" /> },
  { value: 'remove', label: 'Remove from home', destructive: true },
];

export default function MenuIcons() {
  return <Menu label="More for Bedroom heater" items={ACTIONS} />;
}
