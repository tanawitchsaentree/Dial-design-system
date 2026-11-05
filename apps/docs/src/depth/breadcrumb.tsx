// Usage tab for Breadcrumb (component-depth.md U1–U14). Breadcrumb prints the path to the current page.
import { Breadcrumb, Card, Crumb, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const path = (fold: 'auto' | 'always' | 'never' = 'auto') => (
  <Breadcrumb fold={fold}>
    <Crumb href="#home">Home</Crumb>
    <Crumb href="#living-room">Living room</Crumb>
    <Crumb href="#lamps">Lamps</Crumb>
    <Crumb>Kitchen lamp</Crumb>
  </Breadcrumb>
);

export const BREADCRUMB: Depth = {
  overview: (
    <>
      <p>Breadcrumb prints where the current page sits: Home, then Living room, then Lamps, then the lamp itself. Each level above the page is a link back up. The names are joined by short runs of dots.</p>
      <p>The page you are on is plain text with a short ink bar under it. When the unit is too narrow, the middle levels fold into one key with three dots, and pressing it prints them all back.</p>
    </>
  ),
  whenToUse: ['To show the place of a page in a tree of three or more levels.', 'To give a way back up the tree without a Back key.'],
  whenNot: [
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Naming the sections of one long form', to: '/components/stepper', label: 'Stepper' },
  ],
  variants: { na: 'Breadcrumb has one look, a row of names with dotted leaders. How it folds is the fold prop, covered under Modifiers.' },
  anatomy: {
    render: path('never'),
    parts: [
      { part: 'Link', selector: '[data-component="Breadcrumb"] li > a', what: 'A level above the page, in secondary ink, 44px tall.' },
      { part: 'Leader', selector: '[data-component="Breadcrumb"] li > span:first-child', what: 'A short run of dots between two names.' },
      { part: 'Current page', selector: '[data-component="Breadcrumb"] [aria-current="page"]', what: 'The page you are on, plain text with an ink bar under it.' },
    ],
  },
  sizes: { na: 'Breadcrumb has one size. Each level is 44px tall to match the row of keys around it.' },
  emphasis: { na: 'Breadcrumb is printing. The current page is told by a bar and nothing in it is orange.' },
  placement: {
    rows: [['Above the title of a unit', 'The path stands on the inset line, the title right under it.'], ['At the top of a page', 'One path per page, before the title.']],
    examples: [{ title: 'Above a unit’s title', render: <Unit><Card header={<Stack gap="sm">{path()}</Stack>}>Kitchen lamp</Card></Unit> }],
  },
  combinations: {
    good: [['Breadcrumb + Heading', 'The path stands above the heading and the last level repeats its words.'], ['Breadcrumb + Card', 'Put the path in the header of a unit that is a page of its own.']],
    avoid: [{ title: 'a path of two levels', why: 'A single link up is a Back key. Print a Button instead.', render: <Unit><Breadcrumb><Crumb href="#home">Home</Crumb><Crumb>Lamps</Crumb></Breadcrumb></Unit> }],
  },
  content: {
    formula: <p>Name each level with the same noun its page uses as a title, as in <em>Lamps</em>. Do not add the word “page” or an arrow.</p>,
    pair: {
      do: <Breadcrumb><Crumb href="#home">Home</Crumb><Crumb href="#lamps">Lamps</Crumb><Crumb>Kitchen lamp</Crumb></Breadcrumb>, doNote: 'Nouns that match the page titles.',
      dont: <Breadcrumb><Crumb href="#home">Go to home page</Crumb><Crumb href="#lamps">Lamps &gt;</Crumb><Crumb>Kitchen lamp</Crumb></Breadcrumb>, dontNote: 'A sentence, and an arrow the leaders already draw.',
    },
    overflow: { text: 'A long last name wraps inside its own level when the path is folded. The first level and the key stay in place.', render: <Unit><Breadcrumb fold="always"><Crumb href="#home">Home</Crumb><Crumb href="#a">Upstairs</Crumb><Crumb>Heating schedule for the whole of the upstairs rooms</Crumb></Breadcrumb></Unit> },
    rtl: { text: 'In right-to-left languages the path starts on the right and the leaders follow it.', render: <div dir="rtl"><Breadcrumb label="مسار الصفحة"><Crumb href="#home">الرئيسية</Crumb><Crumb href="#lamps">المصابيح</Crumb><Crumb>مصباح المطبخ</Crumb></Breadcrumb></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. The path folds sooner and the names do not shrink.', render: <Breadcrumb><Crumb href="#home">Startseite</Crumb><Crumb href="#w">Wohnzimmer</Crumb><Crumb>Küchenlampe</Crumb></Breadcrumb> },
  },
  behaviours: {
    states: [
      ['Link', 'Secondary ink, one step darker on hover.', 'A real link in the tab order.'],
      ['Current page', 'Primary ink, medium weight, an ink bar under it.', 'Announced with aria-current="page"; not a link.'],
      ['Folded', 'The middle levels are out of the row and one key with three dots stands in their place.', 'The key is named “Show full path” and is a button.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the links and the folded key in order.', 'native'],
      ['Keyboard', 'Enter or Space', 'On the folded key, prints every level back and moves focus to the first one.', 'button'],
      ['Screen reader', 'Read', 'A navigation landmark named Breadcrumb that holds an ordered list.', 'nav, ol, aria-current'],
    ],
    loading: <p>Breadcrumb has no loading state. Render it when the path is known.</p>,
    focus: <p>Each link and the folded key take the dark focus ring. When the folded key is pressed it leaves the row, so focus moves to the first level it printed back.</p>,
  },
  deepDive: { na: 'Breadcrumb has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'fold',
      rules: <p><code>auto</code> folds the middle levels only when the path does not fit its unit. <code>always</code> folds whenever there are three levels or more. <code>never</code> lets the row wrap.</p>,
      pair: { do: path('auto'), doNote: 'Auto folds only when it has to.', dont: path('never'), dontNote: 'Never on a narrow unit makes a path that wraps to three lines.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/stepper', 'Stepper', 'Naming the sections of one form.'], ['/components/card', 'Card', 'A unit that can hold the path.']],
  references: [
    { title: 'WAI-ARIA APG · Breadcrumb pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/', why: 'The nav landmark, the ordered list and aria-current="page".' },
    { title: 'WCAG 2.2 · 2.4.8 Location', url: 'https://www.w3.org/WAI/WCAG22/Understanding/location.html', why: 'Why a person should be able to tell where a page sits.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'The size of each link and the folded key.' },
  ],
};
