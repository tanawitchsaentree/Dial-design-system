// @example side start slides the drawer in from the inline start, for a screen whose main key is at the end
import { Button, Drawer, Icon, List } from 'dial-react';

export default function DrawerStart() {
  return (
    <Drawer side="start" trigger={<Button>Programs</Button>} title="Programs">
      <List label="Programs">
        <List.Item href="#cotton" leading={<Icon name="washer" />} label="Cotton" description="40° · 2 h 10 min" />
        <List.Item href="#synthetic" leading={<Icon name="washer" />} label="Synthetic" description="40° · 1 h 30 min" />
        <List.Item href="#quick" leading={<Icon name="washer" />} label="Quick wash" description="30° · 28 min" />
      </List>
    </Drawer>
  );
}
