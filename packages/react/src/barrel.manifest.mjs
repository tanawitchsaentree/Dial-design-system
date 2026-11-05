// Barrel manifest: the ONLY file that decides what's in src/index.ts and in what order
// (see tooling/generate-barrel.mjs). Each wave appends one block.
export const BARREL_MANIFEST = [
  {
    header: `Layout primitives: Container, Grid/GridItem, Stack. Columns, gutters, margins and breakpoints from tokens.`,
    components: ['Container', 'Grid', 'Stack'],
  },
  {
    header: `Wave 1: atoms and controls. Keys, switches, faders, the rotary, displays and the device card.`,
    components: ['Button', 'Switch', 'Text', 'Heading', 'IconButton', 'Checkbox', 'Display', 'Grille', 'Slider', 'Rotary', 'Input', 'Select', 'SegmentedControl', 'Tabs', 'Dialog', 'Toast', 'Chip', 'Badge', 'Progress', 'Card', 'DeviceCard'],
  },
  {
    header: `Wave 2: home and media. Ranges, the scrubber, meters, lists, menus, sheets, banners, empty states, skeletons and the time picker.`,
    components: ['RangeSlider', 'Scrubber', 'Meter', 'Sheet', 'Banner', 'EmptyState', 'List', 'Menu', 'Skeleton', 'TimePicker'],
  },
  {
    header: `Wave 3: home and phone organisms. Pull to refresh, room environment and the units built from wave 1 and 2 parts.`,
    components: ['PullToRefresh', 'Environment', 'MediaPlayer', 'Queue', 'BottomNav', 'ActionSheet', 'Snackbar'],
  },
  {
    header: `Wave 4: concept depth`,
    components: ['Legend', 'SceneCard', 'Slot', 'Tray', 'Icon', 'Wiring', 'ExplainMode', 'Textarea', 'Stepper', 'Avatar', 'Popover', 'Radio', 'Tooltip', 'Accordion', 'Breadcrumb', 'Divider', 'Timeline', 'Stat', 'Pagination', 'Spinner', 'Link', 'Center', 'Box', 'AspectRatio', 'Spacer', 'Flex', 'VisuallyHidden', 'Fieldset', 'HelperText', 'Label', 'InputGroup', 'Kbd', 'Image', 'FormField', 'FAB', 'Table', 'Rating', 'Drawer', 'Listbox', 'TagInput', 'RadioCards', 'ContextMenu', 'MultiSelect', 'Autocomplete', 'Combobox', 'Sidebar', 'Anchor', 'DescriptionList', 'NavigationMenu', 'Navbar', 'NumberInput', 'PasswordInput', 'Editable', 'Dropzone', 'FileUpload', 'PinInput', 'SearchInput', 'VirtualList', 'Carousel', 'ColorPicker', 'TransferList', 'Calendar', 'TreeView', 'Wizard', 'OTPFlow', 'DataGrid', 'DatePicker', 'Form', 'RangePicker', 'AppShell', 'CommandPalette', 'AuthForms', 'RichTextEditor', 'LineChart', 'Sparkline', 'BarChart', 'PieChart', 'SettingsLayout', 'Feed', 'Onboarding', 'NotificationCenter', 'KanbanBoard'],
  },
];
