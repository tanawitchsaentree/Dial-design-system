// Barrel manifest: the ONLY file that decides what's in src/index.ts and in what order
// (see tooling/generate-barrel.mjs). Each wave appends one block.
export const BARREL_MANIFEST = [
  {
    header: `Layout primitives: Container, Grid/GridItem, Stack. Columns, gutters, margins and breakpoints from tokens.`,
    components: ['Container', 'Grid', 'Stack'],
  },
  {
    header: `Wave 1: atoms and controls. Keys, switches, faders, the rotary, displays and the device card.`,
    components: ['Button'],
  },
];
