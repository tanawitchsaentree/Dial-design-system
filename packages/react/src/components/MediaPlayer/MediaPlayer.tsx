import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { Card } from '../Card';
import { Grille } from '../Grille';
import { IconButton } from '../IconButton';
import { Rotary } from '../Rotary';
import { Scrubber } from '../Scrubber';
import { Slider } from '../Slider';
import styles from './MediaPlayer.module.css';

/** One track the player can play. */
export interface MediaTrack {
  /** A stable id, used by `current` and by a Queue beside the player. */
  id: string;
  /** The title, printed as the largest line in the window. */
  title: string;
  /** Who plays it, printed under the title. */
  artist?: string;
  /** Where it plays from, such as "Library" or "Radio", printed after the artist. */
  source?: string;
  /** The address of the audio file. Any address an HTMLAudioElement can play, including a Blob URL. */
  src: string;
  /** The length in seconds, shown until the file has said its own length. */
  duration?: number;
}

/** What the window says the player is doing. */
export type MediaPlayerStatus = 'loading' | 'paused' | 'playing' | 'ended' | 'error' | 'offline';
/** How volume is set: the ruler fader across the body, or a plastic rotary at the end of the key row. */
export type MediaPlayerVolume = 'slider' | 'rotary';

/** The words the player prints and speaks. Pass your own for another language. */
export interface MediaPlayerWords {
  loading: string;
  paused: string;
  playing: string;
  ended: string;
  error: string;
  offline: string;
  play: string;
  previous: string;
  next: string;
  volume: string;
  level: string;
  transport: string;
}

const WORDS: MediaPlayerWords = {
  loading: 'Loading',
  paused: 'Paused',
  playing: 'Playing',
  ended: 'Ended',
  error: 'Can’t play this file',
  offline: 'Offline',
  play: 'Play',
  previous: 'Previous track',
  next: 'Next track',
  volume: 'Volume',
  level: 'Level',
  transport: 'Transport',
};

export interface MediaPlayerProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The tracks in play order. The player plays them one after another. */
  tracks: MediaTrack[];
  /** The id of the track in the window when controlled. Pair it with `onCurrentChange`. */
  current?: string;
  /** The id of the first track in the window when uncontrolled. Defaults to the first track. */
  defaultCurrent?: string;
  /** Called with the new track's id when previous, next or the end of a track changes it. */
  onCurrentChange?: (id: string) => void;
  /** Called whenever the state in the window changes, such as from paused to playing. */
  onStatusChange?: (status: MediaPlayerStatus) => void;
  /** The tracks are not ready yet. The window says Loading and every part waits. */
  loading?: boolean;
  /** The source cannot be reached. The window says Offline and play waits for the network. */
  offline?: boolean;
  /** `slider` (default) is the ruler fader across the body; `rotary` is a plastic knob at the end of the key row. */
  volume?: MediaPlayerVolume;
  /** The volume at the start, from 0 to 100. Default 70. */
  defaultVolume?: number;
  /** Shows the level as lit holes in a Grille beside the keys. Default true. */
  meter?: boolean;
  /** Plays the next track when one ends. Default true. */
  autoAdvance?: boolean;
  /** Tells the operating system what is playing through the Media Session API, so lock screens and media keys work. Default true. */
  mediaSession?: boolean;
  /** The model name printed lowercase at the lower end of the body. Default "mp 1". */
  model?: string;
  /** The wordmark printed at the lower start of the body. Default "dial". */
  wordmark?: ReactNode;
  /** The name of the player for assistive tech. Default "Player". */
  label?: string;
  /** Your own words for the states and the keys. */
  words?: Partial<MediaPlayerWords>;
}

const icon = { viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const;
const PrevGlyph = () => <svg {...icon} fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinejoin="round"><path d="M7 6v12M18 6l-8 6 8 6z" /></svg>;
const NextGlyph = () => <svg {...icon} fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinejoin="round"><path d="M17 6v12M6 6l8 6-8 6z" /></svg>;
const PlayGlyph = () => <svg {...icon} fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>;
const PauseGlyph = () => <svg {...icon} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M8.5 5.5v13M15.5 5.5v13" /></svg>;

/** One printed shape per state, so a state never rests on its word alone or on colour. */
const STATE_GLYPH: Record<MediaPlayerStatus, ReactNode> = {
  playing: <path d="M2 1v8l7-4z" />,
  paused: <path d="M2 1h2v8H2zM6 1h2v8H6z" />,
  ended: <circle cx="5" cy="5" r="3.75" />,
  loading: <path d="M1 4h2v2H1zM4 4h2v2H4zM7 4h2v2H7z" />,
  error: <rect x="1" y="1" width="8" height="8" />,
  offline: <path d="M5 .9 9.4 9.1H.6z" />,
};

type Graph = { ctx: AudioContext; an: AnalyserNode; buf: Uint8Array<ArrayBuffer> };

/** The small MP3 player of the reference as one unit: an OLED window that says the state, the tape fader, three
 *  round transport keys with play the one orange part, the level in holes and a volume control. It plays its
 *  tracks through an HTMLAudioElement and starts only when a person presses play. */
export const MediaPlayer = forwardRef<HTMLElement, MediaPlayerProps>(function MediaPlayer(
  {
    tracks,
    current,
    defaultCurrent,
    onCurrentChange,
    onStatusChange,
    loading = false,
    offline = false,
    volume = 'slider',
    defaultVolume = 70,
    meter = true,
    autoAdvance = true,
    mediaSession = true,
    model = 'mp 1',
    wordmark = 'dial',
    label,
    words,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const w = { ...WORDS, ...words };
  const controlled = current !== undefined;
  const [inner, setInner] = useState<string | undefined>(defaultCurrent ?? tracks[0]?.id);
  const id = controlled ? current : inner;
  const found = tracks.findIndex((t) => t.id === id);
  const index = found < 0 ? 0 : found;
  const track: MediaTrack | undefined = tracks[index];

  const audio = useRef<HTMLAudioElement>(null);
  const want = useRef(false);
  const scrubbing = useRef(false);
  const graph = useRef<Graph | null>(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(track?.duration ?? 0);
  const [vol, setVol] = useState(Math.min(100, Math.max(0, defaultVolume)));
  const [level, setLevel] = useState(0);

  const busy = loading || !track;
  const status: MediaPlayerStatus = busy
    ? 'loading'
    : offline ? 'offline'
    : failed ? 'error'
    : ended ? 'ended'
    : playing ? (waiting ? 'loading' : 'playing')
    : 'paused';

  const go = (i: number) => {
    const t = tracks[i];
    if (!t) return;
    if (!controlled) setInner(t.id);
    onCurrentChange?.(t.id);
  };

  const fail = (e: unknown) => {
    const name = (e as { name?: string } | null)?.name;
    want.current = false;
    setPlaying(false);
    // a refused autoplay or an interrupted load is not a broken file
    if (name === 'NotAllowedError' || name === 'AbortError') return;
    setFailed(true);
  };

  // the level meter listens through Web Audio; the graph is made on the first press, as autoplay rules ask
  const startMeter = () => {
    const a = audio.current;
    if (!meter || !a || typeof window === 'undefined') return;
    if (!graph.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      try {
        const ctx = new AC();
        const src = ctx.createMediaElementSource(a);
        const an = ctx.createAnalyser();
        an.fftSize = 512;
        src.connect(an);
        an.connect(ctx.destination);
        graph.current = { ctx, an, buf: new Uint8Array(new ArrayBuffer(an.fftSize)) };
      } catch {
        return;
      }
    }
    void graph.current.ctx.resume?.().catch(() => {});
  };

  const toggle = () => {
    const a = audio.current;
    if (!a || busy || offline || failed) return;
    // a track with no address cannot play; say so instead of waiting for it
    if (!track?.src) {
      setFailed(true);
      return;
    }
    if (!a.paused) {
      want.current = false;
      a.pause();
      return;
    }
    if (ended) {
      a.currentTime = 0;
      setPos(0);
      setEnded(false);
    }
    want.current = true;
    startMeter();
    a.play().catch(fail);
  };

  const prev = () => {
    const a = audio.current;
    if (a && (a.currentTime > 3 || index === 0)) {
      a.currentTime = 0;
      setPos(0);
      return;
    }
    go(index - 1);
  };
  const next = () => go(index + 1);

  // a new track loads from the start; it keeps playing when the player was playing
  useEffect(() => {
    setFailed(false);
    setEnded(false);
    setPos(0);
    setDur(track?.duration ?? 0);
    const a = audio.current;
    if (a && track && want.current) a.play().catch(fail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id, track?.src]);

  useEffect(() => {
    if (audio.current) audio.current.volume = vol / 100;
  }, [vol]);

  // offline pauses what is playing; the press to play again is the person's
  useEffect(() => {
    if ((offline || loading) && audio.current && !audio.current.paused) {
      want.current = false;
      audio.current.pause();
    }
  }, [offline, loading]);

  // only one player sounds at a time on a page
  useEffect(() => {
    const other = (e: Event) => {
      if (e.target instanceof HTMLMediaElement && e.target !== audio.current && audio.current && !audio.current.paused) {
        want.current = false;
        audio.current.pause();
      }
    };
    document.addEventListener('play', other, true);
    return () => document.removeEventListener('play', other, true);
  }, []);

  // the holes follow the sound about ten times a second while it plays, and go dark when it stops
  useEffect(() => {
    if (!playing || !graph.current) {
      setLevel(0);
      return;
    }
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 100) return;
      last = t;
      const g = graph.current;
      if (!g) return;
      g.an.getByteTimeDomainData(g.buf);
      let sum = 0;
      for (let i = 0; i < g.buf.length; i++) {
        const v = (g.buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / g.buf.length);
      // music sits around −15 dBFS; full scale at about a quarter of the peak keeps the holes moving
      setLevel(Math.round(Math.min(1, rms * 6) * 10));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => () => { void graph.current?.ctx.close?.().catch(() => {}); }, []);

  const report = useRef(onStatusChange);
  report.current = onStatusChange;
  useEffect(() => { report.current?.(status); }, [status]);

  // lock screens and media keys, while this player is the one playing
  const keys = useRef({ toggle, prev, next });
  keys.current = { toggle, prev, next };
  useEffect(() => {
    if (!mediaSession || !playing || !track || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    try {
      if (typeof MediaMetadata !== 'undefined') ms.metadata = new MediaMetadata({ title: track.title, artist: track.artist ?? '', album: track.source ?? '' });
      ms.setActionHandler('play', () => keys.current.toggle());
      ms.setActionHandler('pause', () => keys.current.toggle());
      ms.setActionHandler('previoustrack', () => keys.current.prev());
      ms.setActionHandler('nexttrack', () => keys.current.next());
    } catch {
      /* a browser without one of the actions keeps the rest */
    }
  }, [mediaSession, playing, track]);

  // Space toggles play anywhere in the player, except on a key, which Space presses
  const keydown = (e: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.key !== ' ' || e.altKey || e.ctrlKey || e.metaKey) return;
    if ((e.target as HTMLElement).closest('button, a[href], input, select, textarea, [role="menuitem"]')) return;
    e.preventDefault();
    toggle();
  };

  const word = w[status];
  const meta = [track?.artist, track?.source].filter(Boolean).join(' · ');
  const count = tracks.length > 1 && track ? `${index + 1} / ${tracks.length}` : '';
  const reading = [
    word,
    track ? [track.title, track.artist, track.source].filter(Boolean).join(', ') : '',
    count ? `Track ${index + 1} of ${tracks.length}` : '',
  ].filter(Boolean).join('. ');
  const stopped = busy || offline;
  const playable = !stopped && !failed;
  const volumeProps = {
    label: w.volume,
    min: 0,
    max: 100,
    step: 5,
    value: vol,
    onValueChange: setVol,
    formatValue: (v: number) => `${v}%`,
    disabled: stopped,
  };
  const grille = meter ? (
    <Grille
      className={styles.meter}
      value={level}
      max={10}
      cols={6}
      rows={2}
      label={w.level}
      valueText={playing ? `${level} of 10` : 'Silent'}
    />
  ) : null;

  return (
    <Card
      ref={ref}
      as="section"
      padding="unit"
      wordmark={wordmark}
      model={model}
      aria-label={label ?? 'Player'}
      aria-busy={busy || undefined}
      data-status={status}
      className={cx(styles.root, className)}
      onKeyDown={keydown}
      {...rest}
      data-component="MediaPlayer"
    >
      <div className={styles.face}>
        <div className={styles.window} role="status" aria-live="polite" aria-atomic="true" data-glow="soft">
          <span className={styles.reading}>{reading}</span>
          <span className={styles.status} aria-hidden="true">
            <span className={styles.word}>
              <svg className={styles.glyph} viewBox="0 0 10 10" aria-hidden="true" focusable="false">{STATE_GLYPH[status]}</svg>
              {word}
            </span>
            {count && <span className={styles.count}>{count}</span>}
          </span>
          <span className={styles.title} aria-hidden="true">{track?.title ?? ' '}</span>
          <span className={styles.meta} aria-hidden="true">{meta || ' '}</span>
        </div>
        <Scrubber
          className={styles.scrubber}
          label={track?.title ?? w.loading}
          duration={dur}
          value={pos}
          disabled={stopped || failed || dur <= 0}
          onValueChange={(s) => {
            scrubbing.current = true;
            setPos(s);
          }}
          onValueCommit={(s) => {
            scrubbing.current = false;
            if (audio.current) audio.current.currentTime = s;
            setPos(s);
            if (ended && s < dur) setEnded(false);
          }}
        />
        <div className={styles.deck}>
          <div className={styles.keys} role="group" aria-label={w.transport}>
            <IconButton label={w.previous} onClick={prev} disabled={stopped || (index === 0 && pos < 1)}>
              <PrevGlyph />
            </IconButton>
            <IconButton kind="primary" size="lg" label={w.play} aria-pressed={playing} onClick={toggle} disabled={!playable}>
              {playing ? <PauseGlyph /> : <PlayGlyph />}
            </IconButton>
            <IconButton label={w.next} onClick={next} disabled={stopped || index >= tracks.length - 1}>
              <NextGlyph />
            </IconButton>
          </div>
          {volume === 'rotary' ? (
            <>
              {grille}
              <Rotary {...volumeProps} kind="key" size="sm" className={styles.volume} />
            </>
          ) : grille}
        </div>
        {volume === 'slider' && <Slider {...volumeProps} className={styles.volume} />}
        <audio
          ref={audio}
          src={track?.src || undefined}
          preload="metadata"
          onPlay={() => { setPlaying(true); setEnded(false); setFailed(false); }}
          onPause={() => setPlaying(false)}
          onPlaying={() => setWaiting(false)}
          onWaiting={() => setWaiting(true)}
          onTimeUpdate={(e) => { if (!scrubbing.current) setPos(e.currentTarget.currentTime); }}
          onLoadedMetadata={(e) => { const d = e.currentTarget.duration; if (Number.isFinite(d) && d > 0) setDur(d); }}
          onDurationChange={(e) => { const d = e.currentTarget.duration; if (Number.isFinite(d) && d > 0) setDur(d); }}
          onEnded={() => {
            setPlaying(false);
            if (autoAdvance && index < tracks.length - 1) go(index + 1);
            else { want.current = false; setEnded(true); }
          }}
          onError={() => { if (track?.src) fail(null); }}
        />
      </div>
    </Card>
  );
});
