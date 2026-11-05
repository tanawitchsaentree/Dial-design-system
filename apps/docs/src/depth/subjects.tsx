// How to render each component for the Style tab and the header's live demo, given the enum props
// a reader picks. Only the content is fixed here; which options exist comes from meta.json.
import type { ReactNode } from 'react';
import { useDemoTracks } from '../system/tones';
import { Accordion, AccordionItem, ActionSheet, Anchor, AppShell, AspectRatio, Autocomplete, Avatar, Badge, Banner, BarChart, BottomNav, Box, Breadcrumb, Button, Calendar, Card, Carousel, CarouselSlide, Center, Checkbox, Chip, ColorPicker, Combobox, CommandPalette, Container, ContextMenu, Crumb, DataGrid, DatePicker, DescriptionDetail, DescriptionList, DescriptionTerm, DeviceCard, Dialog, Display, Divider, Drawer, Dropzone, Editable, EmptyState, Environment, Explain, ExplainMode, FAB, Feed, FeedItem, Fieldset, FileUpload, Flex, FlexItem, Form, FormField, FormItem, FormSubmit, Grid, GridItem, Grille, Heading, HelperText, Icon, IconButton, Image, Input, InputGroup, KanbanBoard, Kbd, KbdCombo, Label, Legend, LineChart, Link, List, Listbox, MediaPlayer, Menu, Meter, MultiSelect, Navbar, NavbarLink, NavigationMenu, NavigationMenuGroup, NavigationMenuItem, NavigationMenuLink, NotificationCenter, NotificationItem, NumberInput, OTPFlow, Onboarding, Pagination, PasswordInput, PieChart, PinInput, Popover, Progress, PullToRefresh, Queue, Radio, RadioCard, RadioCards, RadioGroup, RangePicker, RangeSlider, Rating, ResetPasswordForm, RichTextEditor, Rotary, SceneCard, Scrubber, SearchInput, SegmentedControl, Select, SettingsLayout, SettingsRow, SettingsSection, Sheet, Sidebar, SidebarGroup, SidebarItem, SidebarToggle, SignInForm, SignUpForm, Skeleton, Slider, Slot, Snackbar, Spacer, Sparkline, Spinner, Stack, Stat, Step, Stepper, Switch, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Tabs, TagInput, Text, Textarea, TimePicker, Timeline, TimelineItem, Toast, Tooltip, TransferList, Tray, TreeItem, TreeView, VirtualList, VisuallyHidden, Wiring, Wizard, WizardStep } from 'dial-react';

type P = Record<string, string>;
// bare: the subject must not sit on a second pane. true = it is its own surface (Card, a chart, a chat
// thread) and must paint one, which G-BR1 measures; 'layout' = it only places other things (Container,
// Grid, Stack) and paints nothing on purpose.
export interface Subject { render: (p: P, disabled?: boolean) => ReactNode; code: (p: P) => string; disabled?: boolean; bare?: boolean | 'layout' }

/** Marks a bare subject for the gates: data-bare="surface" must paint a surface (G-BR1), "layout" is skipped. */
export const BareHost = ({ bare, children }: { bare: boolean | 'layout'; children: ReactNode }) => <div className="bare-subject" data-bare={bare === 'layout' ? 'layout' : 'surface'}>{children}</div>;

/** The Style tab's player plays the book's demo tones, like every other player in the book. */
function SubjectPlayer() {
  const tracks = useDemoTracks(2);
  return <MediaPlayer tracks={tracks ?? []} loading={!tracks} />;
}
const attrs = (p: P) => Object.entries(p).map(([k, v]) => ` ${k}="${v}"`).join('');

/** The surface a subject sits on in the docs. A system whose components need a surface under them
 *  (text over imagery, translucent material) replaces this with its own surface. */
export const OnSurface = ({ children }: { children: ReactNode }) => <div className="demo-row spec-row">{children}</div>;

export const SUBJECTS: Record<string, Subject> = {
  KanbanBoard: { render: () => <div style={{ inlineSize: 'var(--ds-layout-container-lg)', maxInlineSize: '100%', minBlockSize: 'var(--ds-layout-frame-lg)' }}><KanbanBoard label="Chores for the week" columns={[{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'Doing', limit: 2 }, { id: 'done', title: 'Done' }]} cards={[{ id: 'kettle', title: 'Descale the kettle', detail: 'Mali, this week' }, { id: 'filters', title: 'Order boiler filters', detail: 'Due Friday' }, { id: 'lamp', title: 'Replace the hall lamp' }, { id: 'rads', title: 'Bleed the radiators' }, { id: 'boiler', title: 'Book the boiler service' }]} defaultValue={{ todo: ['kettle', 'filters'], doing: ['lamp', 'rads', 'boiler'] }} /></div>, code: () => `<KanbanBoard
  label="Chores for the week"
  columns={[{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'Doing', limit: 2 }]}
  cards={[{ id: 'kettle', title: 'Descale the kettle' }]}
  defaultValue={{ todo: ['kettle'] }}
/>` },
  NotificationCenter: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-phone)', maxInlineSize: '100%' }}><NotificationCenter><NotificationItem id="washer" day="Today" title="Washer finished" time="22:40" unread>Laundry room</NotificationItem><NotificationItem id="night" day="Today" title="Night mode started" time="22:30" unread>Heating set to 18</NotificationItem><NotificationItem id="door" day="Yesterday" title="Front door locked" time="23:10">Hall</NotificationItem><NotificationItem id="filter" day="Yesterday" title="Filter due" time="18:05" unread>Hall</NotificationItem></NotificationCenter></div>, code: () => `<NotificationCenter>
  <NotificationItem id="washer" day="Today" title="Washer finished" time="22:40" unread>Laundry room</NotificationItem>
  <NotificationItem id="door" day="Yesterday" title="Front door locked" time="23:10">Hall</NotificationItem>
</NotificationCenter>` },
  Onboarding: { render: () => <Stack direction="row" gap="md" align="center"><Button id="tour-heat">Heating</Button><Button id="tour-lamp">Lamp</Button><Button id="tour-fan">Fan</Button><Onboarding defaultOpen steps={[{ target: 'tour-heat', title: 'Heating', text: 'Turns the radiator on or off.' }, { target: 'tour-lamp', title: 'Lamp', text: 'Dims the lamp.' }, { target: 'tour-fan', title: 'Fan', text: 'Runs the fan.' }]} /></Stack>, code: () => `<Onboarding
  defaultOpen
  steps={[
    { target: 'tour-heat', title: 'Heating', text: 'Turns the radiator on or off.' },
    { target: 'tour-lamp', title: 'Lamp', text: 'Dims the lamp.' },
    { target: 'tour-fan', title: 'Fan', text: 'Runs the fan.' },
  ]}
/>` },
  Feed: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><Feed label="House activity" hasMore newCount={2}><FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem><FeedItem name="Tan Saen" time="21:15">Heating is down to 18.</FeedItem><FeedItem name="Pim Nok" time="19:02">Hall lamp set to warm.</FeedItem><FeedItem name="Ann Dee" time="18:30">Door locked.</FeedItem></Feed></div>, code: () => `<Feed label="House activity" hasMore newCount={2}>
  <FeedItem name="Mali Kaew" time="22:40">…</FeedItem>
  <FeedItem name="Tan Saen" time="21:15">…</FeedItem>
</Feed>` },
  SettingsLayout: { render: () => <div style={{ display: 'grid', gap: 'var(--ds-gap-xl)' }}><div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><SettingsLayout title="Fan" titleLevel={2}><SettingsSection heading="Speed"><SettingsRow label="Oscillate" description="Turns side to side.">{({ labelId }) => <Switch aria-labelledby={labelId} defaultChecked />}</SettingsRow><SettingsRow label="Quiet hours" description="Runs low after 23:00.">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection><SettingsSection heading="Timer"><SettingsRow label="Switch off">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow><SettingsRow label="Away mode" description="Needs a second user." disabled>{({ labelId }) => <Switch aria-labelledby={labelId} disabled />}</SettingsRow></SettingsSection></SettingsLayout></div><div style={{ inlineSize: 'var(--ds-layout-frame-xs)', maxInlineSize: '100%' }}><SettingsLayout title="Fan" titleLevel={2}><SettingsSection heading="Speed"><SettingsRow label="Oscillate" description="Turns side to side.">{({ labelId }) => <Switch aria-labelledby={labelId} defaultChecked />}</SettingsRow></SettingsSection></SettingsLayout></div></div>, code: () => `<SettingsLayout title="Fan" titleLevel={2}>
  <SettingsSection heading="Speed">
    <SettingsRow label="Oscillate" description="Turns side to side.">
      {({ labelId }) => <Switch aria-labelledby={labelId} />}
    </SettingsRow>
  </SettingsSection>
</SettingsLayout>` },
  PieChart: { render: (p) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%', display: 'grid', gap: 'var(--ds-gap-3xl)' }}><PieChart label="Heating by room" slices={[{ name: 'Living room', value: 380 }, { name: 'Bedrooms', value: 240 }, { name: 'Kitchen', value: 180 }, { name: 'Bathroom', value: 120 }]} formatValue={(v) => `${v} kWh`} {...p} /><PieChart variant="pie" label="Where the water goes" slices={[{ name: 'Washing', value: 52 }, { name: 'Showers', value: 33 }, { name: 'Taps', value: 15 }]} formatValue={(v) => `${v} l`} /></div>, code: (p) => `<PieChart${attrs(p)}\n  label="Heating by room"\n  slices={[{ name: 'Living room', value: 380 }, { name: 'Bedrooms', value: 240 }, { name: 'Kitchen', value: 180 }, { name: 'Bathroom', value: 120 }]}\n  formatValue={(v) => \`\${v} kWh\`}\n/>` },
  BarChart: { render: (p) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%', display: 'grid', gap: 'var(--ds-gap-3xl)' }}><BarChart label="Energy by day, kWh" categories={['Mon', 'Tue', 'Wed', 'Thu']} series={[{ name: 'Heating', values: [12, 18, 9, 15] }, { name: 'Hot water', values: [6, 7, 11, 5] }]} formatValue={(v) => `${v} kWh`} {...p} /><BarChart label="Hours the heating ran" orientation="horizontal" categories={['Living room', 'Bedroom', 'Kitchen']} series={[{ name: 'Hours', values: [9, 6, 4.5] }]} formatValue={(v) => `${v} h`} /></div>, code: (p) => `<BarChart${attrs(p)}\n  label="Energy by day"\n  categories={['Mon', 'Tue', 'Wed', 'Thu']}\n  series={[{ name: 'Heating', values: [12, 18, 9, 15] }, { name: 'Hot water', values: [6, 7, 11, 5] }]}\n  formatValue={(v) => \`\${v} kWh\`}\n/>` },
  Sparkline: { render: () => <Stack gap="md"><Sparkline showValue label="Power, last 7 days" unit="kW" values={[0.4, 0.5, 2.2, 2, 0.9, 1.2, 1.8, 2.6]} /><Sparkline showValue label="Solar, last 7 days" unit="kWh" values={[6.5, 6, 4.1, 3.2, 2, 0.6, 0.2]} /><Sparkline label="Cellar temperature, last 7 days" values={[]} /></Stack>, code: () => `<Sparkline label="Power, last 7 days" unit="kW" values={[0.4, 0.5, 2.2, 2, 0.9, 1.2, 1.8]} />
<Sparkline showValue label="Solar, last 7 days" unit="kWh" values={[6.5, 6, 4.1, 3.2, 2, 0.6, 0.2]} />` },
  LineChart: { render: () => <LineChart label="Temperature this week" unit="°C" categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} series={[{ label: 'Indoor', values: [20.5, 21, 21.5, 20.8, 21.2, 22, 21.6] }, { label: 'Outdoor', values: [8, 6, 9, 12, 10, 7, 5] }, { label: 'Target', values: [21, 21, 21, 21, 21, 21, 21] }]} />, code: () => `<LineChart
  label="Temperature this week"
  unit="°C"
  categories={['Mon', 'Tue', 'Wed']}
  series={[
    { label: 'Indoor', values: [20.5, 21, 21.5] },
    { label: 'Outdoor', values: [8, 6, 9] },
  ]}
/>` },
  RichTextEditor: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%', minBlockSize: 'var(--ds-layout-frame-xs)' }}><RichTextEditor label="Notes" name="note" defaultValue="<h2>Heating</h2><p>Keep the <strong>hall</strong> at 18 until <em>Friday</em>.</p><ul><li>Check the valves</li><li>Bleed the radiators</li></ul>" /></div>, code: () => `<RichTextEditor
  label="Notes"
  defaultValue={note}
  onChange={setNote}
/>` },
  AuthForms: { render: () => <div style={{ display: 'grid', gap: 'var(--ds-gap-xl)', inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><SignInForm remember forgotHref="#reset" alternateHref="#sign-up" onSubmit={(v) => { document.documentElement.dataset.signin = JSON.stringify(v); }} /><SignUpForm alternateHref="#sign-in" onSubmit={(v) => { document.documentElement.dataset.signup = JSON.stringify(v); }} /><ResetPasswordForm backHref="#sign-in" onSubmit={(v) => { document.documentElement.dataset.reset = JSON.stringify(v); }} /><ResetPasswordForm backHref="#sign-in" sent defaultEmail="mika@example.com" /></div>, code: () => `<SignInForm remember forgotHref="/reset" alternateHref="/sign-up" onSubmit={({ email, password }) => signIn(email, password)} />
<SignUpForm alternateHref="/sign-in" onSubmit={(v) => createAccount(v)} />
<ResetPasswordForm backHref="/sign-in" sent={sent} onSubmit={({ email }) => sendLink(email)} />` },
  CommandPalette: { render: () => <CommandPalette trigger={<Button>Find a command</Button>} commands={[{ id: 'lamps-off', label: 'Turn off all lamps', section: 'Rooms', shortcut: ['L'], keywords: ['light'] }, { id: 'heat-down', label: 'Lower heating to 18', section: 'Rooms', shortcut: ['H'] }, { id: 'door', label: 'Unlock the front door', section: 'Rooms', disabled: true }, { id: 'settings', label: 'Open settings', section: 'App', shortcut: ['Ctrl', ','] }]} />, code: () => `<CommandPalette
  trigger={<Button>Find a command</Button>}
  commands={[
    { id: 'lamps-off', label: 'Turn off all lamps', section: 'Rooms', shortcut: ['L'], onRun: () => lamps.off() },
    { id: 'settings', label: 'Open settings', section: 'App', shortcut: ['Ctrl', ','] },
  ]}
/>` },
  AppShell: { render: () => <div style={{ display: 'grid', gap: 'var(--ds-gap-lg)', inlineSize: '100%' }}><div style={{ overflowX: 'auto', maxInlineSize: '100%' }}><div style={{ inlineSize: 'var(--ds-layout-container-lg)', minBlockSize: 'var(--ds-layout-frame-lg)' }}><AppShell header={<Navbar brand="dial" collapse="never"><NavbarLink href="#rooms" current>Rooms</NavbarLink></Navbar>} sidebar={<Sidebar><SidebarGroup title="Rooms"><SidebarItem href="#living" icon="lamp">Living room</SidebarItem><SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem></SidebarGroup></Sidebar>} footer={<Text tone="secondary">dial 3</Text>}><Heading level={2}>Kitchen</Heading><Text>The heating is set to 21 degrees.</Text></AppShell></div></div><div style={{ inlineSize: 'var(--ds-layout-frame-lg)', maxInlineSize: '100%', minBlockSize: 'var(--ds-layout-frame-lg)' }}><AppShell header={({ compact, menuOpen, openMenu }) => <Navbar brand="dial" collapse={compact ? 'always' : 'auto'} onMenuPress={compact ? openMenu : undefined} menuOpen={menuOpen}><NavbarLink href="#rooms" current>Rooms</NavbarLink></Navbar>} sidebar={<Sidebar><SidebarGroup title="Rooms"><SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem></SidebarGroup></Sidebar>}><Heading level={2}>Kitchen</Heading></AppShell></div></div>, code: () => `<AppShell
  header={({ compact, menuOpen, openMenu }) => (
    <Navbar brand="dial" collapse={compact ? 'always' : 'auto'}
      onMenuPress={compact ? openMenu : undefined} menuOpen={menuOpen}>
      <NavbarLink href="/rooms" current>Rooms</NavbarLink>
    </Navbar>
  )}
  sidebar={<Sidebar>…</Sidebar>}
  footer={<Text>dial 3</Text>}
  focusKey={pathname}
>
  <Heading level={2}>Kitchen</Heading>
</AppShell>` },
  RangePicker: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%', minBlockSize: 'var(--ds-layout-frame-sm)' }}><RangePicker label="Stay" defaultValue={{ start: '2026-11-09', end: '2026-11-17' }} today="2026-11-04" /></div>, code: () => `<RangePicker
  label="Stay"
  defaultValue={{ start: '2026-11-09', end: '2026-11-17' }}
  onValueChange={setStay}
/>` },
  Form: { render: (p) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><Form onSubmit={() => new Promise<void>((done) => setTimeout(done, 1500))} {...p}><Stack gap="lg"><FormItem name="room"><Input label="Room name" required /></FormItem><FormItem name="mail"><Input label="Email" type="email" defaultValue="abc" /></FormItem><div><FormSubmit>Save room</FormSubmit></div></Stack></Form></div>, code: (p) => `<Form${attrs(p)} onSubmit={save}>\n  <FormItem name="room">\n    <Input label="Room name" required />\n  </FormItem>\n  <FormSubmit>Save room</FormSubmit>\n</Form>` },
  DatePicker: { render: () => <div style={{ inlineSize: 'var(--ds-size-frame-md)', maxInlineSize: '100%' }}><DatePicker label="Start date" defaultValue="2026-11-12" today="2026-11-04" min="2026-11-03" /></div>, code: () => `<DatePicker label="Start date" defaultValue="2026-11-12" min="2026-11-03" onValueChange={setDay} />` },
  DataGrid: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%', minBlockSize: 'var(--ds-control-lg)' }}><DataGrid caption="Energy by room" visibleRows={4} selectionMode="multiple" columns={[{ key: 'room', header: 'Room', accessor: (r) => r.room, sortable: true }, { key: 'device', header: 'Device', accessor: (r) => r.device }, { key: 'kwh', header: 'kWh', accessor: (r) => r.kwh, numeric: true, sortable: true }]} rows={[{ id: 'k', room: 'Kitchen', device: 'Oven', kwh: 12.4 }, { id: 'l', room: 'Living room', device: 'Heater', kwh: 8.05 }, { id: 'w', room: 'Laundry', device: 'Washer', kwh: 103.2 }, { id: 'h', room: 'Hall', device: 'Lamp', kwh: 1.9 }, { id: 'b', room: 'Bedroom', device: 'Fan', kwh: 4.6 }, { id: 'o', room: 'Office', device: 'Printer', kwh: 2.2 }, { id: 'g', room: 'Garage', device: 'Charger', kwh: 61.3 }, { id: 'a', room: 'Attic', device: 'Dehumidifier', kwh: 17.8 }]} /></div>, code: () => `<DataGrid
  caption="Energy by room"
  columns={[
    { key: 'room', header: 'Room', accessor: (r) => r.room, sortable: true },
    { key: 'kwh', header: 'kWh', accessor: (r) => r.kwh, numeric: true, sortable: true },
  ]}
  rows={rooms}
  selectionMode="multiple"
  visibleRows={4}
/>` },
  OTPFlow: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><OTPFlow destination="+66 81 234 5678" resendIn={3} name="code" onVerify={(c) => { document.documentElement.dataset.otp = c; }} /></div>, code: () => `<OTPFlow destination="+66 81 234 5678" resendIn={30} onVerify={(code) => check(code)} onResend={() => sendCode()} />` },
  Wizard: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><Wizard canAdvance={(i) => i !== 0 || (document.getElementById('wiz-name') as HTMLInputElement | null)?.value.trim() !== ''}><WizardStep title="General"><Input id="wiz-name" label="Room name" /></WizardStep><WizardStep title="Configuration">Visibility and defaults.</WizardStep><WizardStep title="Review">Check and create.</WizardStep></Wizard></div>, code: () => `<Wizard canAdvance={(i) => i !== 0 || name !== ''} onFinish={save}>
  <WizardStep title="General">…</WizardStep>
  <WizardStep title="Configuration">…</WizardStep>
  <WizardStep title="Review">…</WizardStep>
</Wizard>` },
  TreeView: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><TreeView aria-label="Rooms" defaultExpanded={['rooms']} defaultValue="kitchen"><TreeItem value="rooms" label="Rooms"><TreeItem value="kitchen" label="Kitchen" /><TreeItem value="hall" label="Hall" /><TreeItem value="away" label="Away" disabled /><TreeItem value="garden" label="Garden"><TreeItem value="shed" label="Shed" /></TreeItem></TreeItem><TreeItem value="devices" label="Devices"><TreeItem value="heater" label="Heater" /></TreeItem></TreeView></div>, code: () => `<TreeView aria-label="Rooms" defaultExpanded={['rooms']} defaultValue="kitchen">
  <TreeItem value="rooms" label="Rooms">
    <TreeItem value="kitchen" label="Kitchen" />
    <TreeItem value="hall" label="Hall" />
    <TreeItem value="away" label="Away" disabled />
    <TreeItem value="garden" label="Garden">
      <TreeItem value="shed" label="Shed" />
    </TreeItem>
  </TreeItem>
</TreeView>` },
  Calendar: { render: () => <Calendar defaultMonth="2026-11" today="2026-11-04" weekStart={1} min="2026-11-03" defaultValue="2026-11-12" />, code: () => `<Calendar defaultMonth="2026-11" min="2026-11-03" defaultValue="2026-11-12" />` },
  TransferList: { render: () => <div style={{ inlineSize: 'var(--ds-layout-container-sm)', maxInlineSize: '100%' }}><TransferList moveAll label="Rooms on the night schedule" options={[{ value: 'kitchen', label: 'Kitchen' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'hallway', label: 'Hallway' }, { value: 'bathroom', label: 'Bathroom' }, { value: 'cellar', label: 'Cellar, no sensor', disabled: true }]} defaultValue={['kitchen']} /></div>, code: () => `<TransferList moveAll label="Rooms on the night schedule" defaultValue={['kitchen']} options={[
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
]} />` },
  ColorPicker: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><ColorPicker label="Lamp colour" swatches={[{ value: 'ffd9a0', name: 'Warm white' }, { value: 'ffb347', name: 'Amber' }, { value: 'f4f7ff', name: 'Daylight' }, { value: 'ff8fa3', name: 'Rose' }, { value: '8fd694', name: 'Green' }, { value: '6fa8ff', name: 'Blue' }]} defaultValue="ffb347" hue hex /></div>, code: () => `<ColorPicker
  label="Lamp colour"
  swatches={[{ value: 'ffd9a0', name: 'Warm white' }, { value: 'ffb347', name: 'Amber' }]}
  defaultValue="ffb347"
  hue
  hex
/>` },
  Carousel: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><Carousel label="Rooms"><Text>Living room, 21 degrees</Text><Text>Kitchen, washer running</Text><Text>Bedroom, door closed</Text><Text>Hall, front door locked</Text></Carousel></div>, code: () => `<Carousel label="Rooms">
  <Text>Living room</Text>
  <Text>Kitchen</Text>
</Carousel>` },
  VirtualList: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><VirtualList label="Devices" count={5000} defaultValue={1} getItem={(i) => ({ index: i + 1, label: 'Device ' + (i + 1), disabled: i === 3 })} /></div>, code: () => `<VirtualList
  label="Devices"
  count={5000}
  getItem={(i) => ({ index: i + 1, label: names[i] })}
/>` },
  SearchInput: { render: () => <SearchInput label="Search rooms" hint="Rooms and devices" defaultValue="Kitchen" resultsCount={4} onSearch={(v, e) => e.currentTarget.setAttribute('data-searched', v)} />, code: () => `<SearchInput label="Search rooms" defaultValue="Kitchen" onSearch={(value) => find(value)} />` },
  PinInput: { render: () => <PinInput label="Verification code" hint="We sent six digits to your phone." />, code: () => `<PinInput label="Verification code" hint="We sent six digits to your phone." onComplete={(code) => check(code)} />` },
  FileUpload: { render: () => <FileUpload multiple label="Floor plans" hint="PDF, up to 2 MB each." accept=".pdf" maxSize={2000000} defaultFiles={[new File([new ArrayBuffer(1200000)], 'ground-floor.pdf', { type: 'application/pdf' }), new File([new ArrayBuffer(340000)], 'upstairs.pdf', { type: 'application/pdf' }), new File([new ArrayBuffer(90000)], 'garden.pdf', { type: 'application/pdf' })]} progress={(f) => (f.name === 'upstairs.pdf' ? 60 : undefined)} />, code: () => `<FileUpload multiple label="Floor plans" accept=".pdf" maxSize={2000000} onFilesChange={setFiles} />` },
  Dropzone: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><Stack gap="md"><Dropzone /><Dropzone disabled hint="Uploads are paused" /></Stack></div>, code: () => `<Dropzone
  accept="image/*"
  multiple
  onFilesDrop={(files) => upload(files)}
/>` },
  Editable: { render: () => <Editable label="Room name" defaultValue="Kitchen heating" hint="Enter keeps the change. Escape puts the old name back." />, code: () => `<Editable
  label="Room name"
  defaultValue="Kitchen heating"
  onValueChange={save}
/>` },
  PasswordInput: { render: () => <Stack gap="md"><PasswordInput label="New password" autoComplete="new-password" hint="Use 12 characters or more." defaultValue="correct horse" strength="fair" /><PasswordInput label="Password" autoComplete="current-password" size="lg" /></Stack>, code: () => `<PasswordInput label="New password" autoComplete="new-password" hint="Use 12 characters or more." strength="fair" />` },
  NumberInput: { render: () => <Stack gap="md"><NumberInput label="Target temperature" unit="°C" min={5} max={30} step={0.5} defaultValue={21.5} /><NumberInput label="Spin speed" unit="rpm" min={400} max={1600} step={100} pageStep={400} defaultValue={1000} /></Stack>, code: () => `<NumberInput label="Target temperature" unit="°C" min={5} max={30} step={0.5} defaultValue={21.5} />` },
  Navbar: { render: () => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%', minBlockSize: 'var(--ds-layout-frame-xs)' }}><Navbar brand="dial" collapse="never" actions={<Button>Sign in</Button>}><NavbarLink href="#rooms" current>Rooms</NavbarLink><NavbarLink href="#schedules">Schedules</NavbarLink><NavbarLink href="#devices">Devices</NavbarLink></Navbar><div style={{ marginBlockStart: 'var(--ds-gap-lg)' }}><Navbar brand="dial" collapse="always"><NavbarLink href="#rooms" current>Rooms</NavbarLink><NavbarLink href="#schedules">Schedules</NavbarLink><NavbarLink href="#devices">Devices</NavbarLink></Navbar></div></div>, code: () => `<Navbar brand="dial" actions={<Button>Sign in</Button>}>
  <NavbarLink href="#rooms" current>Rooms</NavbarLink>
  <NavbarLink href="#schedules">Schedules</NavbarLink>
  <NavbarLink href="#devices">Devices</NavbarLink>
</Navbar>` },
  NavigationMenu: { render: () => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', minBlockSize: 'var(--ds-space-24)' }}><NavigationMenu label="Main"><NavigationMenuLink href="#home" current>Home</NavigationMenuLink><NavigationMenuItem label="Rooms"><NavigationMenuGroup title="Upstairs"><NavigationMenuLink href="#bedroom">Bedroom</NavigationMenuLink><NavigationMenuLink href="#bathroom">Bathroom</NavigationMenuLink></NavigationMenuGroup><NavigationMenuGroup title="Downstairs"><NavigationMenuLink href="#kitchen">Kitchen</NavigationMenuLink><NavigationMenuLink href="#living">Living room</NavigationMenuLink></NavigationMenuGroup></NavigationMenuItem><NavigationMenuItem label="Devices"><NavigationMenuGroup title="Lights"><NavigationMenuLink href="#lamps">Lamps</NavigationMenuLink><NavigationMenuLink href="#dimmers">Dimmers</NavigationMenuLink></NavigationMenuGroup></NavigationMenuItem><NavigationMenuLink href="#help">Help</NavigationMenuLink></NavigationMenu></div>, code: () => `<NavigationMenu label="Main">
  <NavigationMenuLink href="/" current>Home</NavigationMenuLink>
  <NavigationMenuItem label="Rooms">
    <NavigationMenuGroup title="Upstairs">
      <NavigationMenuLink href="/bedroom">Bedroom</NavigationMenuLink>
    </NavigationMenuGroup>
  </NavigationMenuItem>
</NavigationMenu>` },
  DescriptionList: { render: () => <div style={{ display: 'grid', gap: 'var(--ds-gap-2xl)', inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}><DescriptionList><DescriptionTerm>Model</DescriptionTerm><DescriptionDetail>ht 4 heater</DescriptionDetail><DescriptionTerm>Power draw</DescriptionTerm><DescriptionDetail numeric>1 840 W</DescriptionDetail><DescriptionTerm>Room</DescriptionTerm><DescriptionDetail>Living room</DescriptionDetail></DescriptionList><DescriptionList orientation="inline"><DescriptionTerm>Model</DescriptionTerm><DescriptionDetail>ht 4 heater</DescriptionDetail><DescriptionTerm>Power draw</DescriptionTerm><DescriptionDetail numeric>1 840 W</DescriptionDetail><DescriptionDetail numeric>230 V</DescriptionDetail><DescriptionTerm>Room</DescriptionTerm><DescriptionDetail>Living room</DescriptionDetail></DescriptionList></div>, code: () => `<DescriptionList>\n  <DescriptionTerm>Model</DescriptionTerm>\n  <DescriptionDetail>ht 4 heater</DescriptionDetail>\n  <DescriptionTerm>Power draw</DescriptionTerm>\n  <DescriptionDetail numeric>1 840 W</DescriptionDetail>\n</DescriptionList>` },
  Anchor: { render: () => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-gap-xl)', inlineSize: 'var(--ds-size-frame-lg)', maxInlineSize: '100%' }}><div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><Anchor root="#anchor-usage-page" items={[{ id: 'au-overview', label: 'Overview' }, { id: 'au-wiring', label: 'Wiring', items: [{ id: 'au-hub', label: 'Hub' }, { id: 'au-sensors', label: 'Sensors' }] }, { id: 'au-schedules', label: 'Schedules' }]} /></div><div id="anchor-usage-page" tabIndex={0} aria-label="Page" style={{ flex: '1 1 var(--ds-size-frame-xs)', overflowY: 'auto', blockSize: 'var(--ds-size-frame-md)' }}>{['overview', 'wiring', 'hub', 'sensors', 'schedules'].map((s) => <section key={s} style={{ minBlockSize: 'var(--ds-size-frame-sm)' }}><h3 id={`au-${s}`}>{s}</h3><p>Text of the section.</p></section>)}</div></div>, code: () => `<Anchor root="#page" items={[
  { id: 'overview', label: 'Overview' },
  { id: 'wiring', label: 'Wiring', items: [{ id: 'hub', label: 'Hub' }] },
]} />` },
  Sidebar: { render: () => <Sidebar label="Main"><SidebarGroup title="Rooms"><SidebarItem href="#living" icon="lamp">Living room</SidebarItem><SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem><SidebarItem href="#bedroom" icon="room">Bedroom</SidebarItem></SidebarGroup><SidebarGroup title="House"><SidebarItem href="#schedules" icon="schedule">Schedules</SidebarItem><SidebarItem href="#settings" icon="settings">Settings</SidebarItem></SidebarGroup><SidebarToggle /></Sidebar>, code: () => `<Sidebar label="Main">
  <SidebarGroup title="Rooms">
    <SidebarItem href="/living" icon="lamp">Living room</SidebarItem>
    <SidebarItem href="/kitchen" icon="heat" current>Kitchen</SidebarItem>
  </SidebarGroup>
  <SidebarToggle />
</Sidebar>` },
  Combobox: { render: () => <Stack gap="lg"><Combobox label="Room" placeholder="Type a room" hint="Pick one from the list." options={[{ value: 'kitchen', label: 'Kitchen' }, { value: 'kids', label: 'Kids room' }, { value: 'living', label: 'Living room' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'bathroom', label: 'Bathroom' }, { value: 'hallway', label: 'Hallway' }]} defaultValue="kitchen" /><Combobox label="Share with" options={[{ value: 'maya', label: 'Maya Chen', leading: <Avatar name="Maya Chen" size="sm" /> }, { value: 'noah', label: 'Noah Okafor', leading: <Avatar name="Noah Okafor" size="sm" /> }]} /></Stack>, code: () => `<Combobox label="Room" placeholder="Type a room" defaultValue="kitchen" options={[
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'kids', label: 'Kids room' },
]} />` },
  Autocomplete: { render: () => <div style={{ inlineSize: '100%', minBlockSize: 'calc(var(--ds-control-lg) * 8)' }}><Autocomplete label="Room" hint="Pick a suggestion or type your own name." options={[{ value: 'living', label: 'Living room' }, { value: 'kitchen', label: 'Kitchen' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'bathroom', label: 'Bathroom' }, { value: 'basement', label: 'Basement' }, { value: 'hall', label: 'Hall' }]} /></div>, code: () => `<Autocomplete
  label="Room"
  options={[
    { value: 'living', label: 'Living room' },
    { value: 'kitchen', label: 'Kitchen' },
  ]}
/>` },
  MultiSelect: { render: () => <div style={{ inlineSize: '100%', minBlockSize: 'calc(var(--ds-control-md) * 8)' }}><MultiSelect label="Rooms" placeholder="Choose rooms" options={[{ value: 'kitchen', label: 'Kitchen' }, { value: 'hall', label: 'Hall' }, { value: 'living', label: 'Living room' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'garage', label: 'Garage', disabled: true }]} defaultValue={['kitchen', 'bedroom']} /></div>, code: () => `<MultiSelect label="Rooms" placeholder="Choose rooms" defaultValue={['kitchen']} options={[
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'hall', label: 'Hall' },
]} />` },
  ContextMenu: { render: () => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', minBlockSize: 'var(--ds-space-24)' }}><ContextMenu items={[{ value: 'rename', label: 'Rename' }, { value: 'move', label: 'Move to room' }, { value: 'remove', label: 'Remove', destructive: true }]} label="Actions for Kitchen lamp" tabIndex={0} style={{ minBlockSize: 'var(--ds-space-24)', display: 'grid', placeItems: 'center' }}><Text tone="secondary">Right-click, or press and hold, on the kitchen lamp</Text></ContextMenu></div>, code: () => `<ContextMenu items={actions} label="Actions for Kitchen lamp" onAction={run} tabIndex={0}>
  Kitchen lamp
</ContextMenu>` },
  RadioCards: { render: () => <RadioCards label="Heating mode" defaultValue="comfort"><RadioCard value="eco" leading={<Icon name="heat" />} title="Eco" description="Lowers the heat when nobody is home." /><RadioCard value="comfort" leading={<Icon name="heat" />} title="Comfort" description="Holds 21 degrees all day." /><RadioCard value="away" leading={<Icon name="heat" />} title="Away" description="Frost guard only." /></RadioCards>, code: () => `<RadioCards label="Heating mode" defaultValue="comfort">
  <RadioCard value="eco" title="Eco" description="Lowers the heat when nobody is home." />
  <RadioCard value="comfort" title="Comfort" description="Holds 21 degrees all day." />
  <RadioCard value="away" title="Away" description="Frost guard only." />
</RadioCards>` },
  TagInput: { render: () => <TagInput label="Rooms" max={3} defaultValue={['Kitchen', 'Hall']} placeholder="Add a room" hint="Enter or a comma adds a tag." />, code: () => `<TagInput label="Rooms" max={3} defaultValue={['Kitchen', 'Hall']} />` },
  Listbox: { render: () => <Stack gap="lg"><Listbox label="Heating mode" options={[{ value: 'comfort', label: 'Comfort' }, { value: 'eco', label: 'Eco' }, { value: 'away', label: 'Away' }, { value: 'boost', label: 'Boost', disabled: true }]} defaultValue="eco" /><Listbox multiple label="Rooms" options={[{ value: 'kitchen', label: 'Kitchen' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'hallway', label: 'Hallway' }]} defaultValue={['kitchen']} /></Stack>, code: () => `<Listbox label="Heating mode" defaultValue="eco" options={[
  { value: 'comfort', label: 'Comfort' },
  { value: 'eco', label: 'Eco' },
]} />` },
  Drawer: { render: () => <Drawer trigger={<Button>Rooms</Button>} title="Rooms" actions={<Button>Add room</Button>}><List label="Rooms"><List.Item href="#living" leading={<Icon name="lamp" />} label="Living room" description="3 devices" /><List.Item href="#kitchen" leading={<Icon name="fan" />} label="Kitchen" description="5 devices" /><List.Item href="#bedroom" leading={<Icon name="heat" />} label="Bedroom" description="2 devices" /></List></Drawer>, code: () => `<Drawer trigger={<Button>Rooms</Button>} title="Rooms" actions={<Button>Add room</Button>}>
  <List label="Rooms">
    <List.Item href="#living" label="Living room" description="3 devices" />
    <List.Item href="#kitchen" label="Kitchen" description="5 devices" />
  </List>
</Drawer>` },
  Rating: { render: () => <><Rating label="Comfort" defaultValue={3} /><Rating label="Average sound score" readOnly value={3.5} /></>, code: () => `<Rating label="Comfort" defaultValue={3} />
<Rating label="Average sound score" readOnly value={3.5} />` },
  Table: { render: () => <Table caption="Energy by room"><TableHead><TableRow><TableHeaderCell sort="ascending" onSort={() => {}}>Room</TableHeaderCell><TableHeaderCell>Device</TableHeaderCell><TableHeaderCell numeric sort="none" onSort={() => {}}>kWh</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableCell>Kitchen</TableCell><TableCell>Oven</TableCell><TableCell numeric>12.4</TableCell></TableRow><TableRow><TableCell>Laundry</TableCell><TableCell>Washer</TableCell><TableCell numeric>103.2</TableCell></TableRow><TableRow><TableCell>Living room</TableCell><TableCell>Heater</TableCell><TableCell numeric>8.05</TableCell></TableRow></TableBody></Table>, code: () => `<Table caption="Energy by room">
  <TableHead>
    <TableRow>
      <TableHeaderCell sort="ascending" onSort={sortByRoom}>Room</TableHeaderCell>
      <TableHeaderCell numeric>kWh</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow><TableCell>Kitchen</TableCell><TableCell numeric>12.4</TableCell></TableRow>
  </TableBody>
</Table>` },
  FAB: { render: () => <><div style={{ position: 'relative', inlineSize: 'calc(var(--ds-control-lg) * 6)', minBlockSize: 'calc(var(--ds-control-lg) * 3)' }}><FAB label="Add room" /></div><div style={{ position: 'relative', inlineSize: 'calc(var(--ds-control-lg) * 6)', minBlockSize: 'calc(var(--ds-control-lg) * 3)' }}><FAB label="Add room" extended /></div></>, code: () => `<div style={{ position: 'relative' }}>
  <FAB label="Add room" />
</div>` },
  FormField: { render: (p) => <Stack gap="lg"><FormField label="Room name" hint="Shown on the home screen." {...p}><input defaultValue="Living room" /></FormField><FormField label="Target" required error="Too warm. Choose 30 °C or less." {...p}><input defaultValue="99" /></FormField><FormField label="Night mode" layout="inline">{(c) => <Switch id={c.id} aria-describedby={c['aria-describedby']} />}</FormField></Stack>, code: (p) => `<FormField${attrs(p)} label="Room name" hint="Shown on the home screen.">\n  <input defaultValue="Living room" />\n</FormField>` },
  Image: { render: () => <Stack direction="row" gap="md" align="start"><div><Image src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 3%22%3E%3Crect width=%224%22 height=%223%22 fill=%22tan%22/%3E%3C/svg%3E" alt="The hall, seen from the front door" ratio="4/3" caption="Hall, 08:10" /></div><div><Image src="/missing.jpg" alt="Garden camera, last frame" ratio="4/3" caption="Garden, no picture" /></div></Stack>, code: () => `<Image src="/hall.jpg" alt="The hall, seen from the front door" ratio="4/3" caption="Hall, 08:10" />` },
  Kbd: { render: () => <p>Press <Kbd>Esc</Kbd> to close, <KbdCombo keys={['Ctrl', 'K']} /> to search, or <Kbd label="Up arrow">↑</Kbd> to go up.</p>, code: () => `<p>Press <Kbd>Esc</Kbd> to close, <KbdCombo keys={['Ctrl', 'K']} /> to search.</p>
<Kbd label="Up arrow">↑</Kbd>` },
  InputGroup: { render: () => <Stack gap="md"><InputGroup label="Address of the hub" start="https://" defaultValue="kitchen" end={<IconButton label="Copy address"><Icon name="plus" /></IconButton>} /><InputGroup label="Monthly price" start="THB" end="/ month" defaultValue="1,250" /></Stack>, code: () => `<InputGroup label="Monthly price" start="THB" end="/ month" defaultValue="1,250" />` },
  Label: { render: (p) => <Stack gap="lg"><Label {...p} htmlFor="label-demo-a" required help="Shown on the room card.">Room name</Label><Label htmlFor="label-demo-b" required mark="glyph">Room name</Label></Stack>, code: (p) => `<Label${attrs(p)} htmlFor="room" required help="Shown on the room card.">Room name</Label>` },
  HelperText: { render: () => <Stack gap="sm"><Input label="Target temperature" defaultValue="42" unit="°C" aria-invalid aria-describedby="ht-subject-e" /><HelperText id="ht-subject-e" tone="error">Enter a value under 30.</HelperText><HelperText>Between 5 and 30 degrees.</HelperText></Stack>, code: () => `<Input label="Target temperature" aria-invalid aria-describedby="t-help" />
<HelperText id="t-help" tone="error">Enter a value under 30.</HelperText>` },
  Fieldset: { render: () => <Stack gap="lg"><Fieldset legend="Night mode" hint="Starts at 23:00."><Stack gap="sm"><Switch label="Lower the heater" defaultChecked /><Switch label="Dim the lamps" /></Stack></Fieldset><Fieldset legend="Guest access" disabled><Stack gap="sm"><Switch label="Share with visitors" /><Switch label="Allow streaming" /></Stack></Fieldset></Stack>, code: () => `<Fieldset legend="Night mode" hint="Starts at 23:00.">
  <Switch label="Lower the heater" />
  <Switch label="Dim the lamps" />
</Fieldset>` },
  VisuallyHidden: { render: () => <Stack gap="md"><Text>Visible words</Text><VisuallyHidden>Words for a screen reader</VisuallyHidden><VisuallyHidden focusable><Link href="#main">Skip to the content</Link></VisuallyHidden></Stack>, code: () => `<VisuallyHidden>Words for a screen reader</VisuallyHidden>\n<VisuallyHidden focusable>\n  <Link href="#main">Skip to the content</Link>\n</VisuallyHidden>` },
  Flex: { render: () => <Flex justify="between" align="center" gap="sm"><FlexItem grow>Living room</FlexItem><FlexItem shrink={false}><Button kind="key">Edit</Button></FlexItem><FlexItem shrink={false}><Button kind="key">Next</Button></FlexItem></Flex>, code: () => `<Flex align="center" gap="sm">\n  <FlexItem grow>Living room</FlexItem>\n  <FlexItem shrink={false}><Button kind="key">Edit</Button></FlexItem>\n</Flex>` },
  Spacer: { render: () => <Stack gap="lg"><Stack direction="row" align="center"><Text>Heating</Text><Spacer axis="inline" flexible /><Button kind="primary">Save</Button></Stack><div><Text>Day</Text><Spacer size="lg" /><Text>Night</Text></div><Stack direction="row" gap="xs" align="center"><Text>Day</Text><Spacer axis="inline" size="xl" /><Text>Night</Text></Stack></Stack>, code: () => `<Spacer size="lg" />\n<Spacer axis="inline" flexible />` },
  AspectRatio: { render: () => <Stack direction="row" gap="md" align="start"><div><AspectRatio ratio="16/9"><Display kind="oled" label="Doorbell camera" value="Front door" /></AspectRatio></div><div><AspectRatio ratio="1/1" rounded><Display kind="oled" label="Living room" value="22.5" unit="°C" /></AspectRatio></div></Stack>, code: () => `<AspectRatio ratio="16/9" rounded>
  <Display kind="oled" label="Doorbell camera" value="Front door" />
</AspectRatio>` },
  Box: { render: () => <Box as="section" padding="lg" surface="raised" corner="panel" aria-label="Living room"><p>Living room</p></Box>, code: () => `<Box as="section" padding="lg" surface="raised" corner="panel">
  …
</Box>` },
  Center: { render: () => <Stack gap="lg"><div className="demo-box demo-full" style={{ blockSize: 'var(--ds-space-24)' }}><Center><Text>Both axes</Text></Center></div><div className="demo-box demo-full"><Center axis="inline" size="sm"><Text>Capped at the sm container width, centred along the line.</Text></Center></div></Stack>, code: () => `<Center>\n  <Text>No rooms yet</Text>\n</Center>\n<Center axis="inline" size="sm">…</Center>` },
  Link: { render: () => <Stack gap="xs"><Text>Read the <Link href="#manual" external>manual</Link> or the <Link href="#rules">heating rules</Link>.</Text><Link href="#lamps" variant="standalone">All lamps</Link></Stack>, code: () => `<Text>
  Read the <Link href="/manual" external>manual</Link> or the <Link href="/rules">heating rules</Link>.
</Text>
<Link href="/lamps" variant="standalone">All lamps</Link>` },
  Spinner: { render: () => <Spinner size="md" label="Asking the hub" showLabel />, code: () => `<Spinner size="md" label="Asking the hub" showLabel />` },
  Pagination: { render: () => <Pagination count={12} defaultPage={6} />, code: () => `<Pagination count={12} defaultPage={6} />` },
  Stat: { render: () => <Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" />, code: () => `<Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" />` },
  Timeline: { render: () => <Timeline><TimelineItem time="22:40" title="Night mode started" latest>Heater set to 18.</TimelineItem><TimelineItem time="21:05" title="Washer finished" /></Timeline>, code: () => `<Timeline>
  <TimelineItem time="22:40" title="Night mode started" latest>Heater set to 18.</TimelineItem>
  <TimelineItem time="21:05" title="Washer finished" />
</Timeline>` },
  Divider: { render: () => <Stack gap="lg"><Text>Heating</Text><Divider /><Text>Lighting</Text><Divider label="schedule" /><Stack direction="row" gap="xl" align="stretch"><Text>Day</Text><Divider orientation="vertical" /><Text>Night</Text></Stack></Stack>, code: () => `<Divider />\n<Divider label="schedule" />\n<Divider orientation="vertical" />` },
  Breadcrumb: { render: () => <Breadcrumb fold="always"><Crumb href="#home">Home</Crumb><Crumb href="#rooms">Rooms</Crumb><Crumb href="#lamps">Lamps</Crumb><Crumb>Kitchen lamp</Crumb></Breadcrumb>, code: () => `<Breadcrumb fold="always">
  <Crumb href="/">Home</Crumb>
  <Crumb href="/rooms">Rooms</Crumb>
  <Crumb href="/lamps">Lamps</Crumb>
  <Crumb>Kitchen lamp</Crumb>
</Breadcrumb>` },
  Accordion: { render: () => <Accordion defaultValue={['schedule']}><AccordionItem value="schedule" title="Schedule">Weekdays at 06:30.</AccordionItem><AccordionItem value="away" title="Away mode">Rooms at 16.</AccordionItem><AccordionItem value="holiday" title="Holiday">Heating off.</AccordionItem></Accordion>, code: () => `<Accordion defaultValue={['schedule']}>
  <AccordionItem value="schedule" title="Schedule">…</AccordionItem>
  <AccordionItem value="away" title="Away mode">…</AccordionItem>
</Accordion>` },
  Tooltip: { render: () => <Tooltip content="Next track"><IconButton label="Next track"><Icon name="next" /></IconButton></Tooltip>, code: () => `<Tooltip content="Next track">
  <IconButton label="Next track"><Icon name="next" /></IconButton>
</Tooltip>` },
  Radio: { render: () => <RadioGroup label="Heating mode" defaultValue="eco"><Radio value="comfort" label="Comfort" /><Radio value="eco" label="Eco" /><Radio value="away" label="Away" /></RadioGroup>, code: () => `<RadioGroup label="Heating mode" defaultValue="eco">
  <Radio value="comfort" label="Comfort" />
  <Radio value="eco" label="Eco" />
  <Radio value="away" label="Away" />
</RadioGroup>` },
  Popover: { render: () => <Popover label="About the water filter" title="Water filter">Change it every three months.</Popover>, code: () => `<Popover label="About the water filter" title="Water filter">
  Change it every three months.
</Popover>` },
  Avatar: { render: () => <Avatar name="Maren Solberg" label="Maren Solberg" />, code: () => `<Avatar name="Maren Solberg" size="md" />` },
  Stepper: { render: () => <Stepper><Step title="General" status="done">Owner and name.</Step><Step title="Configuration" status="current">Visibility.</Step></Stepper>, code: () => `<Stepper>
  <Step title="General" status="done">…</Step>
  <Step title="Configuration" status="current">…</Step>
</Stepper>` },
  Textarea: { render: (p, disabled) => <Textarea {...p} label="Note" defaultValue="Guests arrive on Friday." hint="Shown to everyone in the home." disabled={disabled} />, code: (p) => `<Textarea${attrs(p)} label="Note" defaultValue="Guests arrive on Friday." hint="Shown to everyone in the home." />`, disabled: true },
  ExplainMode: { bare: 'layout', render: (p) => <ExplainMode {...p} defaultOpen><Card padding="unit"><Stack direction="row" gap="xl"><Explain name="Volume" does="Sets how loud the speaker plays."><Rotary kind="key" label="Volume" min={0} max={10} defaultValue={5} /></Explain></Stack></Card></ExplainMode>, code: (p) => `<ExplainMode${attrs(p)}>\n  <Explain name="Volume" does="Sets how loud the speaker plays."><Rotary label="Volume" /></Explain>\n</ExplainMode>` },
  Wiring: { bare: 'layout', render: (p) => <Wiring {...p} label="Heating relations" links={[{ from: 'knob', to: 'heater', label: 'sets', text: 'The thermostat sets the heater', active: true }]}><Wiring.Node id="knob"><Rotary kind="key" label="Temperature" min={16} max={26} defaultValue={21} /></Wiring.Node><Wiring.Node id="heater"><Card padding="unit"><Display label="Heater" value="21" unit="°C" digits={2} /></Card></Wiring.Node></Wiring>, code: (p) => `<Wiring${attrs(p)} label="Heating relations" links={[{ from: 'knob', to: 'heater', label: 'sets', text: 'The thermostat sets the heater', active: true }]}>…</Wiring>` },
  Icon: { render: (p) => <Icon name="play" {...p} />, code: (p) => `<Icon${attrs({ name: 'play', ...p })} />` },
  Tray: { render: () => <Tray label="Playback"><IconButton label="Previous track"><Icon name="previous" /></IconButton><IconButton label="Next track"><Icon name="next" /></IconButton><Badge tone="positive">Live</Badge></Tray>, code: () => '<Tray label="Playback"><IconButton label="Previous track"><Icon name="previous" /></IconButton><IconButton label="Next track"><Icon name="next" /></IconButton><Badge tone="positive">Live</Badge></Tray>' },
  Slot: { bare: true, render: () => <Card padding="unit" wordmark="dial" model="scene 1" style={{ inlineSize: 'max-content' }}><Slot label="Living room" defaultScene={{ value: 'movie', name: 'Movie night', steps: ['Lamps 20%'] }} /></Card>, code: () => '<Slot label="Living room" defaultScene={movieNight} onInsert={run} />' },
  SceneCard: { render: () => <SceneCard value="movie" name="Movie night" steps={['Lamps 20%', 'Blinds down', 'TV on']} />, code: () => '<SceneCard value="movie" name="Movie night" steps={["Lamps 20%", "Blinds down", "TV on"]} />' },
  Legend: { render: (p, disabled) => <Legend {...p} label="Fan" options={['off', 'low', 'mid', 'high', 'auto']} defaultValue="low" disabled={disabled} />, code: (p) => `<Legend${attrs(p)} label="Fan" options={['off', 'low', 'mid', 'high', 'auto']} defaultValue="low" />`, disabled: true },
  Snackbar: { bare: true, render: (p) => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}><Snackbar {...p} action={{ label: 'Undo', onAction: () => {} }}>Lamp removed</Snackbar></div>, code: (p) => `<Snackbar${attrs(p)} action={{ label: 'Undo', onAction: restore }}>Lamp removed</Snackbar>` },
  ActionSheet: { bare: true, render: () => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}><ActionSheet modal={false} open title="Kitchen lamp" detail="lamp 02 · Kitchen" items={[{ value: 'rename', label: 'Rename' }, { value: 'move', label: 'Move to room' }, { value: 'remove', label: 'Remove', destructive: true }]} /></div>, code: () => '<ActionSheet title="Kitchen lamp" items={actions} onAction={run} trigger={key} />' },
  BottomNav: { bare: true, render: () => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}><BottomNav layout="bar" current="rooms" onNavigate={(_v, e) => e.preventDefault()} items={[{ value: 'home', label: 'Home', href: '/home' }, { value: 'rooms', label: 'Rooms', href: '/rooms' }, { value: 'media', label: 'Media', href: '/media' }, { value: 'settings', label: 'Settings', href: '/settings' }]} /></div>, code: () => '<BottomNav items={sections} current="rooms" onNavigate={go} />' },
  Queue: { render: () => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}><Queue defaultTracks={[{ id: 'q1', title: 'Kiln song', artist: 'Ulm Quartet', duration: 222 }, { id: 'q2', title: 'Weniger, aber besser', artist: 'Hochschule', duration: 250 }, { id: 'q3', title: 'Slow return', artist: 'The Faders', duration: 178 }]} playing="q2" /></div>, code: () => '<Queue defaultTracks={tracks} playing="q2" onPlay={play} />' },
  MediaPlayer: { bare: true, render: () => <SubjectPlayer />, code: () => '<MediaPlayer tracks={tracks} />' },
  Environment: { bare: true, render: (p) => <Environment {...p} room="Living room" temperature={21.5} detail="Feels dry" readAt="10:42" readings={[{ kind: 'humidity', value: 38 }, { kind: 'air', value: 74 }]} />, code: (p) => `<Environment${attrs(p)} room="Living room" temperature={21.5} detail="Feels dry" readAt="10:42" readings={[{ kind: 'humidity', value: 38 }, { kind: 'air', value: 74 }]} />` },
  PullToRefresh: { render: (p) => <PullToRefresh {...p} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', maxInlineSize: '100%' }} label="Readings" onRefresh={() => new Promise((d) => setTimeout(d, 1200))} updated={new Date(2026, 10, 2, 10, 41)}><List label="Readings"><List.Item label="Kitchen" description="21.5 °C" /><List.Item label="Bedroom" description="19.0 °C" /></List></PullToRefresh>, code: (p) => `<PullToRefresh${attrs(p)} label="Readings" onRefresh={ask} updated={time}>\n  <List label="Readings">…</List>\n</PullToRefresh>` },
  TimePicker: { render: (p, disabled) => <TimePicker {...p} label="Night mode starts" defaultValue="22:30" disabled={disabled} />, code: (p) => `<TimePicker${attrs(p)} label="Night mode starts" defaultValue="22:30" />`, disabled: true },
  Skeleton: { render: (p) => <div role="group" aria-busy="true" aria-label="Thermostat, loading"><Skeleton {...p} kind="display" digits={3} unit="°C" /></div>, code: (p) => `<div role="group" aria-busy="true" aria-label="Thermostat, loading"><Skeleton${attrs(p)} kind="display" digits={3} unit="°C" /></div>` },
  Menu: { render: (p, disabled) => <Menu {...p} label={p.trigger === 'word' ? 'Sort' : 'More for Kitchen lamp'} items={[{ value: 'rename', label: 'Rename' }, { value: 'move', label: 'Move to room' }, { value: 'remove', label: 'Remove', destructive: true }]} disabled={disabled} />, code: (p) => `<Menu${attrs(p)} label="More for Kitchen lamp" items={actions} onAction={run} />`, disabled: true },
  List: { bare: true, render: (p) => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}><List {...p} label="Kitchen"><List.Item label="Ceiling lamp" description="On · 40%" trailing={<Switch aria-label="Ceiling lamp" defaultChecked />} /><List.Item label="Hood fan" description="Off" trailing={<Switch aria-label="Hood fan" />} /><List.Item href="#heater" label="Floor heater" description="Heating to 21 °C" /></List></div>, code: (p) => `<List${attrs(p)} label="Kitchen">\n  <List.Item label="Ceiling lamp" description="On · 40%" trailing={<Switch aria-label="Ceiling lamp" />} />\n  <List.Item href="/heater" label="Floor heater" description="Heating to 21 °C" />\n</List>` },
  EmptyState: { render: (p) => <EmptyState {...p} drawing="display" title="No devices in the kitchen yet" action={<Button kind="primary">Add a device</Button>}>Plug one in near the hub, then add it here.</EmptyState>, code: (p) => `<EmptyState${attrs(p)} drawing="display" title="No devices in the kitchen yet" action={<Button kind="primary">Add a device</Button>}>Plug one in near the hub, then add it here.</EmptyState>` },
  Banner: { bare: true, render: (p) => <Banner {...p} status="Offline">The hub is offline. Controls will work again when it reconnects.</Banner>, code: (p) => `<Banner${attrs(p)} status="Offline">The hub is offline. Controls will work again when it reconnects.</Banner>` },
  Sheet: { bare: true, render: () => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-lg))' }}><Sheet modal={false} open placement="bottom" title="Living room lamp" model="lamp 02"><Slider label="Brightness" max={100} step={10} defaultValue={60} /></Sheet></div>, code: () => '<Sheet open={open} onOpenChange={setOpen} title="Living room lamp" model="lamp 02"><Slider label="Brightness" max={100} step={10} defaultValue={60} /></Sheet>' },
  Meter: { render: (p) => <Meter {...p} label="Battery" value={18} low={20} high={80} formatValue={(v) => `${v} %`} />, code: (p) => `<Meter${attrs(p)} label="Battery" value={18} low={20} high={80} formatValue={(v) => \`\${v} %\`} />` },
  Scrubber: { render: (_p, disabled) => <Scrubber label="Ruhe, side A" duration={225} defaultValue={83} buffered={140} disabled={disabled} />, code: () => '<Scrubber label="Ruhe, side A" duration={225} defaultValue={83} buffered={140} />', disabled: true },
  RangeSlider: { render: (_p, disabled) => <RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale disabled={disabled} />, code: () => '<RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale />', disabled: true },
  DeviceCard: { bare: true, render: (p) => <DeviceCard {...p} model="tuner 1" display={{ label: 'Radio', value: '88.6', unit: 'MHz', digits: 4 }} knob={{ label: 'Tuning', defaultValue: 2 }} keysLabel="Band" keys={[{ label: 'FM', pressed: true }, { label: 'AM', pressed: false }]} meter={{ label: 'Volume', value: 4, cols: 10, rows: 4 }} fader={{ label: 'Volume', defaultValue: 4, step: 1 }} />, code: (p) => `<DeviceCard${attrs(p)} model="tuner 1" display={{ label: 'Radio', value: '88.6', unit: 'MHz' }} knob={{ label: 'Tuning' }} keys={[{ label: 'FM' }, { label: 'AM' }]} meter={{ label: 'Volume', value: 4 }} fader={{ label: 'Volume' }} />` },
  Card: { bare: true, render: (p) => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}><Card {...p} header={<Heading level={3}>Washer</Heading>} footer={<Button kind="primary">Start wash</Button>} wordmark="dial" model="wash 1"><Text tone="secondary">Cotton 40 °C, ready at 18:20.</Text></Card></div>, code: (p) => `<Card${attrs(p)} header={<Heading level={3}>Washer</Heading>} footer={<Button kind="primary">Start wash</Button>} wordmark="dial" model="wash 1">…</Card>` },
  Progress: { render: (p) => <Progress {...p} label="Washer" value={55} valueText="38 min left" />, code: (p) => `<Progress${attrs(p)} label="Washer" value={55} valueText="38 min left" />` },
  Badge: { render: (p) => <Badge {...p}>Online</Badge>, code: (p) => `<Badge${attrs(p)}>Online</Badge>` },
  Chip: { render: (p, disabled) => <Chip defaultSelected {...p} disabled={disabled}>Eco</Chip>, code: (p) => `<Chip defaultSelected${attrs(p)}>Eco</Chip>`, disabled: true },
  Toast: { bare: true, render: (p) => <Toast {...p} onClose={() => {}}>Lamp turned off</Toast>, code: (p) => `<Toast${attrs(p)} onClose={close}>Lamp turned off</Toast>` },
  Dialog: { bare: true, render: () => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-lg))' }}><Dialog modal={false} open title="Turn off all lamps?" description="Six lamps in four rooms go dark." actions={<><Button>Cancel</Button><Button kind="primary">Turn off</Button></>} /></div>, code: () => '<Dialog open={open} onOpenChange={setOpen} title="Turn off all lamps?" description="Six lamps in four rooms go dark." actions={<><Button>Cancel</Button><Button kind="primary">Turn off</Button></>} />' },
  Tabs: { render: (p) => <Tabs {...p} label="Rooms" items={[{ value: 'living', label: 'Living room', content: <p className="flush">Heater 21.5 °C</p> }, { value: 'kitchen', label: 'Kitchen', content: <p className="flush">Oven off</p> }, { value: 'bedroom', label: 'Bedroom', content: <p className="flush">Heater 18.0 °C</p> }]} />, code: (p) => `<Tabs${attrs(p)} label="Rooms" items={ROOMS} />` },
  SegmentedControl: { render: (p, disabled) => <SegmentedControl {...p} label="Band" options={[{ value: 'fm', label: 'FM' }, { value: 'am', label: 'AM' }, { value: 'aux', label: 'AUX' }]} defaultValue="fm" disabled={disabled} />, code: (p) => `<SegmentedControl${attrs(p)} label="Band" options={BANDS} defaultValue="fm" />`, disabled: true },
  Select: { render: (p, disabled) => <Select {...p} label="Programme" options={[{ value: 'eco', label: 'Eco 40–60' }, { value: 'cotton', label: 'Cotton 40°' }, { value: 'quick', label: 'Quick 30' }]} defaultValue="cotton" disabled={disabled} />, code: (p) => `<Select${attrs(p)} label="Programme" options={programmes} defaultValue="cotton" />`, disabled: true },
  Input: { render: (p, disabled) => <Input {...p} label="Target temperature" unit="°C" defaultValue="21.5" hint="Between 5 and 30." disabled={disabled} />, code: (p) => `<Input${attrs(p)} label="Target temperature" unit="°C" defaultValue="21.5" hint="Between 5 and 30." />`, disabled: true },
  Rotary: { render: (p, disabled) => <Rotary {...p} label="Temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} disabled={disabled} />, code: (p) => `<Rotary${attrs(p)} label="Temperature" min={16} max={26} defaultValue={21} />`, disabled: true },
  Slider: { render: (_p, disabled) => <Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale disabled={disabled} />, code: () => '<Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />', disabled: true },
  Grille: { render: (p) => <Grille {...p} label="Volume" value={6} max={10} cols={12} rows={4} />, code: (p) => `<Grille${attrs(p)} label="Volume" value={6} max={10} cols={12} rows={4} />` },
  Display: { render: (p) => <Display {...p} label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />, code: (p) => `<Display${attrs(p)} label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />` },
  Checkbox: { render: (p, disabled) => <Checkbox label="Pre-wash" defaultChecked {...p} disabled={disabled} />, code: (p) => `<Checkbox label="Pre-wash" defaultChecked${attrs(p)} />`, disabled: true },
  IconButton: { render: (p, disabled) => <IconButton label="Play" {...p} disabled={disabled}><Icon name="play" /></IconButton>, code: (p) => `<IconButton label="Play"${attrs(p)}><Icon name="play" /></IconButton>`, disabled: true },
  Heading: { render: (p) => <Heading level={3} {...p}>Living room heater</Heading>, code: (p) => `<Heading level={3}${attrs(p)}>Living room heater</Heading>` },
  Text: { render: (p) => <Text {...p}>Eco from 23:00</Text>, code: (p) => `<Text${attrs(p)}>Eco from 23:00</Text>` },
  Switch: { render: (p, disabled) => <Switch {...p} label="Keep warm" offLabel="Off" onLabel="On" disabled={disabled} />, code: (p) => `<Switch${attrs(p)} label="Keep warm" offLabel="Off" onLabel="On" />`, disabled: true },
  Button: { render: (p, disabled) => <Button {...p} disabled={disabled}>Start wash</Button>, code: (p) => `<Button${attrs(p)}>Start wash</Button>`, disabled: true },
  Container: { bare: 'layout', render: (p) => <Container {...p}><div className="demo-box"><p className="flush">Content column</p></div></Container>, code: (p) => `<Container${attrs(p)}>…</Container>` },
  Grid: { bare: 'layout', render: () => <Grid><GridItem span={6}><div className="demo-box">Half</div></GridItem><GridItem span={6}><div className="demo-box">Half</div></GridItem></Grid>, code: () => '<Grid>\n  <GridItem span={6}>…</GridItem>\n  <GridItem span={6}>…</GridItem>\n</Grid>' },
  Stack: { render: () => <Stack direction="row" gap="md"><span className="demo-chip">One</span><span className="demo-chip">Two</span><span className="demo-chip">Three</span></Stack>, code: () => '<Stack direction="row" gap="md">…</Stack>' },
};
