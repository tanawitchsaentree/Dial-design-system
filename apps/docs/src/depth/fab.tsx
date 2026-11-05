// Usage tab for FAB (component-depth.md U1–U14). FAB is the unit's one main action, fixed in its corner.
import { Button, FAB, Stack } from 'dial-react';
import type { Depth } from './types';

const Frame = ({ children, clip = false }: { children: React.ReactNode; clip?: boolean }) => (
  <div className="demo-box demo-card" style={{ position: 'relative', minBlockSize: 'calc(var(--ds-control-lg) * 4)', ...(clip ? { overflow: 'hidden', maxBlockSize: 'calc(var(--ds-control-lg) * 3)' } : null) }}>{children}</div>
);
const rooms = (
  <Stack gap="sm">
    <p className="flush">Living room · 21.5 degrees</p>
    <p className="flush">Kitchen · 19 degrees</p>
  </Stack>
);
const long = (
  <Stack gap="sm">
    <p className="flush">Heating on until 22:40, then the night mode lowers it to 18 degrees in every room that has a sensor.</p>
    <p className="flush">Washer finished at 21:05. The door is unlocked and the drum is cooling down for the night.</p>
    <p className="flush">Hall lamp off. Front door locked at 22:10. Garden light on a timer until midnight.</p>
  </Stack>
);

export const FAB_DEPTH: Depth = {
  overview: (
    <>
      <p>FAB is the one main action of a unit, kept in the same corner whatever the content does. It is the orange key, sunk into a round seat cut in the body, at the lower inline-end where the hand rests.</p>
      <p>The seat is opaque, so text that runs beneath it is hidden and the key never sits on printing. With room to spare the key prints its word and stretches into a capsule.</p>
    </>
  ),
  whenToUse: ['For the single action a screen exists for, such as adding a room or a device.', 'When the action must stay reachable while the content scrolls or changes.'],
  whenNot: [
    { situation: 'An action that belongs to one card or one row', to: '/components/button', label: 'Button' },
    { situation: 'A round key for a secondary action', to: '/components/icon-button', label: 'IconButton' },
    { situation: 'A choice between several actions', to: '/components/action-sheet', label: 'ActionSheet' },
  ],
  variants: { na: 'FAB has one look, the orange key in its seat. Whether it prints a word is a modifier, covered below.' },
  anatomy: {
    render: <Frame><FAB label="Add room" extended /></Frame>,
    parts: [
      { part: 'Seat', selector: '[data-component="FAB"]', what: 'An opaque round well in surface.sunken with a ring edge, fixed to the corner. It hides what runs beneath it.' },
      { part: 'Key', selector: '[data-component="FAB"] > button', what: 'The orange key, 52px high, with a darker rim and a short shadow down and to the right.' },
      { part: 'Glyph', selector: '[data-component="FAB"] svg', what: 'A dot-matrix icon in the on-accent ink.' },
      { part: 'Word', selector: '[data-component="FAB"] button > span:last-child', what: 'On an extended key, the label in medium weight.' },
    ],
  },
  sizes: { na: 'FAB has one size. The key is 52px, the largest key in a unit, so it is the easiest part to find and press.' },
  emphasis: {
    text: <p>A FAB is orange, so it is the unit’s one primary control. Do not put a primary Button or another FAB in the same unit. If two actions matter equally, the screen is doing two jobs.</p>,
    pair: {
      do: <Frame><FAB label="Add room" /></Frame>, doNote: 'One orange key, alone in its corner.',
      dont: <Frame><Button kind="primary">Save</Button><FAB label="Add room" /></Frame>, dontNote: 'Two orange keys compete and neither reads as the main action.',
    },
  },
  placement: {
    rows: [['Lower inline-end corner of a unit', 'The default. The seat sits one step in from the edges and clear of the safe area.'], ['Whole-screen unit', 'Use position viewport so the key stays at the corner of the window.'], ['Over a list', 'The seat covers the rows beneath it. Leave the last row clear with padding at the end of the list.']],
    examples: [{ title: 'In a list screen', render: <Frame>{rooms}<FAB label="Add room" /></Frame> }],
  },
  combinations: {
    good: [['FAB + List', 'The list scrolls, the key stays, and the seat hides what passes under it.'], ['FAB + BottomNav', 'Give the FAB a parent that ends above the nav, so the two never overlap.']],
    avoid: [{ title: 'a FAB beside a primary Button', why: 'Both are orange. Make the Button a plastic key, or drop one of the two.', render: <Frame><Stack direction="row" gap="sm"><Button kind="primary">Save</Button></Stack><FAB label="Add room" /></Frame> }],
  },
  content: {
    formula: <p>Name the action with a verb and a noun, as in <em>Add room</em>. The label is the accessible name even when the key shows only the glyph.</p>,
    pair: {
      do: <Frame><FAB label="Add room" extended /></Frame>, doNote: 'A verb and a noun.',
      dont: <Frame><FAB label="New" extended /></Frame>, dontNote: 'New what? The word alone does not say what the key does.',
    },
    overflow: { text: 'The word does not wrap. A long label makes the capsule wider, so keep it to two or three words.', render: <Frame><FAB label="Add a new room to the house" extended /></Frame> },
    rtl: { text: 'In right-to-left languages the seat moves to the left corner and the glyph to the right of the word.', render: <div dir="rtl"><Frame><FAB label="إضافة غرفة" extended /></Frame></div> },
    expansion: { text: 'German words run about 30% longer. The capsule grows with them and the height stays.', render: <Frame><FAB label="Raum hinzufügen" extended /></Frame> },
  },
  behaviours: {
    states: [
      ['Default', 'Orange key with a darker rim in a sunken seat.', 'Announced as a button with its label.'],
      ['Hover', 'The orange moves one step lighter. The key does not lift.', 'No change.'],
      ['Active', 'The key drops by its travel and the shadow collapses.', 'No change.'],
      ['Focus', 'A dark ring outside the key.', 'No change.'],
      ['Disabled', 'Half-faded, flat, no shadow.', 'Announced as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the key.', 'native'],
      ['Keyboard', 'Enter or Space', 'Presses the key.', 'native'],
      ['Pointer', 'Click or tap', 'Presses the key. The target is 52px.', 'onClick'],
      ['Screen reader', 'Read', 'Read as a button named by the label, glyph hidden.', 'aria-label'],
    ],
    loading: <p>FAB has no loading state. Set <code>disabled</code> while the action runs.</p>,
    focus: <p>Nothing moves focus to the FAB. It is positioned from the corner, so put it in the markup where Tab should reach it.</p>,
  },
  deepDive: { na: 'FAB has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'extended',
      rules: <p>Prints the label beside the glyph. Use it when the screen has room and the glyph alone could mean more than one thing. The label is the accessible name either way.</p>,
      pair: { do: <Frame><FAB label="Add room" extended /></Frame>, doNote: 'The word names the action.', dont: <Frame><FAB label="Edit scene" icon="refresh" /></Frame>, dontNote: 'A glyph that does not match the label misleads.' },
    },
    {
      name: 'icon',
      rules: <p>Picks the glyph from the dot-matrix set. The default is <code>plus</code>, for adding. Pick one that matches the label, such as <code>edit</code> for changing something.</p>,
      pair: { do: <Frame><FAB label="Edit scene" icon="edit" /></Frame>, doNote: 'The glyph and the label say the same thing.', dont: <Frame><FAB label="Edit scene" icon="plus" /></Frame>, dontNote: 'A plus says add, not edit.' },
    },
    {
      name: 'position',
      rules: <p><code>container</code> fixes the key to the nearest positioned ancestor, so give that ancestor <code>position: relative</code>. <code>viewport</code> fixes it to the window. Both keep the device’s safe area clear.</p>,
      pair: { do: <Frame>{long}<FAB label="Add room" /></Frame>, doNote: 'The seat hides the text under it, so nothing is read through the key.', dont: <Frame clip>{long}<FAB label="Add room" /></Frame>, dontNote: 'The frame ends where the text does, so the last line is lost under the key. Pad the end of the list.' },
    },
  ],
  related: [['/components/button', 'Button', 'An action that belongs to one card or row.'], ['/components/icon-button', 'IconButton', 'A round key for a secondary action.'], ['/components/bottom-nav', 'BottomNav', 'The strip the FAB must clear.']],
  references: [
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the key is 52px and not smaller.' },
    { title: 'MDN · env() and safe-area-inset-*', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/env', why: 'How the key stays clear of notches and home bars.' },
    { title: 'WAI-ARIA Authoring Practices · Button pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Keyboard and naming for the key.' },
  ],
};
