// Usage tab for IconButton (component-depth.md U1–U14). IconButton is a round key with a printed symbol.
import { Button, IconButton, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const ic = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const Play = () => <svg {...ic}><path d="M8 5l11 7-11 7z" /></svg>;
const Pause = () => <svg {...ic}><path d="M9 6v12M15 6v12" /></svg>;
const Prev = () => <svg {...ic}><path d="M18 6l-8 6 8 6zM6 6v12" /></svg>;
const Next = () => <svg {...ic}><path d="M6 6l8 6-8 6zM18 6v12" /></svg>;
const Power = () => <svg {...ic}><path d="M12 4v8M7 7a7 7 0 1 0 10 0" /></svg>;
const Plus = () => <svg {...ic}><path d="M12 5v14M5 12h14" /></svg>;
const Minus = () => <svg {...ic}><path d="M5 12h14" /></svg>;

export const ICON_BUTTON: Depth = {
  overview: (
    <>
      <p>IconButton runs one action that a symbol says better than a word, such as play, skip, power or volume. It is a round key of the same matte plastic as the unit. When you press it, it drops by its height and its shadow disappears under it. When you let go, it comes back on a spring.</p>
      <p>The symbol is printing on the key. The name lives in the <code>label</code> prop, which screen readers announce. Only one key in a unit is orange, and the symbol itself is never orange.</p>
    </>
  ),
  whenToUse: ['For the transport keys on a player, which are previous, play or pause, and next.', 'For power, volume up and volume down on a device unit.', 'Where a row of keys must stay short and every symbol is well known.'],
  whenNot: [
    { situation: 'The action needs a word to be understood', to: '/components/button', label: 'Button' },
    { situation: 'Something stays on or off', to: '/components/switch', label: 'Switch' },
    { situation: 'Picking one of a few options', to: '/components/checkbox', label: 'Checkbox' },
  ],
  variants: {
    key: { purpose: 'Every action except the main one. Body-coloured plastic with the symbol in grey printing.', pairing: 'Sits beside a primary key, or in a row of plastic keys.' },
    primary: { purpose: 'The one action the unit exists for, such as Play. Dyed orange with a darker rim.', pairing: 'Once per unit. Never next to a primary Button or an orange knob.' },
  },
  anatomy: {
    render: <IconButton label="Play" kind="primary"><Play /></IconButton>,
    parts: [
      { part: 'Key body', selector: '[data-component="IconButton"]', what: 'A disc of matte plastic, 44px across, with a short shadow down and to the right.' },
      { part: 'Printed symbol', selector: '[data-component="IconButton"] svg', what: 'A 20px icon drawn with a 2px stroke in the key’s ink. Hidden from screen readers.' },
    ],
    perVariant: 'The primary key is dyed orange and carries a darker rim. The plastic key has no rim.',
  },
  sizes: {
    md: { use: '44px across. Keys inside a unit and in toolbars.', pairs: 'Button md, Switch, Select.' },
    lg: { use: '52px across. The main key of a sheet on a phone.', pairs: 'Button lg, in a sheet’s bottom row.' },
  },
  emphasis: {
    text: <p>One orange key per unit, counting Buttons and knobs too. A row of transport keys has one orange key in the middle, and that is the one that starts or pauses.</p>,
    pair: {
      do: <Unit><Stack direction="row" gap="sm"><IconButton label="Previous track"><Prev /></IconButton><IconButton label="Play" kind="primary"><Play /></IconButton><IconButton label="Next track"><Next /></IconButton></Stack></Unit>,
      doNote: 'One orange key in the row.',
      dont: <Unit><Stack direction="row" gap="sm"><IconButton label="Previous track" kind="primary"><Prev /></IconButton><IconButton label="Play" kind="primary"><Play /></IconButton><IconButton label="Next track" kind="primary"><Next /></IconButton></Stack></Unit>,
      dontNote: 'Three orange keys. Nothing reads as the main action.',
    },
  },
  placement: {
    rows: [['Bottom of a unit, after the display', 'Transport and power keys, where the hand expects them.'], ['Top end of a sheet', 'A plastic close key, the only key in that corner.']],
    examples: [{ title: 'Under a display', render: <Unit><Stack gap="md"><p className="flush">Kitchen speaker · Track 4 of 12</p><Stack direction="row" gap="sm"><IconButton label="Previous track"><Prev /></IconButton><IconButton label="Pause" kind="primary"><Pause /></IconButton><IconButton label="Next track"><Next /></IconButton></Stack></Stack></Unit> }],
  },
  combinations: {
    good: [['Primary + plastic icon keys', 'A player, with the main action in orange and the alternatives in plastic.'], ['Plastic icon keys + a plastic Button', 'Volume keys next to a worded action such as Group speakers.']],
    avoid: [{ title: 'an orange icon key next to an orange Button', why: 'Two orange parts in one unit split attention, and neither reads as the main action.', render: <Unit><Stack direction="row" gap="sm"><IconButton label="Play" kind="primary"><Play /></IconButton><Button kind="primary">Start wash</Button></Stack></Unit> }],
  },
  content: {
    formula: <p>The <code>label</code> is a verb, then the object if needed, as in <em>Next track</em>, <em>Turn off</em> or <em>Volume up</em>. Sentence case, no full stop. Pick a symbol people already know.</p>,
    pair: {
      do: <IconButton label="Volume up"><Plus /></IconButton>, doNote: 'The label says what happens, here Volume up.',
      dont: <IconButton label="Plus"><Plus /></IconButton>, dontNote: 'Plus names the picture instead of the action.',
    },
    overflow: { text: 'The key never grows. A long label is read out but never printed, so it cannot overflow the disc.', render: <div data-overflow-demo=""><IconButton label="Turn off every lamp in the living room"><Power /></IconButton></div> },
    rtl: { text: 'In right-to-left languages the order of keys mirrors. Direction symbols such as previous and next swap places with the row.', render: <div dir="rtl"><Stack direction="row" gap="sm"><IconButton label="السابق"><Next /></IconButton><IconButton label="تشغيل" kind="primary"><Play /></IconButton><IconButton label="التالي"><Prev /></IconButton></Stack></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. Only the spoken name gets longer; the key stays 44px.', render: <Stack direction="row" gap="sm"><IconButton label="Lautstärke verringern"><Minus /></IconButton><IconButton label="Lautstärke erhöhen"><Plus /></IconButton></Stack> },
  },
  behaviours: {
    states: [
      ['Rest', 'Raised by its height, with a short shadow down and to the right.', 'The symbol is the secondary ink on plastic keys.'],
      ['Hover', 'The symbol darkens one step. On the primary key, the orange moves one step lighter.', 'The key never lifts or grows.'],
      ['Pressed', 'Drops by 3px in 65ms and the shadow collapses under it.', 'Returns on the spring in about 245ms when released.'],
      ['Focus', 'A dark 2px ring outside the disc.', 'The ring is the same on every part.'],
      ['Latched', 'With aria-pressed true a plastic disc stays down by 3px as frosted grey glass, its symbol in primary ink.', 'Only toggle discs latch. The orange disc never turns to glass.'],
      ['Disabled', 'Flat, no shadow, at half opacity.', 'It cannot be pressed.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the key.', 'native button'],
      ['Keyboard', 'Space or Enter', 'Presses the key and runs the action.', 'native button'],
      ['Pointer', 'Press and release', 'Drops at once, returns on the spring, runs on release.', 'native button'],
      ['Screen reader', 'Read', 'Announced as a button with its label. The symbol is not read.', 'aria-label'],
    ],
    loading: <p>IconButton has no loading state. While a device takes time to answer, show the progress on the unit’s display and keep the key as it is.</p>,
    focus: <p>IconButton is never focused on page load. In a sheet, a close key is not the first thing focused; the first field or action is.</p>,
  },
  deepDive: {
    key: {
      purpose: <p>The plastic key carries every icon action that is not the reason the unit exists. It spends no colour, so it never competes with the orange part.</p>,
      context: <Unit><Stack direction="row" gap="sm"><IconButton label="Volume down"><Minus /></IconButton><IconButton label="Volume up"><Plus /></IconButton></Stack></Unit>,
      practices: ['Use it for skip, volume and close.', 'Keep the symbol simple, with one stroke shape and no text inside it.'],
      pair: { do: <IconButton label="Turn off"><Power /></IconButton>, doNote: 'Power as a plastic key on a unit with another main action.', dont: <IconButton label="Turn off" kind="primary"><Power /></IconButton>, dontNote: 'An orange power key next to a main action takes its place.' },
    },
    primary: {
      purpose: <p>The primary key is the one orange part of a unit that has no knob or primary Button. On a player it is play or pause.</p>,
      context: <Unit><Stack direction="row" gap="sm"><IconButton label="Previous track"><Prev /></IconButton><IconButton label="Play" kind="primary"><Play /></IconButton><IconButton label="Next track"><Next /></IconButton></Stack></Unit>,
      practices: ['Use it once per unit.', 'Leave it out when the unit already has an orange knob or Button.'],
      pair: { do: <Unit><IconButton label="Play" kind="primary"><Play /></IconButton></Unit>, doNote: 'One orange key in the unit.', dont: <Unit><Stack direction="row" gap="sm"><IconButton label="Play" kind="primary"><Play /></IconButton><IconButton label="Turn off" kind="primary"><Power /></IconButton></Stack></Unit>, dontNote: 'Two orange keys in the unit.' },
    },
  },
  modifiers: { na: 'IconButton has no optional slots or booleans besides disabled. The label is required.' },
  related: [['/components/button', 'Button', 'The action needs a word on the key.'], ['/components/switch', 'Switch', 'Something stays on or off.'], ['/components/checkbox', 'Checkbox', 'An option that is on or off in a list.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Keyboard and role expectations for a button.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why every key keeps a 44px target.' },
    { title: 'WCAG 2.2 · 4.1.2 Name, Role, Value', url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html', why: 'Why an icon key needs a label in words.' },
  ],
};
