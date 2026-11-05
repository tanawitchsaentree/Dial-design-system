// @example The Menu key opens your own Drawer instead of the built-in panel, through onMenuPress
import { useState } from 'react';
import { Drawer, Icon, List, Navbar, NavbarLink } from 'dial-react';

export default function NavbarDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar brand="dial" collapse="always" onMenuPress={() => setOpen(true)} menuOpen={open}>
        <NavbarLink href="#rooms" current>Rooms</NavbarLink>
        <NavbarLink href="#devices">Devices</NavbarLink>
      </Navbar>
      <Drawer open={open} onOpenChange={setOpen} title="Menu">
        <List label="Places">
          <List.Item href="#rooms" leading={<Icon name="lamp" />} label="Rooms" />
          <List.Item href="#devices" leading={<Icon name="fan" />} label="Devices" />
        </List>
      </Drawer>
    </>
  );
}
