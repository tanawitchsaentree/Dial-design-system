// The twelve patterns every kiln book covers (component-depth.md, G-IA1): the problem, the anatomy of
// the solution, a live example built from dial's components, variations and the components it uses.
// Live renders reuse the Code-tab examples in ../examples, so a pattern shows the same code the
// component pages test. A pattern that needs a component dial does not have yet says so in `gap`.
import { Button, Card, Heading, Text } from 'dial-react';
import type { PatternDepth } from '../patterns/PatternDepth';
import BadgeInList from '../examples/BadgeInList';
import BadgeSummary from '../examples/BadgeSummary';
import ButtonInUnit from '../examples/ButtonInUnit';
import ButtonStates from '../examples/ButtonStates';
import CheckboxStates from '../examples/CheckboxStates';
import ChipControlled from '../examples/ChipControlled';
import ChipRemovable from '../examples/ChipRemovable';
import DeviceCardLamp from '../examples/DeviceCardLamp';
import DialogBasic from '../examples/DialogBasic';
import DialogPending from '../examples/DialogPending';
import DisplayInUnit from '../examples/DisplayInUnit';
import InputBasic from '../examples/InputBasic';
import InputError from '../examples/InputError';
import ProgressInUnit from '../examples/ProgressInUnit';
import ProgressIndeterminate from '../examples/ProgressIndeterminate';
import SelectLong from '../examples/SelectLong';
import StackForm from '../examples/StackForm';
import SwitchStates from '../examples/SwitchStates';
import TabsManyRooms from '../examples/TabsManyRooms';
import ToastAction from '../examples/ToastAction';
import ToastUndo from '../examples/ToastUndo';

const c = (slug: string, label: string, why: string): [string, string, string] => [`/components/${slug}`, label, why];

function EmptyRoom() {
  return (
    <Card header={<Heading level={3}>Kitchen</Heading>} footer={<Button kind="primary">Add a device</Button>} wordmark="dial" model="room">
      <Text tone="secondary">No devices in this room yet.</Text>
    </Card>
  );
}

const P: Record<string, PatternDepth> = {
  'common-actions': {
    title: 'Common actions',
    lede: 'Where the actions of a unit go, and which one gets the orange.',
    problem: <p>A device can do many things, but a person comes to it for one. P1 decides the answer. Each unit has one loud control in orange, and every other action is a plain key beside or below it.</p>,
    anatomy: [['Display', 'says the state the action will change'], ['Primary control', 'the one orange Button or knob'], ['Keys', 'secondary Buttons in body colour, in a row at the bottom']],
    example: { title: 'Keys at the bottom of a unit, under the display', render: <ButtonInUnit /> },
    variations: [{ title: 'Disabled and full width', text: 'A key that cannot act now loses its height. A single action can span the unit.', render: <ButtonStates /> }],
    pairs: [],
    related: [c('button', 'Button', 'the primary control and the plain keys'), c('device-card', 'DeviceCard', 'places the display, knob and keys')],
  },
  dialogs: {
    title: 'Dialogs',
    lede: 'A sheet that asks one question about a device and waits for the answer.',
    problem: <p>Some changes need a decision before they happen, such as deleting a schedule. A dialog stops the screen and asks one question. It has a title that asks it, keys that answer it and one orange key for the answer that acts.</p>,
    anatomy: [['Title', 'the question, in a few words'], ['Body', 'what will happen, or one field'], ['Keys', 'Cancel and the one orange key']],
    example: { title: 'A sheet that asks one question', render: <DialogBasic /> },
    variations: [{ title: 'Waiting for the device', text: 'The sheet stays open while the device answers, then closes.', render: <DialogPending /> }],
    pairs: [],
    related: [c('dialog', 'Dialog', 'the sheet, focus trap and Escape'), c('button', 'Button', 'the answer keys')],
  },
  'disabled-states': {
    title: 'Disabled states',
    lede: 'How a part shows that it cannot be used right now.',
    problem: <p>A key that does nothing when pressed is confusing. In dial a disabled part loses its height and lies flat, the way a locked key on a real appliance sits flush. Its label stays readable, and the display or a hint says why.</p>,
    anatomy: [['Flat part', 'no shadow and half opacity'], ['Readable label', 'the printing keeps its contrast'], ['Reason', 'the display or a hint says what to do']],
    example: { title: 'Off, on and disabled switches', render: <SwitchStates /> },
    variations: [{ title: 'Checkboxes', text: 'A disabled checkbox loses its height and its tick stays readable.', render: <CheckboxStates /> }],
    pairs: [],
    related: [c('switch', 'Switch', 'disabled cap'), c('checkbox', 'Checkbox', 'disabled key'), c('button', 'Button', 'disabled key')],
  },
  'empty-states': {
    title: 'Empty states',
    lede: 'What a room or list shows when there is nothing in it yet.',
    problem: <p>An empty area should say what is missing and offer the one action that fills it. It uses the same card as a full one, so the screen keeps its shape when the first device arrives.</p>,
    anatomy: [['Card', 'the same body as a full unit'], ['Line of text', 'what is missing, in the lighter ink'], ['Primary key', 'the one action that fills it']],
    example: { title: 'A room with no devices', render: <EmptyRoom /> },
    variations: [],
    pairs: [],
    related: [c('card', 'Card', 'the body'), c('text', 'Text', 'the line that says what is missing'), c('button', 'Button', 'the one orange action')],
  },
  filtering: {
    title: 'Filtering',
    lede: 'Narrowing a list of devices to the ones a person cares about.',
    problem: <p>A home with many devices needs a way to show only lamps, or only what is on. Chips are the filters. The screen keeps the set of chosen chips and says what it shows, so a filtered list is never mistaken for the whole home.</p>,
    anatomy: [['Chips', 'one per filter, pressed when on'], ['Summary', 'a line that says what is shown'], ['List', 'the units that match']],
    example: { title: 'Controlled filters that say what they show', render: <ChipControlled /> },
    variations: [{ title: 'Removable filters', text: 'Each chip has its own remove key with a full target.', render: <ChipRemovable /> }],
    pairs: [],
    related: [c('chip', 'Chip', 'the filter keys'), c('text', 'Text', 'the summary line')],
  },
  forms: {
    title: 'Forms',
    lede: 'Settings and set-up, one short group at a time.',
    problem: <p>Set-up asks for names, times and networks. Keep each group short, put each label above or beside its field and check values as they are entered. A field with a problem prints the problem under the well with a glyph.</p>,
    anatomy: [['Group', 'a Stack of rows'], ['Field', 'a label printed above a recessed well'], ['Error', 'the problem printed under the well'], ['Primary key', 'Save or Connect']],
    example: { title: 'A settings group with each label beside its value', render: <StackForm /> },
    variations: [{ title: 'A text field', text: 'The label is printed above a well the width of its column.', render: <InputBasic /> }, { title: 'An error', text: 'The field is marked invalid and the problem is printed under it.', render: <InputError /> }],
    pairs: [],
    related: [c('input', 'Input', 'text fields'), c('select', 'Select', 'choices from a list'), c('stack', 'Stack', 'the rows')],
  },
  loading: {
    title: 'Loading',
    lede: 'What a unit shows while a device is busy or has not answered.',
    problem: <p>Devices take time to answer. The unit keeps its layout and its display says the state. A groove shows how far a job has run when that is known, and a still row of ticks says Working when it is not.</p>,
    anatomy: [['Display', 'says what the device is doing'], ['Progress', 'how far, or Working'], ['Keys', 'stay in place, disabled if they cannot act']],
    example: { title: 'The display says the state and the groove how far', render: <ProgressInUnit /> },
    variations: [{ title: 'Unknown length', text: 'With no value, the ticks stay still and the word says Working.', render: <ProgressIndeterminate /> }],
    pairs: [],
    related: [c('progress', 'Progress', 'how far a job has run'), c('display', 'Display', 'the state')],
  },
  notifications: {
    title: 'Notifications',
    lede: 'Telling a person that something happened, without taking over the screen.',
    problem: <p>A cycle ends or a device drops off the network. A toast says so in a short line with a status word and a glyph. It stays at least five seconds and is announced to screen readers. One action key, such as Undo or Try again, is allowed.</p>,
    anatomy: [['Toast', 'a short body above the page'], ['Status', 'a glyph and a word'], ['Action', 'one optional key']],
    example: { title: 'Undo from the toast', render: <ToastUndo /> },
    variations: [{ title: 'Try again', text: 'One plastic key to retry after a failure.', render: <ToastAction /> }],
    pairs: [],
    related: [c('toast', 'Toast', 'the message and its live region'), c('badge', 'Badge', 'the status word inside a unit')],
  },
  'overflow-content': {
    title: 'Overflow content',
    lede: 'What happens when there are more rooms or choices than fit.',
    problem: <p>A home can have many rooms and a list can have many cities. Tabs wrap onto a second row and keep every name visible. Long lists scroll inside their panel. Nothing is cut off without a way to reach it.</p>,
    anatomy: [['Tabs', 'wrap onto more rows'], ['Select panel', 'scrolls inside itself'], ['Typing', 'jumps to a choice by its first letters']],
    example: { title: 'Five rooms wrap onto a second row', render: <TabsManyRooms /> },
    variations: [{ title: 'A long list', text: 'The panel scrolls, and typing the first letters jumps to a city.', render: <SelectLong /> }],
    pairs: [],
    related: [c('tabs', 'Tabs', 'rooms'), c('select', 'Select', 'long lists')],
  },
  'read-only-states': {
    title: 'Read-only states',
    lede: 'Showing a value a person can read but cannot change here.',
    problem: <p>Some values only report, such as the outdoor temperature or energy used today. They go in a display, which is a live region and never a control. A reading never looks like a key.</p>,
    anatomy: [['Display', 'the value and its unit'], ['Label', 'what the value is'], ['Keys', 'only for things that can change']],
    example: { title: 'The window at the top of a unit', render: <DisplayInUnit /> },
    variations: [],
    pairs: [],
    related: [c('display', 'Display', 'read-only values'), c('text', 'Text', 'labels')],
  },
  search: {
    title: 'Search',
    lede: 'Finding a device or a setting by name.',
    problem: <p>In a large home, typing a name is faster than scrolling. A text field with a printed label filters the list below it as the person types. The list says how many devices match.</p>,
    gap: 'dial has no search field or results list yet. An Input with a label stands in until they are built.',
    anatomy: [['Field', 'an Input labelled Search'], ['Results', 'the units whose names match'], ['Count', 'how many match']],
    example: { title: 'A text field used for search', render: <InputBasic /> },
    variations: [],
    pairs: [],
    related: [c('input', 'Input', 'the search field')],
  },
  'status-indicators': {
    title: 'Status indicators',
    lede: 'Showing whether each device is on, off, busy or in trouble.',
    problem: <p>Status must read at a glance and without colour. A badge prints a small lamp and a word, such as On or Fault. In a list each row gets one badge at the end of the line. A summary counts each state.</p>,
    anatomy: [['Lamp', 'a small printed glyph'], ['Word', 'the state'], ['Place', 'at the end of the line or in the display']],
    example: { title: 'One badge per row in a list of devices', render: <BadgeInList /> },
    variations: [{ title: 'Summary', text: 'Counts of each state, every one a glyph and a word.', render: <BadgeSummary /> }, { title: 'In a unit', text: 'A lamp unit uses its key and display for status.', render: <DeviceCardLamp /> }],
    pairs: [],
    related: [c('badge', 'Badge', 'lamp and word'), c('display', 'Display', 'state inside a unit')],
  },
};

export const PATTERN_DEPTH: Record<string, PatternDepth> = Object.fromEntries(Object.entries(P).map(([slug, p]) => [`/patterns/${slug}`, p]));
