import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { AspectRatio, type AspectRatioValue } from '../AspectRatio';
import styles from './Image.module.css';

export type ImageFit = 'cover' | 'contain';
type Status = 'loading' | 'loaded' | 'error';

export interface ImageProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The picture's address. With no address the window shows the failed state. */
  src?: string;
  /**
   * What the picture shows, in words. Required. Pass an empty string only when the picture is decoration
   * and the text beside it already says everything; the window is then hidden from assistive tech.
   */
  alt: string;
  /** The window's proportion, width over height: 1/1, 4/3, 16/9 (the default) or 3/2. The height is held before the picture loads. */
  ratio?: AspectRatioValue;
  /** `cover` fills the window and crops the picture (default). `contain` shows all of it and leaves plastic at the sides. */
  fit?: ImageFit;
  /** A short line printed on the body below the window. It is never laid over the picture. */
  caption?: ReactNode;
  /** `lazy` (default) loads the picture when it nears the screen; `eager` loads it at once, for the first picture on a page. */
  loading?: 'lazy' | 'eager';
  /** Called when the picture has loaded. */
  onLoad?: () => void;
  /** Called when the picture fails to load. */
  onError?: () => void;
  /** Class name for the figure. */
  className?: string;
}

/**
 * A picture seen through a window cut into the body, at a fixed proportion. While it loads the window shows one dash,
 * and if it fails two dashes, never a broken-image icon. A caption sits below on the body. Not a control.
 */
export const Image = forwardRef<HTMLElement, ImageProps>(function Image(
  { src, alt, ratio = '16/9', fit = 'cover', caption, loading = 'lazy', onLoad, onError, className, ...rest },
  ref,
) {
  const [result, setResult] = useState<{ src?: string; status: Status }>({ src, status: src ? 'loading' : 'error' });
  const imgRef = useRef<HTMLImageElement>(null);
  // a new src starts again at loading, without waiting for an effect
  const status: Status = !src ? 'error' : result.src === src ? result.status : 'loading';

  // a picture that finished before React attached its handlers (cache, server render) is read from the element
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete) setResult({ src, status: el.naturalWidth > 0 ? 'loaded' : 'error' });
  }, [src]);

  const decorative = alt === '';
  const windowA11y = status === 'error' ? (decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': alt }) : {};
  return (
    <figure ref={ref} data-component="Image" className={cx(styles.root, className)} {...rest}>
      <AspectRatio ratio={ratio} rounded className={styles.window} data-state={status} data-fit={fit} {...windowA11y}>
        {status === 'error' ? null : (
          <img
            ref={imgRef}
            className={styles.image}
            src={src}
            alt={alt}
            loading={loading}
            onLoad={() => {
              setResult({ src, status: 'loaded' });
              onLoad?.();
            }}
            onError={() => {
              setResult({ src, status: 'error' });
              onError?.();
            }}
          />
        )}
        {status === 'loaded' ? null : (
          <span className={styles.placeholder} aria-hidden="true">
            <span className={styles.mark} />
          </span>
        )}
      </AspectRatio>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
});
