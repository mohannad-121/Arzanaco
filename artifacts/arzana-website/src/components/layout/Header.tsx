import React from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Bot, ChevronDown, Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCatalog } from '../../contexts/CatalogContext';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import headerLogo from '@photos/arzana-arabia-logo-transparent.png';

const navItems = [
  { href: '/', label: 'nav.home' }, { href: '/about', label: 'nav.about' },
  { href: '/testing-commissioning', label: 'nav.testing' }, { href: '/safety-systems', label: 'nav.safety' },
  { href: '/clients', label: 'nav.clients' }, { href: '/contact', label: 'nav.contact' },
];

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { categories } = useCatalog();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [productsOpen, setProductsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const menuCloseRef = React.useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const isFloating = location === '/' && !scrolled && !mobileOpen;

  React.useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  React.useEffect(() => { document.body.style.overflow = mobileOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [mobileOpen]);
  React.useEffect(() => { if (mobileOpen) menuCloseRef.current?.focus(); }, [mobileOpen]);
  React.useEffect(() => { setMobileOpen(false); setProductsOpen(false); }, [location]);

  const navClass = (href: string) => cn(
    'relative flex min-h-11 items-center px-2.5 text-[.72rem] font-bold uppercase tracking-[.11em] transition-colors',
    isFloating ? 'text-white/80 hover:text-white' : 'text-foreground/72 hover:text-primary',
    location === href && (isFloating ? 'text-white' : 'text-primary'),
  );
  const close = () => setMobileOpen(false);

  return <header className={cn('fixed inset-x-0 top-0 z-50 h-[76px] transition-[background-color,border-color,box-shadow] duration-300 md:h-[84px]', isFloating ? 'border-b border-white/10 bg-gradient-to-b from-black/30 to-transparent' : 'border-b border-[#d5d1c9] bg-[#f7f4ef]/95 text-foreground shadow-[0_7px_26px_rgba(31,32,34,.09)] backdrop-blur-md')}>
    <a href="#main-content" className="sr-only z-[60] bg-primary px-4 py-3 text-white focus:not-sr-only focus:absolute focus:start-4 focus:top-4">Skip to content</a>
    <div className="site-container flex h-full items-center justify-between gap-4">
      <Link href="/" className="flex h-12 w-32 shrink-0 items-center sm:h-14 sm:w-36" aria-label="Arzana Arabia home"><img src={headerLogo} alt="Arzana Arabia" className="h-full w-full object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,.35)]" /></Link>
      <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
        {navItems.slice(0, 2).map((item) => <Link key={item.href} href={item.href} className={navClass(item.href)}>{t(item.label)}</Link>)}
        <div className="group relative"><Link href="/products" className={cn(navClass('/products'), location.startsWith('/products') && (isFloating ? 'text-white' : 'text-primary'))}>{t('nav.products')}<ChevronDown className="ms-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" /></Link>
          <div className="pointer-events-none absolute start-0 top-[calc(100%+.45rem)] w-[39rem] translate-y-1 border border-[#d7d2ca] bg-[#f7f4ef] p-5 opacity-0 shadow-[0_20px_55px_rgba(31,32,34,.18)] transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"><div className="mb-4 flex items-center justify-between border-b border-border pb-3"><span className="eyebrow">{t('nav.products')}</span><Link href="/products" className="text-xs font-bold text-primary hover:underline">{t('common.all')}</Link></div><div className="grid grid-cols-2 gap-x-5">{categories.map((category) => <Link key={category.id} href={`/products/${category.slug}`} className="border-b border-border/70 py-3 text-sm font-semibold text-foreground/75 transition hover:border-primary hover:text-primary">{language === 'ar' ? category.nameAr : category.nameEn}</Link>)}</div></div>
        </div>
        {navItems.slice(2).map((item) => <Link key={item.href} href={item.href} className={navClass(item.href)}>{t(item.label)}</Link>)}
      </nav>
      <div className="hidden items-center gap-2 xl:flex"><button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className={cn('min-h-10 border-s px-3 text-xs font-bold tracking-[.14em] transition-colors', isFloating ? 'border-white/25 text-white hover:text-white/65' : 'border-foreground/15 text-foreground hover:text-primary')} aria-label="Switch language">{language === 'en' ? 'AR' : 'EN'}</button><Button variant="outline" onClick={() => setLocation('/arzana-ai')} className={cn('min-h-11 rounded-sm px-3.5 shadow-none', isFloating ? 'border-white/60 bg-black/15 text-white hover:bg-white hover:text-foreground' : 'border-foreground/25 bg-transparent text-foreground hover:border-primary hover:text-primary')}>{language === 'ar' ? 'بوت أرزانا' : 'ARZANA BOT'}<Bot className="ms-1.5 h-4 w-4" /></Button><Button onClick={() => setLocation('/request-quote')} className="min-h-11 rounded-sm border border-primary/80 px-4 shadow-none hover:shadow-none">{t('nav.quote')}<ArrowUpRight className="ms-1" /></Button></div>
      <div className="flex items-center gap-2 xl:hidden"><button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className={cn('min-h-11 px-2 text-xs font-bold tracking-[.13em]', isFloating ? 'text-white' : 'text-foreground')} aria-label="Switch language">{language === 'en' ? 'AR' : 'EN'}</button><button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" className={cn('grid h-11 w-11 place-items-center border transition', isFloating ? 'border-white/40 bg-black/15 text-white' : 'border-foreground/20 bg-transparent text-foreground')}><Menu className="h-5 w-5" /></button></div>
    </div>
    <AnimatePresence>{mobileOpen && <motion.div initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }} className="fixed inset-0 z-[60] bg-[#1f2022]/55 backdrop-blur-[2px] xl:hidden"><motion.div role="dialog" aria-modal="true" aria-label="Mobile navigation" initial={reducedMotion ? false : { x: language === 'ar' ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: language === 'ar' ? '-100%' : '100%' }} transition={{ duration: .28, ease: [0.16, 1, .3, 1] }} className="ms-auto flex h-full w-[min(100%,25rem)] flex-col overflow-y-auto bg-[#f7f4ef] p-6 text-foreground shadow-2xl"><div className="mb-8 flex items-center justify-between border-b border-border pb-5"><img src={headerLogo} alt="Arzana Arabia" className="h-14 w-44 object-contain mix-blend-multiply" /><button ref={menuCloseRef} type="button" onClick={close} className="grid h-11 w-11 place-items-center border border-border" aria-label="Close menu"><X className="h-5 w-5" /></button></div><nav className="flex flex-col" aria-label="Mobile navigation">{navItems.slice(0, 2).map((item) => <Link key={item.href} href={item.href} onClick={close} className={cn('border-b border-border py-4 text-sm font-bold', location === item.href && 'text-primary')}>{t(item.label)}</Link>)}<button type="button" onClick={() => setProductsOpen(!productsOpen)} className="flex min-h-14 items-center justify-between border-b border-border text-start text-sm font-bold"><span>{t('nav.products')}</span><ChevronDown className={cn('h-4 w-4 transition-transform', productsOpen && 'rotate-180')} /></button><AnimatePresence>{productsOpen && <motion.div initial={reducedMotion ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .2 }} className="border-b border-border bg-[#ece8e1] px-3">{categories.map((category) => <Link key={category.id} href={`/products/${category.slug}`} onClick={close} className="block py-3 text-sm font-medium text-foreground/75">{language === 'ar' ? category.nameAr : category.nameEn}</Link>)}</motion.div>}</AnimatePresence>{navItems.slice(2).map((item) => <Link key={item.href} href={item.href} onClick={close} className={cn('border-b border-border py-4 text-sm font-bold', location === item.href && 'text-primary')}>{t(item.label)}</Link>)}</nav><div className="mt-auto grid gap-3 pt-8"><Button variant="outline" className="w-full" onClick={() => { setLocation('/arzana-ai'); close(); }}>{language === 'ar' ? 'بوت أرزانا' : 'ARZANA BOT'}<Bot className="ms-1.5 h-4 w-4" /></Button><Button className="w-full" onClick={() => { setLocation('/request-quote'); close(); }}>{t('nav.quote')}<ArrowUpRight className="ms-1" /></Button></div></motion.div></motion.div>}</AnimatePresence>
  </header>;
};
