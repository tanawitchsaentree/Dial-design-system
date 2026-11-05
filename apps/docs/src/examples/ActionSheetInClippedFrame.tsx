// @example Opened from a key in a frame that clips its content near the end of the row, the panel still shows whole
import { ActionSheet, Icon, IconButton } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to another room' },
  { value: 'share', label: 'Share with the household' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetInClippedFrame() {
  return (
    <div className="demo-box demo-card" style={{ overflow: 'hidden', blockSize: 'var(--ds-space-24)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <p className="flush">Hall speaker</p>
      <ActionSheet
        title="Hall speaker"
        items={ACTIONS}
        trigger={
          <IconButton label="Actions for Hall speaker">
            <Icon name="more" />
          </IconButton>
        }
      />
    </div>
  );
}
