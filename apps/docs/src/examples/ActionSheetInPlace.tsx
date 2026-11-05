// @example modal false shows the docked lid in place, for a preview of its rows and its Cancel key
import { ActionSheet, Icon } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename', icon: <Icon name="edit" /> },
  { value: 'move', label: 'Move to room', icon: <Icon name="room" /> },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetInPlace() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>
      <ActionSheet modal={false} open title="Kitchen lamp" detail="lamp 02 · Kitchen" items={ACTIONS} />
    </div>
  );
}
