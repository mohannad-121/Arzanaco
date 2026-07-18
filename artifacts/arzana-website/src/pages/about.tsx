import { Link } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { language } = useLanguage();
  const copy =
    language === 'ar'
      ? {
          title: 'عن شركة أرزانا العربية',
          introduction: 'تعرض هذه الصفحة المعلومات والمنتجات الواردة في ملف شركة أرزانا العربية.',
          catalog: 'ملف الشركة',
          catalogDescription:
            'يشمل الملف منتجات الجهد المتوسط والمنخفض، وأنظمة عدم انقطاع التيار والبطاريات، وأجهزة القياس، وأنظمة السلامة، واختبار وتشغيل المحطات الكهربائية.',
          explore: 'استعرض المنتجات',
        }
      : {
          title: 'About ARZANA Arabia Company',
          introduction: 'This site presents the information and products listed in the ARZANA Arabia company profile.',
          catalog: 'Company Profile',
          catalogDescription:
            'The profile includes medium- and low-voltage products, UPS and batteries, measurement instruments, safety systems, and testing and commissioning of electrical substations.',
          explore: 'Explore Products',
        };

  return (
    <PageWrapper>
      <section className="border-b bg-muted py-20 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">{copy.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70 md:text-xl">{copy.introduction}</p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <article className="rounded-2xl border bg-card p-8 shadow-sm md:p-12">
            <h2 className="text-2xl font-bold text-foreground">{copy.catalog}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/75">{copy.catalogDescription}</p>
            <Link
              href="/products"
              className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {copy.explore}
            </Link>
          </article>
        </div>
      </section>
    </PageWrapper>
  );
}
