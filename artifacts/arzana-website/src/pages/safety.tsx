import { Link, useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useCatalog } from '../contexts/CatalogContext';
import safetyImage from '@assets/service_safety.jpg';

export default function SafetySystems() {
  const { language } = useLanguage();
  const { categories, products } = useCatalog();
  const [, setLocation] = useLocation();
  const category = categories.find((item) => item.id === 'cat-3');
  const safetyProducts = products.filter((product) => product.categoryId === 'cat-3');
  const copy =
    language === 'ar'
      ? {
          title: 'أنظمة السلامة والحماية من السقوط',
          introduction: 'يسرد ملف الشركة المنتجات التالية ضمن أنظمة السلامة والحماية من السقوط.',
          viewProducts: 'عرض المنتجات',
          quote: 'طلب عرض سعر',
          catalog: 'منتج مدرج في ملف الشركة',
        }
      : {
          title: 'Safety & Fall Protection Systems',
          introduction: 'The company profile lists the following products under safety and fall protection systems.',
          viewProducts: 'View Products',
          quote: 'Request a Quote',
          catalog: 'Product listed in the company profile',
        };

  return (
    <PageWrapper>
      <section className="relative overflow-hidden bg-foreground py-20 text-background">
        <div className="absolute inset-0">
          <img src={safetyImage} alt="" className="h-full w-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">{copy.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{copy.introduction}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => setLocation('/products/safety-fall-protection')}>
              {copy.viewProducts}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-0 bg-white text-foreground hover:bg-white/90"
              onClick={() => setLocation('/request-quote')}
            >
              {copy.quote}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {safetyProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${category?.slug}/${product.slug}`}
                className="group rounded-xl border bg-card p-7 transition-colors hover:border-primary"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{copy.catalog}</p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  {language === 'ar' ? product.nameAr : product.nameEn}
                </h2>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-primary">
                  {copy.viewProducts}
                  <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
