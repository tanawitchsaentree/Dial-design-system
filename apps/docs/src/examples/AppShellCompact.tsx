// @example A narrow frame: the Sidebar leaves the page and the Navbar's Menu key opens it in a Drawer
import { AppShell, Heading, Navbar, NavbarLink, Sidebar, SidebarGroup, SidebarItem, Text } from 'dial-react';

export default function AppShellCompact() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-lg)', maxInlineSize: '100%' }}>
      <AppShell
        header={({ compact, menuOpen, openMenu }) => (
          <Navbar brand="dial" collapse={compact ? 'always' : 'auto'} onMenuPress={compact ? openMenu : undefined} menuOpen={menuOpen}>
            <NavbarLink href="#rooms" current>Rooms</NavbarLink>
            <NavbarLink href="#schedules">Schedules</NavbarLink>
          </Navbar>
        )}
        sidebar={
          <Sidebar>
            <SidebarGroup title="Rooms">
              <SidebarItem href="#living" icon="lamp">Living room</SidebarItem>
              <SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem>
            </SidebarGroup>
          </Sidebar>
        }
      >
        <Heading level={2}>Kitchen</Heading>
        <Text>Press Menu to see the rooms.</Text>
      </AppShell>
    </div>
  );
}
