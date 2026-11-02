// The home page's one remarkable thing (book shell A, derivation in apps/lab/book/derivation.json): anchor A
// large on its plastic stage with its parts named by thin printed leaders, as a Braun leaflet names the parts
// of the product it shows, and a small rack of four more units set on one module grid like the reference
// sheet. The anchor's knob is the page's one orange part (P1); every other unit uses key-kind controls.
import { useLayoutEffect, useRef, useState } from 'react';
import { Button, Card, DeviceCard, Display, Explain, ExplainMode, Grille, Icon as DotIcon, IconButton, Legend, Progress, Rotary, SceneCard, Slider, Slot, Switch, TimePicker, Tray, Wiring, type SceneInfo } from 'dial-react';
import { Section, Stage } from './kit';

type Callout = { label: string; side: 'start' | 'end'; find: (host: HTMLElement) => Element | null };
const CALLOUTS: Callout[] = [
  { label: 'display', side: 'end', find: (h) => h.querySelector('[data-component="Display"]') },
  { label: 'knob', side: 'start', find: (h) => h.querySelector('[data-component="Rotary"]') },
  { label: 'keys', side: 'end', find: (h) => h.querySelector('[data-component="Button"], [data-component="IconButton"]') },
  { label: 'grille', side: 'end', find: (h) => h.querySelector('[data-component="Grille"]') },
  { label: 'fader', side: 'start', find: (h) => h.querySelector('[data-component="Slider"]') },
  { label: 'wordmark', side: 'start', find: (h) => h.querySelector('[class*="wordmark"]') },
  { label: 'model', side: 'end', find: (h) => h.querySelector('[class*="model"]') },
];
// labels stand on the module grid: their rows are multiples of 8px and at least 32px apart
const MODULE = 8, ROW = 32;

function AnchorHero() {
  const [step, setStep] = useState(2);
  const [band, setBand] = useState<'FM' | 'AM'>('FM');
  const [volume, setVolume] = useState(4);
  // under 480px the two-column anchor no longer fits beside its 44px parts, so the same unit stands in
  // its one-column layout (DeviceCard layout="tall") and the part names become a printed list under it
  const [narrow, setNarrow] = useState(() => matchMedia('(max-width: 480px)').matches);
  useLayoutEffect(() => { const mq = matchMedia('(max-width: 480px)'); const on = () => setNarrow(mq.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); }, []);
  const fig = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Array<{ label: string; side: 'start' | 'end'; y: number; py: number; px: number }>>([]);
  useLayoutEffect(() => {
    const measure = () => {
      const f = fig.current, c = card.current; if (!f || !c) return;
      const o = f.getBoundingClientRect();
      const placed: Record<'start' | 'end', number[]> = { start: [], end: [] };
      const out = CALLOUTS.flatMap((k) => {
        const el = k.find(c); if (!el) return [];
        const r = el.getBoundingClientRect();
        const py = r.y + r.height / 2 - o.y;
        const prev = placed[k.side].at(-1) ?? -Infinity;
        const y = Math.max(Math.round(py / MODULE) * MODULE, prev + ROW);
        placed[k.side].push(y);
        return [{ label: k.label, side: k.side, y, py, px: k.side === 'start' ? r.x - o.x : r.x + r.width - o.x }];
      });
      setMarks(out);
    };
    measure();
    const ro = new ResizeObserver(measure); if (fig.current) ro.observe(fig.current);
    return () => ro.disconnect();
  }, [narrow]);
  const w = fig.current?.clientWidth ?? 0;
  return (
    <div className="hero-anchor" ref={fig}>
      <div ref={card} className="hero-card-host">
        <DeviceCard
          layout={narrow ? 'tall' : 'a'}
          model="tuner 1"
          display={{ label: 'Radio', value: (87.6 + step * 0.5).toFixed(1), unit: 'MHz', digits: 4 }}
          knob={{ label: 'Tuning', value: step, onValueChange: setStep, formatValue: (v) => `Step ${v}` }}
          keysLabel="Band"
          keys={[{ label: 'FM', pressed: band === 'FM', onPress: () => setBand('FM') }, { label: 'AM', pressed: band === 'AM', onPress: () => setBand('AM') }]}
          meter={{ label: 'Volume', value: volume, cols: 10, rows: 4 }}
          fader={{ label: 'Volume', value: volume, onValueChange: setVolume, step: 1 }}
        />
      </div>
      <svg className="hero-leads" aria-hidden="true" width="100%" height="100%">
        {marks.map((m) => {
          const lane = m.side === 'start' ? MODULE * 12 : w - MODULE * 12;
          return <path key={m.label} d={`M${m.px} ${m.py} H${m.side === 'start' ? lane + MODULE * 2 : lane - MODULE * 2} L${lane} ${m.y}`} />;
        })}
      </svg>
      <ul className="hero-parts flush" aria-label="Parts of the unit">
        {marks.map((m) => <li key={m.label} className={`hero-part ${m.side}`} style={{ insetBlockStart: m.y }}>{m.label}</li>)}
      </ul>
    </div>
  );
}

const Icon = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

function Rack() {
  const [target, setTarget] = useState(22);
  const [lamp, setLamp] = useState(true);
  const [level, setLevel] = useState(70);
  const [playing, setPlaying] = useState(true);
  const [running, setRunning] = useState(true);
  return (
    <div className="hero-rack" aria-label="More units">
      <Card padding="unit" wordmark="dial" model="thermostat 1" className="rack-unit">
        <Display label="Thermostat" value="21.5" unit="°C" detail={`Heating to ${target}`} digits={3} />
        <div className="rack-row"><Rotary kind="key" label="Temperature" min={16} max={26} value={target} onValueChange={setTarget} formatValue={(v) => `${v} °C`} /></div>
      </Card>
      <Card padding="unit" wordmark="dial" model="lamp 1" className="rack-unit">
        <Display label="Lamp" value={lamp ? String(level) : '0'} unit="%" detail={lamp ? 'Warm white' : 'Off'} digits={3} />
        <Slider label="Brightness" min={0} max={100} step={10} value={level} onValueChange={setLevel} formatValue={(v) => `${v} %`} disabled={!lamp} />
        <Switch label="Lamp" checked={lamp} onCheckedChange={setLamp} />
      </Card>
      <Card padding="unit" wordmark="dial" model="speaker 1" className="rack-unit">
        <Display kind="oled" label="Speaker" value="So What" detail={`${playing ? 'Playing' : 'Paused'} · Kind of Blue`} />
        <Grille label="Volume" value={5} cols={12} rows={3} />
        <div className="rack-row">
          <IconButton kind="key" label="Previous track"><Icon d="M18 6l-8 6 8 6zM6 6v12" /></IconButton>
          <IconButton kind="key" label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying(!playing)}><Icon d={playing ? 'M8 5v14M16 5v14' : 'M8 5l11 7-11 7z'} /></IconButton>
          <IconButton kind="key" label="Next track"><Icon d="M6 6l8 6-8 6zM18 6v12" /></IconButton>
        </div>
      </Card>
      <Card padding="unit" wordmark="dial" model="wash 1" className="rack-unit">
        <Display label="Washer" value={running ? '38' : '0'} unit="min" detail="Cotton" digits={3} />
        <Progress label="Wash progress" value={running ? 60 : 0} max={100} valueText={running ? '60 percent, rinsing next' : 'Not started'} />
        <div className="rack-row"><Button kind="key" onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</Button></div>
      </Card>
    </div>
  );
}

// "Living room, 22:40": the units above at work in one room, as a leaflet shows the system in use. The
// thermostat's legend knob and the speaker's play key are the only orange parts, one per unit (P1); the
// heating relations are printed lines (P8), the lamp's fader cap is warm glass (P9), and How this works
// prints every part's name.
const MODES = [
  { value: 'off', label: 'off', target: null },
  { value: 'eco', label: 'eco', target: 18 },
  { value: 'comfort', label: 'comfort', target: 21 },
  { value: 'boost', label: 'boost', target: 24 },
] as const;
const SCENES: SceneInfo[] = [
  { value: 'movie', name: 'Movie night', steps: ['Lamp 20%', 'Speaker on', 'Heating comfort'] },
  { value: 'reading', name: 'Reading', steps: ['Lamp 80%', 'Speaker off'] },
  { value: 'away', name: 'Away', steps: ['Lamp off', 'Heating eco'] },
];

function LivingRoom() {
  const [mode, setMode] = useState('comfort');
  const [night, setNight] = useState('23:00');
  const [lamp, setLamp] = useState(true);
  const [level, setLevel] = useState(20);
  const [playing, setPlaying] = useState(true);
  const [scene, setScene] = useState<SceneInfo | null>(SCENES[0]);
  const target = MODES.find((m) => m.value === mode)?.target ?? null;
  const run = (s: SceneInfo) => {
    if (s.value === 'movie') { setLamp(true); setLevel(20); setPlaying(true); setMode('comfort'); }
    if (s.value === 'reading') { setLamp(true); setLevel(80); setPlaying(false); }
    if (s.value === 'away') { setLamp(false); setPlaying(false); setMode('eco'); }
  };
  return (
    <ExplainMode className="scene" toggleLabel="How this works">
      <div className="scene-room">
        <Wiring
          className="scene-wiring"
          label="Heating relations"
          links={[
            { from: 'thermostat', to: 'heater', label: 'sets', text: target === null ? 'The thermostat has the heater off' : `The thermostat sets the heater to ${target} °C`, active: target !== null },
            { from: 'night', to: 'thermostat', label: `after ${night}`, text: `Good night turns the thermostat to eco after ${night}` },
          ]}
        >
          <Wiring.Node id="thermostat" className="scene-node">
            <Card padding="unit" wordmark="dial" model="thermostat 2">
              <Explain name="Window" does="Shows the room's temperature and what the heating is doing.">
                <Display label="Living room" value="20.5" unit="°C" detail={target === null ? 'Heating off' : `Heating to ${target}`} digits={3} />
              </Explain>
              <Explain name="Mode" does="Turn the knob or press a word to pick how warm the room runs.">
                <Legend label="Mode" options={MODES.map(({ value, label }) => ({ value, label }))} value={mode} onValueChange={setMode} />
              </Explain>
            </Card>
          </Wiring.Node>
          <Wiring.Node id="heater" className="scene-node">
            <Card padding="unit" wordmark="dial" model="heater 2">
              <Explain name="Heater" does="Follows the thermostat and shows how hard it is working.">
                <Display label="Heater" value={target === null ? 'Off' : String(target)} unit={target === null ? undefined : '°C'} detail={target === null ? 'Standing by' : 'Following the thermostat'} digits={3} />
              </Explain>
              <Grille label="Heat output" value={target === null ? 0 : target - 15} max={10} cols={10} rows={2} />
            </Card>
          </Wiring.Node>
          <Wiring.Node id="night" className="scene-node">
            <Card padding="unit" wordmark="dial" model="schedule 1">
              <Explain name="Good night" does="Sets the time the house goes to eco for the night.">
                <TimePicker label="Good night starts" value={night} onValueChange={setNight} />
              </Explain>
            </Card>
          </Wiring.Node>
        </Wiring>
        <div className="scene-units">
          <Card padding="unit" wordmark="dial" model="lamp 2" className="scene-unit">
            <Display label="Floor lamp" value={lamp ? String(level) : '0'} unit="%" detail={lamp ? 'Warm white' : 'Off'} digits={3} />
            <Explain name="Brightness" does="Slide the warm glass cap to dim or brighten the lamp.">
              <Slider label="Brightness" tint="warm" min={0} max={100} step={10} value={level} onValueChange={setLevel} formatValue={(v) => `${v} %`} disabled={!lamp} />
            </Explain>
            <Explain name="Power" does="Turns the lamp on or off and keeps its brightness.">
              <Switch label="Lamp" checked={lamp} onCheckedChange={setLamp} />
            </Explain>
          </Card>
          <Card padding="unit" wordmark="dial" model="speaker 2" className="scene-unit">
            <Display kind="oled" label="Speaker" value="So What" detail={`${playing ? 'Playing' : 'Paused'} · Kind of Blue`} />
            <div className="scene-transport">
              <Explain name="Track keys" does="Skip back or forward one track.">
                <Tray label="Tracks">
                  <IconButton label="Previous track"><DotIcon name="previous" /></IconButton>
                  <IconButton label="Next track"><DotIcon name="next" /></IconButton>
                </Tray>
              </Explain>
              <Explain name="Play" does="Starts or pauses the music.">
                <IconButton kind="primary" size="lg" label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying(!playing)}><DotIcon name={playing ? 'pause' : 'play'} /></IconButton>
              </Explain>
            </div>
          </Card>
          <Card padding="unit" wordmark="dial" model="scene 1" className="scene-unit scene-slot">
            <div className="scene-bay">
              <Explain name="Scene slot" does="Runs the scene on the card inside. Pick up a card beside it, then press the slot.">
                <Slot label="Living room" scene={scene} onSceneChange={setScene} onInsert={run} />
              </Explain>
              <div className="scene-cards" role="group" aria-label="Waiting scene cards">
                {SCENES.filter((s) => s.value !== scene?.value).map((s) => <SceneCard key={s.value} value={s.value} name={s.name} steps={s.steps} />)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ExplainMode>
  );
}

/** The home hero: anchor A named part by part, then the rack. Both stand in demo stages (the system's look
 *  lives only in stages, G-SH1). */
export function HomeHero() {
  return (
    <div className="home-hero" data-home-hero="">
      <Stage className="hero-stage"><AnchorHero /></Stage>
      <Stage className="rack-stage"><Rack /></Stage>
      <Section id="scene" title="Living room, 22:40" wide>
        <p className="scene-lede">The same units, set out in one room at twenty to eleven. Turn the thermostat’s knob and the lit word moves along its printed modes. A line shows that it drives the heater, and a second line shows the Good night schedule taking over after 23:00. The knob and the speaker’s play key are the only orange parts, one in each unit. Put a scene card in the slot and its lamp lights. Press How this works and every part prints its name.</p>
        <Stage className="scene-stage"><LivingRoom /></Stage>
      </Section>
    </div>
  );
}
