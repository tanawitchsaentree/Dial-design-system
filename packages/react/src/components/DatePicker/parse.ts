// Reading and writing a typed date for DatePicker. Both ways use the Gregorian calendar and Latin digits, so
// the string that is shown can always be read back, whatever the locale. Dates stay "yyyy-mm-dd" strings.
import { formatISODate, parseISODate, type ISODate } from '../Calendar';

type Part = 'day' | 'month' | 'year';

export interface DateShape {
  /** The text for a day in the locale's own order and separators, such as "04/11/2026". */
  show: (iso: ISODate) => string;
  /** The same shape written with words in place of the digits, such as "dd/mm/yyyy". */
  pattern: (words: { day: string; month: string; year: string }) => string;
  /** The order of day, month and year the locale types them in. */
  order: Part[];
}

const supported = (locale: string) => {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(locale).length ? locale : 'en';
  } catch {
    return 'en';
  }
};

/** Works out how a locale writes a numeric date: the order of its parts and the marks between them. */
export function dateShape(locale: string): DateShape {
  const loc = supported(locale);
  const f = new Intl.DateTimeFormat(loc, {
    year: 'numeric', month: '2-digit', day: '2-digit', calendar: 'gregory', numberingSystem: 'latn', timeZone: 'UTC',
  });
  const sample = new Date(0);
  sample.setUTCFullYear(2000, 10, 22);
  const parts = f.formatToParts(sample);
  const order = parts.filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year').map((p) => p.type as Part);
  return {
    order,
    show: (iso) => {
      const p = parseISODate(iso)!;
      const d = new Date(0);
      d.setUTCFullYear(p.year, p.month - 1, p.day);
      return f.format(d);
    },
    pattern: (words) =>
      parts.map((p) => (p.type === 'day' || p.type === 'month' || p.type === 'year' ? words[p.type] : p.value)).join(''),
  };
}

export type Reading = { kind: 'empty' } | { kind: 'date'; iso: ISODate } | { kind: 'invalid' };

/** Reads typed text as ISO "yyyy-mm-dd" or in the locale's order. Anything that is not a real day is invalid. */
export function readDate(text: string, order: Part[]): Reading {
  const t = text.trim();
  if (t === '') return { kind: 'empty' };
  if (/\p{L}/u.test(t)) return { kind: 'invalid' };
  const groups = t.match(/\d+/g);
  if (!groups || groups.length !== 3) return { kind: 'invalid' };
  const [a, b, c] = groups;
  // four digits first always means year-month-day, whatever the locale
  const used: Part[] = a.length === 4 ? ['year', 'month', 'day'] : order;
  const found: Record<Part, string> = { day: '', month: '', year: '' };
  [a, b, c].forEach((g, i) => { found[used[i]] = g; });
  if (found.year.length !== 4 || found.month.length > 2 || found.day.length > 2) return { kind: 'invalid' };
  const iso = formatISODate(Number(found.year), Number(found.month), Number(found.day));
  return parseISODate(iso) ? { kind: 'date', iso } : { kind: 'invalid' };
}
