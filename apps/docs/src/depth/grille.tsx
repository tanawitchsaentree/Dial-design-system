// Usage tab for Grille (component-depth.md U1–U14). Grille is a perforated field whose holes are the meter.
import { Button, Display, Grille, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const GRILLE: Depth = {
  overview: (
    <>
      <p>Grille is a field of small round holes in the body. The holes are the meter: lit holes show a level, an activity or a signal, and the rest stay dark. It reads at a glance, from across a room.</p>
      <p>Every hole is a recess, not a printed dot. A lit hole is grey ink at full strength and never orange. A grille always measures something, so it always has a name and a value that a screen reader can read.</p>
    </>
  ),
  whenToUse: ['To show a level: volume, fan speed, battery, water in a tank.', 'To show activity or signal strength in coarse steps.', 'Next to the display or the control that sets the level.'],
  whenNot: [
    { situation: 'The exact number matters', to: '/components/display', label: 'Display' },
    { situation: 'The person sets the level by dragging', to: '/components/slider', label: 'Slider' },
    { situation: 'A state that is on or off', to: '/components/badge', label: 'Badge' },
  ],
  variants: { na: 'Grille has one look. Its shape and fill order are options, covered under Modifiers.' },
  anatomy: {
    render: <Grille label="Volume" value={6} cols={12} rows={4} />,
    parts: [
      { part: 'Field', selector: '[data-component="Grille"]', what: 'A grid of holes on a 12px pitch, the 4px step.' },
      { part: 'Hole', selector: '[data-component="Grille"] > span:not([data-lit])', what: 'An 8px round recess in the body.' },
      { part: 'Lit hole', selector: '[data-component="Grille"] > span[data-lit]', what: 'The same recess filled with ink at full step.' },
    ],
  },
  sizes: { na: 'Grille has one hole size, 8px on a 12px pitch. Change cols and rows to change the field.' },
  emphasis: {
    text: <p>One grille per unit, next to what it measures. Two grilles in one unit make the reader work out which is which.</p>,
    pair: {
      do: <Unit><Stack gap="sm"><Display label="Radio" value="98.5" unit="MHz" digits={4} /><Grille label="Volume" value={4} cols={12} rows={3} /></Stack></Unit>,
      doNote: 'One window for the station, one grille for the volume.',
      dont: <Unit><Stack gap="sm"><Grille label="Volume" value={4} cols={12} rows={3} /><Grille label="Bass" value={7} cols={12} rows={3} /></Stack></Unit>,
      dontNote: 'Two grilles side by side, with nothing to tell them apart at a glance.',
    },
  },
  placement: {
    rows: [['Beside or under the display', 'The window gives the state, the grille the level.'], ['Next to the keys that change it', 'Pressing a key lights or darkens holes right beside it.']],
    examples: [{ title: 'With the keys that change it', render: <Unit><Stack gap="md"><Grille label="Volume" value={5} cols={12} rows={4} /><Stack direction="row" gap="sm"><Button>Quieter</Button><Button>Louder</Button></Stack></Stack></Unit> }],
  },
  combinations: {
    good: [['Grille + Display', 'A number in the window and its level in holes.'], ['Grille + keys', 'Each press moves the level one step.']],
    avoid: [{ title: 'a grille with no reading', why: 'Holes that measure nothing are decoration, and dial does not allow them.', render: <Unit><Grille label="Volume" value={0} cols={12} rows={3} valueText="Volume off" /></Unit> }],
  },
  content: {
    formula: <p>The label names what is measured: <em>Volume</em>, <em>Fan speed</em>, <em>Battery</em>. valueText says the reading in words: <em>Volume 6 of 10</em>.</p>,
    pair: {
      do: <Grille label="Battery" value={7} cols={10} rows={2} valueText="Battery 70 percent" />, doNote: 'A name and a reading in words.',
      dont: <Grille label="Grille" value={7} cols={10} rows={2} />, dontNote: 'The name says what it is, not what it measures.',
    },
    overflow: { text: 'The field never wraps: it keeps cols holes per row. Choose cols that fit the narrowest column you expect, about 12 holes per 144px.', render: <div style={{ inlineSize: 160 }}><Grille label="Volume" value={6} cols={12} rows={3} /></div> },
    rtl: { text: 'In right-to-left languages fill inline starts from the right, because it follows the reading direction.', render: <div dir="rtl"><Grille label="الصوت" value={6} cols={12} rows={3} /></div> },
    expansion: { text: 'The grille has no words of its own. A longer label only changes what a screen reader says.', render: <Grille label="Lüftergeschwindigkeit" value={4} cols={12} rows={3} /> },
  },
  behaviours: {
    states: [
      ['Level', 'Lit holes in fill order, the rest dark.', 'The number of lit holes is value ÷ max × holes, rounded.'],
      ['Changing', 'Holes fade on or off in 120ms.', 'Nothing sweeps or pulses at rest.'],
      ['Reduce motion', 'Holes switch at once with no fade.', 'The level is the same.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Skips the grille. It shows a value and is not a control.', 'no tabindex'],
      ['Screen reader', 'Read', 'Announced as a meter with its label and valueText.', 'role meter'],
    ],
    loading: <p>Before the device reports a level, show value 0 with valueText such as "Waiting for the speaker".</p>,
    focus: <p>Grille never takes focus. Focus goes to the control that changes it.</p>,
  },
  deepDive: { na: 'Grille has one kind, covered above.' },
  modifiers: [
    {
      name: 'shape',
      rules: <p>rect is the default field. circle leaves out the holes outside the circle, like a speaker grille. Use the same number of cols and rows for a round field.</p>,
      pair: { do: <Grille label="Fan speed" value={5} cols={11} rows={11} shape="circle" fill="up" />, doNote: 'A round field with equal cols and rows.', dont: <Grille label="Fan speed" value={5} cols={16} rows={5} shape="circle" />, dontNote: 'A wide field squashes the circle into an oval.' },
    },
    {
      name: 'fill',
      rules: <p>inline lights holes column by column along the reading direction, for levels like volume. up lights rows from the bottom, for levels that rise, like water in a tank.</p>,
      pair: { do: <Grille label="Water tank" value={6} cols={6} rows={8} fill="up" />, doNote: 'A tall field that fills from the bottom.', dont: <Grille label="Water tank" value={6} cols={6} rows={8} />, dontNote: 'A tall field that fills sideways reads as a second meter.' },
    },
  ],
  related: [['/components/display', 'Display', 'The exact number in a window.'], ['/components/slider', 'Slider', 'The person sets the level.']],
  references: [
    { title: 'WAI-ARIA 1.2 · meter role', url: 'https://www.w3.org/TR/wai-aria-1.2/#meter', why: 'A scalar value within a known range.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'Lit holes must stand apart from unlit ones at 3:1.' },
    { title: 'Vitsœ · Dieter Rams: ten principles for good design', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
