// Usage tab for TreeView (component-depth.md U1–U14). TreeView shows nested items that open and close.
import { Icon, TreeItem, TreeView } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const home = (chosen = 'kitchen', extra?: React.ReactNode) => (
  <TreeView aria-label="Rooms" defaultExpanded={['rooms', 'upstairs']} defaultValue={chosen}>
    <TreeItem value="rooms" label="Rooms">
      <TreeItem value="kitchen" label="Kitchen" />
      <TreeItem value="hall" label="Hall" />
      <TreeItem value="upstairs" label="Upstairs">
        <TreeItem value="bedroom" label="Bedroom" />
        <TreeItem value="bath" label="Bathroom" />
      </TreeItem>
    </TreeItem>
    <TreeItem value="devices" label="Devices">
      <TreeItem value="heater" label="Heater" />
    </TreeItem>
    {extra}
  </TreeView>
);

export const TREE_VIEW: Depth = {
  overview: (
    <>
      <p>TreeView shows items that hold other items, such as the rooms of a home with the devices in each. A branch has a chevron and opens to show its children. A hairline with one right-angle bend joins every child to its parent.</p>
      <p>One item can be chosen. It prints in medium weight inside a hairline box. The arrow keys walk the tree, so it works without a pointer.</p>
    </>
  ),
  whenToUse: ['To browse a hierarchy three or four levels deep, such as rooms and devices.', 'To pick one item out of nested groups.'],
  whenNot: [
    { situation: 'Folding sections of text that are read one at a time', to: '/components/accordion', label: 'Accordion' },
    { situation: 'Showing the path to the current page', to: '/components/breadcrumb', label: 'Breadcrumb' },
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
  ],
  variants: { na: 'TreeView has one look, a schematic of lines and nodes. What changes is the state of each item, covered under Modifiers.' },
  anatomy: {
    render: home(),
    parts: [
      { part: 'Toggle', selector: '[data-component="TreeView"] [data-tree-toggle]', what: 'A 44px cell with a chevron on a branch and a small ring node on a leaf.' },
      { part: 'Label', selector: '[data-component="TreeView"] [data-tree-text]', what: 'The item’s name. The chosen one sits in a hairline box in medium weight.' },
      { part: 'Join line', selector: '[data-component="TreeView"] [role="group"]', what: 'The group of children. A hairline runs down from the parent and bends into each child.' },
    ],
  },
  sizes: { na: 'TreeView has one size. Every row is 44px tall and each level steps in by 22px, half a module.' },
  emphasis: { na: 'The chosen item is told by weight and a box. Nothing in a TreeView is orange.' },
  placement: {
    rows: [['A side column or a sheet', 'The tree fills the column and the detail of the chosen item stands beside it.'], ['Three or four levels', 'Deeper trees run out of width; split them in two screens.']],
    examples: [{ title: 'In a card', render: <Unit>{home('hall')}</Unit> }],
  },
  combinations: {
    good: [['TreeView + Card', 'The tree stands in a card and the chosen item’s settings stand beside it.'], ['TreeView + Icon', 'A dot-matrix glyph before the name tells the kind of thing, such as a lamp or a lock.']],
    avoid: [{ title: 'a TreeView of one level', why: 'Nothing nests, so no line is drawn. Use a List.', render: <Unit><TreeView aria-label="Rooms"><TreeItem value="a" label="Kitchen" /><TreeItem value="b" label="Hall" /></TreeView></Unit> }],
  },
  content: {
    formula: <p>Name each item with a noun, as in <em>Kitchen</em> or <em>Heater</em>. A branch names the group, as in <em>Rooms</em>. Do not write “Folder” or “Open” in the name.</p>,
    pair: {
      do: home(),
      doNote: 'Nouns, and the line shows what belongs where.',
      dont: <TreeView aria-label="Rooms" defaultExpanded={['a']}><TreeItem value="a" label="Open the rooms folder"><TreeItem value="b" label="Click here for the kitchen" /></TreeItem></TreeView>,
      dontNote: 'The chevron already says it opens, and the name is a sentence.',
    },
    overflow: { text: 'A long name wraps beside the chevron. The row grows and the lines follow it.', render: <TreeView aria-label="Floors" defaultExpanded={['g']}><TreeItem value="g" label="Ground floor with the open kitchen and the long hall to the garden"><TreeItem value="k" label="Kitchen" /></TreeItem></TreeView> },
    rtl: { text: 'In right-to-left languages the tree grows from the right, the lines run on the right and Left and Right swap.', render: <div dir="rtl"><TreeView aria-label="غرف" defaultExpanded={['r']}><TreeItem value="r" label="الغرف"><TreeItem value="k" label="المطبخ" /><TreeItem value="h" label="الصالة" /></TreeItem></TreeView></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap and the lines stay joined.', render: <TreeView aria-label="Räume" defaultExpanded={['r']}><TreeItem value="r" label="Wohnräume"><TreeItem value="k" label="Küche mit Essbereich" /></TreeItem></TreeView> },
  },
  behaviours: {
    states: [
      ['Closed branch', 'A right chevron, secondary ink.', 'aria-expanded="false".'],
      ['Open branch', 'A down chevron, the children drawn under it.', 'aria-expanded="true".'],
      ['Chosen', 'Medium weight, primary ink, a hairline box; a leaf’s node fills.', 'aria-selected="true".'],
      ['Disabled', 'Faded; the arrow keys skip it.', 'aria-disabled="true".'],
    ],
    interactions: [
      ['Keyboard', 'Up / Down', 'Moves to the previous or next visible item.', 'native'],
      ['Keyboard', 'Right / Left', 'Right opens a branch, then enters it. Left closes it, then goes to the parent.', 'native'],
      ['Keyboard', 'Home / End', 'Moves to the first or last visible item.', 'native'],
      ['Keyboard', 'Enter / Space', 'Chooses the focused item.', 'native'],
      ['Keyboard', 'A letter', 'Jumps to the next item whose name starts with it.', 'native'],
      ['Pointer', 'Click', 'The chevron opens or closes a branch. Anywhere else on the row chooses it.', 'native'],
      ['Screen reader', 'Read', 'Read as a tree with each item’s level, position and open state.', 'tree, treeitem, group'],
    ],
    loading: <p>TreeView has no loading state. Children are rendered by you, so mount them when you have them.</p>,
    focus: <p>One item is in the tab order: the last focused, else the chosen one, else the first. Tab leaves the tree and Shift+Tab comes back to the same item.</p>,
  },
  deepDive: { na: 'TreeView has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'disabled',
      rules: <p>A disabled item cannot be chosen or opened and the arrow keys skip it. Do not disable an item that holds the only way forward.</p>,
      pair: {
        do: <TreeView aria-label="Schedules" defaultExpanded={['w']}><TreeItem value="w" label="Weekdays"><TreeItem value="m" label="Morning" /><TreeItem value="n" label="Night" disabled /></TreeItem></TreeView>,
        doNote: 'One item off, the others still reachable.',
        dont: <TreeView aria-label="Schedules"><TreeItem value="w" label="Weekdays" disabled><TreeItem value="m" label="Morning" /></TreeItem></TreeView>,
        dontNote: 'The only branch is disabled, so nothing can be reached.',
      },
    },
    {
      name: 'leading',
      rules: <p>A dot-matrix Icon before the name tells the kind of thing. It is decoration and is hidden from screen readers, so the name must stand on its own.</p>,
      pair: {
        do: <TreeView aria-label="Devices" defaultExpanded={['l']}><TreeItem value="l" label="Living room" leading={<Icon name="room" size="sm" />}><TreeItem value="lamp" label="Lamp" leading={<Icon name="lamp" size="sm" />} /></TreeItem></TreeView>,
        doNote: 'The glyph repeats what the name says.',
        dont: <TreeView aria-label="Devices" defaultExpanded={['l']}><TreeItem value="l" label="Living room" leading={<Icon name="lock" size="sm" />}><TreeItem value="lamp" label="Lamp" leading={<Icon name="washer" size="sm" />} /></TreeItem></TreeView>,
        dontNote: 'The glyph says one thing and the name another.',
      },
    },
  ],
  related: [['/components/accordion', 'Accordion', 'Folding sections.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to here.'], ['/components/list', 'List', 'A flat list of items.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Tree View pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/', why: 'The roles, the properties and the key map this component follows.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the chosen item is a box and a weight, not only a colour.' },
    { title: 'IEC 60617 · Graphical symbols for diagrams', url: 'https://www.iec.ch/', why: 'Orthogonal lines with junction dots, the model for the join lines.' },
  ],
};
