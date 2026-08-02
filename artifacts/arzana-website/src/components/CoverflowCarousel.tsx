import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CoverflowItem {
  src: string;
  alt: string;
  caption?: string;
}

interface CoverflowCarouselProps {
  items: readonly CoverflowItem[];
  autoplay?: boolean;
  className?: string;
}

function relativePosition(index: number, active: number, count: number) {
  let position = index - active;
  if (position > count / 2) position -= count;
  if (position < -count / 2) position += count;
  return position;
}

/**
 * A project-ready adaptation of the supplied Originkit coverflow: one active
 * image, narrow contextual side slats, keyboard controls, reduced motion, and
 * a single timer that is paused by direct user interaction.
 */
export function CoverflowCarousel({ items, autoplay = true, className }: CoverflowCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const interactionTimer = useRef<number | undefined>(undefined);
  const count = items.length;

  const go = useCallback((direction: number) => {
    setActive((current) => (current + direction + count) % count);
  }, [count]);

  const pauseForInteraction = useCallback(() => {
    setPaused(true);
    window.clearTimeout(interactionTimer.current);
    interactionTimer.current = window.setTimeout(() => setPaused(false), 7000);
  }, []);

  useEffect(() => () => window.clearTimeout(interactionTimer.current), []);

  useEffect(() => {
    if (!autoplay || paused || reducedMotion || count < 2) return undefined;
    const interval = window.setInterval(() => go(1), 4200);
    return () => window.clearInterval(interval);
  }, [autoplay, count, go, paused, reducedMotion]);

  const cards = useMemo(() => items.map((item, index) => {
    const relative = relativePosition(index, active, count);
    const side = Math.sign(relative);
    const isActive = relative === 0;
    const visible = Math.abs(relative) <= 2;

    return (
      <motion.button
        key={item.src}
        type="button"
        aria-label={`Show ${item.alt}`}
        aria-current={isActive ? 'true' : undefined}
        className="coverflow-card"
        initial={false}
        animate={{
          x: `${relative * 37}%`,
          scale: isActive ? 1 : Math.abs(relative) === 1 ? .82 : .7,
          opacity: visible ? (isActive ? 1 : Math.abs(relative) === 1 ? .72 : .16) : 0,
          zIndex: 20 - Math.abs(relative),
          filter: isActive ? 'saturate(1)' : 'saturate(.78)',
        }}
        transition={reducedMotion ? { duration: 0 } : { duration: .38, ease: [0.22, 1, .36, 1] }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
        onClick={() => { pauseForInteraction(); setActive(index); }}
      >
        <img src={item.src} alt={item.alt} className="coverflow-card__image" draggable={false} />
        {!isActive && <span className={cn('coverflow-card__shade', side > 0 ? 'coverflow-card__shade--end' : 'coverflow-card__shade--start')} />}
      </motion.button>
    );
  }), [active, count, items, pauseForInteraction, reducedMotion]);

  if (count === 0) return null;

  return (
    <section
      className={cn('coverflow', className)}
      aria-roledescription="carousel"
      aria-label="Testing and commissioning image gallery"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); pauseForInteraction(); go(document.documentElement.dir === 'rtl' ? 1 : -1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); pauseForInteraction(); go(document.documentElement.dir === 'rtl' ? -1 : 1); }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false); }}
    >
      <div className="coverflow__viewport">{cards}</div>
      <div className="coverflow__controls">
        <button type="button" className="coverflow__arrow" aria-label="Previous image" onClick={() => { pauseForInteraction(); go(document.documentElement.dir === 'rtl' ? 1 : -1); }}><ChevronLeft aria-hidden="true" /></button>
        <p className="coverflow__caption" aria-live="polite">{items[active]?.caption ?? items[active]?.alt}</p>
        <button type="button" className="coverflow__arrow" aria-label="Next image" onClick={() => { pauseForInteraction(); go(document.documentElement.dir === 'rtl' ? -1 : 1); }}><ChevronRight aria-hidden="true" /></button>
      </div>
    </section>
  );
}
