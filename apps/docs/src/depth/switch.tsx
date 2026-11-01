// Usage tab for Switch (component-depth.md U1–U14). Switch is the slide switch on the side of an appliance.
import { Button, Stack, Switch } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const SWITCH: Depth = {
  overview: (
    <>
      <p>Switch turns one setting on or off, and the setting stays that way until someone changes it. It is a slide switch: a plastic cap that rides in a short groove. The cap sits at one end for off and at the other end for on.</p>
      <p>You read the state in three ways at once. The cap is at the on end, the small lamp beside it is filled with ink, and the word for the current position is printed heavier. None of these is a colour, so the switch never uses orange. Orange belongs to the unit’s one main control.</p>
    </>
  ),
  whenToUse: ['To turn a setting on or off that stays put, such as Keep warm or Child lock.', 'To pick between two named positions, such as Cook and Warm.', 'When the change takes effect at once, with no Save step.'],
  whenNot: [
    { situation: 'Running an action once, such as Start wash', to: '/components/button', label: 'Button' },
    { situation: 'Agreeing to something in a form that is sent later', to: '/components/checkbox', label: 'Checkbox' },
    { situation: 'Picking one of three or more modes', to: '/components/segmented-control', label: 'SegmentedControl' },
  ],
  variants: { na: 'Switch has no variant prop. Every switch is the same slide switch, so they read alike across units.' },
  anatomy: {
    render: <Switch label="Keep warm" offLabel="Off" onLabel="On" defaultChecked />,
    parts: [
      { part: 'Label', selector: 'label', what: 'The printed name of the setting. It names the switch for screen readers.' },
      { part: 'Off word', selector: '[data-component="Switch"] > span:first-child', what: 'The word printed at the off end of the groove.' },
      { part: 'Groove', selector: '[data-component="Switch"] > span:nth-child(2)', what: 'A slot recessed into the body, 52px long.' },
      { part: 'Cap', selector: '[data-component="Switch"] > span:nth-child(2) > span', what: 'A raised plastic cap with one printed index line. Its end of the groove is the state.' },
      { part: 'On word', selector: '[data-component="Switch"] > span:nth-child(3)', what: 'The word printed at the on end of the groove.' },
      { part: 'Lamp', selector: '[data-component="Switch"] > span:last-child', what: 'A 6px hole that fills with ink while the switch is on.' },
    ],
  },
  sizes: { na: 'Switch has one size. Its hit area is 44px tall, the smallest target every part in dial keeps.' },
  emphasis: {
    text: <p>A switch is never the loud part of a unit. It stays plastic and ink, so a unit can hold several switches and still have one orange control.</p>,
    pair: {
      do: <Unit><Stack gap="sm"><Switch label="Keep warm" offLabel="Off" onLabel="On" defaultChecked /><Button kind="primary">Start</Button></Stack></Unit>,
      doNote: 'Plastic switches with one orange key.',
      dont: <Unit><Stack gap="sm"><Switch label="Keep warm" /><Switch label="Delay start" /><Switch label="Quick cook" /><Switch label="Rinse" /><Switch label="Soak" /></Stack></Unit>,
      dontNote: 'Five switches and no main action. Group them in a settings sheet instead.',
    },
  },
  placement: {
    rows: [['Inside a unit, under the display', 'A setting of that device, such as Keep warm on a rice cooker.'], ['A settings list', 'One switch per row, label first and the switch at the end of the row.']],
    examples: [{ title: 'Under a display', render: <Unit><Stack gap="md"><p className="flush">Rice cooker · 12 min left</p><Switch label="Keep warm after" offLabel="Off" onLabel="On" defaultChecked /></Stack></Unit> }],
  },
  combinations: {
    good: [['Switch + display', 'The display says what the device is doing; the switch sets how.'], ['Switches + one primary key', 'Settings first, then the action that uses them.']],
    avoid: [{ title: 'a switch and a Button that do the same thing', why: 'Two controls for one setting leave people unsure which one is true.', render: <Unit><Stack gap="sm"><Switch label="Lamp" offLabel="Off" onLabel="On" /><Button>Turn lamp on</Button></Stack></Unit> }],
  },
  content: {
    formula: <p>The label names the setting as a noun: <em>Keep warm</em>, <em>Child lock</em>. Position words are short: <em>Off</em> and <em>On</em>, or the two modes, such as <em>Warm</em> and <em>Cook</em>. Sentence case, no full stop.</p>,
    pair: {
      do: <Switch label="Child lock" offLabel="Off" onLabel="On" />, doNote: 'The label names the setting.',
      dont: <Switch label="Turn on child lock?" offLabel="No" onLabel="Yes" />, dontNote: 'A question with Yes and No reads like a form, not a setting.',
    },
    overflow: { text: 'A long label wraps onto more lines. The switch stays the same size and stays centred on the label.', render: <div style={{ inlineSize: 240 }}><Switch label="Keep the rice warm for twelve hours after cooking" offLabel="Off" onLabel="On" /></div> },
    rtl: { text: 'In right-to-left languages the off word moves to the right and the cap slides to the left for on.', render: <div dir="rtl"><Switch label="إبقاء دافئ" offLabel="إيقاف" onLabel="تشغيل" defaultChecked /></div> },
    expansion: { text: 'German position words can run 30% longer. The groove keeps its length and the words take the room they need.', render: <Switch label="Warmhalten" offLabel="Aus" onLabel="Kochen" /> },
  },
  behaviours: {
    states: [
      ['Off', 'The cap rests at the start of the groove. The lamp is an empty hole.', 'The off word is printed in the medium weight.'],
      ['On', 'The cap rests at the far end. The lamp is filled with ink.', 'The on word is printed in the medium weight.'],
      ['Hover', 'The position words darken one step.', 'The cap never lifts or grows.'],
      ['Focus', 'A dark 2px ring outside the switch.', 'The ring is the same on every part.'],
      ['Disabled', 'The cap is flat with no shadow, at half opacity.', 'It cannot be thrown.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the switch.', 'native button'],
      ['Keyboard', 'Space or Enter', 'Throws the switch to the other end.', 'native button'],
      ['Pointer', 'Click the switch or its label', 'The cap slides to the other end and settles.', 'native button, label for'],
      ['Screen reader', 'Read', 'Announced as a switch with its label, on or off.', 'role switch, aria-checked'],
    ],
    loading: <p>Switch has no loading state. If the device takes time to answer, keep the cap where the person put it and show the progress on the unit’s display.</p>,
    focus: <p>Switch is never focused on page load. In a settings sheet, focus goes to the sheet’s heading first.</p>,
  },
  deepDive: { na: 'Switch has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'onLabel and offLabel',
      rules: <p>Print the two positions beside the groove. Use them when the ends have names, such as Warm and Cook, or when the switch sits far from its label. Give both or neither.</p>,
      pair: { do: <Switch label="Mode" offLabel="Warm" onLabel="Cook" />, doNote: 'Both ends named.', dont: <Switch label="Mode" onLabel="Cook" />, dontNote: 'Only one end named, so the other end means nothing.' },
    },
    {
      name: 'disabled',
      rules: <p>Use it when the setting cannot change right now, such as Delay start while a cycle runs. Say why on the display.</p>,
      pair: { do: <Unit><Stack gap="sm"><p className="flush">Cooking · 12 min left</p><Switch label="Delay start" offLabel="Off" onLabel="On" disabled /></Stack></Unit>, doNote: 'The display says why the switch is locked.', dont: <Switch label="Delay start" offLabel="Off" onLabel="On" disabled />, dontNote: 'A locked switch with no reason anywhere.' },
    },
  ],
  related: [['/components/button', 'Button', 'An action that runs once.'], ['/components/checkbox', 'Checkbox', 'A choice in a form sent later.'], ['/components/segmented-control', 'SegmentedControl', 'One of three or more modes.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Switch pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/', why: 'Role, state and keyboard expectations for a switch.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why on is told by position, lamp and word, not by colour.' },
    { title: 'Vitsœ · Dieter Rams: ten principles for good design', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
