import { clients } from '../data/clients';

export function ClientLogoMarquee() {
  if (!clients.length) return null;
  const items = [...clients, ...clients];
  return <div className="client-marquee" role="region" aria-label="Arzana clients">
    <div className="client-marquee__track">
      {items.map((client, index) => <div key={`${client.id}-${index}`} className="client-marquee__item" aria-hidden={index >= clients.length || undefined}>
        <img src={client.logoPath} alt={index < clients.length ? client.alt : ''} className={client.emphasis === 'large' ? 'client-marquee__logo client-marquee__logo--large' : 'client-marquee__logo'} />
      </div>)}
    </div>
  </div>;
}
