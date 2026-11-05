// Usage tab for Link (component-depth.md U1–U14). Link is a reference to somewhere else, in a sentence or on its own line.
import { Card, Link, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const LINK: Depth = {
  overview: (
    <>
      <p>Link sends a person to another page, another place on the page, or another site. It keeps the words of the sentence it stands in: same size, same line height, same ink. One thin rule under the words is what tells it from the text around it.</p>
      <p>A link that has been read steps one ink lighter. A link that leaves the app carries a small dot-matrix mark at its end and opens a new tab. For a router, pass your own link as the child with <code>asChild</code>.</p>
    </>
  ),
  whenToUse: ['To go somewhere: another page, a section, a file or another site.', 'To name a place inside a sentence, such as a rule or a manual.'],
  whenNot: [
    { situation: 'Doing something: saving, turning a lamp off, sending', to: '/components/button', label: 'Button' },
    { situation: 'Showing the path to the current page', to: '/components/breadcrumb', label: 'Breadcrumb' },
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
  ],
  variants: {
    inline: { purpose: 'Stands inside a sentence and takes its size and line height.', pairing: 'Body text, a help line under a field, a footnote.' },
    standalone: { purpose: 'Stands on its own line, 44px tall, with the rule under the words only.', pairing: 'The end of a unit, a list of destinations, a footer.' },
  },
  anatomy: {
    render: <Text>Read the <Link href="#manual" external>manual</Link> first.</Text>,
    parts: [
      { part: 'Words', selector: '[data-component="Link"]', what: 'The name of the place, in the ink and size of the sentence.' },
      { part: 'Rule', selector: '[data-component="Link"]', what: 'A hairline under the words that thickens one step on hover.' },
      { part: 'External mark', selector: '[data-component="Link"] svg', what: 'A dot-matrix glyph at the end, present only on a link that leaves the app.' },
    ],
    perVariant: 'The standalone variant is the same parts in a row 44px tall.',
  },
  sizes: { na: 'Link has no size of its own. It takes the size of the text around it, and a standalone link is 44px tall.' },
  emphasis: { na: 'A link is printing. Nothing in it is orange; the one orange part of a unit is its primary control.' },
  placement: {
    rows: [['Inside a sentence', 'Words of the sentence are the link text; nothing else is added.'], ['At the end of a unit', 'One standalone link on the inset line, below the content.'], ['In a footer', 'Standalone links, each on a line of its own.']],
    examples: [{ title: 'At the end of a unit', render: <Unit><Card header="Kitchen lamp"><Stack gap="sm"><Text>On at 18:00, off at 23:00.</Text><Link href="#schedule" variant="standalone">All schedules</Link></Stack></Card></Unit> }],
  },
  combinations: {
    good: [['Link + Text', 'The link is part of a sentence and reads as one.'], ['Link + Card', 'One standalone link at the end of a unit, below its content.']],
    avoid: [{ title: 'a link that acts like a key', why: 'A link that saves or switches something is a Button. A screen reader announces it as navigation.', render: <Unit><Link href="#save">Save changes</Link></Unit> }],
  },
  content: {
    formula: <p>Name the place, as in <em>heating rules</em>. Write the words of the destination and nothing about the click.</p>,
    pair: {
      do: <Text>Change the night level in <Link href="#rules">heating rules</Link>.</Text>, doNote: 'The link names the place.',
      dont: <Text>For heating rules, <Link href="#rules">click here</Link>.</Text>, dontNote: 'Click here means nothing out of context.',
    },
    overflow: { text: 'A long link wraps with its sentence and the rule follows each line.', render: <Unit><Text>See <Link href="#long">the schedule for the whole of the upstairs rooms in winter and summer</Link> for details.</Text></Unit> },
    rtl: { text: 'In right-to-left languages the external mark moves to the left end of the words.', render: <div dir="rtl"><Text>اقرأ <Link href="#manual" external externalLabel="يفتح في علامة تبويب جديدة">الدليل</Link> أولاً.</Text></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. A standalone link grows in width and keeps its height.', render: <Link href="#a" variant="standalone">Alle Heizungsregeln anzeigen</Link> },
  },
  behaviours: {
    states: [
      ['Rest', 'Ink words with a hairline rule.', 'A real link in the tab order.'],
      ['Hover', 'The rule thickens one step. Nothing moves.', 'None.'],
      ['Focus', 'The dark ring, offset from the words.', 'Shown for the keyboard only.'],
      ['Visited', 'One ink step lighter; the visited prop makes the rule dotted.', 'None. A link is not told as visited by a screen reader.'],
      ['External', 'A dot-matrix mark at the end.', 'The mark is named “Opens in a new tab”.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the link.', 'native'],
      ['Keyboard', 'Enter', 'Follows the link.', 'native'],
      ['Pointer', 'Click, or modifier-click', 'Follows the link, or opens it in a new tab, as the browser does for any anchor.', 'native'],
      ['Screen reader', 'Read', 'Announced as a link with its words; an external link adds “Opens in a new tab”.', 'a, img'],
    ],
    loading: <p>Link has no loading state. A link to a slow page is still a link; show the wait on the page it opens.</p>,
    focus: <p>The link takes the dark ring with a gap, so it clears the descenders of the words. Space does not follow a link; use a Button for that.</p>,
  },
  deepDive: {
    inline: {
      purpose: <p>The words of the sentence are the link. The line height of the paragraph is kept, so a link never makes a line taller, and the hit area is the words as in every sentence.</p>,
      context: <Text>Set the night level in <Link href="#rules">heating rules</Link>.</Text>,
      practices: ['Use the words that name the destination.', 'Keep it to a few words so the rule does not run across the line.'],
      pair: { do: <Text>Open the <Link href="#manual">manual</Link>.</Text>, doNote: 'Short, and a noun.', dont: <Text><Link href="#manual">Open the manual to read how to set the night level</Link>.</Text>, dontNote: 'A whole sentence underlined.' },
    },
    standalone: {
      purpose: <p>A link with a line to itself. It is 44px tall, so a thumb can hit it, and the rule runs under the words only.</p>,
      context: <Link href="#all" variant="standalone">All lamps</Link>,
      practices: ['Put one at the end of a unit.', 'Stack them with a Stack when there are several.'],
      pair: { do: <Link href="#all" variant="standalone">All lamps</Link>, doNote: 'On its own line.', dont: <Text>Go to <Link href="#all" variant="standalone">all lamps</Link> now.</Text>, dontNote: 'A tall row inside a sentence breaks the line.' },
    },
  },
  modifiers: [
    {
      name: 'external',
      rules: <p>Set it when the link leaves the app. It adds the mark, opens a new tab with <code>rel=&quot;noopener noreferrer&quot;</code> and announces the new tab. Your own <code>target</code> and <code>rel</code> win.</p>,
      pair: { do: <Text>Read the <Link href="#manual" external>vendor manual</Link>.</Text>, doNote: 'The mark tells the person before they press.', dont: <Text>Read the <Link href="#manual">vendor manual</Link>.</Text>, dontNote: 'A new site with no warning, if it opens elsewhere.' },
    },
    {
      name: 'visited',
      rules: <p>Set it for a link the person has already been to. Browsers step the ink for visited URLs on their own but cannot change the rule, so a router sets this prop to get the dotted rule too.</p>,
      pair: { do: <Text>You read <Link href="#manual" visited>the manual</Link>.</Text>, doNote: 'Lighter ink and a dotted rule.', dont: <Text>You read <Link href="#manual" style={{ textDecoration: 'none' }}>the manual</Link>.</Text>, dontNote: 'Taking the rule away leaves colour alone to tell it.' },
    },
    {
      name: 'asChild',
      rules: <p>Pass your router&apos;s link as the one child. It receives the classes, the mark and the data attributes, and keeps its own navigation.</p>,
      pair: { do: <Link asChild><a href="#route" onClick={(e) => e.preventDefault()}>Rooms</a></Link>, doNote: 'The child stays the router link.', dont: <Link href="#route" onClick={(e) => e.preventDefault()}>Rooms</Link>, dontNote: 'A plain anchor reloads the page in a single-page app.' },
    },
  ],
  related: [['/components/button', 'Button', 'Doing something instead of going somewhere.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to the current page.'], ['/components/tabs', 'Tabs', 'Switching between views.']],
  references: [
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the rule under a link is there.' },
    { title: 'WCAG 2.2 · 2.4.4 Link Purpose (In Context)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html', why: 'Why the words name the destination.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why a standalone link is 44px and an inline one is exempt.' },
  ],
};
