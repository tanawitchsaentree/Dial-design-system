'use client';
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Carousel.module.css';

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  /** What the slide shows. */
  children?: ReactNode;
  /** The slide's position, counted from 0. Set by the Carousel; do not pass it yourself. */
  index?: number;
  /** How many slides there are. Set by the Carousel; do not pass it yourself. */
  total?: number;
  /** Builds the group name read out for the slide, such as "2 of 5". Set by the Carousel from its own `slideLabel`. */
  slideLabel?: (n: number, total: number) => string;
  /** Class name for the slide. */
  className?: string;
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  /** The slides. Each child becomes one slide; wrap a child in `CarouselSlide` to pass it your own props. */
  children: ReactNode;
  /** The name of the carousel that assistive tech lists, such as "Rooms". Defaults to "Carousel". */
  label?: string;
  /** The slide on show, counted from 0. Pass it with `onIndexChange` to control the Carousel yourself. */
  index?: number;
  /** The slide to start on when you do not control it. Default 0. */
  defaultIndex?: number;
  /** Called with the new slide when a key, a swipe or an arrow key lands on one. */
  onIndexChange?: (index: number) => void;
  /** The name of the previous key. Pass your own for another language. Defaults to "Previous slide". */
  previousLabel?: string;
  /** The name of the next key. Pass your own for another language. Defaults to "Next slide". */
  nextLabel?: string;
  /** Builds each slide's group name, such as "2 of 5". Pass your own for another language or word order. */
  slideLabel?: (n: number, total: number) => string;
  /** Builds the position read out when it changes, such as "Slide 2 of 5". Pass your own for another language. */
  statusLabel?: (n: number, total: number) => string;
  /** Class name for the region. */
  className?: string;
}

/** One slide of a Carousel: a group named "n of N", one window wide, that the track snaps to. */
export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(function CarouselSlide(
  { children, index = 0, total = 1, slideLabel = messages.carousel.slide, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription={messages.carousel.roleSlide}
      aria-label={slideLabel(index + 1, total)}
      data-component="CarouselSlide"
      data-index={index}
      className={cx(styles.slide, className)}
      {...rest}
    >
      {children}
    </div>
  );
});

const clamp = (n: number, total: number) => Math.min(Math.max(0, Math.floor(n)), Math.max(0, total - 1));

/**
 * Pages through a few slides in a recessed window on a native scroll-snap track, with a previous and a next
 * key and a row of holes for the position. It never advances by itself.
 * UNVERIFIED: the snap landing, the IntersectionObserver position and smooth scrolling are not testable in jsdom;
 * they are checked in system/conformance/carousel.mjs (Playwright).
 */
export const Carousel = forwardRef<HTMLElement, CarouselProps>(function Carousel(
  {
    children,
    label = messages.carousel.label,
    index,
    defaultIndex = 0,
    onIndexChange,
    previousLabel = messages.carousel.previous,
    nextLabel = messages.carousel.next,
    slideLabel = messages.carousel.slide,
    statusLabel = messages.carousel.status,
    className,
    ...rest
  },
  ref,
) {
  const items = Children.toArray(children).filter((c) => c !== null && c !== undefined && typeof c !== 'boolean');
  const total = items.length;
  const [own, setOwn] = useState(defaultIndex);
  const current = clamp(index ?? own, total);
  const currentRef = useRef(current);
  currentRef.current = current;
  const scroller = useRef<HTMLDivElement>(null);
  const previousKey = useRef<HTMLButtonElement>(null);
  const nextKey = useRef<HTMLButtonElement>(null);
  /** The slide a key or a prop is moving to; the observer ignores the slides passed on the way. */
  const target = useRef<number | null>(null);
  const targetTimer = useRef<number | undefined>(undefined);
  const mounted = useRef(false);
  const reported = useRef(current);

  const scrollToSlide = useCallback((i: number, instant: boolean) => {
    const box = scroller.current;
    const slide = box?.children[i] as HTMLElement | undefined;
    if (!box || !slide) return;
    if (Math.abs(slide.getBoundingClientRect().x - box.getBoundingClientRect().x) < 1) { target.current = null; return; }
    // under reduce motion the track jumps; otherwise it glides to the snap point
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.current = i;
    window.clearTimeout(targetTimer.current);
    targetTimer.current = window.setTimeout(() => { target.current = null; }, 1000);
    slide.scrollIntoView({ behavior: instant || reduce ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  }, []);

  const land = useCallback((i: number) => {
    reported.current = i;
    if (i === currentRef.current) return;
    setOwn(i);
    onIndexChange?.(i);
  }, [onIndexChange]);

  // The slide whose area is mostly inside the window is the one on show.
  useEffect(() => {
    const box = scroller.current;
    if (!box || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const i = Number((e.target as HTMLElement).dataset.index);
        if (Number.isNaN(i)) continue;
        if (target.current !== null) {
          if (i !== target.current) continue;
          target.current = null;
        }
        land(i);
      }
    }, { root: box, threshold: 0.6 });
    Array.from(box.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [land, total]);

  // The first slide, and a change of `index` from outside, put the track where the prop says.
  // A swipe or a key reports its own slide first (`reported`), so only a change that came from outside moves the track.
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; if (current > 0) scrollToSlide(current, true); return; }
    if (current !== reported.current) { reported.current = current; scrollToSlide(current, false); }
  }, [current, scrollToSlide]);

  useEffect(() => () => window.clearTimeout(targetTimer.current), []);

  const go = (to: number) => {
    const next = clamp(to, total);
    if (next === current) return;
    land(next);
    scrollToSlide(next, false);
  };

  const step = (by: number, key: HTMLButtonElement | null, other: HTMLButtonElement | null) => {
    const next = clamp(current + by, total);
    // a key that is about to go flat hands focus to the other key, so focus is not lost with it
    if ((next === 0 || next === total - 1) && document.activeElement === key && other && !other.disabled) other.focus();
    go(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.altKey || e.ctrlKey || e.metaKey) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    let to: number | null = null;
    if (e.key === forward) to = current + 1;
    else if (e.key === back) to = current - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = total - 1;
    if (to === null) return;
    e.preventDefault();
    go(to);
  };

  return (
    <section
      ref={ref}
      aria-roledescription={messages.carousel.roleCarousel}
      aria-label={label}
      data-component="Carousel"
      className={cx(styles.root, className)}
      {...rest}
    >
      <div className={styles.window}>
        <div
          ref={scroller}
          role="group"
          aria-label={label}
          tabIndex={0}
          className={styles.scroller}
          onKeyDown={onKeyDown}
        >
          {items.map((child, i) =>
            isValidElement(child) && child.type === CarouselSlide
              ? cloneElement(child as ReactElement<CarouselSlideProps>, { index: i, total, slideLabel, key: child.key ?? i })
              : <CarouselSlide key={isValidElement(child) && child.key !== null ? child.key : i} index={i} total={total} slideLabel={slideLabel}>{child}</CarouselSlide>,
          )}
        </div>
      </div>
      <div className={styles.strip}>
        <IconButton ref={previousKey} label={previousLabel} className={styles.key} disabled={current <= 0} onClick={() => step(-1, previousKey.current, nextKey.current)}>
          <Icon name="chevron-left" size="sm" className={styles.flip} />
        </IconButton>
        <div className={styles.dots} aria-hidden="true">
          {items.map((_, i) => <span key={i} className={styles.dot} data-on={i === current ? '' : undefined} />)}
        </div>
        <IconButton ref={nextKey} label={nextLabel} className={styles.key} disabled={current >= total - 1} onClick={() => step(1, nextKey.current, previousKey.current)}>
          <Icon name="chevron-right" size="sm" className={styles.flip} />
        </IconButton>
      </div>
      <VisuallyHidden role="status" aria-live="polite">{total > 0 ? statusLabel(current + 1, total) : null}</VisuallyHidden>
    </section>
  );
});
