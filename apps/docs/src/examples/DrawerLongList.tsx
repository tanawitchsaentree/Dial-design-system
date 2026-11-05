// @example A long list scrolls inside the drawer while the title and the key at the bottom keep their places
import { Button, Drawer, Icon, List } from 'dial-react';

const ROOMS = ['Living room', 'Kitchen', 'Bedroom', 'Hall', 'Garden', 'Garage', 'Study', 'Bathroom', 'Cellar', 'Attic', 'Terrace', 'Guest room'];

export default function DrawerLongList() {
  return (
    <Drawer trigger={<Button>All rooms</Button>} title="All rooms" actions={<Button>Add room</Button>}>
      <List label="All rooms">
        {ROOMS.map((room) => (
          <List.Item key={room} href={`#${room.toLowerCase().replace(/ /g, '-')}`} leading={<Icon name="lamp" />} label={room} />
        ))}
      </List>
    </Drawer>
  );
}
