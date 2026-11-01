// Every sentence the engine pages say about this system. kiln create leaves each one as a
// TODO(phase): the book renders from day one, and gate G-TODO1 fails the milestone while any TODO is
// still visible. Write these in the system's own voice, through human-tone (tone gate), with numbers
// read from tokens rather than typed (the kit's `tok()` helper), and true to the code.
import type { ReactNode } from 'react';

export const NAME = 'dial';
export const PACKAGES = { tokens: 'dial-tokens', react: 'dial-react' };

const todo = (phase: string, what: string) => `TODO(${phase}) ${what}`;

export const CONTENT: {
  overview: { title: string; lede: ReactNode; status: ReactNode };
  partBlurb: Record<string, string>;
  foundations: Record<string, { lede: ReactNode; prose?: ReactNode }>;
  credits: ReactNode;
} = {
  overview: {
    title: 'dial: the face of a home appliance, drawn on a screen',
    lede: 'dial is for apps that run the things in a home: heating, lamps, the washer, the music. Each card behaves like one small appliance, with a warm-white matte body, one display that says the state and one orange control. It must never turn into a retro costume, spread orange across the screen or set grey text that nobody can read.',
    status: 'The anchor is picked and the tokens are dial’s own, estimated from the reference. Only the layout primitives are built so far.',
  },
  partBlurb: {
    Introduction: 'What the system is, and the principles behind every trade-off.',
    'Getting started': 'Install it, design with it, build with it, contribute to it.',
    Foundations: 'Colour, type, space, shape, motion, icons and the rest, each with live values.',
    Components: 'Every component in depth, in four tabs, with tested keyboard and contrast.',
    Patterns: 'Common problems solved with the components, with live examples.',
    Accessibility: 'How every claim in this book is measured and tested.',
    Reference: 'All tokens, the change history, the decision log and the exceptions register.',
  },
  foundations: {
    color: { lede: "Colour has three jobs: warm-white or charcoal plastic, grey ink printed on it, and one orange for the control that matters most in each unit. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    themes: { lede: "Light is warm-white plastic and is the base. Dark is the charcoal edition of the same object, lit by the same light. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    typography: { lede: "One grotesk in two weights, set like printing on a case, with tabular figures wherever a number changes. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    spacing: { lede: "Space comes from the body's inset, so a display, a grille and a knob sit on the same lines. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    grid: { lede: "A unit is a fixed face, and its parts keep their places in every state. The page grid places units side by side. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    dimensions: { lede: "Every control keeps a 44px target even when it draws smaller, as a real knob does. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    shape: { lede: "Corners are about a sixth of a unit's short side, and anything inside nests: inner radius equals outer radius minus the inset. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    motion: { lede: "A press goes down at once and comes back on a spring. Knobs and faders settle into detents, and nothing moves while idle. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
    icons: { lede: "Icons appear only where a printed word will not fit, drawn with the same stroke as the printing. Colours and proportions are estimated from the reference seen in chat and get measured again from the reference file." },
  },
  credits: todo('milestone', 'images, fonts and libraries the system uses, with their licences'),
};
