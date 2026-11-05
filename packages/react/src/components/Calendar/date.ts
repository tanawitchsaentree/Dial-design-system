// Date helpers for Calendar, DatePicker and RangePicker. Dates are plain ISO strings, "yyyy-mm-dd",
// worked out in UTC so a time zone or a daylight-saving change can never move a day. No date library.

/** A calendar day as a string, "yyyy-mm-dd". */
export type ISODate = string;
/** A calendar month as a string, "yyyy-mm". */
export type ISOMonth = string;

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH = /^(\d{4})-(\d{2})$/;

const utc = (y: number, m: number, d: number) => {
  const dt = new Date(0);
  dt.setUTCFullYear(y, m - 1, d);
  return dt;
};
const pad = (n: number, w: number) => String(n).padStart(w, '0');

/** Reads "yyyy-mm-dd" into parts, or returns null when it is not a real day (such as 2026-02-30). */
export function parseISODate(iso: string | null | undefined): { year: number; month: number; day: number } | null {
  const m = typeof iso === 'string' ? DAY.exec(iso) : null;
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = utc(year, month, day);
  return dt.getUTCFullYear() === year && dt.getUTCMonth() === month - 1 && dt.getUTCDate() === day ? { year, month, day } : null;
}

/** Reads "yyyy-mm" into parts, or returns null. */
export function parseISOMonth(iso: string | null | undefined): { year: number; month: number } | null {
  const m = typeof iso === 'string' ? MONTH.exec(iso) : null;
  if (!m) return null;
  const [year, month] = [Number(m[1]), Number(m[2])];
  return month >= 1 && month <= 12 ? { year, month } : null;
}

/** Writes parts as "yyyy-mm-dd". */
export function formatISODate(year: number, month: number, day: number): ISODate {
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

const fromDate = (dt: Date): ISODate => formatISODate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
const toDate = (iso: ISODate): Date => {
  const p = parseISODate(iso)!;
  return utc(p.year, p.month, p.day);
};

/** Today in the visitor's own time zone, as "yyyy-mm-dd". */
export function todayISO(now: Date = new Date()): ISODate {
  return formatISODate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** The month a day belongs to, "yyyy-mm". */
export const monthOf = (iso: ISODate): ISOMonth => iso.slice(0, 7);

/** Days in a month. */
export function daysInMonth(year: number, month: number): number {
  return utc(year, month + 1, 0).getUTCDate();
}

/** Moves a day by whole days, forward or back. */
export function addDays(iso: ISODate, days: number): ISODate {
  const dt = toDate(iso);
  dt.setUTCDate(dt.getUTCDate() + days);
  return fromDate(dt);
}

/** Moves a day by whole months and keeps the day number when the month is long enough, else the last day. */
export function addMonths(iso: ISODate, months: number): ISODate {
  const p = parseISODate(iso)!;
  const index = p.year * 12 + (p.month - 1) + months;
  const [year, month] = [Math.floor(index / 12), (index % 12 + 12) % 12 + 1];
  return formatISODate(year, month, Math.min(p.day, daysInMonth(year, month)));
}

/** Moves a month "yyyy-mm" by whole months. */
export function addMonthsToMonth(month: ISOMonth, months: number): ISOMonth {
  return monthOf(addMonths(`${month}-01`, months));
}

/** Sorts two days: negative when a is before b, 0 when equal, positive when after. */
export const compareISODate = (a: ISODate, b: ISODate): number => (a < b ? -1 : a > b ? 1 : 0);

/** Holds a day inside min and max (either may be left out). */
export function clampISODate(iso: ISODate, min?: ISODate, max?: ISODate): ISODate {
  if (min && compareISODate(iso, min) < 0) return min;
  if (max && compareISODate(iso, max) > 0) return max;
  return iso;
}

/** Day of the week for a day: 0 is Sunday, 6 is Saturday. */
export const weekdayOf = (iso: ISODate): number => toDate(iso).getUTCDay();

/**
 * The cells of a month as six weeks of seven. A cell is the day's "yyyy-mm-dd", or null where the
 * grid stands outside the month. `weekStart` is 0 for Sunday through 6 for Saturday.
 */
export function monthGrid(month: ISOMonth, weekStart = 1): (ISODate | null)[][] {
  const p = parseISOMonth(month)!;
  const first = weekdayOf(`${month}-01`);
  const lead = (first - weekStart + 7) % 7;
  const count = daysInMonth(p.year, p.month);
  return Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, c) => {
      const day = w * 7 + c - lead + 1;
      return day >= 1 && day <= count ? formatISODate(p.year, p.month, day) : null;
    }),
  );
}
