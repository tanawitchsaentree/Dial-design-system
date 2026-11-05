// @example Two Buttons open and close every branch through the expanded prop, with long names that wrap
import { useState } from 'react';
import { Button, Stack, TreeItem, TreeView } from 'dial-react';

const BRANCHES = ['ground', 'first', 'loft'];

export default function TreeViewExpandAll() {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <Stack gap="lg">
      <Stack gap="md">
        <Button kind="key" onClick={() => setOpen(BRANCHES)}>Open all</Button>
        <Button kind="key" onClick={() => setOpen([])}>Close all</Button>
      </Stack>
      <TreeView aria-label="Floors" expanded={open} onExpandedChange={setOpen}>
        <TreeItem value="ground" label="Ground floor with the open kitchen and the long hall">
          <TreeItem value="kitchen" label="Kitchen" />
          <TreeItem value="hall" label="Hall" />
        </TreeItem>
        <TreeItem value="first" label="First floor">
          <TreeItem value="bedroom" label="Bedroom" />
          <TreeItem value="loft" label="Loft">
            <TreeItem value="store" label="Store room" />
          </TreeItem>
        </TreeItem>
      </TreeView>
    </Stack>
  );
}
