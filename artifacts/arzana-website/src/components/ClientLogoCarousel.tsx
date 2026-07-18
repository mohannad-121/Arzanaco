import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from 'react';
import type { Client } from '../data/clients';

interface ClientLogoCarouselProps {
  clients: Client[];
}

const AUTOPLAY_DELAY = 2800;
const TRANSITION_DURATION = 320;

function modIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function easeCubicInOut(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function ClientLogoCarousel({ clients }: ClientLogoCarouselProps) {
  const isReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplayRevision, setAutoplayRevision] = useState(0);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const positionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const animationRef = useRef({ start: 0, target: 0, startTime: 0 });

  const count = clients.length;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const selectClient = useCallback(
    (clientIndex: number, resetAutoplay = true) => {
      if (count < 2) return;

      const current = Math.round(positionRef.current);
      const currentActive = modIndex(current, count);

      if (clientIndex === currentActive) {
        if (resetAutoplay) setAutoplayRevision((revision) => revision + 1);
        return;
      }

      let delta = clientIndex - current;
      delta = ((delta % count) + count) % count;
      if (delta > count / 2) delta -= count;

      setDirection(delta >= 0 ? 1 : -1);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (isReducedMotion) {
        const target = positionRef.current + delta;
        positionRef.current = target;
        setPosition(target);
        if (resetAutoplay) setAutoplayRevision((revision) => revision + 1);
        return;
      }

      animationRef.current = {
        start: positionRef.current,
        target: positionRef.current + delta,
        startTime: performance.now(),
      };

      const tick = (now: number) => {
        const { start, target, startTime } = animationRef.current;
        const progress = Math.min(1, (now - startTime) / TRANSITION_DURATION);
        const nextPosition = start + (target - start) * easeCubicInOut(progress);

        positionRef.current = nextPosition;
        setPosition(nextPosition);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        positionRef.current = target;
        setPosition(target);
        animationFrameRef.current = null;
      };

      animationFrameRef.current = requestAnimationFrame(tick);
      if (resetAutoplay) setAutoplayRevision((revision) => revision + 1);
    },
    [count, isReducedMotion],
  );

  useEffect(() => {
    if (count < 2 || isPaused || isReducedMotion) return;

    const interval = window.setInterval(() => {
      const next = modIndex(Math.round(positionRef.current) + 1, count);
      selectClient(next, false);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(interval);
  }, [autoplayRevision, count, isPaused, isReducedMotion, selectClient]);

  if (count === 0) return null;

  const activeIndex = modIndex(Math.round(position), count);
  const activeClient = clients[activeIndex];
  const buttonSize = isMobile ? 42 : 56;
  const buttonCount = Math.min(count, isMobile ? 5 : 7);
  const half = Math.floor(buttonCount / 2);
  const buffer = half + 1;
  const curve = 0.48;
  const gap = isMobile ? 13 : 20;
  const step = buttonSize + gap;
  const deltaAngle = ((Math.PI * 2) / count) * curve;
  const radius = step / (2 * Math.sin(deltaAngle / 2));
  const baseTop = buttonSize * 0.9;
  const fadeInner = Math.max(0, half - 0.4);
  const fadeEnd = half + 0.6;
  const maxAngle = Math.min(Math.PI, fadeEnd * deltaAngle);
  const stripHeight = baseTop + radius * (1 - Math.cos(maxAngle)) + buttonSize / 2 + 16;
  const imageSize = isMobile ? 220 : 280;

  const visibleClients: number[] = [];
  const rendered = new Set<number>();
  const center = Math.round(position);
  for (let slot = -buffer; slot <= buffer; slot += 1) {
    const itemIndex = modIndex(center + slot, count);
    if (!rendered.has(itemIndex)) {
      rendered.add(itemIndex);
      visibleClients.push(itemIndex);
    }
  }

  const getSlot = (clientIndex: number) => {
    let slot = clientIndex - position;
    slot %= count;
    if (slot > count / 2) slot -= count;
    if (slot < -count / 2) slot += count;
    return slot;
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget as Node | null;
    if (!nextFocusedElement || !event.currentTarget.contains(nextFocusedElement)) {
      setIsPaused(false);
    }
  };

  const pauseForTouch = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') setIsPaused(true);
  };

  const resumeAfterTouch = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') setIsPaused(false);
  };

  return (
    <section
      aria-label="Client logo carousel"
      className="overflow-hidden rounded-2xl border bg-card px-4 py-8 shadow-sm sm:px-8 sm:py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={handleBlur}
      onPointerDown={pauseForTouch}
      onPointerUp={resumeAfterTouch}
      onPointerCancel={resumeAfterTouch}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5">
        <div
          className="relative max-w-full overflow-hidden rounded-xl border bg-white"
          style={{ width: imageSize, height: imageSize }}
        >
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={activeClient.id}
              custom={direction}
              initial={
                isReducedMotion
                  ? { opacity: 0 }
                  : { x: direction * 180, y: 80, opacity: 0, scale: 0.88, rotate: direction * 6 }
              }
              animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={
                isReducedMotion
                  ? { opacity: 0 }
                  : { x: -direction * 180, y: 80, opacity: 0, scale: 0.88, rotate: -direction * 6 }
              }
              transition={{ duration: isReducedMotion ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={activeClient.logoPath}
                alt={activeClient.alt}
                draggable={false}
                className="h-full w-full object-contain p-8 sm:p-10"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.p
            key={activeClient.id}
            initial={{ opacity: 0, y: isReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isReducedMotion ? 0 : -8 }}
            transition={{ duration: isReducedMotion ? 0.15 : 0.25 }}
            className="min-h-6 px-4 text-center text-lg font-semibold text-foreground"
          >
            {activeClient.name}
          </motion.p>
        </AnimatePresence>

        <div className="relative w-full overflow-hidden" style={{ height: stripHeight }}>
          {visibleClients.map((clientIndex) => {
            const slot = getSlot(clientIndex);
            const angle = slot * deltaAngle;
            const x = radius * Math.sin(angle);
            const y = radius * (1 - Math.cos(angle));
            const angleDegrees = (angle * 180) / Math.PI;
            const absoluteSlot = Math.abs(slot);
            const depth = Math.max(0, 1 - (0.55 * absoluteSlot) / Math.max(1, half));
            const scale = 0.55 + 0.45 * depth;
            const opacity =
              absoluteSlot <= fadeInner
                ? 1
                : absoluteSlot >= fadeEnd
                  ? 0
                  : 1 - (absoluteSlot - fadeInner) / (fadeEnd - fadeInner);
            const isActive = clientIndex === activeIndex;
            const client = clients[clientIndex];

            return (
              <motion.button
                key={client.id}
                type="button"
                aria-label={`Show ${client.name}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => selectClient(clientIndex)}
                initial={false}
                animate={{ x, y, rotate: angleDegrees, scale, opacity }}
                transition={isReducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-1/2 top-0 grid place-items-center rounded-full border bg-white p-0 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                style={{
                  width: buttonSize,
                  height: buttonSize,
                  marginLeft: -buttonSize / 2,
                  marginTop: baseTop - buttonSize / 2,
                  zIndex: Math.round(depth * 100) + (isActive ? 100 : 0),
                  pointerEvents: opacity > 0.05 ? 'auto' : 'none',
                  borderColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                }}
              >
                <img
                  src={client.logoPath}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-contain p-1.5"
                  style={{ transform: `rotate(${-angleDegrees}deg)` }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
