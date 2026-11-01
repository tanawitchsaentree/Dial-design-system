// The state matrix rows: every interactive component in every state it promises. System-owned. kiln's
// gate G-SV1 opens /patterns/states and checks that each cell looks different from its row's first cell
// and carries the state's ARIA (a cell named "disabled" must hold a disabled control, and so on). A
// missing route or an empty matrix fails the gate, so wave 1 adds a row the moment a component with
// states passes QA. Hover and focus are forced by the gates; the cells here are the static states.
//
// Shape of a row, from Pane (one line per component, the first cell is the default):
//   { component: 'Checkbox', family: 'Choices', cells: [
//       ['default', <Checkbox label="Prints" />],
//       ['checked', <Checkbox label="Prints" defaultChecked />],
//       ['disabled', <Checkbox label="Prints" disabled />],
//       ['invalid', <Checkbox label="Prints" invalid />],
//   ] }
// State words with an ARIA rule in G-SV1: disabled, invalid, readonly, required, checked, indeterminate,
// selected, loading, sorted. A cell may combine them ("disabled checked").
import type { ReactNode } from 'react';
import { Button, Checkbox, Chip, IconButton, Input, Rotary, SegmentedControl, Select, Slider, Switch } from 'dial-react';

export type StateRow = { component: string; family: string; cells: [string, ReactNode][] };

/** Families in reading order. Each family gets one section and the sentence in FAMILY_TEXT. */
export const FAMILIES: string[] = ['Fields', 'Choices', 'Ranges', 'Actions', 'Tables'];

/** One plain paragraph per family: how a state shows itself in this system (shape, tone, words). */
export const FAMILY_TEXT: Record<string, string> = {
  Fields: 'A field is a recessed well. A problem draws the well edge in the critical tone and prints the message under it with a glyph, so the state never rests on colour alone. A disabled field loses its inner shadow and fades. The rows hold Thai text, because tone marks stacked over a vowel are the first thing a short line box cuts.',
  Choices: 'A choice is a key that latches. On is shown by the key sitting low, a lit lamp or a tick in ink, and the word stays readable in every state. A disabled key loses its height and fades, but keeps showing whether it is on.',
  Ranges: 'A range is a cap in a groove or a knob over a ring of ticks. The reading is printed beside it. A disabled range keeps its position and its reading, and fades so it reads as locked.',
  Actions: 'An action is a raised key. A disabled key loses its height and its shadow and fades, so it looks like a key that cannot be pressed.',
};

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const power = <svg {...icon}><path d="M12 3v8M7 6.5a7 7 0 1 0 10 0" /></svg>;
const PROGRAMS = [{ value: 'cotton', label: 'Cotton' }, { value: 'synth', label: 'Synthetic' }, { value: 'wool', label: 'Wool' }];
const ROOMS = [{ value: 'kitchen', label: 'ห้องครัว' }, { value: 'living', label: 'ห้องนั่งเล่น' }, { value: 'bed', label: 'ห้องนอนใหญ่' }];

/** The rows. One per interactive component; the first cell is the default. */
export const STATE_ROWS: StateRow[] = [
  { component: 'Input', family: 'Fields', cells: [
    ['default', <Input label="ชื่อห้อง" />],
    ['filled', <Input label="ชื่อห้อง" defaultValue="ห้องนั่งเล่นชั้นบน" />],
    ['invalid', <Input label="ชื่อห้อง" defaultValue="ห้องนั่งเล่นชั้นบน" error="มีห้องชื่อนี้แล้ว" />],
    ['readonly', <Input label="ชื่อห้อง" defaultValue="ห้องครัว" readOnly />],
    ['disabled', <Input label="ชื่อห้อง" defaultValue="ห้องครัว" disabled />],
  ] },
  { component: 'Select', family: 'Fields', cells: [
    ['default', <Select label="ห้อง" options={ROOMS} placeholder="เลือกห้อง" />],
    ['with value', <Select label="ห้อง" options={ROOMS} defaultValue="living" />],
    ['disabled', <Select label="ห้อง" options={ROOMS} defaultValue="living" disabled />],
  ] },
  { component: 'Checkbox', family: 'Choices', cells: [
    ['default', <Checkbox label="Extra rinse" />],
    ['ticked', <Checkbox label="Extra rinse" defaultChecked />],
    ['mixed', <Checkbox label="Extra rinse" indeterminate />],
    ['disabled', <Checkbox label="Extra rinse" disabled />],
  ] },
  { component: 'Switch', family: 'Choices', cells: [
    ['default', <Switch label="Keep warm" />],
    ['checked', <Switch label="Keep warm" defaultChecked />],
    ['disabled', <Switch label="Keep warm" disabled />],
    ['disabled checked', <Switch label="Keep warm" defaultChecked disabled />],
  ] },
  { component: 'Chip', family: 'Choices', cells: [
    ['default', <Chip>Kitchen</Chip>],
    ['selected', <Chip defaultSelected>Kitchen</Chip>],
    ['disabled', <Chip disabled>Kitchen</Chip>],
  ] },
  { component: 'SegmentedControl', family: 'Choices', cells: [
    ['default', <SegmentedControl label="Program" options={PROGRAMS} />],
    ['disabled', <SegmentedControl label="Program" options={PROGRAMS} defaultValue="cotton" disabled />],
  ] },
  { component: 'Slider', family: 'Ranges', cells: [
    ['default', <Slider label="Brightness" defaultValue={60} />],
    ['disabled', <Slider label="Brightness" defaultValue={60} disabled />],
  ] },
  { component: 'Rotary', family: 'Ranges', cells: [
    ['default', <Rotary label="Temperature" min={16} max={26} defaultValue={21} />],
    ['disabled', <Rotary label="Temperature" min={16} max={26} defaultValue={21} disabled />],
  ] },
  { component: 'Button', family: 'Actions', cells: [
    ['default', <Button>Start</Button>],
    ['disabled', <Button disabled>Start</Button>],
  ] },
  { component: 'IconButton', family: 'Actions', cells: [
    ['default', <IconButton label="Power">{power}</IconButton>],
    ['disabled', <IconButton label="Power" disabled>{power}</IconButton>],
  ] },
];
