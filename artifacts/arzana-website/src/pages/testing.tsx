import { CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { CoverflowCarousel } from '../components/CoverflowCarousel';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { testingCommissioningMedia } from '../data/assets';

const systemsCovered = ['Low voltage switchgear', 'Medium voltage switchgear', 'Power and auxiliary transformers', 'Protection relays', 'AC and DC panels', 'Battery and battery charger', 'Medium voltage power cables', 'Capacitor banks', 'Cable Terminations'];

export default function TestingCommissioning() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const copy = language === 'ar'
    ? { title: 'اختبار وتشغيل المحطات الكهربائية', introduction: 'يسرد ملف الشركة اختبار وتشغيل المحطات الكهربائية والأنظمة التالية.', systems: 'الأنظمة المدرجة', contact: 'تواصل معنا', quote: 'طلب عرض سعر' }
    : { title: 'Testing and Commissioning of Electrical Substations', introduction: 'The company profile lists testing and commissioning of electrical substations and the systems below.', systems: 'Listed Systems', contact: 'Contact Us', quote: 'Request a Quote' };

  return <PageWrapper>
    <section className="page-hero py-28 text-background md:py-36">
      <div className="absolute inset-0"><img src={testingCommissioningMedia[0].src} alt={testingCommissioningMedia[0].altEn} className="h-full w-full object-cover opacity-20 mix-blend-overlay" /><div className="absolute inset-0 bg-gradient-to-r from-foreground to-transparent" /></div>
      <div className="site-container relative z-10 max-w-4xl"><p className="eyebrow mb-5 !text-white/70">Field assurance</p><h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">{copy.title}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{copy.introduction}</p></div>
    </section>
    <section className="bg-[#d8d4cb] py-16 md:py-24"><div className="site-container max-w-5xl"><p className="eyebrow mb-4">Commissioning scope</p><h2 className="section-title mb-8 text-3xl">{copy.systems}</h2>
      <div className="steel-card p-6 md:p-8"><ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{systemsCovered.map((system) => <li key={system} className="flex items-start gap-3 border border-border bg-muted/70 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span className="font-medium text-foreground/80">{system}</span></li>)}</ul></div>
      <section className="mt-12" aria-label={language === 'ar' ? 'معرض صور الاختبار والتشغيل' : 'Testing and commissioning gallery'}><CoverflowCarousel items={testingCommissioningMedia.map((item) => ({ src: item.src, alt: language === 'ar' ? item.altAr : item.altEn, caption: language === 'ar' ? item.altAr : item.altEn }))} /></section>
      <div className="mt-10 flex flex-wrap gap-4"><Button size="lg" onClick={() => setLocation('/contact')}>{copy.contact}</Button><Button size="lg" variant="outline" onClick={() => setLocation('/request-quote')}>{copy.quote}</Button></div>
    </div></section>
  </PageWrapper>;
}
