// Usage tab for Label (component-depth.md U1–U14). Label is the printed name above a part.
import { Label, Stack, Textarea } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const field = (id: string) => <input id={id} defaultValue="Living room" style={{ inlineSize: '100%', boxSizing: 'border-box', font: 'inherit', minBlockSize: 'var(--ds-control-md)' }} />;

export const LABEL: Depth = {
  overview: (
    <>
      <p>Label is the printed name of a part, such as a field, a slider or a group of keys. It sits on the inset line above the part, in medium ink, and can say in a word whether the part is required or optional, and add one line of help.</p>
      <p>Input, Textarea and Select print their own labels in the same look, so you only reach for Label when you build a part of your own, or compose a form field from separate pieces. Pressing the words moves focus to the part.</p>
    </>
  ),
  whenToUse: ['To name a part you built yourself, such as a native input, a custom control or a group.', 'To mark a part as required or optional in words, and to add a line of help.'],
  whenNot: [
    { situation: 'A text field that needs a name', to: '/components/input', label: 'Input' },
    { situation: 'A short running message after the action', to: '/components/text', label: 'Text' },
  ],
  variants: { na: 'Label has one look, a name in medium ink. How the required mark prints is a prop, covered under Modifiers.' },
  anatomy: {
    render: <Stack gap="md"><Label htmlFor="label-anatomy" required help="Shown on the room card.">Room name</Label>{field('label-anatomy')}</Stack>,
    parts: [
      { part: 'Name', selector: '[data-component="Label"] > label > span:first-child', what: 'The printed name in medium ink, at the label size.' },
      { part: 'Mark', selector: '[data-component="Label"] > label > span:nth-child(2)', what: 'The word required or optional at the far end of the line, in secondary ink.' },
      { part: 'Help', selector: '[data-component="Label"] > p', what: 'One line under the name in secondary ink, with an id the part can point to.' },
    ],
  },
  sizes: { na: 'Label has one size, the label size, the same as the printing on every other part.' },
  emphasis: { na: 'A label is printing and is never the loud part of a unit. It has no orange and no emphasis levels.' },
  placement: {
    rows: [['Above a field or a group', 'The label stands on the inset line directly over the part, with the help between them.'], ['Beside a switch or a check', 'Switch and Checkbox print their own word beside the part, so no Label is needed.']],
    examples: [{ title: 'Above your own field', render: <Unit><Stack gap="sm"><Label htmlFor="label-place" required>Room name</Label>{field('label-place')}</Stack></Unit> }],
  },
  combinations: {
    good: [['Label + a native input', 'Tie them with htmlFor and id; the mark becomes part of the field’s name.'], ['Label + Text', 'Put long guidance in a Text under the part, and keep the label’s help to one line.']],
    avoid: [{ title: 'a Label above an Input', why: 'Input already prints its label, so the part is named twice and read out twice.', render: <Unit><Stack gap="sm"><Label htmlFor="label-avoid">Note</Label><Textarea label="Note" rows={2} id="label-avoid" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the part with a noun, as in <em>Room name</em>. Do not end with a colon and do not write “Enter”. The mark says whether it is needed.</p>,
    pair: {
      do: <Label htmlFor="label-do" required>Room name</Label>, doNote: 'A noun, and the mark says it is needed.',
      dont: <Label htmlFor="label-dont">Please enter the room name:</Label>, dontNote: 'An instruction and a colon, in place of the name.',
    },
    overflow: { text: 'A long name wraps under itself. The mark stays on the first line at the far end and does not move.', render: <Label htmlFor="label-long" required>Room name for the upstairs guest bedroom at the back of the house</Label> },
    rtl: { text: 'In right-to-left languages the name starts on the right and the mark moves to the left end.', render: <div dir="rtl"><Label htmlFor="label-rtl" required requiredText="مطلوب">اسم الغرفة</Label></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap and the mark keeps its place.', render: <Label htmlFor="label-de" required requiredText="erforderlich">Bezeichnung des Raumes</Label> },
  },
  behaviours: {
    states: [
      ['Plain', 'The name in primary ink.', 'Read as the name of the part.'],
      ['Required', 'The word at the far end, or a star after the name.', 'The word is part of the name, read as “Room name required”.'],
      ['Optional', 'The word optional at the far end.', 'Read as “Description optional”.'],
    ],
    interactions: [
      ['Pointer', 'Press the label', 'Focus moves to the part named by htmlFor.', 'native label'],
      ['Keyboard', 'Tab', 'A label is not a stop. Tab reaches the part it names.', 'native'],
      ['Screen reader', 'Read', 'The label is the part’s accessible name; the help is its description when the part lists the helpId.', 'label, aria-describedby'],
    ],
    loading: <p>Label has no loading state.</p>,
    focus: <p>A label takes no focus. Pressing it moves focus to the part it names.</p>,
  },
  deepDive: { na: 'Label has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'required / optional',
      rules: <p>Mark the exception. If most parts are required, mark the optional ones; if most are optional, mark the required ones. Set <code>required</code> on the control too, because the label only prints the mark.</p>,
      pair: { do: <Stack gap="md"><Label htmlFor="label-m1" required>Room name</Label><Label htmlFor="label-m2" optional>Description</Label></Stack>, doNote: 'Both marks are words that can be read.', dont: <Label htmlFor="label-m3">Room name</Label>, dontNote: 'No mark, so nobody learns which parts may be left empty.' },
    },
    {
      name: 'mark',
      rules: <p><code>word</code> (default) prints the word at the far end of the line. <code>glyph</code> prints a star straight after the name and keeps the word for screen readers. Use the star only where the form says once what it means.</p>,
      pair: { do: <Label htmlFor="label-g1" required mark="glyph">Room name</Label>, doNote: 'The star is ink and the word stays for screen readers.', dont: <Label htmlFor="label-g2" required mark="glyph">Room name *</Label>, dontNote: 'Two stars, one typed by hand. Let the mark print the star.' },
    },
    {
      name: 'help',
      rules: <p>One short line, such as the format or the limit. Pass <code>helpId</code> and list it in the part’s <code>aria-describedby</code>.</p>,
      pair: { do: <Label htmlFor="label-h1" help="Up to 350 characters.">Description</Label>, doNote: 'One line that the part can point to.', dont: <Label htmlFor="label-h2" help="Write a short description of the room. It is shown on the card, in the list and in search, so keep it clear and under 350 characters.">Description</Label>, dontNote: 'A paragraph in a label. Move it to a Text under the part.' },
    },
  ],
  related: [['/components/input', 'Input', 'A text field that prints this label itself.'], ['/components/textarea', 'Textarea', 'Several lines, same label.'], ['/components/select', 'Select', 'Pick one of a list, same label.']],
  references: [
    { title: 'WCAG 2.2 · 3.3.2 Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html', why: 'Why a part needs a visible name and a mark for what is required.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why required is a word or a star and not only a tint.' },
    { title: 'GOV.UK Design System · Text input', url: 'https://design-system.service.gov.uk/components/text-input/', why: 'Mark the optional fields, and keep the label a noun.' },
  ],
};
