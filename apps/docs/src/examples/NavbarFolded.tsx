// @example The legend folded behind a Menu key, as it is on a narrow screen; the key opens the links in a panel
import { Navbar, NavbarLink } from 'dial-react';

export default function NavbarFolded() {
  return (
    <Navbar brand="dial" collapse="always">
      <NavbarLink href="#rooms" current>Rooms</NavbarLink>
      <NavbarLink href="#schedules">Schedules</NavbarLink>
      <NavbarLink href="#devices">Devices</NavbarLink>
      <NavbarLink href="#help">Help</NavbarLink>
    </Navbar>
  );
}
