import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLanguage } from "../contexts/LanguageContext";
import { RequestQuoteButton } from "../components/RequestQuoteButton";
import { useCatalog } from "../contexts/CatalogContext";
import { approvedImages, getProductMedia } from "../data/assets";

export default function SafetySystems() {
  const { language } = useLanguage();
  const { categories, products } = useCatalog();
  const category = categories.find((item) => item.id === "cat-3");
  const safetyProducts = products.filter(
    (product) => product.categoryId === "cat-3",
  );
  const copy =
    language === "ar"
      ? {
          title: "أنظمة السلامة والحماية من السقوط",
          introduction:
            "يسرد ملف الشركة المنتجات التالية ضمن أنظمة السلامة والحماية من السقوط.",
          viewProducts: "عرض المنتجات",
          quote: "طلب عرض سعر",
          details: "عرض التفاصيل",
        }
      : {
          title: "Safety & Fall Protection Systems",
          introduction:
            "The company profile lists the following products under safety and fall protection systems.",
          viewProducts: "View Products",
          quote: "Request a Quote",
          details: "View Details",
        };

  return (
    <PageWrapper>
      <section className="page-hero py-28 text-background md:py-36">
        <div className="absolute inset-0">
          <img
            src={approvedImages.safety}
            alt="Construction loading platform safety system"
            className="h-full w-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent" />
        </div>
        <div className="site-container relative z-10 max-w-4xl">
          <p className="eyebrow mb-5 !text-white/70">Protective systems</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {copy.introduction}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <RequestQuoteButton
              size="lg"
              href="/products/safety-fall-protection"
              label={copy.viewProducts}
            />
            <RequestQuoteButton size="lg" />
          </div>
        </div>
      </section>
      <section className="bg-[#d8d4cb] py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {safetyProducts.map((product) => {
              const image = getProductMedia(product)[0];
              return (
                <Link
                  key={product.id}
                  href={`/products/${category?.slug}/${product.slug}`}
                  className="corner-card corner-card--media group block min-h-[23rem]"
                >
                  <span className="corner-card__corner" aria-hidden="true">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                  {image && (
                    <img
                      src={image.src}
                      alt={language === "ar" ? image.altAr : image.altEn}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                    />
                  )}
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,32,34,.08),rgba(31,32,34,.9))]" />
                  <div className="corner-card__content flex h-full flex-col justify-end p-7 text-white">
                    <h2 className="text-2xl font-bold leading-tight">
                      {language === "ar" ? product.nameAr : product.nameEn}
                    </h2>
                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-white">
                      {copy.details}
                      <ArrowRight
                        className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
