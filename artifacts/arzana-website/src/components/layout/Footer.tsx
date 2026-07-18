import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../../contexts/LanguageContext';
import { categories } from '../../data/categories';
import { Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';

export const Footer = () => {
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col select-none">
              <span className="text-3xl font-bold tracking-tight text-white uppercase leading-none">ARZANA</span>
              <span className="text-sm tracking-[0.2em] text-white/70 mt-1 ml-[1px]">ARABIA</span>
            </Link>
            <p className="text-white/70 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Company</h4>
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
            <h4 className="text-lg font-semibold text-white">Solutions</h4>
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
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+966112041144" className="hover:text-white transition-colors" dir="ltr">+966 11 2041144</a>
                  <a href="tel:+966566676600" className="hover:text-white transition-colors" dir="ltr">+966 56 667 6600</a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  <a href="mailto:m.saadi@arzanaco.com" className="hover:text-white transition-colors">m.saadi@arzanaco.com</a>
                  <a href="mailto:moaath@arzanaco.com" className="hover:text-white transition-colors">moaath@arzanaco.com</a>
                </div>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
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
