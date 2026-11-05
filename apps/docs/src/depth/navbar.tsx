// Usage tab for Navbar (component-depth.md U1–U14). Navbar is the strip of printing along the top of a product.
import { Button, Navbar, NavbarLink } from 'dial-react';
import type { Depth } from './types';

const links = (current = 0) =>
  ['Rooms', 'Schedules', 'Devices', 'Help'].map((w, i) => <NavbarLink key={w} href={`#${w.toLowerCase()}`} current={i === current}>{w}</NavbarLink>);
const bar = (props: Partial<React.ComponentProps<typeof Navbar>> = {}) => (
  <Navbar brand="dial" actions={<Button>Sign in</Button>} {...props}>{links()}</Navbar>
);

export const NAVBAR: Depth = {
  overview: (
    <>
      <p>Navbar is the bar along the top of a product. The model name stands at the inline start, the places of the product stand in the middle as printed words, and the keys, such as Sign in, stand at the inline end. The place you are on has an ink dot before it and is printed in the medium weight.</p>
      <p>When the places do not fit the width, they fold behind one Menu key. The bar never wraps to a second line.</p>
    </>
  ),
  whenToUse: ['To move between the top-level places of a product.', 'To keep the model name and the main keys on every screen.', 'To hold the one primary key of a screen, such as Add device.'],
  whenNot: [
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Showing where a page sits in a path', to: '/components/breadcrumb', label: 'Breadcrumb' },
    { situation: 'Opening a list of actions', to: '/components/menu', label: 'Menu' },
  ],
  variants: { na: 'Navbar has one look, a strip of body plastic with printed words. How it folds, always, never or when needed, is covered under Modifiers.' },
  anatomy: {
    render: bar(),
    parts: [
      { part: 'Bar', selector: 'header[data-component="Navbar"]', what: 'Body plastic with the unit elevation and a 28px radius that nests the round Menu key.' },
      { part: 'Model name', selector: 'header[data-component="Navbar"] > div:first-child', what: 'Printed on the inset line in the emphasis size and the medium weight.' },
      { part: 'Legend', selector: 'header[data-component="Navbar"] > nav', what: 'The places in one row. Each is at least 44px tall.' },
      { part: 'Ink dot', selector: 'header[data-component="Navbar"] a[aria-current="page"] span:first-child', what: 'Drawn before every word and filled on the current page.' },
      { part: 'Keys', selector: 'header[data-component="Navbar"] > div:last-child', what: 'Your actions at the inline end, and the Menu key when the legend folds.' },
    ],
  },
  sizes: { na: 'Navbar has one size. The bar is 56px tall: a 44px key and a 6px inset on each side.' },
  emphasis: { na: 'Nothing in a Navbar is orange. A primary Button in the actions slot is the screen’s one orange key.' },
  placement: {
    rows: [['The top of every screen', 'The bar spans the width of its container and stays in the same place from page to page.'], ['A long page', 'Set sticky so the bar holds the top edge. It stays matte and keeps its elevation.']],
    examples: [{ title: 'At the top of a screen', render: <div className="demo-box demo-card">{bar()}</div> }],
  },
  combinations: {
    good: [['Navbar + Button', 'Sign in or Add device at the inline end. Only one of them is primary.'], ['Navbar + Drawer', 'Pass onMenuPress to open your own Drawer from the Menu key.']],
    avoid: [{ title: 'a Navbar of tabs', why: 'Links that switch views on one page are Tabs. A Navbar goes to other pages.', render: <div className="demo-box demo-card"><Navbar brand="dial" collapse="never"><NavbarLink href="#overview" current>Overview</NavbarLink><NavbarLink href="#activity">Activity</NavbarLink></Navbar></div> }],
  },
  content: {
    formula: <p>Name each place with one noun, as in <em>Rooms</em> or <em>Devices</em>. Print the model name in lowercase and keep it to a word.</p>,
    pair: {
      do: bar(), doNote: 'One noun per place, the model name in lowercase.',
      dont: <Navbar brand="DIAL SMART HOME" collapse="never"><NavbarLink href="#a" current>Go to your rooms now</NavbarLink><NavbarLink href="#b">See everything</NavbarLink></Navbar>, dontNote: 'Shouted name and sentences instead of nouns.',
    },
    overflow: { text: 'When the places do not fit, the legend folds behind the Menu key. The bar stays one line.', render: <div style={{ inlineSize: 'var(--ds-layout-frame-xs)' }}>{bar()}</div> },
    rtl: { text: 'In right-to-left languages the model name sits on the right, the keys on the left, and the dot stays before each word.', render: <div dir="rtl"><Navbar brand="dial" collapse="never"><NavbarLink href="#a" current>الغرف</NavbarLink><NavbarLink href="#b">الأجهزة</NavbarLink></Navbar></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The bar folds sooner and each word keeps its width.', render: <Navbar brand="dial" collapse="never"><NavbarLink href="#a" current>Einstellungen</NavbarLink><NavbarLink href="#b">Zeitpläne</NavbarLink></Navbar> },
  },
  behaviours: {
    states: [
      ['Rest', 'A link in secondary ink, with an empty dot before it.', 'A link in a navigation landmark.'],
      ['Hover', 'The ink steps to primary. Nothing lifts.', 'No change.'],
      ['Focus', 'A 2px ring around the link.', 'The link is read by its words.'],
      ['Current', 'Primary ink, medium weight and a filled dot.', 'Announced with aria-current="page".'],
      ['Folded', 'The legend leaves the row and the Menu key appears.', 'The key says it opens a dialog and whether it is open.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the model name, the links and the keys in order.', 'native'],
      ['Keyboard', 'Enter', 'Follows a link or presses the Menu key.', 'native'],
      ['Keyboard', 'Escape', 'Closes the Menu panel and returns focus to the Menu key.', 'Popover'],
      ['Pointer', 'Press a link in the panel', 'Follows the link and closes the panel.', 'onClick'],
      ['Screen reader', 'Read', 'A navigation landmark named Main; the current page is announced.', 'nav, aria-current'],
    ],
    loading: <p>Navbar has no loading state.</p>,
    focus: <p>Focus is never moved by the bar. In the Menu panel it moves to the first link on open and returns to the Menu key on close.</p>,
  },
  deepDive: { na: 'Navbar has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'collapse',
      rules: <p><code>auto</code> (default) folds the places behind the Menu key only when they do not fit. <code>always</code> folds at every width and <code>never</code> keeps them in the row. Use <code>never</code> only for two or three short places.</p>,
      pair: { do: bar(), doNote: 'Auto: the places stay in the row while they fit.', dont: <Navbar brand="dial" collapse="never">{links()}{links(1)}</Navbar>, dontNote: 'Never with too many places: the bar runs off its container.' },
    },
    {
      name: 'sticky',
      rules: <p>Set <code>sticky</code> on a long page so the bar holds the top edge. The bar stays matte with the same elevation, because glass belongs to the small parts a finger moves.</p>,
      pair: { do: bar({ sticky: true }), doNote: 'Sticky on a long page.', dont: bar({ sticky: true, className: undefined }), dontNote: 'A sticky bar in a short preview adds nothing.' },
    },
    {
      name: 'onMenuPress',
      rules: <p>Give <code>onMenuPress</code> to open your own Drawer from the Menu key, and <code>menuOpen</code> so the key announces it. Without it the Menu key opens the links in a panel.</p>,
      pair: { do: <Navbar brand="dial" collapse="always" onMenuPress={() => undefined} menuOpen={false}>{links()}</Navbar>, doNote: 'Your Drawer holds the links.', dont: <Navbar brand="dial" collapse="always">{links()}</Navbar>, dontNote: 'For a long menu with many groups the built-in panel is small.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching between views of one page.'], ['/components/breadcrumb', 'Breadcrumb', 'Where a page sits in a path.'], ['/components/drawer', 'Drawer', 'A side panel for a long menu.'], ['/components/popover', 'Popover', 'The panel behind the Menu key.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Disclosure navigation menu', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/', why: 'How a nav of links and a folded menu key are announced.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the current page is told by a dot and weight, not colour alone.' },
    { title: 'Carbon Design System · UI shell header', url: 'https://carbondesignsystem.com/components/UI-shell-header/usage/', why: 'A reference for the brand, links and actions slots.' },
  ],
};
