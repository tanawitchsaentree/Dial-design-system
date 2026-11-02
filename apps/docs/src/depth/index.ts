// Usage-tab content per component (component-depth.md U1–U14). A component with no entry here renders
// its first-edition notes and fails G-K2 until its depth file is written. Each wave adds its files.
import type { Depth } from './types';
import { TIME_PICKER } from './time-picker';
import { SKELETON } from './skeleton';
import { MENU } from './menu';
import { LIST } from './list';
import { EMPTY_STATE } from './empty-state';
import { BANNER } from './banner';
import { SHEET } from './sheet';
import { METER } from './meter';
import { SCRUBBER } from './scrubber';
import { RANGE_SLIDER } from './range-slider';
import { DEVICE_CARD } from './device-card';
import { CARD } from './card';
import { PROGRESS } from './progress';
import { BADGE } from './badge';
import { CHIP } from './chip';
import { TOAST } from './toast';
import { DIALOG } from './dialog';
import { TABS } from './tabs';
import { SEGMENTED_CONTROL } from './segmented-control';
import { SELECT } from './select';
import { INPUT } from './input';
import { ROTARY } from './rotary';
import { SLIDER } from './slider';
import { GRILLE } from './grille';
import { DISPLAY } from './display';
import { CHECKBOX } from './checkbox';
import { ICON_BUTTON } from './icon-button';
import { HEADING } from './heading';
import { TEXT } from './text';
import { SWITCH } from './switch';
import { BUTTON } from './button';
import { CONTAINER, GRID, STACK } from './layout';

export const DEPTH: Record<string, Depth> = { Container: CONTAINER, Grid: GRID, Stack: STACK, Button: BUTTON, Switch: SWITCH, Text: TEXT, Heading: HEADING, IconButton: ICON_BUTTON, Checkbox: CHECKBOX, Display: DISPLAY, Grille: GRILLE, Slider: SLIDER, Rotary: ROTARY, Input: INPUT, Select: SELECT, SegmentedControl: SEGMENTED_CONTROL, Tabs: TABS, Dialog: DIALOG, Toast: TOAST, Chip: CHIP, Badge: BADGE, Progress: PROGRESS, Card: CARD, DeviceCard: DEVICE_CARD, RangeSlider: RANGE_SLIDER, Scrubber: SCRUBBER, Meter: METER, Sheet: SHEET, Banner: BANNER, EmptyState: EMPTY_STATE, List: LIST, Menu: MENU, Skeleton: SKELETON, TimePicker: TIME_PICKER };
