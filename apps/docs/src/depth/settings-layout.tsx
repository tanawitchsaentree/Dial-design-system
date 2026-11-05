// Usage tab for SettingsLayout (component-depth.md U1–U14). SettingsLayout frames a settings page as titled sections of rows.
import { Select, SettingsLayout, SettingsRow, SettingsSection, Stack, Switch, VisuallyHidden } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const WIDE = { inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' } as const;
const SPEEDS = [{ value: 'low', label: 'Low' }, { value: 'high', label: 'High' }];

const page = (title = 'Fan', disabled = false) => (
  <SettingsLayout title={title} titleLevel={2}>
    <SettingsSection heading="Speed">
      <SettingsRow label="Speed" description="How hard the fan runs.">
        <Select label={<VisuallyHidden>Speed</VisuallyHidden>} options={SPEEDS} defaultValue="low" />
      </SettingsRow>
      <SettingsRow label="Oscillate" description="Turns side to side." disabled={disabled}>
        {({ labelId }) => <Switch aria-labelledby={labelId} defaultChecked disabled={disabled} />}
      </SettingsRow>
    </SettingsSection>
  </SettingsLayout>
);

export const SETTINGS_LAYOUT: Depth = {
  overview: (
    <>
      <p>SettingsLayout frames a settings page. A title stands at the top, and under it each section is a heading over a hairline box of rows. A row prints the setting’s name and small print on the start side and the part that sets it on the end side.</p>
      <p>Rows are parted by seams. When the unit is narrow the part drops under its name and keeps its full size. The layout is printing, so it has no fill and no shadow, and nothing in it is orange.</p>
    </>
  ),
  whenToUse: ['To lay out a page of settings that each have a name and one part.', 'To pair a switch or a select with a line of small print.', 'To keep a long list of settings in sections with their own headings.'],
  whenNot: [
    { situation: 'Grouping a few controls inside one form', to: '/components/fieldset', label: 'Fieldset' },
    { situation: 'Listing facts that cannot be changed', to: '/components/description-list', label: 'DescriptionList' },
    { situation: 'Splitting a long form into numbered steps', to: '/components/stepper', label: 'Stepper' },
  ],
  variants: { na: 'SettingsLayout has one look, a titled column of printed boxes. Its one choice is titleLevel, covered under Modifiers.' },
  anatomy: {
    render: <div style={WIDE}>{page()}</div>,
    parts: [
      { part: 'Title', selector: '[data-component="SettingsLayout"] > div:first-child > h2', what: 'The page title. It names the whole layout.' },
      { part: 'Section', selector: '[data-component="SettingsSection"]', what: 'A heading over one box of rows, named by its heading.' },
      { part: 'Box', selector: '[data-component="SettingsSection"] > [role="list"]', what: 'A hairline box in the ring ink with no fill.' },
      { part: 'Row', selector: '[data-component="SettingsRow"]', what: 'One setting: name and small print, then the part.' },
    ],
  },
  sizes: { na: 'SettingsLayout has one size. It takes the width of its column, and a row is never shorter than the 44px touch target.' },
  emphasis: { na: 'A settings page is printing and is never loud. The only orange is a primary key you place beside it, such as Save.' },
  placement: {
    rows: [['Inside a unit', 'One layout fills the unit’s column. Put the orange key under the last section, not inside a row.'], ['On a wide page', 'Keep the layout to a reading width. A row that stretches far apart loses the pair of name and part.']],
    examples: [{ title: 'A page of settings in a column', render: <Unit><div style={WIDE}>{page('Fan')}</div></Unit> }],
  },
  combinations: {
    good: [['SettingsLayout + Switch', 'The common row: a name and one switch.'], ['SettingsLayout + Select', 'A choice from a short list, dropping under its name when narrow.'], ['SettingsLayout + Button', 'The orange key under the last section.']],
    avoid: [{ title: 'a SettingsLayout with one row', why: 'A box round a single setting adds a heading and a line for nothing. Print the label and the part on their own.', render: <Unit><div style={WIDE}><SettingsLayout title="Fan" titleLevel={2}><SettingsSection heading="Speed"><SettingsRow label="Oscillate">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection></SettingsLayout></div></Unit> }],
  },
  content: {
    formula: <p>Name a section with a noun, as in <em>Speed</em> or <em>Schedule</em>. Name a row with the thing it sets, not the action. Keep the small print to one sentence.</p>,
    pair: {
      do: <div style={WIDE}><SettingsLayout title="Fan" titleLevel={2}><SettingsSection heading="Schedule"><SettingsRow label="Night mode" description="Starts at 23:00.">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection></SettingsLayout></div>, doNote: 'A noun for the section, the setting for the row.',
      dont: <div style={WIDE}><SettingsLayout title="Fan" titleLevel={2}><SettingsSection heading="Please set up your schedule:"><SettingsRow label="Click to turn night mode on" description="Starts at 23:00.">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection></SettingsLayout></div>, dontNote: 'A sentence with a colon, and a row named by the action.',
    },
    overflow: { text: 'A long name wraps in its column and the part keeps its size.', render: <div style={WIDE}><SettingsLayout title="Fan" titleLevel={2}><SettingsSection heading="Schedule"><SettingsRow label="Lower the heater and dim every lamp upstairs at night" description="Starts at 23:00.">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection></SettingsLayout></div> },
    rtl: { text: 'In right-to-left languages the name sits at the right and the part at the left.', render: <div dir="rtl" style={WIDE}><SettingsLayout title="المروحة" titleLevel={2}><SettingsSection heading="الجدول"><SettingsRow label="وضع الليل" description="يبدأ عند 23:00.">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection></SettingsLayout></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap and the part does not move.', render: <div style={WIDE}><SettingsLayout title="Ventilator" titleLevel={2}><SettingsSection heading="Zeitplan"><SettingsRow label="Nachtmodus einschalten" description="Beginnt um 23:00 Uhr.">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection></SettingsLayout></div> },
  },
  behaviours: {
    states: [
      ['Default', 'A title, then headings over hairline boxes of rows.', 'Each section is a region named by its heading.'],
      ['Disabled row', 'The name and small print fade.', 'Disable the part inside the row as well.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the parts in the rows. The layout itself takes no focus.', 'native'],
      ['Screen reader', 'Read', 'Each section is read as a region with its heading, and each row as a list item.', 'section, aria-labelledby, role=list'],
    ],
    loading: <p>SettingsLayout has no loading state.</p>,
    focus: <p>SettingsLayout never takes focus. Focus lands on the first enabled part in the first row.</p>,
  },
  deepDive: { na: 'SettingsLayout has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'titleLevel',
      rules: <p>The page title is level 1 by default and the sections take the next level. Lower it to 2 when the layout sits inside a page that already has its own h1.</p>,
      pair: { do: <div style={WIDE}>{page('Fan')}</div>, doNote: 'Level 2 title under the page’s own h1.', dont: <div style={WIDE}><SettingsLayout title="Fan"><SettingsSection heading="Speed"><SettingsRow label="Oscillate">{({ labelId }) => <Switch aria-labelledby={labelId} />}</SettingsRow></SettingsSection></SettingsLayout></div>, dontNote: 'A second h1 on a page that has one.' },
    },
    {
      name: 'disabled',
      rules: <p>Fades the name and small print of one row. It does not reach into the part, so disable the part as well and say why in the small print.</p>,
      pair: { do: <div style={WIDE}>{page('Fan', true)}</div>, doNote: 'Row faded and its switch disabled.', dont: <Stack gap="sm"><Switch label="Oscillate" disabled /></Stack>, dontNote: 'Only the part is disabled; the name still looks live.' },
    },
  ],
  related: [['/components/fieldset', 'Fieldset', 'A printed box round a few controls inside a form.'], ['/components/divider', 'Divider', 'The seam between two rows.'], ['/components/switch', 'Switch', 'The usual part at the end of a row.']],
  references: [
    { title: 'MDN · The section element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section', why: 'How a section becomes a named region.' },
    { title: 'WCAG 2.2 · 1.3.1 Info and Relationships', url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html', why: 'Why a name and its control are tied in markup.' },
    { title: 'W3C WAI · Page structure', url: 'https://www.w3.org/WAI/tutorials/page-structure/headings/', why: 'How heading levels give a page its outline.' },
  ],
};
