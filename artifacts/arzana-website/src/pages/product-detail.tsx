import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { CheckCircle2, ChevronRight, Mail } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useCatalog } from '../contexts/CatalogContext';
import NotFound from './not-found';
import { getProductMedia } from '../data/assets';

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

  if (!product || !category || product.categoryId !== category.id) {
    return <NotFound />;
  }

  const relatedProducts = products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 3);
  const media = getProductMedia(product);
  const [activeMedia, setActiveMedia] = useState(0);
  const copy =
    language === 'ar'
      ? {
          breadcrumb: 'المنتجات',
          catalogEntry: 'منتج مدرج في ملف الشركة',
          options: 'الخيارات المذكورة في الكتالوج',
          applications: 'التطبيقات المذكورة في ملف الشركة',
          quote: 'طلب عرض سعر',
          contact: 'تواصل معنا',
          related: 'منتجات أخرى في الفئة',
        }
      : {
          breadcrumb: 'Products',
          catalogEntry: 'Product listed in the company profile',
          options: 'Catalog options',
          applications: 'Applications in the company profile',
          quote: 'Request a Quote',
          contact: 'Contact Us',
          related: 'More products in this category',
        };

  return (
    <PageWrapper>
      <nav className="border-b bg-muted py-4" aria-label="Breadcrumb">
        <div className="site-container flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">{t('nav.home')}</Link>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <Link href="/products" className="hover:text-primary">{copy.breadcrumb}</Link>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <Link href={`/products/${category.slug}`} className="hover:text-primary">
            {language === 'ar' ? category.nameAr : category.nameEn}
          </Link>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <span className="truncate font-medium text-foreground">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </span>
        </div>
      </nav>

      <section className="site-container max-w-6xl py-14 md:py-20">
        <article className="grid gap-10 border border-border bg-card p-7 shadow-[0_18px_50px_rgba(39,40,42,.08)] lg:grid-cols-2 md:p-10">
          <div className="contents">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {language === 'ar' ? category.nameAr : category.nameEn}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-[-.04em] text-foreground md:text-5xl">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </h1>
          {media.length > 0 && (
            <section className="lg:col-start-2 lg:row-span-5 lg:row-start-1" aria-label={language === 'ar' ? `معرض صور ${product.nameAr}` : `${product.nameEn} image gallery`}>
              <img
                src={media[activeMedia].src}
                alt={language === 'ar' ? media[activeMedia].altAr : media[activeMedia].altEn}
                className={`h-72 w-full border bg-white md:h-[32rem] ${media[activeMedia].fit === 'cover' ? 'object-cover' : 'object-contain p-4'}`}
              />
              {media.length > 1 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {media.map((item, index) => (
                    <button type="button" key={item.src} onClick={() => setActiveMedia(index)} className={`border bg-white p-1 transition ${activeMedia === index ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}`} aria-label={`${language === 'ar' ? product.nameAr : product.nameEn} image ${index + 1}`}>
                    <img
                      src={item.src}
                      alt={language === 'ar' ? item.altAr : item.altEn}
                      className={`h-20 w-full ${item.fit === 'cover' ? 'object-cover' : 'object-contain p-2'}`}
                      loading="lazy"
                    /></button>
                  ))}
                </div>
              )}
            </section>
          )}
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            {(language === 'ar' ? product.descriptionAr : product.descriptionEn) || copy.catalogEntry}
          </p>

          {((language === 'ar' ? product.applicationsAr : product.applicationsEn) ?? []).length > 0 && (
            <section className="mt-10 border-t pt-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">{copy.applications}</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(language === 'ar' ? product.applicationsAr : product.applicationsEn)?.map((application) => (
                  <li key={application} className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-foreground/80">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {application}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.types && product.types.length > 0 && (
            <section className="mt-10 border-t pt-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">{copy.options}</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.types.map((type) => (
                  <li key={type} className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-foreground/80">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {type}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t pt-8">
            <Button size="lg" onClick={() => setLocation('/request-quote')}>
              {copy.quote}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => setLocation('/contact')}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {copy.contact}
            </Button>
          </div></div>
        </article>

        {relatedProducts.length > 0 && (
          <section className="mt-14 border-t pt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">{copy.related}</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${category.slug}/${relatedProduct.slug}`}
                  className="rounded-xl border bg-card p-5 transition-colors hover:border-primary"
                >
                  {getProductMedia(relatedProduct)[0] && (
                    <img
                      src={getProductMedia(relatedProduct)[0].src}
                      alt={language === 'ar' ? getProductMedia(relatedProduct)[0].altAr : getProductMedia(relatedProduct)[0].altEn}
                      loading="lazy"
                      className={`mb-4 h-28 w-full rounded-lg border bg-white ${getProductMedia(relatedProduct)[0].fit === 'cover' ? 'object-cover' : 'object-contain p-2'}`}
                    />
                  )}
                  <p className="font-semibold text-foreground">
                    {language === 'ar' ? relatedProduct.nameAr : relatedProduct.nameEn}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </PageWrapper>
  );
}
