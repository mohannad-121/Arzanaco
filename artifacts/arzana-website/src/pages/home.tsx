import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Link, useLocation } from 'wouter';
import { ArrowRight, ChevronRight, Zap, Shield, FileText, Settings, Hammer, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import heroImg from '@assets/hero_substation.jpg';
import mvlvImg from '@assets/mv_lv_showcase.jpg';
import safetyImg from '@assets/safety_systems_home.jpg';
import testingImg from '@assets/testing_commissioning_home.jpg';

export default function Home() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const isRtl = language === 'ar';
  const Arrow = isRtl ? ArrowRight : ArrowRight; // We'll just rotate it if needed, or lucide handles it

  return (
    <PageWrapper>
      {/* HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Substation" 
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
              <p className="text-foreground/70 leading-relaxed mb-8 text-lg">
                We deliver robust medium and low voltage solutions including Ring Main Units, Transformers, Automatic Transfer Switches, and Power Factor Correction systems designed for demanding industrial environments.
              </p>
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
                <img src={mvlvImg} alt="MV LV Showcase" className="w-full h-auto object-cover" />
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
              <img src={safetyImg} alt="Safety Systems" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
              <img src={testingImg} alt="Testing & Commissioning" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-3">{t('testing.title')}</h3>
                <p className="text-white/80 mb-6 max-w-md">Comprehensive substation testing, equipment verification, and commissioning services by certified engineers.</p>
                <Button variant="secondary" className="w-fit" onClick={() => setLocation('/testing-commissioning')}>
                  {t('testing.explore')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('industries.title')}</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              t('industries.utilities'),
              t('industries.commercial'),
              t('industries.industrial'),
              t('industries.infrastructure'),
              t('industries.telecom'),
              t('industries.datacenters'),
              t('industries.construction'),
              "Oil & Gas"
            ].map((industry, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-lg text-center font-medium text-foreground hover:border-primary transition-colors">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

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
