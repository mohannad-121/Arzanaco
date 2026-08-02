import { Link, useLocation } from 'wouter';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, FileText, Hammer, Settings, Shield, Zap } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { ClientLogoCarousel } from '../components/ClientLogoCarousel';
import { clients } from '../data/clients';
import { approvedImages } from '../data/assets';
import { useCatalog } from '../contexts/CatalogContext';

const areas = [
  { icon: Zap, key: 'areas.power', href: '/products/mv-lv-solutions', number: '01' },
  { icon: FileText, key: 'areas.electrical', href: '/products/meters-instruments', number: '02' },
  { icon: Settings, key: 'areas.automation', href: '/products/ups-stabilizers', number: '03' },
  { icon: Shield, key: 'areas.safety', href: '/safety-systems', number: '04' },
  { icon: Hammer, key: 'areas.testing', href: '/testing-commissioning', number: '05' },
];

export default function Home() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { categories } = useCatalog();
  const reduced = useReducedMotion();
  const featured = categories.slice(0, 4);
  const heroMotion = reduced ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: .7, ease: [0.16, 1, .3, 1] as const } };

  return <PageWrapper>
    <section className="relative flex min-h-[82svh] items-end overflow-hidden bg-[#1f2022] pb-16 pt-32 text-white md:min-h-[90svh] md:pb-24">
      {reduced ? <img src={approvedImages.engineering} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" aria-hidden="true" /> : <video className="absolute inset-0 h-full w-full object-cover opacity-55" autoPlay muted loop playsInline preload="metadata" poster={approvedImages.engineering} aria-hidden="true"><source src="/herovideo.mp4" type="video/mp4" /></video>}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(21,22,23,.94),rgba(31,32,34,.72)_46%,rgba(31,32,34,.2))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1f2022]/70 to-transparent" />
      <div className="site-container relative z-10 w-full"><motion.div {...heroMotion} className="max-w-3xl">
        <p className="eyebrow mb-6 !text-white/75">Saudi Electrical Engineering</p>
        <h1 className="max-w-3xl text-5xl font-bold leading-[.98] tracking-[-.055em] text-white md:text-7xl xl:text-8xl">{t('hero.title')}</h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 md:text-xl md:leading-9">{t('hero.subtitle')}</p>
        <div className="mt-10 flex flex-wrap gap-3"><Button size="lg" className="min-h-14 px-7" onClick={() => setLocation('/products')}>{t('hero.cta.primary')}<ArrowRight className="ms-2" /></Button><Button size="lg" variant="secondary" className="min-h-14 px-7" onClick={() => setLocation('/request-quote')}>{t('hero.cta.secondary')}</Button></div>
      </motion.div>
      <div className="mt-16 hidden border-t border-white/20 pt-4 text-[.7rem] font-semibold tracking-[.15em] text-white/65 md:flex md:justify-between md:uppercase"><span>ARZANA ARABIA COMPANY LTD.</span><span>POWER / PROTECTION / PERFORMANCE</span></div>
      </div>
    </section>

    <section className="industrial-grid border-y border-border bg-muted/60 py-12"><div className="site-container grid gap-8 md:grid-cols-[1.1fr_2fr]"><p className="eyebrow self-center">Engineering with intent</p><p className="max-w-3xl text-xl font-medium leading-relaxed tracking-[-.02em] text-foreground md:text-2xl">Arzana brings together distribution, critical power, modular infrastructure and specialist field support for demanding projects across the Kingdom.</p></div></section>

    <section className="py-20 md:py-28"><div className="site-container"><div className="mb-12 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end"><div><p className="eyebrow mb-4">{t('areas.title')}</p><h2 className="section-title">Built around the work your project demands.</h2></div><p className="section-copy">A practical route into Arzana’s electrical solutions, safety systems and commissioning support.</p></div>
      <div className="grid border-s border-t border-border sm:grid-cols-2 lg:grid-cols-5">{areas.map((area, index) => <motion.div key={area.number} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .06 }}><Link href={area.href} className="group relative flex min-h-64 flex-col border-b border-e border-border bg-background p-6 transition hover:bg-[#27282a] hover:text-white"><span className="text-xs font-bold tracking-[.16em] text-primary group-hover:text-[#d38a98]">{area.number}</span><area.icon className="mt-auto h-7 w-7 text-primary group-hover:text-white" /><h3 className="mt-6 text-lg font-bold leading-snug">{t(area.key)}</h3><ArrowRight className="absolute bottom-6 end-6 h-4 w-4 text-primary transition-transform group-hover:translate-x-1 group-hover:text-white rtl:group-hover:-translate-x-1" /></Link></motion.div>)}</div>
    </div></section>

    <section className="bg-[#27282a] py-20 text-white md:py-28"><div className="site-container grid items-center gap-12 lg:grid-cols-2"><div><p className="eyebrow mb-5 !text-[#d38a98]">Power distribution</p><h2 className="section-title !text-white">{t('mvlv.title')}</h2><p className="mt-7 max-w-xl text-lg leading-8 text-white/70">{t('mvlv.subtitle')}</p><Button className="mt-9" onClick={() => setLocation('/products/mv-lv-solutions')}>{t('mvlv.view')}<ArrowRight className="ms-2" /></Button></div><div className="relative border border-white/15 bg-[#f6f3ee] p-4 shadow-2xl"><div className="industrial-grid absolute inset-0 opacity-35" /><img src={approvedImages.powerDistribution} alt="Ring Main Unit for power distribution" className="relative h-[25rem] w-full object-contain p-5 md:h-[31rem]" /></div></div></section>

    <section className="py-20 md:py-28"><div className="site-container"><div className="mb-12"><p className="eyebrow mb-4">Product families</p><h2 className="section-title">Solutions that stay clear from specification to site.</h2></div><div className="grid gap-px bg-border md:grid-cols-2">{featured.map((category, index) => <Link key={category.id} href={`/products/${category.slug}`} className="group flex min-h-44 items-end justify-between bg-background p-7 transition hover:bg-primary hover:text-white"><div><span className="text-xs font-bold tracking-[.14em] text-primary group-hover:text-white/70">0{index + 1}</span><h3 className="mt-3 text-xl font-bold">{language === 'ar' ? category.nameAr : category.nameEn}</h3></div><ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:text-white rtl:group-hover:-translate-x-1" /></Link>)}</div><div className="mt-8"><Button variant="outline" onClick={() => setLocation('/products')}>{t('mvlv.view')}</Button></div></div></section>

    <section className="bg-muted py-20 md:py-28"><div className="site-container grid gap-6 lg:grid-cols-2"><Link href="/safety-systems" className="group relative min-h-[29rem] overflow-hidden bg-foreground"><img src={approvedImages.safety} alt="Construction loading platform safety system" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#1f2022] via-[#1f2022]/45 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-8 text-white"><p className="eyebrow !text-white/70">Systems protection</p><h2 className="mt-4 text-3xl font-bold">{t('safety.title')}</h2><p className="mt-3 max-w-md text-white/75">{t('safety.subtitle')}</p><span className="mt-6 inline-flex items-center text-sm font-bold">{t('common.readMore')}<ArrowRight className="ms-2 h-4 w-4" /></span></div></Link><Link href="/testing-commissioning" className="group relative min-h-[29rem] overflow-hidden bg-foreground"><img src={approvedImages.testing} alt="Electrical panel testing and commissioning" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#1f2022] via-[#1f2022]/45 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-8 text-white"><p className="eyebrow !text-white/70">Field assurance</p><h2 className="mt-4 text-3xl font-bold">{t('testing.title')}</h2><p className="mt-3 max-w-md text-white/75">{t('testing.subtitle')}</p><span className="mt-6 inline-flex items-center text-sm font-bold">{t('testing.explore')}<ArrowRight className="ms-2 h-4 w-4" /></span></div></Link></div></section>

    {clients.length > 0 && <section className="py-20 md:py-28"><div className="site-container"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow justify-center mb-4">{t('clients.title')}</p><h2 className="section-title mx-auto">{t('clients.subtitle')}</h2></div><ClientLogoCarousel clients={clients} /><div className="mt-8 text-center"><Link href="/clients" className="text-sm font-bold text-primary hover:underline">{t('clients.view')}</Link></div></div></section>}

    <section className="bg-primary py-20 text-white md:py-24"><div className="site-container grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="eyebrow !text-white/70">Project enquiries</p><h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-[-.04em] md:text-5xl">{t('contact.cta.title')}</h2></div><div className="flex flex-wrap gap-3"><Button size="lg" variant="secondary" onClick={() => setLocation('/request-quote')}>{t('nav.quote')}</Button><Button size="lg" className="border-white/60 bg-transparent hover:bg-white hover:text-primary" onClick={() => setLocation('/contact')}>{t('contact.email')}</Button></div></div></section>
  </PageWrapper>;
}
