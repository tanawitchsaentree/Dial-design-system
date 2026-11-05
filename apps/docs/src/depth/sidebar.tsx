// Usage tab for Sidebar (component-depth.md U1–U14). Sidebar is a side column of pages that can shrink to icons.
import { Sidebar, SidebarGroup, SidebarItem, SidebarToggle } from 'dial-react';
import type { Depth } from './types';

const Frame = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card" style={{ inlineSize: '100%', minBlockSize: 'var(--ds-layout-frame-xs)' }}>{children}</div>;
const column = (opts: { collapsed?: boolean; toggle?: boolean; current?: string } = {}) => (
  <Sidebar label="Main" defaultCollapsed={opts.collapsed}>
    <SidebarGroup title="Rooms">
      <SidebarItem href="#living" icon="lamp" current={opts.current === 'living'}>Living room</SidebarItem>
      <SidebarItem href="#kitchen" icon="heat" current={(opts.current ?? 'kitchen') === 'kitchen'}>Kitchen</SidebarItem>
      <SidebarItem href="#bedroom" icon="room" current={opts.current === 'bedroom'}>Bedroom</SidebarItem>
    </SidebarGroup>
    <SidebarGroup title="House">
      <SidebarItem href="#schedules" icon="schedule">Schedules</SidebarItem>
      <SidebarItem href="#settings" icon="settings">Settings</SidebarItem>
    </SidebarGroup>
    {opts.toggle ? <SidebarToggle /> : null}
  </Sidebar>
);

export const SIDEBAR: Depth = {
  overview: (
    <>
      <p>Sidebar is the legend printed down the side of the app: the names of its pages, grouped under small headings, in one fixed column. The page you are on is set in medium weight with one ink bar at the start of its row, the same mark Tabs puts under a name.</p>
      <p>It can shrink to icons only. The words leave the picture but stay in the page, so every link keeps its name. Showing it as a drawer on a narrow screen is the app’s job.</p>
    </>
  ),
  whenToUse: ['To move between the five to fifteen pages of an app.', 'To keep the pages in view while the person works in one of them.'],
  whenNot: [
    { situation: 'Switching between views of one page', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Showing where a page sits in a path', to: '/components/breadcrumb', label: 'Breadcrumb' },
    { situation: 'Stepping through pages of a result list', to: '/components/pagination', label: 'Pagination' },
  ],
  variants: { na: 'Sidebar has one look, a column of printed names. Open or collapsed is a state, covered under Modifiers.' },
  anatomy: {
    render: column({ toggle: true }),
    parts: [
      { part: 'Group heading', selector: '[data-component="Sidebar"] > div > p', what: 'A small lowercase name above its list.' },
      { part: 'Link', selector: '[data-component="Sidebar"] li > a', what: 'The whole row, at least 44px tall, with an icon and the page name.' },
      { part: 'Index mark', selector: '[data-component="Sidebar"] li > a > span:first-child', what: 'A short ink bar at the start of the current page’s row.' },
      { part: 'Toggle', selector: '[data-component="Sidebar"] > button', what: 'The key that collapses and expands the column.' },
    ],
  },
  sizes: { na: 'Sidebar has one size. Open it takes the sidebar width, collapsed it is one 44px row plus the inset.' },
  emphasis: { na: 'The current page is told by weight and the index mark. Nothing in a Sidebar is orange.' },
  placement: {
    rows: [['The start edge of the app', 'Stand it beside the page content, full height, with the page filling the rest.'], ['Narrow screens', 'Show it inside a Drawer and keep the same groups.']],
    examples: [{ title: 'Beside a page', render: <Frame><div style={{ display: 'flex', gap: 'var(--ds-gap-xl)', alignItems: 'flex-start' }}>{column({ toggle: true })}<p className="flush">Kitchen: oven, hood and radio.</p></div></Frame> }],
  },
  combinations: {
    good: [['Sidebar + Drawer', 'On a narrow screen the same groups sit inside a Drawer.'], ['Sidebar + Breadcrumb', 'The sidebar picks the area and the breadcrumb shows the path inside it.']],
    avoid: [{ title: 'a Sidebar of two pages', why: 'Two names do not need a column. Use Tabs, or a link in the header.', render: <Frame><Sidebar label="Main"><SidebarGroup title="App"><SidebarItem href="#a" icon="home" current>Home</SidebarItem><SidebarItem href="#b" icon="settings">Settings</SidebarItem></SidebarGroup></Sidebar></Frame> }],
  },
  content: {
    formula: <p>Name each page with a noun, as in <em>Schedules</em> or <em>Kitchen</em>. Give each group a short lowercase heading. Pick an icon that still tells the page apart when the words are gone.</p>,
    pair: {
      do: <Frame><Sidebar label="Main"><SidebarGroup title="Rooms"><SidebarItem href="#k" icon="heat" current>Kitchen</SidebarItem></SidebarGroup></Sidebar></Frame>, doNote: 'A noun and an icon of its own.',
      dont: <Frame><Sidebar label="Main"><SidebarGroup title="Rooms"><SidebarItem href="#k" current>Go to the kitchen page</SidebarItem></SidebarGroup></Sidebar></Frame>, dontNote: 'A sentence, and no icon to keep when collapsed.',
    },
    overflow: { text: 'A long name wraps inside its row. The row grows with the text and the icon stays at the start.', render: <Frame><Sidebar label="Main"><SidebarGroup title="Rooms"><SidebarItem href="#k" icon="heat" current>Upstairs bedroom with the sloping ceiling</SidebarItem><SidebarItem href="#l" icon="lamp">Hall</SidebarItem></SidebarGroup></Sidebar></Frame> },
    rtl: { text: 'In right-to-left languages the column, the icons and the index mark sit on the right.', render: <div dir="rtl"><Frame><Sidebar label="الرئيسية"><SidebarGroup title="الغرف"><SidebarItem href="#k" icon="heat" current>المطبخ</SidebarItem><SidebarItem href="#l" icon="lamp">غرفة المعيشة</SidebarItem></SidebarGroup></Sidebar></Frame></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap and the icons do not move.', render: <Frame><Sidebar label="Main"><SidebarGroup title="Räume"><SidebarItem href="#k" icon="heat" current>Küchenbeleuchtung</SidebarItem><SidebarItem href="#l" icon="lamp">Wohnzimmerheizung</SidebarItem></SidebarGroup></Sidebar></Frame> },
  },
  behaviours: {
    states: [
      ['Default', 'Page names in secondary ink.', 'Links in a list, read with their group name.'],
      ['Hover', 'The name steps to primary ink. Nothing rises.', 'No change.'],
      ['Current', 'Primary ink, medium weight and the index mark.', 'Announced with aria-current="page".'],
      ['Collapsed', 'Icons only, each in a 44px cell. The index mark stays.', 'The toggle reads as collapsed through aria-expanded. Links keep their names.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the links and the toggle in order. There is one tab stop per link.', 'native'],
      ['Keyboard', 'Enter', 'Follows the focused link.', 'native'],
      ['Keyboard', 'Space or Enter', 'On the toggle, collapses or expands the column.', 'native button'],
      ['Screen reader', 'Read', 'A navigation landmark with a list per group; the current page is announced.', 'nav, ul, aria-current'],
    ],
    loading: <p>Sidebar has no loading state. Render the groups you know and add the rest when they arrive.</p>,
    focus: <p>Focus rings follow each link and the toggle. Collapsing does not move focus: the toggle keeps it.</p>,
  },
  deepDive: { na: 'Sidebar has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'collapsed',
      rules: <p>Use <code>defaultCollapsed</code> to start as icons, or <code>collapsed</code> with <code>onCollapsedChange</code> to keep the state yourself. Give every item an <code>icon</code> before you offer the toggle.</p>,
      pair: { do: column({ collapsed: true }), doNote: 'Every row has its own icon.', dont: <Sidebar label="Main" defaultCollapsed><SidebarGroup title="Rooms"><SidebarItem href="#a" current>Kitchen</SidebarItem><SidebarItem href="#b">Hall</SidebarItem></SidebarGroup></Sidebar>, dontNote: 'No icons: the collapsed column is blank.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/drawer', 'Drawer', 'Holds the sidebar on a narrow screen.'], ['/components/breadcrumb', 'Breadcrumb', 'The path inside an area.'], ['/components/list', 'List', 'Rows with the same index mark.']],
  references: [
    { title: 'WAI-ARIA APG · Disclosure navigation menu', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/', why: 'A nav landmark of link lists and a button with aria-expanded.' },
    { title: 'WAI-ARIA · aria-current', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-current', why: 'How the current page is announced.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the current page has a mark and weight, not only a colour.' },
  ],
};
