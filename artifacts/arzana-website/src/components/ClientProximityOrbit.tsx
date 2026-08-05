import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Client } from '../data/clients';

type ClientProximityOrbitProps = {
  clients: Client[];
};

/** A logo-focused adaptation of the Originkit Proximity Orbit. */
export function ClientProximityOrbit({ clients }: ClientProximityOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const speedMultiplier = useRef(1);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);
  const [activeClient, setActiveClient] = useState<Client | null>(clients[0] ?? null);
  const reducedMotion = useReducedMotion();

  const radius = Math.max(92, Math.min(size.width * 0.31, size.height * 0.32));
  const itemCount = Math.min(clients.length, Math.max(8, Math.min(16, Math.round(radius / 12))));
  const orbitClients = useMemo(() => clients.slice(0, itemCount), [clients, itemCount]);
  const logoSize = Math.max(54, Math.min(88, radius * 0.37));

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !orbitClients.length) return;

    let frameId = 0;
    let previousTime: number | null = null;
    let currentRotation = 0;
    const tick = (time: number) => {
      if (previousTime !== null) {
        const elapsed = Math.min(time - previousTime, 100);
        currentRotation -= elapsed * 0.018 * speedMultiplier.current;
        setRotation(currentRotation);
      }
      previousTime = time;
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [orbitClients.length, reducedMotion]);

  if (!clients.length) return null;

  const accelerate = (client: Client) => {
    speedMultiplier.current = 4;
    setActiveClient(client);
  };
  const normalizeSpeed = () => { speedMultiplier.current = 1; };

  return (
    <section
      ref={containerRef}
      aria-label="Client logo orbit"
      className="relative h-[25rem] overflow-hidden border border-[#b9b8b3] bg-[radial-gradient(circle_at_center,#fffdfa_0%,#eee9e1_53%,#d8d4cb_100%)] shadow-[0_18px_38px_rgba(39,40,42,.12)] md:h-[31rem]"
      onMouseLeave={normalizeSpeed}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,131,134,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(124,131,134,.11)_1px,transparent_1px)] bg-[size:28px_28px] opacity-45" />
      <div className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-3 rounded-full border border-[#8f1f35]/25 bg-[#292a2c] p-5 text-center text-white shadow-[0_12px_28px_rgba(39,40,42,.25)] md:h-48 md:w-48">
        {activeClient ? (
          <>
            <img
              src={activeClient.logoPath}
              alt=""
              draggable={false}
              className={`h-12 w-20 object-contain ${activeClient.emphasis === 'large' ? 'scale-110' : ''}`}
            />
            <p className="text-xs font-bold leading-5 tracking-[.08em]">{activeClient.name}</p>
          </>
        ) : (
          <p className="text-xs font-bold leading-5 tracking-[.08em]">Our clients</p>
        )}
      </div>
      {orbitClients.map((client, index) => {
        const angle = ((index / orbitClients.length) * 360 + rotation) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <div
            key={client.id}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
          >
            <motion.button
              type="button"
              aria-label={client.name}
              onMouseEnter={() => accelerate(client)}
              onFocus={() => accelerate(client)}
              onMouseLeave={normalizeSpeed}
              onBlur={normalizeSpeed}
              onClick={() => setActiveClient(client)}
              whileHover={reducedMotion ? undefined : { scale: 1.15 }}
              whileFocus={reducedMotion ? undefined : { scale: 1.15 }}
              className="grid place-items-center rounded-full border border-[#c9c4bc] bg-white shadow-[0_7px_18px_rgba(39,40,42,.14)] transition-shadow hover:border-[#8f1f35] hover:shadow-[0_10px_22px_rgba(143,31,53,.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#8f1f35]"
              style={{ width: logoSize, height: logoSize }}
            >
              <img
                src={client.logoPath}
                alt=""
                draggable={false}
                className={`max-h-[72%] max-w-[72%] object-contain ${client.emphasis === 'large' ? 'scale-110' : ''}`}
              />
            </motion.button>
          </div>
        );
      })}
    </section>
  );
}
