// Usage tab for Slot (component-depth.md U1–U14). The slit a room or device unit has for scene cards.
import { Card, Icon, IconButton, Slot, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <Card padding="unit" wordmark="dial" model="scene 1" style={{ inlineSize: 'max-content', maxInlineSize: '100%' }}>{children}</Card>;
const MOVIE = { value: 'movie', name: 'Movie night', steps: ['Lamps 20%'] };

export const SLOT: Depth = {
  overview: (
    <>
      <p>Slot is the narrow mouth a room or a device unit has for a SceneCard. It is a slit cut into the plastic, with a bay above it that keeps half a card’s height and the room’s name printed under it beside a lamp. Empty, the bay prints the words scene card and an arrow pointing in, and the lamp is a hollow ring with the word Empty.</p>
      <p>Inserting a card runs its scene. The card then stands half out of the slit with its name and first step readable, and the lamp turns to a filled dot with the word Running. A polite status says Movie night inserted into Living room. Pressing the slot when no card is held takes the card out again.</p>
      <p>The slot is one button. Press it, or press Enter on it, to insert the held card. With a card held, the arrows walk from slot to slot, and every slot that can take the card shows a ring around its slit. A card dragged by its handle goes into the slot it is released over.</p>
    </>
  ),
  whenToUse: [
    'On a room or device unit that can run a scene.',
    'When the person picks where a scene runs by putting its card in.',
    'When the screen should show at a glance which scene runs where.',
  ],
  whenNot: [
    { situation: 'The scenes themselves, the cards that go in', to: '/components/scene-card', label: 'SceneCard' },
    { situation: 'Choosing one mode of one device', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Reordering items in a list', to: '/components/queue', label: 'Queue' },
  ],
  variants: { na: 'Slot has one look, a top-loading slit. Empty, inserted and disabled are states, covered under Behaviours.' },
  anatomy: {
    render: <Unit><Slot label="Living room" defaultScene={MOVIE} /></Unit>,
    parts: [
      { part: 'Bay', selector: '[data-component="Slot"] > button > span:first-child', what: 'Half a card’s height above the slit, kept in every state.' },
      { part: 'Inserted card', selector: '[data-component="Slot"] > button > span:first-child > span', what: 'The top half of the card, with the scene’s name and first step.' },
      { part: 'Slit', selector: '[data-component="Slot"] > button > span:last-child', what: 'A narrow recess with the inverse light, the hole the card goes into.' },
      { part: 'Room name', selector: '[data-component="Slot"] > span:nth-child(2) > span:first-child', what: 'The room or device the slot belongs to, at label size.' },
      { part: 'Lamp', selector: '[data-component="Slot"] [data-component="Badge"]', what: 'Badge’s lamp and word, Running or Empty.' },
    ],
  },
  sizes: { na: 'Slot has one size, a card’s width plus a margin each side, so every card fits every slot.' },
  emphasis: {
    text: <p>A slot is not the loud part of its unit. The unit’s one orange part, a knob or a key, stays beside it. The slot and the card in it are never orange, and the lamp tells the state with a shape and a word.</p>,
    pair: {
      do: <Unit><Stack direction="row" gap="lg" align="center"><Slot label="Living room" defaultScene={MOVIE} /><IconButton label="Lamps off" kind="primary" size="lg"><Icon name="power" /></IconButton></Stack></Unit>,
      doNote: 'The slot beside the unit’s one orange key.',
      dont: <Unit><Stack direction="row" gap="lg"><Slot label="Living room" /><Slot label="Living room" /></Stack></Unit>,
      dontNote: 'Two slots for one room, so it is unclear which scene runs.',
    },
  },
  placement: {
    rows: [['On a room unit', 'One slot per room, beside the room’s main key.'], ['On a device unit', 'A speaker or a lamp with its own slot for scenes made for it.'], ['A row of rooms', 'Several slots on one wide unit for a whole floor.']],
    examples: [{ title: 'A floor of three rooms on one unit', render: <Card padding="unit" wordmark="dial" model="home 3"><Stack direction="row" gap="lg"><Slot label="Kitchen" /><Slot label="Bedroom" defaultScene={{ value: 'night', name: 'Good night' }} /><Slot label="Hall" /></Stack></Card> }],
  },
  combinations: {
    good: [['Slot + SceneCard', 'The cards that go in.'], ['Slot + Card', 'The room unit the slot is cut into.'], ['Slot + IconButton', 'The unit’s own orange key beside the slot.']],
    avoid: [{ title: 'a slot with no cards on the screen', why: 'Without a card to pick up the slot can only be emptied. Show the cards on the same screen or in a sheet opened from it.', render: <Unit><Slot label="Study" /></Unit> }],
  },
  content: {
    formula: <p>Name the slot after the room or device it belongs to, such as Living room or Kitchen speaker. The name is printed under the slit and is part of every announcement, so keep it to what people call the room.</p>,
    pair: {
      do: <Unit><Slot label="Kitchen" /></Unit>,
      doNote: 'The room, as people say it.',
      dont: <Unit><Slot label="Slot 2 (zone B)" /></Unit>,
      dontNote: 'A system name nobody in the house uses.',
    },
    overflow: { text: 'A long room name wraps under the slit and pushes the lamp to the next line. The slit and the bay keep their size.', render: <div data-overflow-demo=""><Unit><Slot label="Upstairs guest bedroom" defaultScene={{ value: 'guests', name: 'Guests staying the weekend', steps: ['Heating 21°'] }} /></Unit></div> },
    rtl: { text: 'In right-to-left languages the room name sits on the right and the lamp on the left. The card still goes in from the top.', render: <div dir="rtl"><Unit><Slot label="غرفة المعيشة" words={{ legend: 'بطاقة مشهد', running: 'يعمل', empty: 'فارغ' }} defaultScene={{ value: 'r', name: 'ليلة فيلم' }} /></Unit></div> },
    expansion: { text: 'German and Finnish words run about 30% longer. The lamp word moves under the room name when they do not fit on one line.', render: <Unit><Slot label="Wohnzimmer" words={{ legend: 'Szenenkarte', running: 'Läuft gerade', empty: 'Leer' }} defaultScene={{ value: 'g', name: 'Filmabend' }} /></Unit> },
  },
  behaviours: {
    states: [
      ['Empty', 'The bay prints scene card and an arrow; the lamp is a ring with the word Empty.', 'The button is named Living room slot, empty, scene card, which holds the words its bay prints.'],
      ['Ready', 'While a card is held, the slit has a ring and the legend prints at full ink.', 'Every slot that can take the card shows it.'],
      ['Over', 'The slot under a dragged card has a full ink ring.', 'Releasing inserts the card here.'],
      ['Inserted', 'The card stands half out with its name; the lamp is a dot with the word Running.', 'A polite status says Movie night inserted into Living room.'],
      ['Focus', 'A dark 2px ring around the bay and the slit.', 'The same ring as on every part.'],
      ['Disabled', 'The slot takes no card; its words stay readable.', 'The button is disabled.'],
    ],
    interactions: [
      ['Keyboard', 'Enter or Space', 'Inserts the held card. With no card held, takes the inserted card out.', 'button'],
      ['Keyboard', 'Arrows, Home and End', 'Move focus between the slots on the page.', 'keydown on the slot'],
      ['Keyboard', 'Escape', 'Puts the held card back on its shelf.', 'keydown on the document'],
      ['Pointer', 'Press', 'Inserts the held card, or takes the card out.', 'click'],
      ['Pointer', 'Release a dragged card over it', 'Inserts the card. Pressing the card, then the slot, does the same.', 'pointer events'],
      ['Screen reader', 'Read', 'The slot is a button named by its room and its scene, and each change is announced.', 'aria-label, role status'],
    ],
    loading: <p>Slot has no loading state. While the room’s state loads, render the slot empty and disabled, then pass the running scene as defaultScene or scene.</p>,
    focus: <p>A slot never takes focus on page load. After a card is inserted focus is on the slot it went into, including after a drag.</p>,
  },
  deepDive: { na: 'Slot has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'defaultScene',
      rules: <p>The scene already running when the page opens. Its card stands in the slit without sliding in, and onInsert is not called for it, so the scene does not run twice.</p>,
      pair: { do: <Unit><Slot label="Bedroom" defaultScene={{ value: 'n', name: 'Good night' }} /></Unit>, doNote: 'The running scene, shown as it is.', dont: <Unit><Slot label="Bedroom" /></Unit>, dontNote: 'A room that is running a scene shown as empty.' },
    },
    {
      name: 'disabled',
      rules: <p>For a unit that is offline or cannot run scenes now. The slot takes no card and the card in it stays readable. Say why with a Badge on the unit.</p>,
      pair: { do: <Unit><Slot label="Garage" disabled /></Unit>, doNote: 'An offline unit that takes no card.', dont: <Unit><Slot label="Garage (offline, do not use)" /></Unit>, dontNote: 'The reason in the name and the slot still takes a card.' },
    },
  ],
  related: [['/components/scene-card', 'SceneCard', 'The card that goes in.'], ['/components/device-card', 'DeviceCard', 'The unit a slot can sit on.'], ['/components/badge', 'Badge', 'The lamp and its word.']],
  references: [
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why every drag has a single press or key that does the same.' },
    { title: 'WAI-ARIA Authoring Practices · Live regions', url: 'https://www.w3.org/WAI/ARIA/apg/practices/structural-roles/', why: 'Announcing each insert politely.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
