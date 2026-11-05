// @example Focus follows the route: choosing a page changes focusKey and focus moves to main
import { useState } from 'react';
import { AppShell, Heading, Sidebar, SidebarGroup, SidebarItem, Text } from 'dial-react';

const pages = [
  { id: 'living', name: 'Living room', icon: 'lamp' as const },
  { id: 'kitchen', name: 'Kitchen', icon: 'heat' as const },
];

export default function AppShellFocusKey() {
  const [page, setPage] = useState('living');
  const now = pages.find((p) => p.id === page) ?? pages[0];
  return (
    <div style={{ overflowX: 'auto', maxInlineSize: '100%' }}>
      <div style={{ inlineSize: 'var(--ds-layout-container-lg)' }}>
        <AppShell
          focusKey={page}
          sidebar={
            <Sidebar>
              <SidebarGroup title="Rooms">
                {pages.map((p) => (
                  <SidebarItem key={p.id} href={`#${p.id}`} icon={p.icon} current={p.id === page} onClick={(e) => { e.preventDefault(); setPage(p.id); }}>
                    {p.name}
                  </SidebarItem>
                ))}
              </SidebarGroup>
            </Sidebar>
          }
        >
          <Heading level={2}>{now.name}</Heading>
          <Text>Pick a room. Focus lands here, so a screen reader starts at the new page.</Text>
        </AppShell>
      </div>
    </div>
  );
}
