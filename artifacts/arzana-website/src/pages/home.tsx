import { Link, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  FileText,
  Hammer,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { ClientLogoCarousel } from "../components/ClientLogoCarousel";
import { ClientLogoMarquee } from "../components/ClientLogoMarquee";
import { clients } from "../data/clients";
import { approvedImages } from "../data/assets";
import { useCatalog } from "../contexts/CatalogContext";
import { RequestQuoteButton } from "../components/RequestQuoteButton";

const areas = [
  {
    icon: Zap,
    key: "areas.power",
    detail: "Power systems",
    href: "/products/mv-lv-solutions",
    number: "01",
    image: approvedImages.electricalSystems,
    tone: "lg:col-span-2 lg:row-span-2",
  },
  {
    icon: FileText,
    key: "areas.electrical",
    detail: "Measurement & control",
    href: "/products/meters-instruments",
    number: "02",
    image: approvedImages.engineering,
    tone: "",
  },
  {
    icon: Settings,
    key: "areas.automation",
    detail: "Critical continuity",
    href: "/products/ups-stabilizers",
    number: "03",
    image: approvedImages.automation,
    tone: "",
  },
  {
    icon: Shield,
    key: "areas.safety",
    detail: "Safety & protection",
    href: "/safety-systems",
    number: "04",
    image: approvedImages.edgeProtection,
    tone: "",
  },
  {
    icon: Hammer,
    key: "areas.testing",
    detail: "Testing & commissioning",
    href: "/testing-commissioning",
    number: "05",
    image: approvedImages.testingDetail,
    tone: "",
  },
];
const ease = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { categories } = useCatalog();
  const reduced = useReducedMotion();
  const featured = categories.slice(0, 4);
  return (
    <PageWrapper>
      <section className="relative flex min-h-[84svh] items-end overflow-hidden bg-[#1f2022] pb-14 pt-28 text-white md:min-h-[91svh] md:pb-20">
        {reduced ? (
          <img
            src={approvedImages.engineering}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-95"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={approvedImages.engineering}
            aria-hidden="true"
          >
            <source src="/herovideo.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(104deg,rgba(18,19,20,.78)_0%,rgba(28,29,30,.5)_38%,rgba(31,32,34,.13)_70%,rgba(31,32,34,.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#292a2c]/75 to-transparent" />
        <div className="site-container relative z-10 w-full">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, ease }}
            className="max-w-3xl"
          >
            <p className="eyebrow mb-7 !text-white/85">
              Saudi Electrical Engineering
            </p>
            <h1 className="max-w-3xl text-[clamp(3rem,7vw,6.8rem)] font-bold leading-[.93] tracking-[-.06em] text-white">
              {t("hero.title")}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/90 md:text-xl md:leading-9">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="min-h-14 px-7"
                onClick={() => setLocation("/products")}
              >
                {t("hero.cta.primary")}
                <ArrowRight className="ms-2" />
              </Button>
              <RequestQuoteButton size="lg" />
            </div>
          </motion.div>
          <div className="mt-14 flex items-end justify-between pt-4">
            <p className="hidden text-[.68rem] font-semibold tracking-[.15em] text-white/75 md:block">
              ARZANA ARABIA COMPANY LTD.
            </p>
            <a
              href="#business-areas"
              className="ms-auto flex min-h-11 items-center gap-3 text-[.68rem] font-bold uppercase tracking-[.13em] text-white/80 hover:text-white"
            >
              Explore capabilities <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      <section className="bg-[#292a2c] py-11 text-white">
        <div className="site-container grid items-center gap-6 md:grid-cols-[.9fr_2.1fr]">
          <p className="eyebrow !text-[#deb1bc]">Engineering with intent</p>
          <p className="max-w-3xl text-xl font-medium leading-relaxed tracking-[-.02em] text-white/85 md:text-2xl">
            Arzana brings together distribution, critical power, modular
            infrastructure and specialist field support for demanding projects
            across the Kingdom.
          </p>
        </div>
      </section>
      <section id="business-areas" className="bg-[#dcd8cf] py-18 md:py-24">
        <div className="site-container">
          <div className="mb-10 grid gap-6 md:mb-12 md:grid-cols-[1.4fr_.8fr] md:items-end">
            <div>
              <p className="eyebrow mb-4">{t("areas.title")}</p>
              <h2 className="section-title">
                Built around the work your project demands.
              </h2>
            </div>
            <p className="section-copy">
              A clear route into Arzana’s electrical solutions, protective
              systems and commissioning support.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
            {areas.map((area, index) => (
              <motion.div
                key={area.number}
                className={area.tone}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: reduced ? 0 : 0.3,
                  delay: index * 0.04,
                  ease,
                }}
              >
                <Link
                  href={area.href}
                  className="corner-card corner-card--media group flex min-h-[17rem] overflow-hidden text-white lg:h-full"
                >
                  <span className="corner-card__corner" aria-hidden="true">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                  <img
                    src={area.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-[1.045]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,21,22,.15),rgba(20,21,22,.9))]" />
                  <div className="corner-card__content relative flex h-full w-full flex-col p-6">
                    <div className="flex items-center justify-between text-xs font-bold tracking-[.16em] text-white/70">
                      <span>{area.number}</span>
                      <area.icon className="h-5 w-5 text-[#e4aab6]" />
                    </div>
                    <div className="mt-auto">
                      <p className="text-xs font-semibold uppercase tracking-[.12em] text-white/65">
                        {area.detail}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold leading-tight">
                        {t(area.key)}
                      </h3>
                      <span className="mt-5 inline-flex items-center text-sm font-bold text-white">
                        {t("common.readMore")}
                        <ArrowRight className="ms-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#babcc0] py-20 md:py-24">
        <div className="site-container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">Product families</p>
              <h2 className="section-title">
                Solutions that stay clear from specification to site.
              </h2>
            </div>
            <Button variant="outline" onClick={() => setLocation("/products")}>
              {t("mvlv.view")}
              <ArrowRight className="ms-2" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="corner-card group block min-h-48 bg-[#f6f3ee] p-7"
              >
                <span className="corner-card__corner" aria-hidden="true">
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
                <div className="corner-card__content flex h-full flex-col justify-end">
                  <h3 className="max-w-sm text-2xl font-bold leading-tight">
                    {language === "ar" ? category.nameAr : category.nameEn}
                  </h3>
                  <span className="corner-card__accent mt-5 inline-flex items-center text-sm font-bold text-primary">
                    {t("common.viewDetails")}
                    <ArrowRight className="ms-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#7c1e32] py-20 text-white md:py-24">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <Link
            href="/safety-systems"
            className="corner-card corner-card--media group relative min-h-[29rem] overflow-hidden border-white/20"
          >
            <img
              src={approvedImages.safety}
              alt="Construction loading platform safety system"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241519] via-[#241519]/45 to-transparent" />
            <div className="corner-card__content absolute inset-x-0 bottom-0 p-8">
              <p className="eyebrow !text-white/70">Systems protection</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-.04em]">
                {t("safety.title")}
              </h2>
              <p className="mt-3 max-w-md text-white/80">
                {t("safety.subtitle")}
              </p>
            </div>
          </Link>
          <Link
            href="/testing-commissioning"
            className="corner-card corner-card--media group relative min-h-[29rem] overflow-hidden border-white/20"
          >
            <img
              src={approvedImages.testing}
              alt="Electrical panel testing and commissioning"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241519] via-[#241519]/45 to-transparent" />
            <div className="corner-card__content absolute inset-x-0 bottom-0 p-8">
              <p className="eyebrow !text-white/70">Field assurance</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-.04em]">
                {t("testing.title")}
              </h2>
              <p className="mt-3 max-w-md text-white/80">
                {t("testing.subtitle")}
              </p>
            </div>
          </Link>
        </div>
      </section>
      {clients.length > 0 && (
        <section className="bg-[#eee9e1] py-20 md:py-24">
          <div className="site-container">
            <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="eyebrow mb-4">{t("clients.title")}</p>
                <h2 className="section-title">{t("clients.subtitle")}</h2>
              </div>
              <Link
                href="/clients"
                className="inline-flex items-center text-sm font-bold text-primary hover:underline"
              >
                {t("clients.view")}
                <ArrowRight className="ms-2 h-4 w-4" />
              </Link>
            </div>
            <ClientLogoMarquee />
            <div className="mt-8 grid gap-8 bg-[#292a2c] p-6 text-white md:grid-cols-[.8fr_1.2fr] md:p-9">
              <div>
                <p className="eyebrow !text-[#deb1bc]">Trusted relationships</p>
                <p className="mt-5 text-lg leading-8 text-white/75">
                  A focused look at the organisations represented in Arzana’s
                  approved client portfolio.
                </p>
              </div>
              <ClientLogoCarousel clients={clients} />
            </div>
          </div>
        </section>
      )}
      <section className="bg-[#292a2c] py-20 text-white md:py-24">
        <div className="site-container grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow !text-[#deb1bc]">Project enquiries</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-[-.045em] md:text-5xl">
              {t("contact.cta.title")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <RequestQuoteButton size="lg" />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
