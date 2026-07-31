'use client';

import { useEffect, useRef, useState } from 'react';
import type { Media as MediaData } from '@/content/exhibition';

/**
 * Every image is ours, so nothing here is decorative and everything gets real
 * alt text from the content file.
 *
 * Two floors are represented by clips rather than stills. Lightweeds runs on
 * live weather and Resonating Microcosms is a chain reaction — a frozen frame
 * of either misrepresents the work. Clips are muted, looping, lazily attached
 * and never autoplay under reduced motion, where the poster stands in.
 *
 * Stills pulled from phone clips are only 480px wide, so they are capped by
 * height and never upscaled. In a dark room a smaller lit plate reads as
 * deliberate; a stretched one reads as a mistake.
 */
export function Media({ media, className = '' }: { media: MediaData; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [attached, setAttached] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Attach the clip only as its chapter approaches, so the hallway still owns LCP.
  useEffect(() => {
    if (media.kind !== 'video' || reduced || attached) return;
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setAttached(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [media.kind, reduced, attached]);

  // Run only while the work is actually on screen. A clip playing in a room the
  // visitor has already left is wasted battery, and Chrome will pause it anyway.
  useEffect(() => {
    if (!attached) return;
    const el = holder.current;
    const v = video.current;
    if (!el || !v) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          v.play().catch(() => {
            /* Autoplay refused. The poster is already showing; nothing to do. */
          });
        } else {
          v.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [attached]);

  const cropped = Boolean(media.crop);
  const still = media.kind === 'video' ? media.poster! : media.src;

  const frameStyle: React.CSSProperties = cropped
    ? { aspectRatio: media.crop!.aspect }
    : {
        aspectRatio: `${media.width} / ${media.height}`,
        maxHeight: media.lowRes ? '76svh' : '86svh',
        width: 'auto',
        marginInline: 'auto',
      };

  const fit: React.CSSProperties = cropped
    ? { objectFit: 'cover', objectPosition: media.crop!.position ?? 'center', width: '100%', height: '100%' }
    : { width: '100%', height: '100%', objectFit: 'contain' };

  return (
    <div
      ref={holder}
      className={`relative overflow-hidden ${className}`}
      style={frameStyle}
      data-lowres={media.lowRes ? 'true' : undefined}
    >
      {media.kind === 'video' && attached ? (
        <video
          ref={video}
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={media.alt}
          style={fit}
        />
      ) : (
        <img
          src={still}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
          style={fit}
        />
      )}
    </div>
  );
}
