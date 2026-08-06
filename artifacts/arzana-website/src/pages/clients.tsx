import { Building2 } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { clients } from '../data/clients';
import { useLanguage } from '../contexts/LanguageContext';

export default function Clients() {
  const { t } = useLanguage();
  return <PageWrapper>
    <section className="page-hero py-28 text-center md:py-36"><div className="site-container max-w-3xl"><p className="eyebrow mb-5 justify-center !text-white/70">Relationships</p><h1 className="text-4xl font-bold tracking-[-.04em] text-white md:text-6xl">{t('clients.title')}</h1></div></section>
    <section className="bg-[#d8d4cb] py-16 md:py-24"><div className="site-container">
      {clients.length > 0 ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">{clients.map((client) => <article key={client.id} className="flex min-h-40 flex-col items-center justify-center border border-[#d0cbc2] bg-[#f6f3ee] p-5 text-center shadow-[0_6px_16px_rgba(39,40,42,.08)] sm:min-h-44 sm:p-7"><img src={client.logoPath} alt={client.alt} loading="lazy" className={`w-full object-contain ${client.emphasis === 'large' ? 'h-20 sm:h-24' : 'h-16 sm:h-20'}`} /><p className="mt-4 text-xs font-semibold leading-snug text-[#292a2c] sm:text-sm">{client.name}</p></article>)}</div> : <div className="mx-auto flex max-w-2xl flex-col items-center border bg-card px-6 py-16 text-center"><div className="mb-5 rounded-full bg-muted p-4 text-primary"><Building2 className="h-8 w-8" aria-hidden="true" /></div><h2 className="mb-3 text-2xl font-bold text-foreground">{t('clients.emptyTitle')}</h2><p className="max-w-lg text-foreground/70">{t('clients.emptyDescription')}</p></div>}
    </div></section>
  </PageWrapper>;
}
