import { createElement, forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Box.module.css';

export type BoxPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BoxSurface = 'page' | 'raised' | 'sunken';
export type BoxCorner = 'mark' | 'media' | 'inner' | 'panel';
export type BoxElement = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'ul' | 'ol' | 'li' | 'span';

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Defaults to `div`. Pick the one that matches the content, such as `section` or `li`. */
  as?: BoxElement;
  /** Inset on all sides. none is 0, xs 4px, sm 8, md 16, lg 24 and xl 32. Defaults to none. */
  padding?: BoxPadding;
  /** Ground colour. Leave it out for no fill at all; the three values are the page, raised and sunken grounds. */
  surface?: BoxSurface;
  /** Corner radius. Leave it out for square corners. mark is the smallest, panel the body radius. */
  corner?: BoxCorner;
}

/** A plain block with a token inset and, if asked, a ground and a corner. It has no look until you choose one. */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box({ as = 'div', padding = 'none', surface, corner, className, ...rest }, ref) {
  return createElement(as, {
    ref,
    'data-component': 'Box',
    className: cx(styles.root, styles[`p-${padding}`], surface && styles[`s-${surface}`], corner && styles[`c-${corner}`], className),
    ...rest,
  });
});
