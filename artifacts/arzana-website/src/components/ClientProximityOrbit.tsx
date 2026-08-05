import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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

  const outerRadius = Math.max(128, Math.min(size.width * 0.36, size.height * 0.37));
  const innerRadius = outerRadius * 0.76;
  const outerRingClientCount = Math.ceil(clients.length / 2);
  const outerRingClients = clients.slice(0, outerRingClientCount);
  const innerRingClients = clients.slice(outerRingClientCount);
  const logoSize = Math.max(54, Math.min(84, outerRadius * 0.39));

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
    if (reducedMotion || !clients.length) return;

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
  }, [clients.length, reducedMotion]);

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
      className="relative h-[25rem] overflow-hidden border border-[#b9b8b3] bg-[radial-gradient(circle_at_center,#fffdfa_0%,#eee9e1_53%,#d8d4cb_100%)] shadow-[0_18px_38px_rgba(39,40,42,.12)] md:h-[36rem]"
      onMouseLeave={normalizeSpeed}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,131,134,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(124,131,134,.11)_1px,transparent_1px)] bg-[size:28px_28px] opacity-45" />
      <div className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full border border-[#8f1f35]/25 bg-[#292a2c] p-4 text-center text-white shadow-[0_12px_28px_rgba(39,40,42,.25)] md:h-52 md:w-52 md:gap-4 md:p-6">
        {activeClient ? (
          <>
            <img
              src={activeClient.logoPath}
              alt=""
              draggable={false}
              className={`h-12 w-20 object-contain md:h-16 md:w-28 ${activeClient.emphasis === 'large' ? 'scale-110' : ''}`}
            />
            <p className="max-w-full text-xs font-bold leading-5 tracking-[.06em] md:text-sm md:leading-6">{activeClient.name}</p>
          </>
        ) : (
          <p className="text-xs font-bold leading-5 tracking-[.08em]">Our clients</p>
        )}
      </div>
      {clients.map((client, index) => {
        const isOuterRing = index < outerRingClientCount;
        const ringClients = isOuterRing ? outerRingClients : innerRingClients;
        const ringIndex = isOuterRing ? index : index - outerRingClientCount;
        const ringRadius = isOuterRing ? outerRadius : innerRadius;
        const ringRotation = isOuterRing ? rotation : -rotation * 1.2 + 18;
        const angle = ((ringIndex / ringClients.length) * 360 + ringRotation) * (Math.PI / 180);
        const x = Math.cos(angle) * ringRadius;
        const y = Math.sin(angle) * ringRadius;
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
