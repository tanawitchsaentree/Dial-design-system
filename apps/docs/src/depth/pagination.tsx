// Usage tab for Pagination (component-depth.md U1–U14). Pagination turns the pages of a long list.
import { Pagination, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const PAGINATION: Depth = {
  overview: (
    <>
      <p>Pagination turns the pages of a long list, such as the event log of a heater. Two round keys step back and forward, and the page numbers stand printed between them. The page you are on carries a short ink bar.</p>
      <p>When there are more pages than fit, the middle folds into three dots. The row keeps the same number of places on every page, so the keys do not move under your finger.</p>
    </>
  ),
  whenToUse: ['To split a list or a table of more than one screen into numbered pages.', 'When people need to jump to a page, not only to the next one.'],
  whenNot: [
    { situation: 'Moving between a few views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Showing the path to this page', to: '/components/breadcrumb', label: 'Breadcrumb' },
    { situation: 'Numbering the sections of a form', to: '/components/stepper', label: 'Stepper' },
  ],
  variants: { na: 'Pagination has one look: numbers between two keys. How much of the range shows is set with siblings and boundary, covered under Modifiers.' },
  anatomy: {
    render: <Pagination count={12} defaultPage={6} />,
    parts: [
      { part: 'Previous and next keys', selector: '[data-component="Pagination"] li:first-child > *, [data-component="Pagination"] li:last-child > *', what: 'Two round 44px keys with a dotted arrow. Each goes flat at its end of the range.' },
      { part: 'Page number', selector: '[data-component="Pagination"] li > [data-current]', what: 'A printed number, 44px wide at least. The current one is medium weight with an ink bar under it.' },
      { part: 'Gap', selector: '[data-component="Pagination"] li[aria-hidden="true"]', what: 'Three printed dots where pages are folded away.' },
    ],
  },
  sizes: { na: 'Pagination has one size. Every number and key is 44px tall.' },
  emphasis: { na: 'The current page is told by the ink bar and weight. Nothing in Pagination is orange.' },
  placement: {
    rows: [['Under the list it pages', 'Stand it at the end of the list, on the unit’s inset line.'], ['One per list', 'Two paginations for one list make people ask which one is real.']],
    examples: [{ title: 'Under an event log', render: <Unit><Stack gap="lg"><p>Events 21 to 30 of 84</p><Pagination count={9} defaultPage={3} /></Stack></Unit> }],
  },
  combinations: {
    good: [['Pagination + List', 'The list shows one page, and the count of items sits above the row.'], ['Pagination + Text', 'A line such as “Events 21 to 30 of 84” names the slice on show.']],
    avoid: [{ title: 'a Pagination of one page', why: 'There is nothing to turn. Hide it when the list fits on one page.', render: <Unit><Pagination count={1} /></Unit> }],
  },
  content: {
    formula: <p>The numbers are the content. Name the landmark for what it pages, as in <em>Event log pages</em>, when a screen has more than one.</p>,
    pair: {
      do: <Pagination count={8} defaultPage={2} label="Event log pages" />, doNote: 'The landmark names what it pages.',
      dont: <Pagination count={1} defaultPage={1} />, dontNote: 'One page, nothing to turn.',
    },
    overflow: { text: 'A long range folds into gaps. The row stays seven places wide with the defaults, so it fits a phone.', render: <Pagination count={500} defaultPage={250} /> },
    rtl: { text: 'In right-to-left languages the row runs right to left, and the previous key stands on the right.', render: <div dir="rtl"><Pagination count={12} defaultPage={6} label="الصفحات" previousLabel="الصفحة السابقة" nextLabel="الصفحة التالية" pageLabel={(n) => `صفحة ${n}`} /></div> },
    expansion: { text: 'Numbers have no words to grow. Only the names of the landmark and the keys change length, and they are not printed.', render: <Pagination count={12} defaultPage={6} label="Seitenzahlen" previousLabel="Vorherige Seite" nextLabel="Nächste Seite" pageLabel={(n) => `Seite ${n}`} /> },
  },
  behaviours: {
    states: [
      ['Page', 'A printed number in secondary ink; it darkens one step on hover.', 'Named “Page 4”.'],
      ['Current', 'Primary ink, medium weight and an ink bar.', 'Announced with aria-current="page".'],
      ['Key at the end', 'Flat, no shadow and faded.', 'Announced as dimmed (aria-disabled).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the keys and numbers in order.', 'native'],
      ['Keyboard', 'Enter or Space', 'Goes to the page. On a link, Enter follows it.', 'native'],
      ['Pointer', 'Press a number or key', 'Goes to that page, or one step.', 'onPageChange'],
    ],
    loading: <p>Pagination has no loading state. While the next page loads, keep the row as it is and show the loading state on the list.</p>,
    focus: <p>Focus stays on the number or key you pressed. When a key goes flat because you reached the end, focus moves to the current number so keyboard users are not left on a dead key.</p>,
  },
  deepDive: { na: 'Pagination has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'siblings and boundary',
      rules: <p><code>siblings</code> is how many numbers stand each side of the current page (default 1). <code>boundary</code> is how many stand at each end (default 1). The row keeps the same number of places once the range is long.</p>,
      pair: { do: <Pagination count={40} defaultPage={20} siblings={2} boundary={2} />, doNote: 'Two each side and two at the ends: a wider reach for a long log.', dont: <Pagination count={40} defaultPage={20} siblings={6} boundary={4} />, dontNote: 'Twenty-three places do not fit a phone.' },
    },
    {
      name: 'getHref',
      rules: <p>Pass <code>getHref</code> to print the pages as real links, one address per page. Without it the pages are buttons that call <code>onPageChange</code>.</p>,
      pair: { do: <Pagination count={9} defaultPage={4} getHref={(p) => `#page-${p}`} />, doNote: 'Each page has an address that can be shared.', dont: <Pagination count={9} defaultPage={4} />, dontNote: 'Buttons only, when the list is addressable.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to this page.'], ['/components/stepper', 'Stepper', 'Numbering form sections.']],
  references: [
    { title: 'WAI-ARIA · aria-current', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-current', why: 'How the current page is announced.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why every number is at least 44px.' },
    { title: 'GOV.UK Design System · Pagination', url: 'https://design-system.service.gov.uk/components/pagination/', why: 'Numbered pages with gaps for a long range.' },
  ],
};
