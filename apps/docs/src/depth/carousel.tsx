// Usage tab for Carousel (component-depth.md U1–U14). Carousel pages through a few slides, one at a time.
import { Carousel, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const Frame = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div>;
const rooms = (label = 'Rooms') => (
  <Frame>
    <Carousel label={label}>
      <Text>Living room, 21 degrees</Text>
      <Text>Kitchen, washer running</Text>
      <Text>Bedroom, door closed</Text>
    </Carousel>
  </Frame>
);

export const CAROUSEL: Depth = {
  overview: (
    <>
      <p>Carousel pages through a few slides, such as the rooms of a home or the steps of a manual. One slide shows at a time in a recessed window. A row of holes under it says which slide it is, and a round key each side steps back and forward.</p>
      <p>It never moves by itself. The track scrolls only after a key, a swipe or an arrow key, and it always lands on a slide.</p>
    </>
  ),
  whenToUse: ['To show three to eight slides of the same shape, one at a time, in a narrow column.', 'To let a person page through a gallery or a short manual on a phone, by swipe or by key.'],
  whenNot: [
    { situation: 'Switching between views that each hold a section of the page', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Turning the pages of a long list', to: '/components/pagination', label: 'Pagination' },
    { situation: 'Numbering the sections of a long form', to: '/components/stepper', label: 'Stepper' },
  ],
  variants: { na: 'Carousel has one look: a window, a strip of key, holes and key. Nothing else varies.' },
  anatomy: {
    render: rooms(),
    parts: [
      { part: 'Window', selector: '[data-component="Carousel"] > div:first-child', what: 'A recessed frame that clips the track.' },
      { part: 'Slide', selector: '[data-component="CarouselSlide"]', what: 'One slide, a group named “n of N”, as wide as the window.' },
      { part: 'Keys', selector: '[data-component="Carousel"] > div:nth-child(2) > button', what: 'Previous and next, 44px round keys.' },
      { part: 'Holes', selector: '[data-component="Carousel"] > div:nth-child(2) > div', what: 'One hole per slide; the lit one is the slide on show.' },
    ],
  },
  sizes: { na: 'Carousel has one size. It fills the width of its column, and the keys are 44px.' },
  emphasis: { na: 'Nothing in a Carousel is orange. The lit hole is ink, so the unit keeps its one orange for its primary key.' },
  placement: {
    rows: [['A narrow column', 'Give the Carousel the width of the column and let each slide fill it.'], ['Inside a unit', 'Put it in the body of a card or sheet, with the unit’s orange key after it.']],
    examples: [{ title: 'In a unit', render: <Unit>{rooms()}</Unit> }],
  },
  combinations: {
    good: [['Carousel + Card', 'Each slide can hold a small card of its own.'], ['Carousel + Text', 'A caption under each slide’s image.']],
    avoid: [{ title: 'a Carousel of one slide', why: 'Both keys are flat and the row has one hole. Show the slide on its own.', render: <Frame><Carousel label="Rooms"><Text>Living room</Text></Carousel></Frame> }],
  },
  content: {
    formula: <p>Give the Carousel a <code>label</code> that names what the slides are, such as <em>Rooms</em>. The slides are read as “1 of 5”, so do not number them in their own text.</p>,
    pair: {
      do: rooms('Rooms'), doNote: 'A plural noun names the set.',
      dont: <Frame><Carousel label="Carousel"><Text>1. Living room</Text><Text>2. Kitchen</Text></Carousel></Frame>, dontNote: 'The default name says nothing and the numbers are read twice.',
    },
    overflow: { text: 'A long slide wraps inside the window. Keep the slides about the same height, because the window takes the height of the tallest.', render: <Frame><Carousel label="Notes"><Text>Set the heating schedule for the whole of the upstairs rooms before the first frost of the year.</Text><Text>Short note.</Text></Carousel></Frame> },
    rtl: { text: 'In right-to-left languages the track runs from the right, the previous key sits on the right and the chevrons mirror.', render: <div dir="rtl"><Frame><Carousel label="الغرف" previousLabel="السابق" nextLabel="التالي"><Text>غرفة المعيشة</Text><Text>المطبخ</Text></Carousel></Frame></div> },
    expansion: { text: 'German and Finnish text can run 30% longer. It wraps in the slide and the keys do not move.', render: <Frame><Carousel label="Räume"><Text>Wohnzimmer mit Heizungssteuerung</Text><Text>Küche</Text></Carousel></Frame> },
  },
  behaviours: {
    states: [
      ['First slide', 'The previous key is flat and faded.', 'The previous key is disabled.'],
      ['Last slide', 'The next key is flat and faded.', 'The next key is disabled.'],
      ['Lit hole', 'The slide on show has a larger, solid hole.', 'The position is read as “Slide 2 of 5”.'],
      ['Focus', 'The window takes the dark ring when it holds focus.', 'Named by the label of the carousel.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the window, then to the previous and next keys.', 'native'],
      ['Keyboard', 'Arrow keys, Home, End', 'With the window focused, the arrows step one slide, Home goes to the first and End to the last.', 'Carousel: the arrow keys step the slide and the end keys go flat'],
      ['Touch', 'Swipe', 'The track scrolls and snaps to a slide.', 'scroll-snap'],
      ['Screen reader', 'Read', 'A carousel region of slides, each a group named “n of N”; the position is announced politely when it changes.', 'aria-roledescription'],
    ],
    loading: <p>Carousel has no loading state. Render the slides you have and add the rest when they arrive.</p>,
    focus: <p>Tab reaches the window first. Press an arrow key there to step. When a key goes flat because you reached the end, focus passes to the other key.</p>,
  },
  deepDive: { na: 'Carousel has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'index',
      rules: <p>Pass <code>index</code> with <code>onIndexChange</code> to hold the slide yourself. Leave it out and use <code>defaultIndex</code> and the Carousel keeps its own place.</p>,
      pair: { do: rooms(), doNote: 'Uncontrolled: the Carousel keeps its place.', dont: <Frame><Carousel label="Rooms" index={1}><Text>Living room</Text><Text>Kitchen</Text></Carousel></Frame>, dontNote: 'index without onIndexChange: a swipe lands, but the page is never told.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/pagination', 'Pagination', 'Turning the pages of a long list.'], ['/components/stepper', 'Stepper', 'Numbered sections of a form.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Carousel pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/carousel/', why: 'The roles, the slide names and why nothing advances by itself.' },
    { title: 'WCAG 2.2 · 2.2.2 Pause, Stop, Hide', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html', why: 'Why moving content needs a way to stop, and why this one never starts.' },
    { title: 'MDN · CSS scroll snap', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap', why: 'The native snapping the track is built on.' },
  ],
};
