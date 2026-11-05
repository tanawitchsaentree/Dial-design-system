// @example A held header: the bar stays at the top of a scrolling box while main moves under it
import { AppShell, Heading, Navbar, NavbarLink, Text } from 'dial-react';

export default function AppShellSticky() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-lg)', maxInlineSize: '100%', blockSize: 'var(--ds-layout-frame-lg)', overflowY: 'auto' }}>
      <AppShell
        stickyHeader
        header={
          <Navbar brand="dial" collapse="never">
            <NavbarLink href="#rooms" current>Rooms</NavbarLink>
          </Navbar>
        }
      >
        <Heading level={2}>Schedules</Heading>
        <Text>Scroll this box. The header keeps the top edge and the page ground stays behind it.</Text>
        <div style={{ blockSize: 'var(--ds-layout-frame-lg)' }} />
        <Text tone="secondary">The end of the page.</Text>
      </AppShell>
    </div>
  );
}
