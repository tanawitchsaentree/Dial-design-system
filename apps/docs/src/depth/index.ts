// Usage-tab content per component (component-depth.md U1–U14). A component with no entry here renders
// its first-edition notes and fails G-K2 until its depth file is written. Each wave adds its files.
import type { Depth } from './types';
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

export const DEPTH: Record<string, Depth> = { Container: CONTAINER, Grid: GRID, Stack: STACK, Button: BUTTON, Switch: SWITCH, Text: TEXT, Heading: HEADING, IconButton: ICON_BUTTON, Checkbox: CHECKBOX, Display: DISPLAY, Grille: GRILLE, Slider: SLIDER, Rotary: ROTARY };
