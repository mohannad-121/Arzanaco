import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowDown, ArrowRight, ChevronRight } from 'lucide-react';
import { engineeringPage } from '@workspace/arzana-catalog/engineering';
import heroImage from '@engineering/structural/01-steel-truss-framework.jpg';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { RequestQuoteButton } from '../components/RequestQuoteButton';
import { EngineeringServiceSection } from '../components/EngineeringServiceSection';
import { EngineeringSeo } from '../components/EngineeringSeo';
import { useCatalog } from '../contexts/CatalogContext';
import './engineering.css';

export default function EngineeringDesignCalculations() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const { engineeringServices } = useCatalog();
  const [active, setActive] = useState('structural');
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const navigation = document.querySelector('.engineering-navigator');
      const activationLine = (navigation?.getBoundingClientRect().bottom ?? 180) + 80;
      let current = engineeringServices[0]?.id ?? 'structural';
      for (const service of engineeringServices) {
        if ((document.getElementById(service.id)?.getBoundingClientRect().top ?? Infinity) <= activationLine) current = service.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [engineeringServices]);

  return (
    <PageWrapper>
      <EngineeringSeo />
      <div className="engineering-page">
        <section className="engineering-hero" aria-labelledby="engineering-title">
          <div className="engineering-hero__image"><img src={heroImage} width={1920} height={1280} alt="" aria-hidden="true" fetchPriority="high" decoding="async" /></div>
          <div className="engineering-hero__shade" />
          <div className="industrial-grid engineering-hero__grid" aria-hidden="true" />
          <div className="site-container engineering-hero__content">
            <nav aria-label={ar ? 'مسار التنقل' : 'Breadcrumb'} className="engineering-breadcrumb">
              <Link href="/">{ar ? 'الرئيسية' : 'Home'}</Link><ChevronRight size={13} className="rtl:rotate-180" aria-hidden="true" /><span aria-current="page">{ar ? 'التصميم الهندسي' : 'Engineering Design'}</span>
            </nav>
            <p className="eyebrow engineering-hero__eyebrow">{ar ? 'الخدمات الهندسية' : 'Engineering services'}</p>
            <h1 id="engineering-title">{ar ? engineeringPage.titleAr : <>Engineering Design <span>& Calculations</span></>}</h1>
            <p className="engineering-hero__intro">{ar ? engineeringPage.introductionAr : engineeringPage.introduction}</p>
            <div className="engineering-hero__actions">
              <RequestQuoteButton size="lg" />
              <a href="#structural" className="engineering-text-link">{ar ? 'استكشف الخدمات' : 'Explore the services'}<ArrowDown size={17} aria-hidden="true" /></a>
            </div>
            <div className="engineering-hero__footer"><span>{ar ? 'أربعة تخصصات هندسية. نطاق خدمة واضح.' : 'Four engineering disciplines. A defined scope.'}</span><span dir="ltr">01 — 04</span></div>
          </div>
        </section>
        <nav className="engineering-navigator" aria-label={ar ? 'الخدمات الهندسية' : 'Engineering services'}>
          <div className="site-container engineering-navigator__inner">
            <span className="engineering-navigator__label">{ar ? 'التخصصات' : 'Disciplines'}</span>
            <div className="engineering-navigator__links">
              {engineeringServices.map(service => <a key={service.id} href={`#${service.id}`} aria-current={active === service.id ? 'location' : undefined} onClick={() => setActive(service.id)}><span dir="ltr">{service.number}</span>{ar ? service.shortTitleAr : service.shortTitle}<ArrowDown size={14} aria-hidden="true" /></a>)}
            </div>
          </div>
        </nav>
        {engineeringServices.map(service => <EngineeringServiceSection key={service.id} service={service} />)}
        <section className="engineering-cta" aria-labelledby="engineering-cta-title">
          <div className="industrial-grid pointer-events-none absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="site-container relative engineering-cta__inner">
            <div><p className="eyebrow">{ar ? 'متطلبات مشروعك' : 'Your project requirements'}</p><h2 id="engineering-cta-title">{ar ? 'ابدأ بمخططاتك.' : 'Start with your drawings.'}</h2><p>{ar ? 'أرسل مخططاتك ومتطلبات المشروع لطلب عرض سعر.' : 'Send your drawings and project requirements to request a quotation.'}</p></div>
            <div className="engineering-cta__actions"><RequestQuoteButton size="lg" /><Link href="/contact" className="engineering-text-link">{ar ? 'تواصل مع أرزانا' : 'Contact Arzana'}<ArrowRight size={17} className="rtl:rotate-180" aria-hidden="true" /></Link></div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
