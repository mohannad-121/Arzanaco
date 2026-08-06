import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import testingPhoto from '@pages/testingphoto.png';

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
      <section className="bg-[#292a2c] py-16 text-white md:py-24">
        <div className="site-container max-w-4xl">
          <p className="eyebrow mb-5 !text-[#deb1bc]">Our company</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-[-.045em] text-white md:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">{copy.introduction}</p>
        </div>
      </section>

      <section className="bg-[#d8d4cb] py-16 md:py-24"><div className="site-container grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
          <div className="corner-card relative h-80 w-full lg:h-[34rem]"><img src={testingPhoto} alt="Transformer testing in an electrical substation" className="relative h-full w-full object-cover" /></div>
          <div className="border border-[#c7c3bb] bg-[#f6f3ee] p-7 shadow-[0_14px_32px_rgba(39,40,42,.08)] md:p-8 lg:h-[34rem]">
            <p className="eyebrow mb-3">Engineering support</p><h2 className="section-title text-[1.75rem] leading-tight">{copy.supportTitle}</h2>
            <p className="mt-4 text-base leading-7 text-foreground/75">{copy.support}</p>
            <h3 className="mt-6 text-lg font-semibold text-foreground">{copy.sectorsTitle}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {copy.sectors.map((sector) => <li key={sector} className="bg-primary/7 px-3 py-2 text-sm font-semibold text-primary">{sector}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#292a2c] py-16 text-white md:py-24"><div className="site-container grid max-w-6xl gap-5 lg:grid-cols-2"><article className="border border-white/20 bg-[#292a2c] p-8 md:p-12">
            <p className="eyebrow mb-4 !text-[#deb1bc]">Portfolio</p><h2 className="text-3xl font-bold tracking-[-.04em] text-white">{copy.portfolioTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{copy.portfolio}</p></article><article className="border border-white/20 bg-[#292a2c] p-8 md:p-12">
            <p className="eyebrow mb-4 !text-[#deb1bc]">Mission</p><h2 className="text-3xl font-bold tracking-[-.04em] text-white">{copy.missionTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{copy.mission}</p>
          </article>
        </div>
      </section>
    </PageWrapper>
  );
}
