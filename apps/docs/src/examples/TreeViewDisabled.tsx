// @example disabled items fade, cannot be chosen or opened, and the arrow keys skip them
import { TreeItem, TreeView } from 'dial-react';

export default function TreeViewDisabled() {
  return (
    <TreeView aria-label="Schedules" defaultExpanded={['weekday']} defaultValue="morning">
      <TreeItem value="weekday" label="Weekdays">
        <TreeItem value="morning" label="Morning" />
        <TreeItem value="night" label="Night" disabled />
        <TreeItem value="away" label="Away" />
      </TreeItem>
      <TreeItem value="weekend" label="Weekend" disabled>
        <TreeItem value="lie-in" label="Lie-in" />
      </TreeItem>
      <TreeItem value="holiday" label="Holiday" />
    </TreeView>
  );
}
