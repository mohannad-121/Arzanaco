import { MapPin } from "lucide-react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLanguage } from "../contexts/LanguageContext";
import { companyAddress, contactPeople } from "../data/contact";
import whatsappIcon from "@logos/whatsapp.png";
import phoneIcon from "@logos/telephone-call.png";
import emailIcon from "@logos/outlook.png";
import addressImage from "@photos/address.png";
import { RequestQuoteButton } from "../components/RequestQuoteButton";

const MAP_URL = "https://maps.app.goo.gl/nPuY2zpt2Gx1axCY9";

export default function Contact() {
  const { language } = useLanguage();
  const copy =
    language === "ar"
      ? {
          title: "اتصل بنا",
          intro:
            "للاستفسارات ومتطلبات المشاريع والتواصل العام، يرجى التواصل مع شركة أرزانا العربية المحدودة.",
          phone: "الهاتف",
          email: "البريد الإلكتروني",
          address: "العنوان",
          quote: "طلب عرض سعر",
          quoteCopy:
            "لإعداد طلب عرض سعر، اختر المنتجات المطلوبة وأرسل بيانات التواصل من خلال نموذج طلب عرض السعر.",
          map: "عرض الموقع على الخريطة",
          whatsapp: "واتساب",
        }
      : {
          title: "Contact Us",
          intro:
            "For enquiries, project requirements, and general communication, please contact Arzana Arabia Company Ltd.",
          phone: "Phone",
          email: "Email",
          address: "Address",
          quote: "Request a Quote",
          quoteCopy:
            "To prepare a quote request, select the required products and send your contact details through the Request a Quote form.",
          map: "View on Map",
          whatsapp: "WhatsApp",
        };
  return (
    <PageWrapper>
      <section className="page-hero py-28 md:py-36">
        <div className="site-container max-w-3xl">
          <p className="eyebrow mb-5 !text-white/70">Project enquiries</p>
          <h1 className="text-4xl font-bold tracking-[-.04em] text-white md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            {copy.intro}
          </p>
        </div>
      </section>
      <section className="bg-[#d8d4cb] py-16 md:py-24">
        <div className="site-container grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {contactPeople.map((contact) => (
            <article
              key={contact.email}
              className="contact-card min-h-72 p-7 md:p-8"
            >
              <div className="corner-card__content">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={contact.phoneHref}
                    className="rounded-md border border-foreground/12 bg-white/55 p-3 transition hover:border-primary/50 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <img
                      src={phoneIcon}
                      alt=""
                      className="h-8 w-8 object-contain"
                    />
                    <p className="mt-3 text-[.65rem] font-bold uppercase tracking-[.13em] text-primary">
                      {copy.phone}
                    </p>
                    <span
                      className="mt-1 block whitespace-nowrap text-[.76rem] font-bold text-foreground"
                      dir="ltr"
                    >
                      {contact.phone}
                    </span>
                  </a>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-foreground/12 bg-white/55 p-3 transition hover:border-primary/50 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <img
                      src={whatsappIcon}
                      alt=""
                      className="h-8 w-8 object-contain"
                    />
                    <p className="mt-3 text-[.65rem] font-bold uppercase tracking-[.13em] text-primary">
                      {copy.whatsapp}
                    </p>
                    <span
                      className="mt-1 block whitespace-nowrap text-[.76rem] font-bold text-foreground"
                      dir="ltr"
                    >
                      {contact.phone}
                    </span>
                  </a>
                </div>
                <div className="mt-6 border-t border-foreground/12 pt-5">
                  <img
                    src={emailIcon}
                    alt="Email"
                    className="h-7 w-7 object-contain"
                  />
                  <p className="corner-card__accent mt-4 text-xs font-bold uppercase tracking-[.14em] text-primary">
                    {copy.email}
                  </p>
                  <a
                    href={contact.emailHref}
                    className="mt-2 block break-all text-base font-medium text-foreground/75 hover:text-primary"
                    dir="ltr"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </article>
          ))}
          <article className="corner-card corner-card--media min-h-[30rem] overflow-hidden md:col-span-2 lg:col-span-3">
            <span className="corner-card__corner" aria-hidden="true" />
            <img
              src={addressImage}
              alt="Arzana Arabia address map"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,32,34,.08),rgba(31,32,34,.94))]" />
            <div className="corner-card__content flex h-full flex-col justify-end p-7 text-white md:p-10">
              <MapPin className="h-8 w-8 text-[#f0c9d0]" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold">{copy.address}</h2>
              <address className="corner-card__muted mt-3 not-italic text-lg leading-relaxed text-white/80">
                {(language === "ar"
                  ? companyAddress.linesAr
                  : companyAddress.lines
                ).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-[#f0e5e7]"
              >
                {copy.map}
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </article>
        </div>
        <div className="site-container mt-10 max-w-6xl">
          <div className="border border-[#d9b8c0] border-s-4 border-s-primary bg-[#f7e9ec] p-7 text-foreground shadow-[0_12px_30px_rgba(120,17,47,.08)] md:flex md:items-center md:justify-between md:gap-10 md:p-8">
            <p className="max-w-2xl leading-relaxed text-foreground/80">
              {copy.quoteCopy}
            </p>
            <RequestQuoteButton size="md" className="mt-6 shrink-0 md:mt-0" />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
