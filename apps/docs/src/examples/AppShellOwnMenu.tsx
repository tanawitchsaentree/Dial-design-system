// @example A narrow frame with a plain header: the shell prints its own Menu key above main
import { AppShell, Heading, Sidebar, SidebarGroup, SidebarItem, Text } from 'dial-react';

export default function AppShellOwnMenu() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-lg)', maxInlineSize: '100%' }}>
      <AppShell
        sidebar={
          <Sidebar>
            <SidebarGroup title="House">
              <SidebarItem href="#schedules" icon="schedule">Schedules</SidebarItem>
              <SidebarItem href="#settings" icon="settings" current>Settings</SidebarItem>
            </SidebarGroup>
          </Sidebar>
        }
      >
        <Heading level={2}>Settings</Heading>
        <Text>With no header, the shell adds a Menu key so the column can still be reached.</Text>
      </AppShell>
    </div>
  );
}
