import React from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '../../contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useCatalog } from '../../contexts/CatalogContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from '../../lib/utils';

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { categories } = useCatalog();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [productsOpen, setProductsOpen] = React.useState(false);

  const toggleLang = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    { href: '/', label: 'nav.home' },
    { href: '/about', label: 'nav.about' },
    { href: '/testing-commissioning', label: 'nav.testing' },
    { href: '/safety-systems', label: 'nav.safety' },
    { href: '/clients', label: 'nav.clients' },
    { href: '/contact', label: 'nav.contact' },
  ];

  const navLinkClass = (href: string) =>
    cn(
      'px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md',
      location === href ? 'text-primary' : 'text-foreground/80'
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col select-none">
          <span className="text-2xl font-bold tracking-tight text-primary uppercase leading-none">ARZANA</span>
          <span className="text-xs tracking-[0.2em] text-foreground/80 mt-1 ml-[1px]">ARABIA</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          <NavigationMenu>
            <NavigationMenuList className="gap-0">
              {/* Simple nav links using NavigationMenuLink asChild */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className={navLinkClass('/')}>{t('nav.home')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className={navLinkClass('/about')}>{t('nav.about')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Products mega menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    'bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-sm font-medium',
                    location.startsWith('/products') ? 'text-primary' : 'text-foreground/80'
                  )}
                >
                  {t('nav.products')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[760px] p-6 grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <NavigationMenuLink asChild key={cat.id}>
                        <Link
                          href={`/products/${cat.slug}`}
                          className="group p-3 hover:bg-muted/50 rounded-md transition-colors block"
                        >
                          <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                            {language === 'ar' ? cat.nameAr : cat.nameEn}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                    <div className="col-span-2 pt-4 mt-2 border-t flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">All product categories</span>
                      <NavigationMenuLink asChild>
                        <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                          View All Products →
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/testing-commissioning" className={navLinkClass('/testing-commissioning')}>{t('nav.testing')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/safety-systems" className={navLinkClass('/safety-systems')}>{t('nav.safety')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/clients" className={navLinkClass('/clients')}>{t('nav.clients')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className={navLinkClass('/contact')}>{t('nav.contact')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLang}
            className="text-foreground/80 hover:text-primary font-semibold w-10 text-sm"
            aria-label="Switch language"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </Button>
          <Button variant="default" onClick={() => setLocation('/request-quote')}>
            {t('nav.quote')}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLang} className="font-semibold text-sm px-2">
            {language === 'en' ? 'AR' : 'EN'}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-background px-4 py-6 flex flex-col gap-1 absolute w-full max-h-[calc(100vh-80px)] overflow-y-auto shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-base font-medium p-3 rounded-md transition-colors',
                location === link.href ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {t(link.label)}
            </Link>
          ))}

          {/* Products accordion */}
          <div>
            <button
              className={cn(
                'w-full text-left text-base font-medium p-3 rounded-md transition-colors flex justify-between items-center',
                location.startsWith('/products') ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
              )}
              onClick={() => setProductsOpen(!productsOpen)}
            >
              {t('nav.products')}
              <span className={cn('text-xs transition-transform', productsOpen ? 'rotate-180' : '')}>▼</span>
            </button>
            {productsOpen && (
              <div className="pl-6 flex flex-col gap-1 border-l-2 border-primary/20 ml-4 mt-1 mb-2">
                <Link
                  href="/products"
                  className="text-sm font-medium text-primary p-2"
                  onClick={() => setMobileOpen(false)}
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products/${cat.slug}`}
                    className="text-sm text-foreground/80 hover:text-primary p-2 rounded transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Button className="w-full mt-4" onClick={() => {
            setLocation('/request-quote');
            setMobileOpen(false);
          }}>
            {t('nav.quote')}
          </Button>
        </div>
      )}
    </header>
  );
};
