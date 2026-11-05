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
import { Meter, RangeSlider, Scrubber } from 'dial-react';
import { Banner, EmptyState, Sheet } from 'dial-react';
import { List, Menu } from 'dial-react';
import { TimePicker } from 'dial-react';
import { Legend } from 'dial-react';
import { ActionSheet, BottomNav, Snackbar } from 'dial-react';

const NAV = [{ value: 'home', label: 'หน้าหลัก', href: '#home' }, { value: 'rooms', label: 'ห้อง', href: '#rooms' }, { value: 'media', label: 'สื่อ', href: '#media' }, { value: 'settings', label: 'ตั้งค่า', href: '#settings' }];
import { MediaPlayer, Queue } from 'dial-react';
import { Environment, PullToRefresh } from 'dial-react';
import { SceneCard, Slot, Tray } from 'dial-react';
import { Card, Display, Explain, ExplainMode, Icon, Stack, Wiring } from 'dial-react';

const LAMP_ACTIONS = [{ value: 'rename', label: 'เปลี่ยนชื่อ' }, { value: 'move', label: 'ย้ายห้อง' }, { value: 'remove', label: 'ลบออก', destructive: true }];

const QUEUE_TRACKS = [{ id: 'q1', title: 'เพลงกล่อมเตา', artist: 'วงอูล์ม', duration: 222 }, { id: 'q2', title: 'น้อยแต่ดีกว่า', artist: 'ฮอคชูเลอ', duration: 250 }];
const PLAYER_TRACK = [{ id: 'p1', title: 'Kiln song', artist: 'Ulm Quartet', source: 'Library', src: '', duration: 222 }];
const PLAYER_BROKEN = [{ id: 'p2', title: 'Field recording 3', artist: 'Archive', source: 'Library', src: 'data:audio/wav;base64,AAAA' }];

export type StateRow = { component: string; family: string; cells: [string, ReactNode][] };

/** Families in reading order. Each family gets one section and the sentence in FAMILY_TEXT. */
export const FAMILIES: string[] = ['Fields', 'Choices', 'Ranges', 'Actions', 'Messages', 'Panels', 'Tables'];

/** One plain paragraph per family: how a state shows itself in this system (shape, tone, words). */
export const FAMILY_TEXT: Record<string, string> = {
  Fields: 'A field is a recessed well. A problem draws the well edge in the critical tone and prints the message under it with a glyph, so the state never rests on colour alone. A disabled field loses its inner shadow and fades. The rows hold Thai text, because tone marks stacked over a vowel are the first thing a short line box cuts.',
  Choices: 'A choice is a key that latches. On is shown by the key sitting low, a lit lamp or a tick in ink, and the word stays readable in every state. A disabled key loses its height and fades, but keeps showing whether it is on.',
  Ranges: 'A range is a cap in a groove or a knob over a ring of ticks. The reading is printed beside it. A disabled range keeps its position and its reading, and fades so it reads as locked.',
  Actions: 'An action is a raised key. A disabled key loses its height and its shadow and fades, so it looks like a key that cannot be pressed.',
  Messages: 'A message is printing on the case. A tone shows as its own glyph and a word on the same plastic, never as a stripe or a tint, and an empty place shows its unlit window or holes with one line of words.',
  Panels: 'A panel is a body of its own. On a tall screen it docks to the bottom edge with a printed bar, and on a wide one it stands as a unit at the lower end.',
};

const power = <Icon name="power" />;
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
  { component: 'TimePicker', family: 'Fields', cells: [
    ['default', <TimePicker label="เริ่มโหมดกลางคืน" hourLabel="ชั่วโมง" minuteLabel="นาที" />],
    ['with value', <TimePicker label="เริ่มโหมดกลางคืน" hourLabel="ชั่วโมง" minuteLabel="นาที" defaultValue="22:30" />],
    ['12-hour', <TimePicker label="เริ่มโหมดกลางคืน" hourLabel="ชั่วโมง" minuteLabel="นาที" periodLabel="ช่วงเวลา" hourCycle="12" defaultValue="22:30" />],
    ['invalid', <TimePicker label="สิ้นสุดโหมดกลางคืน" hourLabel="ชั่วโมง" minuteLabel="นาที" defaultValue="21:00" error="เวลาสิ้นสุดต้องหลังเวลาเริ่ม" />],
    ['readonly', <TimePicker label="เริ่มโหมดกลางคืน" hourLabel="ชั่วโมง" minuteLabel="นาที" defaultValue="22:30" readOnly />],
    ['disabled', <TimePicker label="เริ่มโหมดกลางคืน" hourLabel="ชั่วโมง" minuteLabel="นาที" defaultValue="22:30" disabled />],
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
  { component: 'RangeSlider', family: 'Ranges', cells: [
    ['default', <RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} />],
    ['disabled', <RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} disabled />],
  ] },
  { component: 'Scrubber', family: 'Ranges', cells: [
    ['default', <Scrubber label="Ruhe, side A" duration={225} defaultValue={83} buffered={140} />],
    ['disabled', <Scrubber label="Nothing playing" duration={0} disabled />],
  ] },
  { component: 'Meter', family: 'Ranges', cells: [
    ['default', <Meter label="Battery" value={56} low={20} high={80} formatValue={(v) => `${v} %`} />],
    ['low', <Meter label="Battery" value={14} low={20} high={80} formatValue={(v) => `${v} %`} />],
    ['high', <Meter label="Battery" value={92} low={20} high={80} formatValue={(v) => `${v} %`} />],
  ] },
  { component: 'Rotary', family: 'Ranges', cells: [
    ['default', <Rotary label="Temperature" min={16} max={26} defaultValue={21} />],
    ['disabled', <Rotary label="Temperature" min={16} max={26} defaultValue={21} disabled />],
  ] },
  { component: 'Legend', family: 'Choices', cells: [
    ['default', <Legend label="Fan" options={['off', 'low', 'mid', 'high']} defaultValue="off" />],
    ['selected', <Legend label="Fan" options={['off', 'low', 'mid', 'high']} defaultValue="high" />],
    ['disabled', <Legend label="Fan" options={['off', 'low', 'mid', 'high']} defaultValue="off" disabled />],
  ] },
  { component: 'Button', family: 'Actions', cells: [
    ['default', <Button>Start</Button>],
    ['disabled', <Button disabled>Start</Button>],
  ] },
  { component: 'IconButton', family: 'Actions', cells: [
    ['default', <IconButton label="Power">{power}</IconButton>],
    ['disabled', <IconButton label="Power" disabled>{power}</IconButton>],
  ] },
  { component: 'Menu', family: 'Actions', cells: [
    ['default', <Menu label="ตัวเลือกของโคมไฟ" items={LAMP_ACTIONS} />],
    ['disabled', <Menu label="ตัวเลือกของโคมไฟ" items={LAMP_ACTIONS} disabled />],
  ] },
  { component: 'List', family: 'Choices', cells: [
    ['default', <List label="คิวเพลง" selectable style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><List.Item value="a" index={1} label="เพลงกล่อมเตา" description="3:42" /></List>],
    ['selected', <List label="คิวเพลง" selectable defaultValue="a" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><List.Item value="a" index={1} label="เพลงกล่อมเตา" description="3:42" /></List>],
    ['disabled', <List label="คิวเพลง" selectable style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><List.Item value="a" index={1} label="เพลงกล่อมเตา" description="ไม่มีในภูมิภาคนี้" disabled /></List>],
  ] },
  { component: 'Queue', family: 'Choices', cells: [
    ['default', <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}><Queue label="คิวถัดไป" defaultTracks={QUEUE_TRACKS} /></div>],
    ['selected', <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}><Queue label="คิวถัดไป" defaultTracks={QUEUE_TRACKS} playing="q1" words={{ playing: 'กำลังเล่น' }} /></div>],
  ] },
  { component: 'MediaPlayer', family: 'Actions', cells: [
    ['paused', <MediaPlayer tracks={PLAYER_TRACK} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }} />],
    ['loading', <MediaPlayer tracks={[]} loading style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }} />],
    ['offline', <MediaPlayer tracks={PLAYER_TRACK} offline style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }} />],
    ['error', <MediaPlayer tracks={PLAYER_BROKEN} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }} />],
  ] },
  { component: 'Banner', family: 'Messages', cells: [
    ['neutral', <Banner status="Away">Holiday mode is on.</Banner>],
    ['positive', <Banner tone="positive" status="Updated">Every lamp is up to date.</Banner>],
    ['warning', <Banner tone="warning" status="Filter">The filter is due.</Banner>],
    ['critical', <Banner tone="critical" status="Offline">The hub is offline.</Banner>],
    ['dismissible', <Banner status="Away" onDismiss={() => {}}>Holiday mode is on.</Banner>],
  ] },
  { component: 'EmptyState', family: 'Messages', cells: [
    ['words only', <EmptyState title="No devices yet">Add one here.</EmptyState>],
    ['display', <EmptyState drawing="display" title="No devices yet">Add one here.</EmptyState>],
    ['grille', <EmptyState drawing="grille" title="No devices yet">Add one here.</EmptyState>],
    ['with key', <EmptyState title="No devices yet" action={<Button>Add a device</Button>}>Add one here.</EmptyState>],
  ] },
  { component: 'Sheet', family: 'Panels', cells: [
    ['end', <Sheet modal={false} open placement="end" title="Desk lamp"><Slider label="Brightness" max={100} step={10} defaultValue={40} /></Sheet>],
    ['docked', <Sheet modal={false} open placement="bottom" title="Desk lamp"><Slider label="Brightness" max={100} step={10} defaultValue={40} /></Sheet>],
  ] },
  { component: 'BottomNav', family: 'Choices', cells: [
    ['default', <BottomNav layout="bar" label="ส่วนหลัก" items={NAV} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }} />],
    ['current', <BottomNav layout="bar" label="ส่วนหลัก" items={NAV} current="rooms" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }} />],
    ['rail', <BottomNav layout="rail" label="ส่วนหลัก" items={NAV} current="rooms" />],
  ] },
  { component: 'ActionSheet', family: 'Panels', cells: [
    ['default', <ActionSheet modal={false} open title="โคมไฟในครัว" items={LAMP_ACTIONS} cancelLabel="ยกเลิก" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }} />],
    ['disabled action', <ActionSheet modal={false} open title="โคมไฟในครัว" items={LAMP_ACTIONS.map((a) => (a.value === 'move' ? { ...a, disabled: true } : a))} cancelLabel="ยกเลิก" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }} />],
  ] },
  { component: 'Snackbar', family: 'Messages', cells: [
    ['positive', <Snackbar action={{ label: 'Undo', onAction: () => {} }}>Lamp removed</Snackbar>],
    ['neutral', <Snackbar tone="neutral" action={{ label: 'Undo', onAction: () => {} }}>Scene saved</Snackbar>],
    ['warning', <Snackbar tone="warning" action={{ label: 'Undo', onAction: () => {} }}>Heater set to 28 °C</Snackbar>],
    ['critical', <Snackbar tone="critical">Washer didn’t answer</Snackbar>],
  ] },
  { component: 'PullToRefresh', family: 'Messages', cells: [
    ['default', <PullToRefresh label="Readings" onRefresh={() => undefined} updated={new Date(2026, 10, 2, 10, 41)} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><List label="Readings"><List.Item label="Kitchen" description="21.5 °C" /></List></PullToRefresh>],
    ['loading', <PullToRefresh label="Readings" onRefresh={() => undefined} refreshing updated={new Date(2026, 10, 2, 10, 41)} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><List label="Readings"><List.Item label="Kitchen" description="21.5 °C" /></List></PullToRefresh>],
    ['disabled', <PullToRefresh label="Readings" onRefresh={() => undefined} disabled updated={new Date(2026, 10, 2, 10, 41)} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><List label="Readings"><List.Item label="Kitchen" description="21.5 °C" /></List></PullToRefresh>],
  ] },
  { component: 'Environment', family: 'Messages', cells: [
    ['live', <Environment room="Bedroom" temperature={19.0} readAt="10:42" readings={[{ kind: 'humidity', value: 51 }]} />],
    ['stale', <Environment room="Bedroom" temperature={19.0} readAt="10:17" status="stale" readings={[{ kind: 'humidity', value: 51 }]} />],
    ['offline', <Environment room="Bedroom" temperature={19.0} readAt="09:58" status="offline" readings={[{ kind: 'humidity', value: 51 }]} />],
  ] },
  { component: 'SceneCard', family: 'Choices', cells: [
    ['default', <SceneCard value="st-movie" name="ดูหนัง" steps={['ไฟ 20%']} words={{ kind: 'ฉาก' }} />],
    ['disabled', <SceneCard value="st-garden" name="ปาร์ตี้ในสวน" steps={['ไฟทางเดิน']} words={{ kind: 'ฉาก' }} disabled />],
  ] },
  { component: 'Slot', family: 'Choices', cells: [
    ['empty', <Slot label="ห้องนั่งเล่น" words={{ legend: 'การ์ดฉาก', empty: 'ว่าง', running: 'กำลังทำงาน' }} />],
    ['inserted', <Slot label="ห้องนั่งเล่น" words={{ legend: 'การ์ดฉาก', empty: 'ว่าง', running: 'กำลังทำงาน' }} defaultScene={{ value: 'st-movie', name: 'ดูหนัง', steps: ['ไฟ 20%'] }} />],
    ['disabled', <Slot label="โรงรถ" words={{ legend: 'การ์ดฉาก', empty: 'ว่าง', running: 'กำลังทำงาน' }} disabled />],
  ] },
  { component: 'Tray', family: 'Actions', cells: [
    ['default', <Tray label="ปุ่มเครื่องทำความร้อน"><Button>ประหยัด</Button><Button>เร่ง</Button></Tray>],
    ['disabled', <Tray label="ปุ่มเครื่องทำความร้อน"><Button disabled>ประหยัด</Button><Button disabled>เร่ง</Button></Tray>],
  ] },
  { component: 'Wiring', family: 'Messages', cells: [
    ['waiting', <Wiring label="ความสัมพันธ์" activeWord="ทำงานอยู่" waitingWord="รออยู่" links={[{ from: 's', to: 'h', label: 'หลัง 23:00', text: 'โหมดกลางคืนลดฮีตเตอร์เป็น 18' }]}><Wiring.Node id="s"><Switch label="โหมดกลางคืน" /></Wiring.Node><Wiring.Node id="h"><Card padding="unit"><Display label="ฮีตเตอร์" value="21" digits={2} /></Card></Wiring.Node></Wiring>],
    ['active', <Wiring label="ความสัมพันธ์" activeWord="ทำงานอยู่" waitingWord="รออยู่" links={[{ from: 's', to: 'h', label: 'หลัง 23:00', text: 'โหมดกลางคืนลดฮีตเตอร์เป็น 18', active: true }]}><Wiring.Node id="s"><Switch label="โหมดกลางคืน" defaultChecked /></Wiring.Node><Wiring.Node id="h"><Card padding="unit"><Display label="ฮีตเตอร์" value="18" digits={2} /></Card></Wiring.Node></Wiring>],
  ] },
  { component: 'ExplainMode', family: 'Messages', cells: [
    ['closed', <ExplainMode toggleLabel="วิธีใช้"><Card padding="unit"><Stack direction="row" gap="xl"><Explain name="ระดับเสียง" does="ตั้งความดังของลำโพง"><Rotary kind="key" label="ระดับเสียง" min={0} max={10} defaultValue={5} /></Explain></Stack></Card></ExplainMode>],
    ['open', <ExplainMode toggleLabel="วิธีใช้" defaultOpen><Card padding="unit"><Stack direction="row" gap="xl"><Explain name="ระดับเสียง" does="ตั้งความดังของลำโพง"><Rotary kind="key" label="ระดับเสียง" min={0} max={10} defaultValue={5} /></Explain></Stack></Card></ExplainMode>],
  ] },
];
