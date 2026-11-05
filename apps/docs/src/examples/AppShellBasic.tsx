// @example A wide frame: a Navbar across the top, a Sidebar at the start, the page in main and a footer
import { AppShell, Heading, Navbar, NavbarLink, Sidebar, SidebarGroup, SidebarItem, Text } from 'dial-react';

export default function AppShellBasic() {
  return (
    <div style={{ overflowX: 'auto', maxInlineSize: '100%' }}>
      <div style={{ inlineSize: 'var(--ds-layout-container-lg)' }}>
        <AppShell
          header={
            <Navbar brand="dial">
              <NavbarLink href="#rooms" current>Rooms</NavbarLink>
              <NavbarLink href="#schedules">Schedules</NavbarLink>
            </Navbar>
          }
          sidebar={
            <Sidebar>
              <SidebarGroup title="Rooms">
                <SidebarItem href="#living" icon="lamp">Living room</SidebarItem>
                <SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem>
              </SidebarGroup>
            </Sidebar>
          }
          footer={<Text tone="secondary">dial 3</Text>}
        >
          <Heading level={2}>Kitchen</Heading>
          <Text>The heating is set to 21 degrees until 22:30.</Text>
        </AppShell>
      </div>
    </div>
  );
}
