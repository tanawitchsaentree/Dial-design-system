// @example A sticky bar that holds the top edge of a scrolling box, matte and at the same elevation
import { Navbar, NavbarLink, Text } from 'dial-react';

export default function NavbarSticky() {
  return (
    <div style={{ blockSize: 'var(--ds-layout-frame-xs)', overflowY: 'auto' }}>
      <Navbar sticky brand="dial" collapse="never">
        <NavbarLink href="#rooms" current>Rooms</NavbarLink>
        <NavbarLink href="#devices">Devices</NavbarLink>
      </Navbar>
      <div style={{ padding: 'var(--ds-gap-lg)' }}>
        <Text tone="secondary">Scroll this box. The bar stays at the top and keeps its shadow.</Text>
        <div style={{ blockSize: 'var(--ds-layout-frame-sm)' }} />
        <Text tone="secondary">The end of the page.</Text>
      </div>
    </div>
  );
}
