import { Link, useLocation } from 'wouter';
import { CheckCircle2, ChevronRight, Mail } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useCatalog } from '../contexts/CatalogContext';
import NotFound from './not-found';

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
  const copy =
    language === 'ar'
      ? {
          breadcrumb: 'المنتجات',
          catalogEntry: 'منتج مدرج في ملف الشركة',
          options: 'الخيارات المذكورة في الكتالوج',
          quote: 'طلب عرض سعر',
          contact: 'تواصل معنا',
          related: 'منتجات أخرى في الفئة',
        }
      : {
          breadcrumb: 'Products',
          catalogEntry: 'Product listed in the company profile',
          options: 'Catalog options',
          quote: 'Request a Quote',
          contact: 'Contact Us',
          related: 'More products in this category',
        };

  return (
    <PageWrapper>
      <nav className="border-b bg-muted py-4" aria-label="Breadcrumb">
        <div className="container mx-auto flex items-center gap-2 px-4 text-sm text-muted-foreground">
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

      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
        <article className="rounded-2xl border bg-card p-7 shadow-sm md:p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {language === 'ar' ? category.nameAr : category.nameEn}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            {(language === 'ar' ? product.descriptionAr : product.descriptionEn) || copy.catalogEntry}
          </p>

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
          </div>
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
