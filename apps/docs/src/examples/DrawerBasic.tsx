// @example A key opens the drawer from the inline end with a list of rooms and one key at the bottom
import { Button, Drawer, Icon, List } from 'dial-react';

export default function DrawerBasic() {
  return (
    <Drawer trigger={<Button>Rooms</Button>} title="Rooms" actions={<Button>Add room</Button>}>
      <List label="Rooms">
        <List.Item href="#living" leading={<Icon name="lamp" />} label="Living room" description="3 devices" />
        <List.Item href="#kitchen" leading={<Icon name="fan" />} label="Kitchen" description="5 devices" />
        <List.Item href="#bedroom" leading={<Icon name="heat" />} label="Bedroom" description="2 devices" />
      </List>
    </Drawer>
  );
}
