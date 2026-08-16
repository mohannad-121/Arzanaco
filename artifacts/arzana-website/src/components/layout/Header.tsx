import React from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCatalog } from "../../contexts/CatalogContext";
import { cn } from "../../lib/utils";
import { RequestQuoteButton } from "../RequestQuoteButton";
import headerLogo from "@photos/arzana-arabia-logo-transparent.png";

const navItems = [
  { href: "/", label: "nav.home" },
  { href: "/about", label: "nav.about" },
  { href: "/testing-commissioning", label: "nav.testing" },
  { href: "/safety-systems", label: "nav.safety" },
  { href: "/clients", label: "nav.clients" },
  { href: "/contact", label: "nav.contact" },
];

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { categories } = useCatalog();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [productsOpen, setProductsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const menuCloseRef = React.useRef<HTMLButtonElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const scrollPositionRef = React.useRef(0);
  const shouldRestoreMenuFocusRef = React.useRef(false);
  const reducedMotion = useReducedMotion();
  const isFloating = location === "/" && !scrolled && !mobileOpen;

  React.useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  React.useEffect(() => {
    if (!mobileOpen) return;

    const bodyStyle = document.body.style;
    const previousStyles = {
      overflow: bodyStyle.overflow,
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
    };

    scrollPositionRef.current = window.scrollY;
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollPositionRef.current}px`;
    bodyStyle.width = "100%";

    return () => {
      bodyStyle.overflow = previousStyles.overflow;
      bodyStyle.position = previousStyles.position;
      bodyStyle.top = previousStyles.top;
      bodyStyle.width = previousStyles.width;
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [mobileOpen]);
  React.useEffect(() => {
    if (mobileOpen) {
      menuCloseRef.current?.focus();
      return;
    }

    if (shouldRestoreMenuFocusRef.current) {
      menuButtonRef.current?.focus();
      shouldRestoreMenuFocusRef.current = false;
    }
  }, [mobileOpen]);
  React.useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        shouldRestoreMenuFocusRef.current = true;
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);
  React.useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
  }, [location]);

  const navClass = (href: string) =>
    cn(
      "relative flex min-h-11 items-center px-2.5 text-[.72rem] font-bold uppercase tracking-[.11em] transition-colors",
      isFloating
        ? "text-white/80 hover:text-white"
        : "text-foreground/72 hover:text-primary",
      location === href && (isFloating ? "text-white" : "text-primary"),
    );
  const open = () => setMobileOpen(true);
  const close = () => {
    shouldRestoreMenuFocusRef.current = true;
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70] h-[76px] transition-[background-color,border-color,box-shadow] duration-300 md:h-[84px]",
        isFloating
          ? "border-b border-white/10 bg-gradient-to-b from-black/30 to-transparent"
          : "border-b border-[#d5d1c9] bg-[#f7f4ef]/95 text-foreground shadow-[0_7px_26px_rgba(31,32,34,.09)] backdrop-blur-md",
      )}
    >
      <a
        href="#main-content"
        className="sr-only z-[60] bg-primary px-4 py-3 text-white focus:not-sr-only focus:absolute focus:start-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="site-container flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="flex h-12 w-32 shrink-0 items-center sm:h-14 sm:w-36"
          aria-label="Arzana Arabia home"
        >
          <img
            src={headerLogo}
            alt="Arzana Arabia"
            className="h-full w-full object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,.35)]"
          />
        </Link>
        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label="Primary navigation"
        >
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navClass(item.href)}
            >
              {t(item.label)}
            </Link>
          ))}
          <div className="group relative">
            <Link
              href="/products"
              className={cn(
                navClass("/products"),
                location.startsWith("/products") &&
                  (isFloating ? "text-white" : "text-primary"),
              )}
            >
              {t("nav.products")}
              <ChevronDown className="ms-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="pointer-events-none absolute start-0 top-[calc(100%+.45rem)] w-[39rem] translate-y-1 border border-[#d7d2ca] bg-[#f7f4ef] p-5 opacity-0 shadow-[0_20px_55px_rgba(31,32,34,.18)] transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <span className="eyebrow">{t("nav.products")}</span>
                <Link
                  href="/products"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {t("common.all")}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-x-5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products/${category.slug}`}
                    className="border-b border-border/70 py-3 text-sm font-semibold text-foreground/75 transition hover:border-primary hover:text-primary"
                  >
                    {language === "ar" ? category.nameAr : category.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navItems.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navClass(item.href)}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className={cn(
              "min-h-10 border-s px-3 text-xs font-bold tracking-[.14em] transition-colors",
              isFloating
                ? "border-white/25 text-white hover:text-white/65"
                : "border-foreground/15 text-foreground hover:text-primary",
            )}
            aria-label="Switch language"
          >
            {language === "en" ? "AR" : "EN"}
          </button>
          <RequestQuoteButton size="sm" />
        </div>
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className={cn(
              "min-h-11 px-2 text-xs font-bold tracking-[.13em]",
              isFloating ? "text-white" : "text-foreground",
            )}
            aria-label="Switch language"
          >
            {language === "en" ? "AR" : "EN"}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={mobileOpen ? close : open}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="responsive-navigation"
            className={cn(
              "grid h-11 w-11 place-items-center border transition",
              isFloating
                ? "border-white/40 bg-black/15 text-white"
                : "border-foreground/20 bg-transparent text-foreground",
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 bottom-0 top-[76px] z-[60] bg-[#1f2022]/55 backdrop-blur-[2px] md:top-[84px] xl:hidden"
            onClick={close}
          >
            <motion.div
              id="responsive-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: -12 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-[calc(100dvh-76px)] max-h-[calc(100dvh-76px)] w-full flex-col overflow-x-hidden overflow-y-auto bg-[#f7f4ef] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 text-foreground shadow-[0_18px_36px_rgba(31,32,34,.22)] md:h-[calc(100dvh-84px)] md:max-h-[calc(100dvh-84px)] md:px-8 md:pt-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                <img
                  src={headerLogo}
                  alt="Arzana Arabia"
                  className="h-12 w-36 object-contain mix-blend-multiply sm:h-14 sm:w-44"
                />
                <button
                  ref={menuCloseRef}
                  type="button"
                  onClick={close}
                  className="grid h-11 w-11 shrink-0 place-items-center border border-border transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navItems.slice(0, 2).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex min-h-12 items-center border-b border-border py-3 text-sm font-bold",
                      location === item.href && "text-primary",
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => setProductsOpen(!productsOpen)}
                  aria-expanded={productsOpen}
                  aria-controls="responsive-products-submenu"
                  className="flex min-h-12 items-center justify-between border-b border-border py-3 text-start text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                >
                  <span>{t("nav.products")}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      productsOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={
                        reducedMotion
                          ? false
                          : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
                      }
                      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                      transition={{ duration: 0.2 }}
                      id="responsive-products-submenu"
                      className="border-b border-border bg-[#ece8e1] px-3"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products/${category.slug}`}
                          onClick={close}
                          className="flex min-h-11 items-center py-2.5 text-sm font-medium text-foreground/75 hover:text-primary"
                        >
                          {language === "ar"
                            ? category.nameAr
                            : category.nameEn}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {navItems.slice(2).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex min-h-12 items-center border-b border-border py-3 text-sm font-bold",
                      location === item.href && "text-primary",
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-6">
                <RequestQuoteButton size="md" className="w-full" onClick={close} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
