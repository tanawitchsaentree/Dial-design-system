// @example Controlled with open and onOpenChange, so the page can close the drawer when the filter is applied
import { useState } from 'react';
import { Button, Drawer, List, Switch } from 'dial-react';

export default function DrawerControlled() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-section)', justifyItems: 'start' }}>
      <Button onClick={() => setOpen(true)}>Filter devices</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Filter"
        actions={<Button kind="primary" onClick={() => setOpen(false)}>Show 4 devices</Button>}
      >
        <List label="Filter">
          <List.Item label="Lamps" trailing={<Switch aria-label="Lamps" defaultChecked />} />
          <List.Item label="Heaters" trailing={<Switch aria-label="Heaters" defaultChecked />} />
          <List.Item label="Offline only" trailing={<Switch aria-label="Offline only" />} />
        </List>
      </Drawer>
    </div>
  );
}
