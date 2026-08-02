import { Link } from 'wouter';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { companyAddress, contactPeople } from '../data/contact';

export default function Contact() {
  const { language } = useLanguage();
  const copy = language === 'ar'
    ? {
        title: 'اتصل بنا',
        intro: 'للاستفسارات ومتطلبات المشاريع والتواصل العام، يرجى التواصل مع شركة أرزانا العربية المحدودة.',
        phone: 'الهاتف', email: 'البريد الإلكتروني', address: 'العنوان',
        quote: 'طلب عرض سعر',
        quoteCopy: 'لإعداد طلب عرض سعر، اختر المنتجات المطلوبة وأرسل بيانات التواصل من خلال نموذج طلب عرض السعر.',
      }
    : {
        title: 'Contact Us',
        intro: 'For enquiries, project requirements, and general communication, please contact Arzana Arabia Company Ltd.',
        phone: 'Phone', email: 'Email', address: 'Address',
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
        <div className="container mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-2">
          {contactPeople.map((contact) => {
            const Icon = contact.whatsapp ? MessageCircle : Phone;
            return (
              <article key={contact.email} className="rounded-2xl border bg-card p-8">
                <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                <h2 className="mt-6 text-xl font-semibold text-foreground">{copy.phone}</h2>
                <div className="mt-2 flex items-center gap-2" dir="ltr">
                  <a href={contact.phoneHref} className="text-lg text-foreground/70 hover:text-primary">{contact.phone}</a>
                  {contact.whatsapp && <a href={contact.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle className="h-5 w-5 text-primary" /></a>}
                </div>
                {contact.whatsapp && <a href={contact.whatsappHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" dir="ltr"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp</a>}
                <h3 className="mt-6 text-xl font-semibold text-foreground">{copy.email}</h3>
                <a href={contact.emailHref} className="mt-2 block break-all text-lg text-foreground/70 hover:text-primary" dir="ltr">{contact.email}</a>
              </article>
            );
          })}
          <article className="rounded-2xl border bg-card p-8 md:col-span-2">
            <MapPin className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-6 text-xl font-semibold text-foreground">{copy.address}</h2>
            <address className="mt-2 not-italic text-lg leading-relaxed text-foreground/70">
              {(language === 'ar' ? companyAddress.linesAr : companyAddress.lines).map((line) => <span key={line} className="block">{line}</span>)}
            </address>
          </article>
        </div>
        <div className="container mx-auto mt-10 max-w-5xl px-4"><div className="rounded-2xl bg-primary p-8 text-primary-foreground md:flex md:items-center md:justify-between md:gap-10"><p className="max-w-2xl leading-relaxed">{copy.quoteCopy}</p><Button asChild variant="secondary" className="mt-6 shrink-0 md:mt-0"><Link href="/request-quote">{copy.quote}</Link></Button></div></div>
      </section>
    </PageWrapper>
  );
}
