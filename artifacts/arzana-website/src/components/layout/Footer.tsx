import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCatalog } from '../../contexts/CatalogContext';
import { Phone, MessageCircle, MapPin, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';
import { officialLogo } from '../../data/assets';
import { companyAddress, contactPeople } from '../../data/contact';

export const Footer = () => {
  const { t, language } = useLanguage();
  const { categories } = useCatalog();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#1f2022] text-background">
      <div className="industrial-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="site-container relative py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex h-20 w-20 items-center border border-white/25 bg-white p-2" aria-label="Arzana Arabia home">
              <img src={officialLogo} alt="Arzana Arabia" className="h-full w-full object-contain" />
            </Link>
            <p className="text-white/70 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[.15em] text-white">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/products" className="text-white/70 hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link href="/testing-commissioning" className="text-white/70 hover:text-white transition-colors">{t('nav.testing')}</Link></li>
              <li><Link href="/safety-systems" className="text-white/70 hover:text-white transition-colors">{t('nav.safety')}</Link></li>
              <li><Link href="/clients" className="text-white/70 hover:text-white transition-colors">{t('nav.clients')}</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[.15em] text-white">Solutions</h4>
            <ul className="space-y-3">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link href={`/products/${cat.slug}`} className="text-white/70 hover:text-white transition-colors line-clamp-1">
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[.15em] text-white">Contact Us</h4>
            <ul className="space-y-4">
              {contactPeople.map((contact) => (
                <li key={contact.email} className="flex items-start gap-3 text-white/70">
                  <div className="flex shrink-0 items-center gap-1"><a href={contact.phoneHref} aria-label="Call Arzana"><Phone className="h-5 w-5 text-primary" /></a><a href={contact.whatsappHref} target="_blank" rel="noreferrer" aria-label="Contact Arzana on WhatsApp"><MessageCircle className="h-5 w-5 text-primary" /></a></div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <a href={contact.phoneHref} className="hover:text-white transition-colors" dir="ltr">{contact.phone}</a>
                    <a href={contact.emailHref} className="break-all hover:text-white transition-colors" dir="ltr">{contact.email}</a>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <address className="not-italic leading-relaxed">{(language === 'ar' ? companyAddress.linesAr : companyAddress.lines).map((line) => <span key={line} className="block">{line}</span>)}</address>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-white/50 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">
              {t('footer.privacy')}
            </Link>
            <Button variant="ghost" size="icon" onClick={scrollToTop} className="text-white/50 hover:text-white">
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
