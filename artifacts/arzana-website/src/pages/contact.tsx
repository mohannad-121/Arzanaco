import { Link } from 'wouter';
import { Mail, Phone } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

const publicPhone = '+966 59 708 048';
const publicPhoneHref = 'tel:+96659708048';
const publicEmail = 'projects@arzanaco.com';

export default function Contact() {
  const { language } = useLanguage();
  const copy = language === 'ar'
    ? {
        title: 'اتصل بنا',
        intro: 'للاستفسارات ومتطلبات المشاريع والتواصل العام، يرجى التواصل مع شركة أرزانا العربية المحدودة.',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني للمشاريع',
        quote: 'طلب عرض سعر',
        quoteCopy: 'لإعداد طلب عرض سعر، اختر المنتجات المطلوبة وأرسل بيانات التواصل من خلال نموذج طلب عرض السعر.',
      }
    : {
        title: 'Contact Us',
        intro: 'For enquiries, project requirements, and general communication, please contact Arzana Arabia Company Ltd.',
        phone: 'Phone',
        email: 'Projects Email',
        quote: 'Request a Quote',
        quoteCopy: 'To prepare a quote request, select the required products and send your contact details through the Request a Quote form.',
      };

  return (
    <PageWrapper>
      <section className="border-b bg-muted py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">{copy.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">{copy.intro}</p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto grid max-w-4xl gap-6 px-4 md:grid-cols-2">
          <a href={publicPhoneHref} className="rounded-2xl border bg-card p-8 transition-colors hover:border-primary">
            <Phone className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-6 text-xl font-semibold text-foreground">{copy.phone}</h2>
            <p className="mt-2 text-lg text-foreground/70" dir="ltr">{publicPhone}</p>
          </a>
          <a href={`mailto:${publicEmail}`} className="rounded-2xl border bg-card p-8 transition-colors hover:border-primary">
            <Mail className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-6 text-xl font-semibold text-foreground">{copy.email}</h2>
            <p className="mt-2 break-all text-lg text-foreground/70" dir="ltr">{publicEmail}</p>
          </a>
        </div>
        <div className="container mx-auto mt-10 max-w-4xl px-4">
          <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:flex md:items-center md:justify-between md:gap-10">
            <p className="max-w-2xl leading-relaxed">{copy.quoteCopy}</p>
            <Button asChild variant="secondary" className="mt-6 shrink-0 md:mt-0">
              <Link href="/request-quote">{copy.quote}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
