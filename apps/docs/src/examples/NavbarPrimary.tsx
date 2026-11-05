// @example The model name as a link and one orange key in the actions slot, the only orange on the bar
import { Button, Navbar, NavbarLink } from 'dial-react';

export default function NavbarPrimary() {
  return (
    <Navbar
      brand={<a href="#home">dial</a>}
      actions={
        <>
          <Button>Help</Button>
          <Button kind="primary">Add device</Button>
        </>
      }
    >
      <NavbarLink href="#rooms">Rooms</NavbarLink>
      <NavbarLink href="#devices" current>Devices</NavbarLink>
    </Navbar>
  );
}
