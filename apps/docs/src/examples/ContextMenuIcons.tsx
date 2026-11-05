// @example Actions with a printed glyph before each word; the destructive one comes last with its lamp
import { ContextMenu, Icon, Text } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename', icon: <Icon name="edit" size="sm" /> },
  { value: 'move', label: 'Move to room', icon: <Icon name="room" size="sm" /> },
  { value: 'schedule', label: 'Add a schedule', icon: <Icon name="schedule" size="sm" /> },
  { value: 'remove', label: 'Remove from home', destructive: true },
];

export default function ContextMenuIcons() {
  return (
    <ContextMenu items={ACTIONS} label="Actions for Bedroom heater" tabIndex={0} className="demo-box demo-card">
      <Text>Bedroom heater</Text>
    </ContextMenu>
  );
}
