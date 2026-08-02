import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, CheckCircle2, ChevronRight, Mail } from "lucide-react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { useCatalog } from "../contexts/CatalogContext";
import { RequestQuoteButton } from "../components/RequestQuoteButton";
import NotFound from "./not-found";
import { getProductMedia } from "../data/assets";

export default function ProductDetail({
  params,
}: {
  params: { categorySlug: string; productSlug: string };
}) {
  const { t, language } = useLanguage();
  const { categories, products } = useCatalog();
  const [, setLocation] = useLocation();
  const product = products.find((item) => item.slug === params.productSlug);
  const category = categories.find((item) => item.slug === params.categorySlug);
  const [activeMedia, setActiveMedia] = useState(0);
  if (!product || !category || product.categoryId !== category.id)
    return <NotFound />;
  const media = getProductMedia(product);
  const relatedProducts = products
    .filter(
      (item) =>
        item.categoryId === product.categoryId && item.id !== product.id,
    )
    .slice(0, 3);
  const copy =
    language === "ar"
      ? {
          products: "المنتجات",
          applications: "التطبيقات المدرجة في ملف الشركة",
          options: "خيارات الكتالوج",
          quote: "طلب عرض سعر",
          contact: "تواصل معنا",
          related: "منتجات أخرى في هذه الفئة",
          details: "عرض التفاصيل",
        }
      : {
          products: "Products",
          applications: "Applications in the company profile",
          options: "Catalog options",
          quote: "Request a Quote",
          contact: "Contact Us",
          related: "More products in this category",
          details: "View Details",
        };
  const name = language === "ar" ? product.nameAr : product.nameEn;
  const description =
    language === "ar" ? product.descriptionAr : product.descriptionEn;
  const applications =
    language === "ar" ? product.applicationsAr : product.applicationsEn;

  return (
    <PageWrapper>
      <nav className="bg-[#ece8e1] py-4" aria-label="Breadcrumb">
        <div className="site-container flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            {t("nav.home")}
          </Link>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <Link href="/products" className="hover:text-primary">
            {copy.products}
          </Link>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <Link
            href={`/products/${category.slug}`}
            className="hover:text-primary"
          >
            {language === "ar" ? category.nameAr : category.nameEn}
          </Link>
        </div>
      </nav>
      <section className="bg-[#d8d4cb] py-10 md:py-16">
        <div className="site-container max-w-6xl">
          <article className="relative grid overflow-hidden bg-[#f6f3ee] shadow-[0_22px_52px_rgba(39,40,42,.13)] lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative flex min-h-[24rem] flex-col justify-end overflow-hidden bg-[#292a2c] p-7 text-white md:min-h-[32rem] md:p-10">
              {media.length > 0 ? (
                <>
                  <img
                    src={media[activeMedia].src}
                    alt={
                      language === "ar"
                        ? media[activeMedia].altAr
                        : media[activeMedia].altEn
                    }
                    className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${media[activeMedia].fit === "cover" ? "object-cover" : "object-contain p-6 md:p-10"}`}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,32,34,.06),rgba(31,32,34,.76))]" />
                </>
              ) : (
                <>
                  <span className="absolute inset-0 industrial-grid opacity-30" />
                  <span className="absolute -end-12 -top-12 h-56 w-56 rounded-full bg-primary/40 blur-2xl" />
                </>
              )}
              {media.length > 1 && (
                <div className="relative z-10 mt-auto flex gap-2">
                  {media.map((item, index) => (
                    <button
                      type="button"
                      key={item.src}
                      onClick={() => setActiveMedia(index)}
                      aria-label={`${name} image ${index + 1}`}
                      className={`h-14 w-16 overflow-hidden border-2 ${activeMedia === index ? "border-white" : "border-white/40"}`}
                    >
                      <img
                        src={item.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative p-7 md:p-10">
              <span className="absolute end-0 top-0 h-16 w-16 rounded-es-[4rem] bg-primary" />
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
                {language === "ar" ? category.nameAr : category.nameEn}
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-.045em] text-foreground md:text-5xl">
                {name}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-foreground/75">
                {description ||
                  (language === "ar"
                    ? "هذا المنتج مدرج في ملف الشركة."
                    : "This product is listed in the company profile.")}
              </p>
              {applications && applications.length > 0 && (
                <section className="mt-9">
                  <h2 className="text-lg font-bold text-foreground">
                    {copy.applications}
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {applications.map((application) => (
                      <li
                        key={application}
                        className="flex items-center gap-2 bg-[#e8e4dd] px-4 py-3 text-sm text-foreground/80"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        {application}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {product.types && product.types.length > 0 && (
                <section className="mt-9">
                  <h2 className="text-lg font-bold text-foreground">
                    {copy.options}
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {product.types.map((type) => (
                      <li
                        key={type}
                        className="bg-[#292a2c] px-3 py-2 text-sm text-white"
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <div className="mt-10 flex flex-wrap gap-3">
                <RequestQuoteButton size="lg" />
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/contact")}
                >
                  <Mail className="me-2 h-4 w-4" />
                  {copy.contact}
                </Button>
              </div>
            </div>
          </article>
          {relatedProducts.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                {copy.related}
              </h2>
              <div className="grid gap-5 md:grid-cols-3">
                {relatedProducts.map((related) => {
                  const image = getProductMedia(related)[0];
                  return (
                    <Link
                      key={related.id}
                      href={`/products/${category.slug}/${related.slug}`}
                      className="corner-card group block min-h-56"
                    >
                      <span className="corner-card__corner" aria-hidden="true">
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </span>
                      {image && (
                        <img
                          src={image.src}
                          alt={language === "ar" ? image.altAr : image.altEn}
                          loading="lazy"
                          className={`h-36 w-full ${image.fit === "cover" ? "object-cover" : "object-contain bg-[#c7c9c9] p-3"}`}
                        />
                      )}
                      <div className="corner-card__content p-5">
                        <h3 className="font-bold">
                          {language === "ar" ? related.nameAr : related.nameEn}
                        </h3>
                        <span className="corner-card__accent mt-4 inline-flex text-sm font-semibold text-primary">
                          {copy.details}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
