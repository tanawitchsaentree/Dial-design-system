// @example A later breakpoint: at xl the column folds into the Drawer in a frame that would fit it at md
import { AppShell, Heading, Navbar, NavbarLink, Sidebar, SidebarGroup, SidebarItem, Text } from 'dial-react';

export default function AppShellBreakpoint() {
  return (
    <div style={{ overflowX: 'auto', maxInlineSize: '100%' }}>
      <div style={{ inlineSize: 'var(--ds-layout-container-lg)' }}>
        <AppShell
          breakpoint="xl"
          header={({ compact, menuOpen, openMenu }) => (
            <Navbar brand="dial" collapse={compact ? 'always' : 'auto'} onMenuPress={compact ? openMenu : undefined} menuOpen={menuOpen}>
              <NavbarLink href="#rooms" current>Rooms</NavbarLink>
            </Navbar>
          )}
          sidebar={
            <Sidebar>
              <SidebarGroup title="Rooms">
                <SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem>
              </SidebarGroup>
            </Sidebar>
          }
        >
          <Heading level={2}>Kitchen</Heading>
          <Text>The shell is 1024px wide and the xl breakpoint is wider, so the column is in the Drawer.</Text>
        </AppShell>
      </div>
    </div>
  );
}
