import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Zap, Shield, FileText, Settings, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientLogoCarousel } from '../components/ClientLogoCarousel';
import { clients } from '../data/clients';
import { approvedImages } from '../data/assets';

export default function Home() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const isRtl = language === 'ar';
  return (
    <PageWrapper>
      {/* HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <img 
            src={approvedImages.engineering}
            alt="Transformer testing in an electrical substation"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-base h-14 px-8" onClick={() => setLocation('/products')}>
                {t('hero.cta.primary')}
              </Button>
              <Button size="lg" variant="secondary" className="text-base h-14 px-8 bg-white text-foreground hover:bg-white/90" onClick={() => setLocation('/request-quote')}>
                {t('hero.cta.secondary')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BUSINESS AREAS */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('areas.title')}</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Zap, title: t('areas.power'), href: '/products/mv-lv-solutions' },
              { icon: FileText, title: t('areas.electrical'), href: '/products/meters-instruments' },
              { icon: Settings, title: t('areas.automation'), href: '/products/ups-stabilizers' },
              { icon: Shield, title: t('areas.safety'), href: '/safety-systems' },
              { icon: Hammer, title: t('areas.testing'), href: '/testing-commissioning' },
            ].map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={area.href} className="group block h-full">
                  <div className="bg-card border border-border rounded-lg p-6 h-full transition-all duration-300 hover:shadow-lg hover:border-primary">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                      <area.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{area.title}</h3>
                    <div className="flex items-center text-primary font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('common.readMore')} <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MV/LV SHOWCASE */}
      <section className="py-24 bg-muted overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">{t('mvlv.title')}</h2>
              <p className="text-foreground/70 leading-relaxed mb-8 text-lg">{t('mvlv.subtitle')}</p>
              <Button onClick={() => setLocation('/products/mv-lv-solutions')}>
                {t('mvlv.view')}
              </Button>
            </motion.div>
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
                <img src={approvedImages.powerDistribution} alt="Ring Main Unit for power distribution" className="h-auto w-full bg-white object-contain p-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SAFETY & TESTING DUAL SECTION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Safety */}
            <motion.div 
              className="group relative rounded-2xl overflow-hidden h-[400px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img src={approvedImages.safety} alt="Construction loading platform safety system" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-3">{t('safety.title')}</h3>
                <p className="text-white/80 mb-6 max-w-md">{t('safety.subtitle')}</p>
                <Button variant="secondary" className="w-fit" onClick={() => setLocation('/safety-systems')}>
                  {t('common.readMore')}
                </Button>
              </div>
            </motion.div>

            {/* Testing */}
            <motion.div 
              className="group relative rounded-2xl overflow-hidden h-[400px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img src={approvedImages.testing} alt="Electrical panel testing and commissioning" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-3">{t('testing.title')}</h3>
                <p className="text-white/80 mb-6 max-w-md">{t('testing.subtitle')}</p>
                <Button variant="secondary" className="w-fit" onClick={() => setLocation('/testing-commissioning')}>
                  {t('testing.explore')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {clients.length > 0 && (
        <section className="bg-muted py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">{t('clients.title')}</h2>
              <p className="text-foreground/70">{t('clients.subtitle')}</p>
            </div>
            <div className="mx-auto max-w-3xl">
              <ClientLogoCarousel clients={clients} />
            </div>
            <div className="mt-8 text-center">
              <Link href="/clients" className="text-sm font-semibold text-primary hover:underline">
                {t('clients.view')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">{t('contact.cta.title')}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => setLocation('/request-quote')}>
              {t('nav.quote')}
            </Button>
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90" onClick={() => setLocation('/contact')}>
              {t('contact.email')}
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
