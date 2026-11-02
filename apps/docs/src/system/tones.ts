// Demo audio for the MediaPlayer and Queue chapters. The book ships no sound files and calls no network:
// each track is a few seconds of soft tones rendered in the browser with an OfflineAudioContext and
// encoded as a WAV Blob URL. Rendering needs no user gesture; playing still waits for a press.
import { useEffect, useState } from 'react';
import type { MediaTrack } from 'dial-react';

type Recipe = { id: string; title: string; artist: string; source: string; notes: number[]; beat: number };

const RECIPES: Recipe[] = [
  { id: 'kiln-song', title: 'Kiln song', artist: 'Ulm Quartet', source: 'Library', notes: [57, 60, 64, 67, 64, 60, 57, 52], beat: 0.75 },
  { id: 'weniger', title: 'Weniger, aber besser', artist: 'Hochschule', source: 'Library', notes: [62, 66, 69, 74, 69, 66, 62, 57, 62], beat: 0.9 },
  { id: 'slow-return', title: 'Slow return', artist: 'The Faders', source: 'Radio', notes: [55, 59, 62, 59, 55, 50, 55], beat: 1.3 },
  { id: 'detent', title: 'Detent', artist: 'Rotary Club', source: 'Library', notes: [60, 67, 64, 72, 67, 64, 60, 55, 60, 64], beat: 0.5 },
  { id: 'ruhe', title: 'Ruhe, side A', artist: 'Studio dial', source: 'Radio', notes: [53, 57, 60, 65, 60, 57], beat: 1.4 },
];

const RATE = 22050;

function wav(buffer: AudioBuffer): Blob {
  const data = buffer.getChannelData(0);
  const out = new DataView(new ArrayBuffer(44 + data.length * 2));
  const text = (at: number, s: string) => { for (let i = 0; i < s.length; i++) out.setUint8(at + i, s.charCodeAt(i)); };
  text(0, 'RIFF'); out.setUint32(4, 36 + data.length * 2, true); text(8, 'WAVE');
  text(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
  out.setUint32(24, buffer.sampleRate, true); out.setUint32(28, buffer.sampleRate * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true);
  text(36, 'data'); out.setUint32(40, data.length * 2, true);
  for (let i = 0; i < data.length; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i])) * 0x7fff, true);
  return new Blob([out.buffer], { type: 'audio/wav' });
}

async function render(r: Recipe): Promise<MediaTrack> {
  const seconds = r.notes.length * r.beat + 0.6;
  const ctx = new OfflineAudioContext(1, Math.ceil(seconds * RATE), RATE);
  r.notes.forEach((n, i) => {
    const t = i * r.beat;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 440 * 2 ** ((n - 69) / 12);
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(0.32, t + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.001, t + r.beat * 1.4);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + r.beat * 1.5);
  });
  const buffer = await ctx.startRendering();
  return { id: r.id, title: r.title, artist: r.artist, source: r.source, duration: Math.round(seconds), src: URL.createObjectURL(wav(buffer)) };
}

let made: Promise<MediaTrack[]> | null = null;

/** Renders the demo tracks once per page and shares them. Resolves to an empty list where Web Audio is missing. */
export function demoTracks(): Promise<MediaTrack[]> {
  if (!made) made = typeof OfflineAudioContext === 'undefined' ? Promise.resolve([]) : Promise.all(RECIPES.map(render)).catch(() => []);
  return made;
}

/** Your own titles on the demo tones: each track takes the sound and the length of the demo track at its place. */
export function useToned(tracks: Array<Omit<MediaTrack, 'src'>>): MediaTrack[] | null {
  const made = useDemoTracks();
  if (!made || !made.length) return made && [];
  return tracks.map((t, i) => ({ ...t, src: made[i % made.length].src, duration: made[i % made.length].duration }));
}

/** The demo tracks for a chapter example, or null while they render (the player shows its loading state). */
export function useDemoTracks(count = RECIPES.length): MediaTrack[] | null {
  const [tracks, setTracks] = useState<MediaTrack[] | null>(null);
  useEffect(() => {
    let live = true;
    void demoTracks().then((t) => { if (live) setTracks(t.slice(0, count)); });
    return () => { live = false; };
  }, [count]);
  return tracks;
}
