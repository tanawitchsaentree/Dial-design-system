// Usage tab for EmptyState (component-depth.md U1–U14). EmptyState is what a room or list shows before it holds anything.
import { Button, Card, EmptyState, Heading } from 'dial-react';
import type { Depth } from './types';

const Room = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <Card header={<Heading level={3}>{name}</Heading>} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>{children}</Card>
);
const kitchen = (key: React.ReactNode = <Button kind="primary">Add a device</Button>) => (
  <EmptyState drawing="display" title="No devices in the kitchen yet" action={key}>Plug one in near the hub, then add it here.</EmptyState>
);

export const EMPTY_STATE: Depth = {
  overview: (
    <>
      <p>EmptyState is what a room, a list or a panel shows before anything is in it, such as a kitchen with no devices or a list of schedules nobody has made yet. It prints one line that says what is missing, one sentence that says what to do, and one key that does it.</p>
      <p>It can carry a quiet drawing made of the system’s own parts. It is either an LCD window reading two dashes, the way a device shows it has no value, or a field of unlit grille holes, the meter of a room with nothing in it. It never shows a stock illustration, because a picture would be a second voice the case does not have. The drawing is hidden from screen readers; the line says the same thing in words.</p>
      <p>EmptyState paints no body of its own. It is printing on the card or page it sits in, start-aligned on that surface’s inset line, so a room looks the same before and after its first device arrives, only with different contents.</p>
    </>
  ),
  whenToUse: ['A room, list or panel that has nothing in it yet.', 'A filter that leaves no results, with a key to clear it.', 'A list that fills on its own, such as alerts, to say that nothing is wrong.'],
  whenNot: [
    { situation: 'The content is still loading', to: '/components/progress', label: 'Progress' },
    { situation: 'Something does not work, such as the hub being offline', to: '/components/banner', label: 'Banner' },
    { situation: 'A device that has no reading yet, inside its own card', to: '/components/display', label: 'Display' },
  ],
  variants: { na: 'EmptyState has no variant prop. Its one option, the drawing, is described under modifiers.' },
  anatomy: {
    render: <Room name="Kitchen">{kitchen()}</Room>,
    parts: [
      { part: 'Drawing', selector: '[data-component="EmptyState"] [data-part="drawing"]', what: 'An unlit LCD window reading two dashes, or an empty grille field. Hidden from screen readers.' },
      { part: 'Line', selector: '[data-component="EmptyState"] > p:first-of-type', what: 'What is missing, in medium weight at the emphasis size.' },
      { part: 'Sentence', selector: '[data-component="EmptyState"] > p:nth-of-type(2)', what: 'What to do to fill the place, in the secondary ink.' },
      { part: 'Key', selector: '[data-component="EmptyState"] [data-part="action"]', what: 'The one key that fills it, orange only when that is the screen’s main action.' },
    ],
  },
  sizes: { na: 'EmptyState has one size. It takes the width of the surface it sits in and keeps the sentence to the reading measure.' },
  emphasis: {
    text: <p>One key at most. It is orange only when filling this place is the main thing the screen is for, such as adding the first device to an empty room. When the screen already has its orange key, the empty state’s key is plastic.</p>,
    pair: {
      do: <Room name="Kitchen">{kitchen()}</Room>,
      doNote: 'One key, orange because adding a device is the room’s main action.',
      dont: <Room name="Kitchen"><EmptyState title="No devices in the kitchen yet" action={<><Button kind="primary">Add a device</Button> <Button kind="primary">Learn more</Button></>}>Plug one in near the hub, then add it here.</EmptyState></Room>,
      dontNote: 'Two orange keys, so the room has no main action.',
    },
  },
  placement: {
    rows: [['In a room card', 'Where the device units would be, on the card’s inset line under its name.'], ['In a list', 'In place of the first row, at the top, so the person sees it without scrolling.'], ['On a whole screen', 'Under the screen title, start-aligned, never centred in the middle of the page.']],
    examples: [{ title: 'In a list that fills on its own', render: <Room name="Alerts"><EmptyState title="Nothing needs you">Alerts from the hub show here when they happen.</EmptyState></Room> }],
  },
  combinations: {
    good: [['Card + EmptyState', 'The room keeps its name and body; only its contents change.'], ['EmptyState + one Button', 'The one step that fills the place.']],
    avoid: [{ title: 'an empty state inside a Banner', why: 'A Banner says that something holds or fails. An empty room has nothing wrong with it, so it needs no tone and no glyph.', render: <Room name="Kitchen"><EmptyState title="Something went wrong">No devices were found.</EmptyState></Room> }],
  },
  content: {
    formula: <><p>The line names what is missing and where, as in <em>No devices in the kitchen yet</em>. The word yet tells people this is a beginning. The sentence says the step, as in <em>Plug one in near the hub, then add it here.</em> The key repeats the step as a verb, such as <em>Add a device</em>.</p><p>Keep it to those three things. A second paragraph of help belongs on a help page.</p></>,
    pair: {
      do: <Room name="Kitchen">{kitchen()}</Room>, doNote: 'What is missing, where, and the step.',
      dont: <Room name="Kitchen"><EmptyState title="No data" /></Room>, dontNote: 'Says nothing about the room and leaves no next step.',
    },
    overflow: { text: 'A long line wraps onto more lines and keeps its start edge. The sentence stops at the reading measure.', render: <div data-overflow-demo=""><Room name="Upstairs guest room">  <EmptyState title="No devices in the upstairs guest room by the window yet" action={<Button>Add a device</Button>}>Plug one in near the hub, then add it here.</EmptyState></Room></div> },
    rtl: { text: 'In right-to-left languages the drawing, the words and the key start on the right.', render: <div dir="rtl"><Room name="المطبخ"><EmptyState drawing="display" title="لا توجد أجهزة في المطبخ بعد" action={<Button kind="primary">إضافة جهاز</Button>}>وصّل جهازًا قرب المحور ثم أضفه هنا.</EmptyState></Room></div> },
    expansion: { text: 'German runs about 30% longer. The line wraps; the key grows with its word.', render: <Room name="Küche"><EmptyState drawing="display" title="Noch keine Geräte in der Küche" action={<Button kind="primary">Gerät hinzufügen</Button>}>Stecke eines in der Nähe des Hubs ein und füge es hier hinzu.</EmptyState></Room> },
  },
  behaviours: {
    states: [
      ['Empty', 'The drawing, the line, the sentence and the key, printed on the surface.', 'Read in order as plain text and a button.'],
      ['First item added', 'The screen replaces the empty state with the list or the device unit.', 'Move focus to the new item.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches the key.', 'native button'],
      ['Pointer', 'Click the key', 'Runs the step that fills the place.', 'the action prop'],
      ['Screen reader', 'Read', 'The line and the sentence are read as text; the drawing is skipped.', 'aria-hidden drawing'],
    ],
    loading: <p>Never show an empty state while the list is still loading, or people read that the room is empty when it is not. Show progress first and the empty state only once the answer is known.</p>,
    focus: <p>An empty state takes no focus of its own. When a key on it adds the first item, move focus to that item.</p>,
  },
  deepDive: { na: 'EmptyState has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'drawing',
      rules: <p>Use display for a place that will hold devices, so the drawing is the window they would light. Use grille for a place that holds a level or a count, such as schedules. Leave it out for a list that fills on its own.</p>,
      pair: { do: <Room name="Schedules"><EmptyState drawing="grille" title="No schedules yet" action={<Button>New schedule</Button>}>A schedule turns devices on and off at set times.</EmptyState></Room>, doNote: 'Unlit holes, the meter of a list with nothing in it.', dont: <Room name="Alerts"><EmptyState drawing="display" title="Nothing needs you">Alerts from the hub show here when they happen.</EmptyState></Room>, dontNote: 'A dead display on a list that is fine reads as a fault.' },
    },
    {
      name: 'action',
      rules: <p>One key for the step that fills the place. Leave it out when the place fills on its own.</p>,
      pair: { do: <Room name="Garden">{kitchen(<Button>Add a device</Button>)}</Room>, doNote: 'One plastic key when the screen has its orange key elsewhere.', dont: <Room name="Garden">{kitchen(<><Button>Add a device</Button> <Button>Scan</Button> <Button>Help</Button></>)}</Room>, dontNote: 'Three keys, and none of them says which step comes first.' },
    },
  ],
  related: [['/components/card', 'Card', 'The room the empty state sits in.'], ['/components/display', 'Display', 'The window the drawing borrows.'], ['/components/grille', 'Grille', 'The holes the drawing borrows.']],
  references: [
    { title: 'Nielsen Norman Group · Designing Empty States in Complex Applications', url: 'https://www.nngroup.com/articles/empty-state-interface-design/', why: 'Say why a place is empty and how to fill it.' },
    { title: 'WAI-ARIA Authoring Practices · Hiding decorative images', url: 'https://www.w3.org/WAI/tutorials/images/decorative/', why: 'A drawing that repeats the text is hidden from assistive tech.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
