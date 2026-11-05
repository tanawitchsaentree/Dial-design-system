// Usage tab for NavigationMenu (component-depth.md U1–U14). NavigationMenu is the site menu of names and panels.
import { NavigationMenu, NavigationMenuGroup, NavigationMenuItem, NavigationMenuLink, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const Room = ({ children }: { children: React.ReactNode }) => <div style={{ minBlockSize: 'var(--ds-space-24)' }}>{children}</div>;

const menu = (open?: string) => (
  <Room>
    <NavigationMenu label="Main" defaultValue={open ?? null}>
      <NavigationMenuLink href="#home" current>Home</NavigationMenuLink>
      <NavigationMenuItem label="Rooms" value="rooms">
        <NavigationMenuGroup title="Upstairs">
          <NavigationMenuLink href="#bedroom">Bedroom</NavigationMenuLink>
          <NavigationMenuLink href="#bathroom">Bathroom</NavigationMenuLink>
        </NavigationMenuGroup>
        <NavigationMenuGroup title="Downstairs">
          <NavigationMenuLink href="#kitchen">Kitchen</NavigationMenuLink>
          <NavigationMenuLink href="#living">Living room</NavigationMenuLink>
        </NavigationMenuGroup>
      </NavigationMenuItem>
      <NavigationMenuLink href="#help">Help</NavigationMenuLink>
    </NavigationMenu>
  </Room>
);

export const NAVIGATION_MENU: Depth = {
  overview: (
    <>
      <p>NavigationMenu is the row of section names along the top of a site, such as Home, Rooms, Devices and Help. A name that holds more pages is a key. Press it and a plastic panel drops from it, with the links in titled groups.</p>
      <p>It opens on a press and never on hover, so a finger and a keyboard reach everything a pointer does. Only one panel is open at a time.</p>
    </>
  ),
  whenToUse: ['To give a site two to six sections along the top.', 'To group several pages under one name.'],
  whenNot: [
    { situation: 'Actions on one object, such as rename or remove', to: '/components/menu', label: 'Menu' },
    { situation: 'Switching between views of the same page', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Showing the path to the current page', to: '/components/breadcrumb', label: 'Breadcrumb' },
  ],
  variants: { na: 'NavigationMenu has one look: names in a row and a plastic panel. Whether a name opens a panel depends on which part you use.' },
  anatomy: {
    render: menu('rooms'),
    parts: [
      { part: 'Name', selector: '[data-component="NavigationMenu"] [data-nav-top]', what: 'A printed word at least 44px tall; a key when it holds a panel, a link when it does not.' },
      { part: 'Panel', selector: '[data-component="NavigationMenu"] li > div', what: 'The plastic panel that drops from the key, with the groups side by side.' },
      { part: 'Group title', selector: '[data-component="NavigationMenu"] li > div p', what: 'A small printed title over one column of links.' },
      { part: 'Link', selector: '[data-component="NavigationMenu"] li > div a', what: 'A row at least 44px tall; the current page carries an ink bar.' },
    ],
  },
  sizes: { na: 'NavigationMenu has one size. Every name and link is at least 44px tall so a finger can press it.' },
  emphasis: { na: 'The current page is told by an ink bar and weight. Nothing in a NavigationMenu is orange.' },
  placement: {
    rows: [['Along the top of a page or a unit', 'The names stand on the inset line and the panel drops over what is below.'], ['Narrow screens', 'The names wrap to a second row. Keep each name short.']],
    examples: [{ title: 'Along the top of a unit', render: <Unit>{menu()}</Unit> }],
  },
  combinations: {
    good: [['NavigationMenu + Breadcrumb', 'The menu names the section and the breadcrumb names the path inside it.'], ['NavigationMenu + Heading', 'Put the page heading under the row, not inside a panel.']],
    avoid: [{ title: 'a name that holds one link', why: 'A key that opens a panel of one link costs two presses. Make it a plain link.', render: <Unit><Room><NavigationMenu label="Main"><NavigationMenuItem label="Help"><NavigationMenuGroup title="Support"><NavigationMenuLink href="#contact">Contact</NavigationMenuLink></NavigationMenuGroup></NavigationMenuItem></NavigationMenu></Room></Unit> }],
  },
  content: {
    formula: <p>Name a key with a noun, as in <em>Rooms</em> or <em>Devices</em>. Title each group with one word and do not repeat the key name in the links.</p>,
    pair: {
      do: <Unit><NavigationMenu label="Main"><NavigationMenuLink href="#rooms" current>Rooms</NavigationMenuLink><NavigationMenuLink href="#devices">Devices</NavigationMenuLink></NavigationMenu></Unit>, doNote: 'Short nouns that fit one row.',
      dont: <Unit><NavigationMenu label="Main"><NavigationMenuLink href="#rooms" current>Browse all of the rooms in your house</NavigationMenuLink><NavigationMenuLink href="#devices">Manage devices</NavigationMenuLink></NavigationMenu></Unit>, dontNote: 'Long names push the row onto a second line.',
    },
    overflow: { text: 'When the names do not fit, the row wraps. Each name stays on one line and keeps its 44px height.', render: <div style={{ inlineSize: 'var(--ds-layout-frame-sm)' }}><NavigationMenu label="Main"><NavigationMenuLink href="#home" current>Home</NavigationMenuLink><NavigationMenuLink href="#rooms">Rooms</NavigationMenuLink><NavigationMenuLink href="#devices">Devices</NavigationMenuLink><NavigationMenuLink href="#schedules">Schedules</NavigationMenuLink><NavigationMenuLink href="#help">Help</NavigationMenuLink></NavigationMenu></div> },
    rtl: { text: 'In right-to-left languages the names start on the right, the arrows swap and the panel hangs from the right edge of its key.', render: <div dir="rtl"><NavigationMenu label="القائمة"><NavigationMenuLink href="#home" current>الرئيسية</NavigationMenuLink><NavigationMenuLink href="#rooms">الغرف</NavigationMenuLink></NavigationMenu></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. The row wraps and the panel grows to the longest link.', render: <NavigationMenu label="Hauptmenü"><NavigationMenuLink href="#home" current>Startseite</NavigationMenuLink><NavigationMenuLink href="#settings">Einstellungen</NavigationMenuLink></NavigationMenu> },
  },
  behaviours: {
    states: [
      ['Default', 'The name in secondary ink.', 'A link, or a button with aria-expanded="false".'],
      ['Hover', 'The name inks to primary.', 'No change.'],
      ['Open', 'The key sinks into a well and its chevron points up.', 'aria-expanded="true".'],
      ['Current', 'An ink bar under the name and medium weight.', 'aria-current="page".'],
    ],
    interactions: [
      ['Pointer', 'Press a key', 'Opens its panel and closes any other. A press outside closes it.', 'native'],
      ['Keyboard', 'Left, Right, Home, End', 'Move between the names.', 'NavigationMenu: Left, Right, Home and End walk the top names and only one panel is open at a time'],
      ['Keyboard', 'Down, Escape', 'Down opens a panel on its first link and then walks the links. Escape closes it and returns focus to the key.', 'NavigationMenu: Down opens a panel on its first link and Escape closes it with focus back on the name'],
      ['Screen reader', 'Read', 'A navigation landmark; each key says whether it is expanded.', 'nav, aria-expanded'],
    ],
    loading: <p>NavigationMenu has no loading state.</p>,
    focus: <p>Tab reaches each name in turn. When a panel is open, Tab moves into its links, and moving focus out of the item closes the panel.</p>,
  },
  deepDive: { na: 'NavigationMenu has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'current',
      rules: <p>Mark the link for the page the person is on. It gets an ink bar and <code>aria-current="page"</code>. Mark one link at most.</p>,
      pair: { do: menu(), doNote: 'One current link, Home.', dont: <Unit><NavigationMenu label="Main"><NavigationMenuLink href="#a" current>Home</NavigationMenuLink><NavigationMenuLink href="#b" current>Rooms</NavigationMenuLink></NavigationMenu></Unit>, dontNote: 'Two current pages: the person cannot tell where they are.' },
    },
    {
      name: 'description',
      rules: <p>A short line under a link in a panel, in secondary ink. Use it when two links could be mistaken for each other.</p>,
      pair: {
        do: <Unit><Stack gap="sm"><NavigationMenu label="Main" defaultValue="plans"><NavigationMenuItem label="Heating" value="plans"><NavigationMenuGroup title="Schedules"><NavigationMenuLink href="#week" description="Set the week by day and hour.">Weekly plan</NavigationMenuLink></NavigationMenuGroup></NavigationMenuItem></NavigationMenu></Stack></Unit>, doNote: 'One short line that tells the links apart.',
        dont: <Unit><Stack gap="sm"><NavigationMenu label="Main" defaultValue="plans"><NavigationMenuItem label="Heating" value="plans"><NavigationMenuGroup title="Schedules"><NavigationMenuLink href="#week" description="Weekly plan">Weekly plan</NavigationMenuLink></NavigationMenuGroup></NavigationMenuItem></NavigationMenu></Stack></Unit>, dontNote: 'The line repeats the words above it.',
      },
    },
  ],
  related: [['/components/menu', 'Menu', 'Actions on one object.'], ['/components/tabs', 'Tabs', 'Switching views of the same page.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to this page.']],
  references: [
    { title: 'WAI-ARIA APG · Disclosure navigation menu', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/', why: 'The pattern this follows: buttons with aria-expanded that control lists of links.' },
    { title: 'WCAG 2.2 · 1.4.13 Content on Hover or Focus', url: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html', why: 'Why a panel opens on a press and not on hover.' },
  ],
};
