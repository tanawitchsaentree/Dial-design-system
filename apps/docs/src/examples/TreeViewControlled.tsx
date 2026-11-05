// @example value and expanded are held by your own state, and the choice is shown in a Text below
import { useState } from 'react';
import { Text, TreeItem, TreeView } from 'dial-react';

export default function TreeViewControlled() {
  const [value, setValue] = useState<string | null>('hall');
  const [open, setOpen] = useState<string[]>(['rooms']);
  return (
    <>
      <TreeView aria-label="Rooms" value={value} onValueChange={setValue} expanded={open} onExpandedChange={setOpen}>
        <TreeItem value="rooms" label="Rooms">
          <TreeItem value="kitchen" label="Kitchen" />
          <TreeItem value="hall" label="Hall" />
          <TreeItem value="garden" label="Garden">
            <TreeItem value="shed" label="Shed" />
          </TreeItem>
        </TreeItem>
      </TreeView>
      <Text>{value} chosen, {open.length} open</Text>
    </>
  );
}
