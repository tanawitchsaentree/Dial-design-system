// Usage tab for SceneCard (component-depth.md U1–U14). A scene printed on a card you insert into a Slot.
import { Button, Card, SceneCard, Slot, Stack } from 'dial-react';
import type { Depth } from './types';

const Row = ({ children }: { children: React.ReactNode }) => <Stack direction="row" gap="md">{children}</Stack>;

export const SCENE_CARD: Depth = {
  overview: (
    <>
      <p>SceneCard is one scene of the home, such as Movie night, Away or Good night, printed on a small card. The card is light stock, one step lighter than the plastic, printed in dark ink in both themes. The name sits on the top edge, what the scene does is printed under it in up to three short lines, and the foot carries the word scene and an arrow that shows which end goes in.</p>
      <p>A card does nothing on its own. The person picks it up and inserts it into a room’s Slot, and that runs the scene there. So the screen always says where a scene runs. Press a card to pick it up and press a slot to put it in. From the keyboard, Enter picks it up, an arrow or Tab reaches a slot, Enter inserts it and Escape puts it back. A pointer can also drag the card by the printed handle in its top corner.</p>
      <p>Only one card is held at a time on a page, the way one hand holds one card. Picking up a second card puts the first one back.</p>
    </>
  ),
  whenToUse: [
    'For scenes or presets that set several devices at once, such as Movie night or Away.',
    'When the same scene can run in more than one room and the person picks the room.',
    'When a household wants a short shelf of scenes that anyone can read at a glance.',
  ],
  whenNot: [
    { situation: 'A single action on one device, such as turning a lamp off', to: '/components/button', label: 'Button' },
    { situation: 'A device with its display and keys', to: '/components/device-card', label: 'DeviceCard' },
    { situation: 'Choosing one of a few modes on one unit', to: '/components/segmented-control', label: 'SegmentedControl' },
  ],
  variants: { na: 'SceneCard has one look, a portrait card printed on light stock. A disabled card is covered under Behaviours.' },
  anatomy: {
    render: <SceneCard value="movie" name="Movie night" steps={['Lamps 20%', 'Blinds down', 'TV on']} />,
    parts: [
      { part: 'Card', selector: '[data-component="SceneCard"] > button', what: 'Light card stock with a hairline edge and the short unit shadow. Three keys wide and four tall.' },
      { part: 'Name', selector: '[data-component="SceneCard"] > button > span:nth-child(2)', what: 'The scene’s name, medium weight at body size, on the edge that stays out of a slot.' },
      { part: 'Steps', selector: '[data-component="SceneCard"] > button > span:nth-child(3)', what: 'Up to three short lines of what the scene does, at caption size.' },
      { part: 'Foot', selector: '[data-component="SceneCard"] > button > span:last-child', what: 'The word scene and an arrow pointing to the end that goes in.' },
      { part: 'Handle', selector: '[data-component="SceneCard"] > button > span:first-child', what: 'Six printed dots in a 44px corner. A pointer drags the card by it.' },
    ],
  },
  sizes: { na: 'SceneCard has one size, three keys wide and four keys tall, so every card fits every slot.' },
  emphasis: {
    text: <p>A scene card is quiet. It is never orange, because the room’s unit already has its one orange part. Cards are told apart by their printed names, never by colour or a picture.</p>,
    pair: {
      do: <Row><SceneCard value="e1" name="Movie night" steps={['Lamps 20%']} /><SceneCard value="e2" name="Away" steps={['Lamps off']} /></Row>,
      doNote: 'Two cards told apart by their names.',
      dont: <Row><Button kind="primary">Movie night</Button><Button kind="primary">Away</Button></Row>,
      dontNote: 'Scenes as orange keys that run at once. Two loud parts and no room named.',
    },
  },
  placement: {
    rows: [['Above the rooms', 'A shelf of cards over the room units, the usual place.'], ['In a sheet', 'A long set of scenes in a sheet opened from a room.'], ['Beside one unit', 'Two or three cards next to the only room that uses them.']],
    examples: [{ title: 'A shelf of cards over one room', render: <Stack gap="xl"><Row><SceneCard value="p1" name="Dinner" steps={['Dining lamp 60%']} /><SceneCard value="p2" name="Tidy up" steps={['All lamps 100%']} /></Row><Card padding="unit" wordmark="dial" model="scene 1" style={{ inlineSize: 'max-content' }}><Slot label="Dining room" /></Card></Stack> }],
  },
  combinations: {
    good: [['SceneCard + Slot', 'The card goes into a room’s slot to run there.'], ['SceneCard + Badge', 'A word beside a card that cannot run now, such as Hub offline.'], ['SceneCard + Sheet', 'A long set of cards in a sheet.']],
    avoid: [{ title: 'cards with no slot on the screen', why: 'A card that cannot go anywhere cannot run. Show at least one Slot with the cards, or use a Button for a single action.', render: <Row><SceneCard value="a1" name="Movie night" steps={['Lamps 20%']} /></Row> }],
  },
  content: {
    formula: <p>Name a scene after the moment it is for, in two words or fewer, such as Movie night or Good night. Write each step as the device and its new state, such as Lamps 20% or Blinds down. Leave out the room; the slot names it.</p>,
    pair: {
      do: <SceneCard value="c1" name="Good night" steps={['All lamps off', 'Doors locked']} />,
      doNote: 'The moment, then the devices and their states.',
      dont: <SceneCard value="c2" name="Turn off all lamps in the living room and lock" />,
      dontNote: 'An instruction as the name, with the room in it.',
    },
    overflow: { text: 'A long name wraps on the card. Steps that do not fit are cut at the foot, so the name always stays whole.', render: <div data-overflow-demo=""><SceneCard value="o1" name="Guests staying the weekend" steps={['Guest room heating 21°', 'Hall lamp on at dusk', 'Bathroom fan on a timer']} /></div> },
    rtl: { text: 'In right-to-left languages the handle sits in the top left corner and the words are set from the right.', render: <div dir="rtl"><SceneCard value="r1" name="ليلة فيلم" steps={['الإضاءة ٢٠٪', 'الستائر مغلقة']} words={{ kind: 'مشهد' }} /></div> },
    expansion: { text: 'German and Finnish names run about 30% longer. They wrap onto a second line of the card.', render: <SceneCard value="g1" name="Filmabend im Wohnzimmer" steps={['Leuchten 20%', 'Rollos unten']} words={{ kind: 'Szene' }} /> },
  },
  behaviours: {
    states: [
      ['Resting', 'Light stock with the short unit shadow.', 'A button with aria-pressed false.'],
      ['Hover on the handle', 'The dots darken one step. No lift.', 'The pointer shows a hand that can grab.'],
      ['Held', 'The card rises one step with a key’s shadow and an ink mark under it.', 'aria-pressed true, and a polite status says Movie night picked up.'],
      ['Dragging', 'The card follows the pointer and the slot under it shows a full ink ring.', 'Releasing over a slot inserts it; anywhere else the card goes back.'],
      ['Focus', 'A dark 2px ring just outside the card.', 'The same ring as on every part.'],
      ['Disabled', 'The card lies flat with no shadow and its words stay readable.', 'The button is disabled and cannot be picked up.'],
    ],
    interactions: [
      ['Keyboard', 'Enter or Space', 'Picks the card up, or puts it back when it is already held.', 'button with aria-pressed'],
      ['Keyboard', 'Right or Down arrow while held', 'Moves focus to the first slot. Left or Up moves to the last.', 'keydown on the card'],
      ['Keyboard', 'Escape while held', 'Puts the card back and returns focus to it.', 'keydown on the document'],
      ['Pointer', 'Press', 'Picks the card up; then press a slot to insert it.', 'click'],
      ['Pointer', 'Drag the handle', 'Carries the card to a slot. Pressing the card and then the slot does the same.', 'pointer events'],
      ['Screen reader', 'Read', 'The card is a toggle button named by its name and steps, announced as pressed while held.', 'aria-pressed, role status'],
    ],
    loading: <p>SceneCard has no loading state. While the scenes load, leave the shelf empty or show a Skeleton line, then render the cards.</p>,
    focus: <p>A card never takes focus on page load. After Escape focus goes back to the card. After it is inserted focus is on the slot it went into.</p>,
  },
  deepDive: { na: 'SceneCard has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'steps',
      rules: <p>Up to three short lines of what the scene does. They are printed under the name and cut at the foot when they do not fit. The first step also shows on the half card in a slot.</p>,
      pair: { do: <SceneCard value="m1" name="Away" steps={['Lamps off', 'Heating 16°']} />, doNote: 'Two steps the household can check.', dont: <SceneCard value="m2" name="Away" steps={['Lamps off', 'Heating 16°', 'Blinds down', 'Camera on', 'Alarm armed']} />, dontNote: 'Five steps, so two are cut at the foot.' },
    },
    {
      name: 'disabled',
      rules: <p>For a scene that cannot run now, such as one that needs a hub that is offline. The card lies flat and cannot be picked up. Say why next to it with a Badge.</p>,
      pair: { do: <SceneCard value="d1" name="Garden party" steps={['Path lights on']} disabled />, doNote: 'Flat, readable and not movable.', dont: <SceneCard value="d2" name="Garden party (offline)" steps={['Path lights on']} />, dontNote: 'The reason in the name, and the card can still be picked up.' },
    },
  ],
  related: [['/components/slot', 'Slot', 'Where a card goes in to run its scene.'], ['/components/device-card', 'DeviceCard', 'The unit a slot can sit on.'], ['/components/button', 'Button', 'A single action that runs at once.']],
  references: [
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why every drag has a single press or key that does the same.' },
    { title: 'WAI-ARIA Authoring Practices · Button pattern, toggle button', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'A held card is a toggle button with aria-pressed.' },
    { title: 'Yoto Player', url: 'https://yotoplay.com/', why: 'The card you insert to choose what plays, the reference for this component.' },
  ],
};
