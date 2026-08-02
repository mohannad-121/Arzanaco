import { Link } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { approvedImages } from '../data/assets';

export default function About() {
  const { language } = useLanguage();
  const copy = language === 'ar'
    ? {
        title: 'عن شركة أرزانا العربية المحدودة',
        introduction: 'أرزانا العربية المحدودة شركة هندسية سعودية متخصصة في توزيع الطاقة والطاقة الحرجة والبنية التحتية المعيارية والحلول الكهربائية الصناعية.',
        sectorsTitle: 'القطاعات التي نخدمها',
        sectors: ['المرافق', 'الصناعة', 'الاتصالات', 'التجاري', 'البنية التحتية'],
        supportTitle: 'دعم هندسي متكامل للمشروع',
        support: 'نقدم منتجات موثوقة وخدمات هندسية متكاملة تدعم قطاعات المرافق والصناعة والاتصالات والقطاعات التجارية والبنية التحتية في المملكة. يشمل دعمنا الهندسة واختيار المنتجات ودعم التصنيع ودعم التركيب والاختبار والتشغيل وخدمات ما بعد البيع.',
        portfolioTitle: 'محفظة أعمالنا',
        portfolio: 'تشمل محفظتنا معدات الجهد المتوسط والمنخفض والمحولات وأنظمة UPS وحلول البطاريات ومآوي الاتصالات وحاويات مركز التحكم المحلي (LCC) والمباني الكهربائية (E-House) وبنية مراكز البيانات وأنظمة الحماية والقياس وخدمات الاختبار والتشغيل.',
        missionTitle: 'رسالتنا',
        mission: 'تقديم حلول كهربائية موثوقة وفعالة من حيث التكلفة ومهيأة للمستقبل تسهم في تطوير البنية التحتية في المملكة العربية السعودية وتحقيق مستهدفات رؤية 2030.',
        explore: 'استعرض المنتجات والحلول',
      }
    : {
        title: 'About Arzana Arabia Company Ltd.',
        introduction: 'Arzana Arabia Company Ltd. is a Saudi-based engineering company specializing in power distribution, critical power, modular infrastructure, and industrial electrical solutions.',
        sectorsTitle: 'Sectors We Support',
        sectors: ['Utility', 'Industrial', 'Telecommunications', 'Commercial', 'Infrastructure'],
        supportTitle: 'Integrated Engineering and Project Support',
        support: 'We deliver reliable products and integrated engineering services that support the Kingdom’s utility, industrial, telecommunications, commercial, and infrastructure sectors. Our support spans engineering and product selection, manufacturing support, installation support, testing, commissioning, and after-sales service.',
        portfolioTitle: 'Our Portfolio',
        portfolio: 'Our portfolio includes medium- and low-voltage electrical equipment, transformers, UPS systems, battery solutions, telecom shelters, Local Control Center (LCC) containers, Electrical Houses (E-Houses), data center infrastructure, protection and metering systems, and testing and commissioning services.',
        missionTitle: 'Our Mission',
        mission: 'To deliver dependable, cost-effective, and future-ready electrical solutions that contribute to Saudi Arabia’s infrastructure development and Vision 2030 objectives.',
        explore: 'Explore Products & Solutions',
      };

  return (
    <PageWrapper>
      <section className="relative isolate overflow-hidden bg-[#292a2c] py-28 text-white md:py-36"><img src={approvedImages.infrastructure} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(24,25,26,.94),rgba(32,33,35,.68),rgba(32,33,35,.35))]" />
        <div className="site-container max-w-4xl">
          <p className="eyebrow mb-5 !text-white/70">Our company</p><h1 className="max-w-4xl text-4xl font-bold tracking-[-.045em] text-white md:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">{copy.introduction}</p>
        </div>
      </section>

      <section className="bg-[#d8d4cb] py-16 md:py-24"><div className="site-container grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative"><span className="absolute -start-3 -top-4 text-7xl font-bold tracking-[-.1em] text-primary/20">01</span><img src={approvedImages.engineering} alt="Transformer testing in an electrical substation" className="relative h-80 w-full object-cover shadow-[0_22px_42px_rgba(39,40,42,.2)] lg:h-[34rem]" /></div>
          <div className="corner-card bg-[#f6f3ee] p-7 md:p-10">
            <p className="eyebrow mb-4">Engineering support</p><h2 className="section-title text-3xl">{copy.supportTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/75">{copy.support}</p>
            <h3 className="mt-8 text-lg font-semibold text-foreground">{copy.sectorsTitle}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {copy.sectors.map((sector) => <li key={sector} className="bg-primary/7 px-4 py-3 text-sm font-semibold text-primary">{sector}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#292a2c] py-16 text-white md:py-24"><div className="site-container grid max-w-6xl gap-5 lg:grid-cols-2"><article className="corner-card corner-card--dark p-8 md:p-12">
            <p className="eyebrow mb-4 !text-[#deb1bc]">Portfolio</p><h2 className="text-3xl font-bold tracking-[-.04em] text-white">{copy.portfolioTitle}</h2>
            <p className="corner-card__muted mt-5 text-lg leading-relaxed text-white/75">{copy.portfolio}</p></article><article className="corner-card corner-card--dark bg-[#8f1f35] p-8 md:p-12">
            <p className="eyebrow mb-4 !text-white/70">Mission</p><h2 className="text-3xl font-bold tracking-[-.04em] text-white">{copy.missionTitle}</h2>
            <p className="corner-card__muted mt-5 text-lg leading-relaxed text-white/85">{copy.mission}</p>
            <Link href="/products" className="mt-8 inline-flex bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#f0e5e7]">
              {copy.explore}
            </Link>
          </article>
        </div>
      </section>
    </PageWrapper>
  );
}
