// Usage tab for AppShell (component-depth.md U1–U14). AppShell is the frame of a screen.
import { AppShell, Heading, Navbar, NavbarLink, Sidebar, SidebarGroup, SidebarItem, Text } from 'dial-react';
import type { Depth } from './types';

const nav = (
  <Sidebar>
    <SidebarGroup title="Rooms">
      <SidebarItem href="#living" icon="lamp">Living room</SidebarItem>
      <SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem>
    </SidebarGroup>
  </Sidebar>
);
const bar = (
  <Navbar brand="dial" collapse="never">
    <NavbarLink href="#rooms" current>Rooms</NavbarLink>
  </Navbar>
);
const Wide = ({ children }: { children: React.ReactNode }) => (
  <div style={{ overflowX: 'auto', maxInlineSize: '100%' }}>
    <div style={{ inlineSize: 'var(--ds-layout-container-lg)' }}>{children}</div>
  </div>
);
const Narrow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ inlineSize: 'var(--ds-layout-frame-lg)', maxInlineSize: '100%' }}>{children}</div>
);
const page = (title: string, body: string) => (
  <>
    <Heading level={2}>{title}</Heading>
    <Text>{body}</Text>
  </>
);

export const APP_SHELL: Depth = {
  overview: (
    <>
      <p>AppShell is the frame of a whole screen. It places a header unit across the top, a side column at the inline start, the page in main and an optional footer, and it leaves an inset gap between them. Each region is a unit of its own; the shell paints nothing except the page ground.</p>
      <p>It composes Navbar, Sidebar and Drawer rather than copying them. When the shell is narrower than the breakpoint, the Sidebar leaves the page and opens in a Drawer from the Menu key. The first stop for the keyboard is a skip link, and a route change moves focus to main.</p>
    </>
  ),
  whenToUse: ['To frame every page of an app in the same header, side column and footer.', 'To get the four landmarks and a skip link without wiring them each time.', 'To fold a side column into a Drawer on a narrow screen.'],
  whenNot: [
    { situation: 'Only centring content at a reading width', to: '/components/container', label: 'Container' },
    { situation: 'A side column with no frame around it', to: '/components/sidebar', label: 'Sidebar' },
    { situation: 'A panel that opens over the page', to: '/components/drawer', label: 'Drawer' },
  ],
  variants: { na: 'AppShell has one look. Its layout changes with the width of the shell, not with a variant prop; see the breakpoint under Modifiers.' },
  anatomy: {
    render: <Wide><AppShell header={bar} sidebar={nav} footer={<Text tone="secondary">dial 3</Text>}>{page('Kitchen', 'The heating is set to 21 degrees.')}</AppShell></Wide>,
    parts: [
      { part: 'Header', selector: '[data-component="AppShell"] > [data-part="header"]', what: 'The top unit, usually a Navbar, across the full width.' },
      { part: 'Side column', selector: '[data-component="AppShell"] [data-part="side"]', what: 'The Sidebar, at the inline start of the second row.' },
      { part: 'Main', selector: '[data-component="AppShell"] main', what: 'The page. It takes focus from the skip link and from a route change.' },
      { part: 'Footer', selector: '[data-component="AppShell"] > footer', what: 'The optional bottom unit.' },
    ],
  },
  sizes: { na: 'AppShell has no size. It fills the width it is given, and the units inside keep their own sizes.' },
  emphasis: { na: 'The shell paints nothing orange. The one primary key of a screen belongs to the unit that holds it.' },
  placement: {
    rows: [['The root of an app', 'One AppShell around the routes, with the pathname as focusKey.'], ['A narrow pane', 'The shell measures itself, so a pane under the breakpoint folds the column even on a wide window.']],
    examples: [{ title: 'Wide: the column stands at the start', render: <Wide><AppShell header={bar} sidebar={nav}>{page('Kitchen', 'The column is inline.')}</AppShell></Wide> }],
  },
  combinations: {
    good: [['AppShell + Navbar', 'The Navbar is the banner landmark; pass a function as header to open the Drawer from its Menu key.'], ['AppShell + Sidebar', 'The Sidebar is the navigation landmark and moves into the Drawer when narrow.']],
    avoid: [{ title: 'two AppShells nested', why: 'The page then has two skip links and two main landmarks. Use one shell per page.', render: <Narrow><AppShell>{page('Outer', 'Inner shell follows.')}</AppShell></Narrow> }],
  },
  content: {
    formula: <p>Keep the skip link to a short imperative, as in <em>Skip to main content</em>. Name the Drawer and the Menu key with the same word.</p>,
    pair: {
      do: <Narrow><AppShell skipLabel="Skip to main content">{page('Kitchen', 'A clear skip link.')}</AppShell></Narrow>, doNote: 'A short imperative that names the target.',
      dont: <Narrow><AppShell skipLabel="Click here to skip over the navigation and go to the content of this page">{page('Kitchen', 'A long skip link.')}</AppShell></Narrow>, dontNote: 'Too long to take in while tabbing.',
    },
    overflow: { text: 'A long page title wraps inside main. The side column and the header keep their places.', render: <Narrow><AppShell>{page('A very long page title for the heating schedule of the whole upstairs floor', 'The title wraps.')}</AppShell></Narrow> },
    rtl: { text: 'In right-to-left languages the side column moves to the right and the Drawer comes in from the right.', render: <div dir="rtl"><Wide><AppShell sidebar={nav}>{page('المطبخ', 'العمود على اليمين.')}</AppShell></Wide></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap inside their units and the grid does not move.', render: <Narrow><AppShell skipLabel="Zum Hauptinhalt springen">{page('Küche', 'Allgemeine Einstellungen')}</AppShell></Narrow> },
  },
  behaviours: {
    states: [
      ['Split', 'The side column stands at the inline start and main beside it.', 'Sidebar is a navigation landmark.'],
      ['Folded', 'The column is gone from the page; the Menu key opens it in a Drawer.', 'The Menu key reports aria-expanded.'],
      ['Main focused', 'A ring when the keyboard put focus there.', 'Main is announced as the main landmark.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'The first stop is the skip link, which shows as a key while focused.', 'a, VisuallyHidden'],
      ['Keyboard', 'Enter on the skip link', 'Moves focus to main.', 'focus()'],
      ['Keyboard', 'Escape', 'Closes the Drawer; focus returns to the Menu key.', 'Drawer'],
      ['Route change', 'focusKey changes', 'Closes the Drawer and moves focus to main.', 'useEffect'],
    ],
    loading: <p>AppShell has no loading state. Show Skeleton or Progress inside main.</p>,
    focus: <p>Focus starts at the top of the document, where the skip link is. After a route change focus is on main, so a screen reader starts at the new page and not at the header.</p>,
  },
  deepDive: { na: 'AppShell has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'breakpoint',
      rules: <p>The width under which the side column folds into the Drawer, as a token name: <code>sm</code>, <code>md</code> (default), <code>lg</code> or <code>xl</code>. The shell measures its own width, not the window.</p>,
      pair: { do: <Narrow><AppShell sidebar={nav}>{page('Kitchen', 'Folded in a narrow pane.')}</AppShell></Narrow>, doNote: 'A narrow pane folds the column.', dont: <Wide><AppShell breakpoint="xl" sidebar={nav}>{page('Kitchen', 'Folded with room to spare.')}</AppShell></Wide>, dontNote: 'A breakpoint wider than the pane hides a column that fitted.' },
    },
    {
      name: 'focusKey',
      rules: <p>Pass the router&rsquo;s pathname. When it changes, focus moves to main and an open Drawer closes. Leave it out if your router already moves focus.</p>,
      pair: { do: <Narrow><AppShell focusKey="/kitchen">{page('Kitchen', 'Focus follows the route.')}</AppShell></Narrow>, doNote: 'One value that changes on navigation.', dont: <Narrow><AppShell focusKey={{}}>{page('Kitchen', 'A new value every render.')}</AppShell></Narrow>, dontNote: 'A value that changes on every render steals focus each time.' },
    },
  ],
  related: [['/components/navbar', 'Navbar', 'The header unit.'], ['/components/sidebar', 'Sidebar', 'The side column.'], ['/components/drawer', 'Drawer', 'Holds the column on a narrow screen.'], ['/components/container', 'Container', 'A reading width without landmarks.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Landmark Regions', url: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/', why: 'Banner, navigation, main and contentinfo.' },
    { title: 'WCAG 2.2 · 2.4.1 Bypass Blocks', url: 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html', why: 'Why the skip link is the first stop.' },
    { title: 'MDN · ResizeObserver', url: 'https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver', why: 'How the shell measures its own width.' },
  ],
};
