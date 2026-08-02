import React from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCatalog } from '../../contexts/CatalogContext';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import headerLogo from '@photos/arzana-arabia-logo.png';

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { categories } = useCatalog();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [productsOpen, setProductsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);
  const navLinks = [
    { href: '/', label: 'nav.home' }, { href: '/about', label: 'nav.about' },
    { href: '/testing-commissioning', label: 'nav.testing' }, { href: '/safety-systems', label: 'nav.safety' },
    { href: '/clients', label: 'nav.clients' }, { href: '/contact', label: 'nav.contact' },
  ];
  const navClass = (href: string) => cn('relative px-2 py-3 text-[.78rem] font-semibold tracking-[.06em] uppercase transition-colors hover:text-primary after:absolute after:bottom-1 after:start-2 after:h-px after:bg-primary after:transition-all', location === href ? 'text-primary after:w-[calc(100%-1rem)]' : 'text-foreground/70 after:w-0');

  const isHome = location === '/';
  return <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled || !isHome ? 'border-b border-border bg-background/95 shadow-[0_8px_30px_rgba(31,32,34,.1)] backdrop-blur-md' : 'bg-gradient-to-b from-black/45 to-transparent text-white')}>
    <a href="#main-content" className="sr-only z-[60] rounded bg-primary px-4 py-3 text-white focus:not-sr-only focus:absolute focus:start-4 focus:top-4">Skip to content</a>
    <div className="site-container flex h-[4.75rem] items-center justify-between gap-4 lg:h-[5.5rem]">
      <Link href="/" className="flex h-12 w-28 shrink-0 items-center sm:w-32" aria-label="Arzana Arabia home"><img src={headerLogo} alt="Arzana Arabia" className="h-full w-full object-contain" /></Link>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
        {navLinks.slice(0, 2).map((link) => <Link key={link.href} href={link.href} className={navClass(link.href)}>{t(link.label)}</Link>)}
        <div className="group relative">
          <Link href="/products" className={cn(navClass('/products'), location.startsWith('/products') && 'text-primary')}>
            {t('nav.products')} <ChevronDown className="ms-1 inline h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
          </Link>
          <div className="pointer-events-none absolute start-0 top-full w-[39rem] translate-y-2 border border-border bg-background p-5 opacity-0 shadow-2xl transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3"><span className="eyebrow">{t('nav.products')}</span><Link href="/products" className="text-xs font-bold text-primary hover:underline">{t('common.all')}</Link></div>
            <div className="grid grid-cols-2 gap-1">{categories.map((category) => <Link key={category.id} href={`/products/${category.slug}`} className="border border-transparent px-3 py-2.5 text-sm font-medium text-foreground/75 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary">{language === 'ar' ? category.nameAr : category.nameEn}</Link>)}</div>
          </div>
        </div>
        {navLinks.slice(2).map((link) => <Link key={link.href} href={link.href} className={navClass(link.href)}>{t(link.label)}</Link>)}
      </nav>
      <div className="hidden items-center gap-2 lg:flex"><button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="border-s border-current/20 px-3 text-xs font-bold tracking-[.12em] hover:text-primary" aria-label="Switch language">{language === 'en' ? 'AR' : 'EN'}</button><Button onClick={() => setLocation('/request-quote')} className="min-h-10 px-5">{t('nav.quote')}</Button></div>
      <div className="flex items-center gap-2 lg:hidden"><button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="px-2 text-xs font-bold tracking-[.12em]" aria-label="Switch language">{language === 'en' ? 'AR' : 'EN'}</button><button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center border border-current/30 bg-background/10"><Menu className="h-5 w-5" /></button></div>
    </div>
    <AnimatePresence>{mobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 top-0 z-50 bg-foreground/70 backdrop-blur-sm lg:hidden"><motion.div initial={{ x: language === 'ar' ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: language === 'ar' ? '-100%' : '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 220 }} className="ms-auto flex h-full w-[min(100%,24rem)] flex-col overflow-y-auto bg-background p-6 text-foreground shadow-2xl">
      <div className="mb-9 flex items-center justify-between"><img src={headerLogo} alt="Arzana Arabia" className="h-12 w-28 object-contain" /><button type="button" onClick={closeMenu} className="grid h-10 w-10 place-items-center border border-border" aria-label="Close menu"><X className="h-5 w-5" /></button></div>
      <nav className="flex flex-col" aria-label="Mobile navigation">{navLinks.slice(0, 2).map((link) => <Link key={link.href} href={link.href} onClick={closeMenu} className={cn('border-b border-border py-4 text-sm font-bold', location === link.href && 'text-primary')}>{t(link.label)}</Link>)}
        <button type="button" onClick={() => setProductsOpen(!productsOpen)} className="flex items-center justify-between border-b border-border py-4 text-start text-sm font-bold"><span>{t('nav.products')}</span><ChevronDown className={cn('h-4 w-4 transition-transform', productsOpen && 'rotate-180')} /></button>
        <AnimatePresence>{productsOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-border bg-muted/60 px-3">{categories.map((category) => <Link key={category.id} href={`/products/${category.slug}`} onClick={closeMenu} className="block py-2.5 text-sm text-foreground/75">{language === 'ar' ? category.nameAr : category.nameEn}</Link>)}</motion.div>}</AnimatePresence>
        {navLinks.slice(2).map((link) => <Link key={link.href} href={link.href} onClick={closeMenu} className={cn('border-b border-border py-4 text-sm font-bold', location === link.href && 'text-primary')}>{t(link.label)}</Link>)}</nav>
      <Button className="mt-auto w-full" onClick={() => { setLocation('/request-quote'); closeMenu(); }}>{t('nav.quote')}</Button>
    </motion.div></motion.div>}</AnimatePresence>
  </header>;
};
