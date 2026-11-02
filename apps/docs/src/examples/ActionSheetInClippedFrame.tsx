// @example Opened from a key in a frame that clips its content near the end of the row, the panel still shows whole
import { ActionSheet, IconButton } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to another room' },
  { value: 'share', label: 'Share with the household' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetInClippedFrame() {
  return (
    <div className="demo-box demo-card" style={{ overflow: 'hidden', blockSize: 96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <p className="flush">Hall speaker</p>
      <ActionSheet
        title="Hall speaker"
        items={ACTIONS}
        trigger={
          <IconButton label="Actions for Hall speaker">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
          </IconButton>
        }
      />
    </div>
  );
}
