// @example A top bar with a model name, four places with an ink dot before the current one, and a sign-in key
import { Button, Navbar, NavbarLink } from 'dial-react';

export default function NavbarBasic() {
  return (
    <Navbar brand="dial" actions={<Button>Sign in</Button>}>
      <NavbarLink href="#rooms" current>Rooms</NavbarLink>
      <NavbarLink href="#schedules">Schedules</NavbarLink>
      <NavbarLink href="#devices">Devices</NavbarLink>
      <NavbarLink href="#help">Help</NavbarLink>
    </Navbar>
  );
}
