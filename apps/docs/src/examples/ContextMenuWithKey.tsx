// @example The same actions also sit on a visible Menu key, so the right-click is a shortcut and never the only way
import { ContextMenu, Menu, Text } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ContextMenuWithKey() {
  return (
    <ContextMenu items={ACTIONS} label="Actions for Hall speaker" tabIndex={0} className="demo-box demo-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Hall speaker</Text>
        <Menu label="More for Hall speaker" items={ACTIONS} />
      </div>
    </ContextMenu>
  );
}
