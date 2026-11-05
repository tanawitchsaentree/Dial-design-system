// Usage tab for Anchor (component-depth.md U1–U14). Anchor is the "on this page" list of a long page.
import { Anchor } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const flat = [
  { id: 'dp-overview', label: 'Overview' },
  { id: 'dp-wiring', label: 'Wiring' },
  { id: 'dp-schedules', label: 'Schedules' },
];
const nested = [
  { id: 'dp-overview', label: 'Overview' },
  { id: 'dp-wiring', label: 'Wiring', items: [{ id: 'dp-hub', label: 'Hub' }, { id: 'dp-sensors', label: 'Sensors' }] },
  { id: 'dp-schedules', label: 'Schedules' },
];

export const ANCHOR: Depth = {
  overview: (
    <>
      <p>Anchor is the “on this page” list of a long page, such as a manual with Overview, Wiring and Schedules. Each heading is a small word in one column, and the section in view carries one short ink mark beside it.</p>
      <p>It follows the page by itself, so the mark moves as the person scrolls. Pressing a word goes to that heading. The list never changes the page, and it is not orange.</p>
    </>
  ),
  whenToUse: ['To jump around a page with four or more headings.', 'To show which section of a long page is in view.'],
  whenNot: [
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Showing the path to this page', to: '/components/breadcrumb', label: 'Breadcrumb' },
  ],
  variants: { na: 'Anchor has one look, a column of heading words. Nesting and the current section are data, covered under Modifiers.' },
  anatomy: {
    render: <Unit><div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={nested} defaultValue="dp-wiring" /></div></Unit>,
    parts: [
      { part: 'Landmark', selector: 'nav[data-component="Anchor"]', what: 'A nav with a name, so assistive tech lists it among the page’s regions.' },
      { part: 'Link', selector: 'nav[data-component="Anchor"] a', what: 'One heading, a 44px row that goes to it when pressed.' },
      { part: 'Index mark', selector: 'nav[data-component="Anchor"] a > span:first-child', what: 'A short ink bar in the gutter, shown only beside the section in view.' },
      { part: 'Sub-list', selector: 'nav[data-component="Anchor"] ul ul', what: 'The sub-headings of one heading, one module in.' },
    ],
  },
  sizes: { na: 'Anchor has one size. Each row is 44px tall, the height of a control.' },
  emphasis: { na: 'The section in view is told by full ink, medium weight and the index mark. Nothing in an Anchor is orange.' },
  placement: {
    rows: [['Beside a long page', 'Stand it in a column next to the text, and keep it in view while the page scrolls.'], ['Four to twelve headings', 'Fewer and the page does not need it; more and the list scrolls on its own.']],
    examples: [{ title: 'In a narrow column', render: <Unit><div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={flat} defaultValue="dp-overview" /></div></Unit> }],
  },
  combinations: {
    good: [['Anchor + Breadcrumb', 'The breadcrumb says where the page is; the Anchor says where you are in it.'], ['Anchor + Card', 'Stand the list in a Card beside the text of a manual.']],
    avoid: [{ title: 'an Anchor of two headings', why: 'Two rows need no map. Print them as two headings.', render: <Unit><div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={flat.slice(0, 2)} /></div></Unit> }],
  },
  content: {
    formula: <p>Use the heading’s own words. Keep each one to a noun or two, as in <em>Wiring</em> or <em>Night schedule</em>, so the row stays on one line.</p>,
    pair: {
      do: <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={[{ id: 'a1', label: 'Wiring' }]} /></div>, doNote: 'The heading’s own noun.',
      dont: <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={[{ id: 'a2', label: 'Click here to read about how the wiring works' }]} /></div>, dontNote: 'A sentence where the heading has a noun.',
    },
    overflow: { text: 'A long heading wraps inside its row. The gutter and the mark stay where they are.', render: <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={[{ id: 'o1', label: 'Configuration of the heating schedule for the upstairs rooms' }, { id: 'o2', label: 'Reset' }]} defaultValue="o1" /></div> },
    rtl: { text: 'In right-to-left languages the gutter sits on the right and sub-headings step in from the right.', render: <div dir="rtl" style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={[{ id: 'r1', label: 'عام', items: [{ id: 'r2', label: 'الإعدادات' }] }]} defaultValue="r1" /></div> },
    expansion: { text: 'German and Finnish headings can run 30% longer. They wrap and the marks do not move.', render: <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={[{ id: 'e1', label: 'Allgemeine Einstellungen' }, { id: 'e2', label: 'Konfiguration' }]} defaultValue="e1" /></div> },
  },
  behaviours: {
    states: [
      ['Waiting', 'The word in secondary ink, the gutter empty.', 'A plain link.'],
      ['Hover', 'The word darkens one ink step.', 'Nothing moves.'],
      ['Current', 'Full ink, medium weight and the index mark.', 'Announced with aria-current="location".'],
      ['Focus', 'The dark ring around the row.', 'The link’s own name is read.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the next link. One Tab stop for each heading.', 'native'],
      ['Keyboard', 'Enter', 'Goes to the heading and marks it current.', 'native'],
      ['Pointer', 'Press', 'Goes to the heading and marks it current.', 'native'],
      ['Scroll', 'Scroll the page', 'The mark moves to the last heading that has passed the upper third of the page.', 'IntersectionObserver'],
    ],
    loading: <p>Anchor has no loading state. Pass the items once the headings are on the page.</p>,
    focus: <p>Pressing a link moves the page to the heading through the browser’s own fragment navigation. Focus stays on the link.</p>,
  },
  deepDive: { na: 'Anchor has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'items',
      rules: <p>Each item is an <code>id</code> and a <code>label</code>. Put sub-headings in an item’s <code>items</code>, one level deep or two. Every <code>id</code> must be the id of a heading on the page.</p>,
      pair: { do: <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={nested} defaultValue="dp-hub" /></div>, doNote: 'Hub and Sensors sit under Wiring.', dont: <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor items={[{ id: 'm1', label: 'Wiring', items: [{ id: 'm2', label: 'Hub', items: [{ id: 'm3', label: 'Pins', items: [{ id: 'm4', label: 'Pin 4' }] }] }] }]} /></div>, dontNote: 'Four levels: the column runs out of width.' },
    },
    {
      name: 'offset',
      rules: <p>Pass the height in pixels of anything fixed to the top of the scrolling area. A heading counts as reached once it clears that height. Set <code>scroll-margin-block-start</code> on the headings to the same height so a press lands below it.</p>,
      pair: { do: <p className="flush">A 44px header, <code>offset={'{44}'}</code>.</p>, doNote: 'The offset matches the bar.', dont: <p className="flush">A 44px header, no offset.</p>, dontNote: 'The mark runs one heading behind.' },
    },
    {
      name: 'value',
      rules: <p>Leave <code>value</code> out and the list follows the page. Pass <code>value</code> with <code>onValueChange</code> when something else needs to know the current section, such as a title.</p>,
      pair: { do: <p className="flush"><code>value</code> and <code>onValueChange</code> together.</p>, doNote: 'The page owns the value.', dont: <p className="flush"><code>value</code> alone.</p>, dontNote: 'The mark never moves.' },
    },
  ],
  related: [['/components/breadcrumb', 'Breadcrumb', 'The path to this page.'], ['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/link', 'Link', 'A single link.']],
  references: [
    { title: 'WAI-ARIA · aria-current', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-current', why: 'How the current section is announced.' },
    { title: 'MDN · IntersectionObserver', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API', why: 'How the list follows the page.' },
    { title: 'WCAG 2.2 · 2.4.1 Bypass Blocks', url: 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html', why: 'Why a long page needs links to its sections.' },
  ],
};
