// @example modal false shows the drawer in place, with no scrim, for a preview or a wide settings page
import { Button, Drawer, Icon, List } from 'dial-react';

export default function DrawerInPlace() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-sidebar))' }}>
      <Drawer modal={false} open title="Rooms" actions={<Button>Add room</Button>}>
        <List label="Rooms">
          <List.Item href="#living" leading={<Icon name="lamp" />} label="Living room" description="3 devices" />
          <List.Item href="#kitchen" leading={<Icon name="fan" />} label="Kitchen" description="5 devices" />
        </List>
      </Drawer>
    </div>
  );
}
