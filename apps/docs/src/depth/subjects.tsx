// How to render each component for the Style tab and the header's live demo, given the enum props
// a reader picks. Only the content is fixed here; which options exist comes from meta.json.
import type { ReactNode } from 'react';
import { Button, Checkbox, Container, Display, Grid, GridItem, Grille, Heading, IconButton, Rotary, Slider, Stack, Switch, Text } from 'dial-react';

type P = Record<string, string>;
// bare: the subject must not sit on a second pane. true = it is its own surface (Card, a chart, a chat
// thread) and must paint one, which G-BR1 measures; 'layout' = it only places other things (Container,
// Grid, Stack) and paints nothing on purpose.
export interface Subject { render: (p: P, disabled?: boolean) => ReactNode; code: (p: P) => string; disabled?: boolean; bare?: boolean | 'layout' }

/** Marks a bare subject for the gates: data-bare="surface" must paint a surface (G-BR1), "layout" is skipped. */
export const BareHost = ({ bare, children }: { bare: boolean | 'layout'; children: ReactNode }) => <div className="bare-subject" data-bare={bare === 'layout' ? 'layout' : 'surface'}>{children}</div>;

const attrs = (p: P) => Object.entries(p).map(([k, v]) => ` ${k}="${v}"`).join('');

/** The surface a subject sits on in the docs. A system whose components need a surface under them
 *  (text over imagery, translucent material) replaces this with its own surface. */
export const OnSurface = ({ children }: { children: ReactNode }) => <div className="demo-row spec-row">{children}</div>;

export const SUBJECTS: Record<string, Subject> = {
  Rotary: { render: (p, disabled) => <Rotary {...p} label="Temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} disabled={disabled} />, code: (p) => `<Rotary${attrs(p)} label="Temperature" min={16} max={26} defaultValue={21} />`, disabled: true },
  Slider: { render: (_p, disabled) => <Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale disabled={disabled} />, code: () => '<Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />', disabled: true },
  Grille: { render: (p) => <Grille {...p} label="Volume" value={6} max={10} cols={12} rows={4} />, code: (p) => `<Grille${attrs(p)} label="Volume" value={6} max={10} cols={12} rows={4} />` },
  Display: { render: (p) => <Display {...p} label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />, code: (p) => `<Display${attrs(p)} label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />` },
  Checkbox: { render: (p, disabled) => <Checkbox label="Pre-wash" defaultChecked {...p} disabled={disabled} />, code: (p) => `<Checkbox label="Pre-wash" defaultChecked${attrs(p)} />`, disabled: true },
  IconButton: { render: (p, disabled) => <IconButton label="Play" {...p} disabled={disabled}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 5l11 7-11 7z" /></svg></IconButton>, code: (p) => `<IconButton label="Play"${attrs(p)}><PlayIcon /></IconButton>`, disabled: true },
  Heading: { render: (p) => <Heading level={3} {...p}>Living room heater</Heading>, code: (p) => `<Heading level={3}${attrs(p)}>Living room heater</Heading>` },
  Text: { render: (p) => <Text {...p}>Eco from 23:00</Text>, code: (p) => `<Text${attrs(p)}>Eco from 23:00</Text>` },
  Switch: { render: (p, disabled) => <Switch {...p} label="Keep warm" offLabel="Off" onLabel="On" disabled={disabled} />, code: (p) => `<Switch${attrs(p)} label="Keep warm" offLabel="Off" onLabel="On" />`, disabled: true },
  Button: { render: (p, disabled) => <Button {...p} disabled={disabled}>Start wash</Button>, code: (p) => `<Button${attrs(p)}>Start wash</Button>`, disabled: true },
  Container: { bare: 'layout', render: (p) => <Container {...p}><div className="demo-box"><p className="flush">Content column</p></div></Container>, code: (p) => `<Container${attrs(p)}>…</Container>` },
  Grid: { bare: 'layout', render: () => <Grid><GridItem span={6}><div className="demo-box">Half</div></GridItem><GridItem span={6}><div className="demo-box">Half</div></GridItem></Grid>, code: () => '<Grid>\n  <GridItem span={6}>…</GridItem>\n  <GridItem span={6}>…</GridItem>\n</Grid>' },
  Stack: { render: () => <Stack direction="row" gap="md"><span className="demo-chip">One</span><span className="demo-chip">Two</span><span className="demo-chip">Three</span></Stack>, code: () => '<Stack direction="row" gap="md">…</Stack>' },
};
