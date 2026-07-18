import { Building2 } from 'lucide-react';
import { ClientLogoCarousel } from '../components/ClientLogoCarousel';
import { PageWrapper } from '../components/layout/PageWrapper';
import { clients } from '../data/clients';
import { useLanguage } from '../contexts/LanguageContext';

export default function Clients() {
  const { t } = useLanguage();
  const hasClients = clients.length > 0;

  return (
    <PageWrapper>
      <section className="border-b bg-muted py-16 text-center md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="mb-5 text-4xl font-bold text-foreground md:text-5xl">
            {t('clients.title')}
          </h1>
          <p className="text-lg leading-relaxed text-foreground/70 md:text-xl">
            {t('clients.subtitle')}
          </p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto space-y-16 px-4 md:space-y-24">
          {hasClients ? (
            <>
              <div className="mx-auto max-w-3xl">
                <ClientLogoCarousel clients={clients} />
              </div>

              <div>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                    {t('clients.gridTitle')}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex min-h-32 items-center justify-center rounded-xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md sm:min-h-36 sm:p-7"
                    >
                      <img
                        src={client.logoPath}
                        alt={client.alt}
                        loading="lazy"
                        className="h-20 w-full object-contain sm:h-24"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
              <div className="mb-5 rounded-full bg-muted p-4 text-primary">
                <Building2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">
                {t('clients.emptyTitle')}
              </h2>
              <p className="max-w-lg text-foreground/70">{t('clients.emptyDescription')}</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
