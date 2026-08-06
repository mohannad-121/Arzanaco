import logo from '@logos/arz-logo.png';
import photo1 from '@photos/1.jpg';
import photo2 from '@photos/2.jpg';
import photo3 from '@photos/3.jpg';
import photo4 from '@photos/4.jpg';
import photo5 from '@photos/5.jpg';
import photo6 from '@photos/6.jpg';
import photo7 from '@photos/7.jpg';
import photo8 from '@photos/8.jpg';
import photo9 from '@photos/9.jpg';
import photo10 from '@photos/10.jpg';
import photo11 from '@photos/11.jpg';
import photo12 from '@photos/12.jpg';
import photo13 from '@photos/13.jpg';
import photo14 from '@photos/14.jpg';
import photo15 from '@photos/15.jpg';
import photo16 from '@photos/16.jpg';
import photo17 from '@photos/17.jpg';
import photo18 from '@photos/18.jpg';
import photo19 from '@photos/19.jpg';
import photo20 from '@photos/20.jpg';
import photo21 from '@photos/21.jpg';
import photo22 from '@photos/22.jpg';
import photo23 from '@photos/23.jpg';
import photo25 from '@photos/25.jpg';
import photo26 from '@photos/26.png';
import photo27 from '@photos/27.jpg';
import photo28 from '@photos/28.jpg';
import photo29 from '@photos/29.jpg';
import photo30 from '@photos/30.jpg';
import photo31 from '@pages/Electrical panel.png';
import photo32 from '@pages/Technician testing.png';
import photo33 from '@photos/33.jpg';
import photo34 from '@pages/Cable joint.png';
import amendmentThreeTelecommunicationShelter from '@photos/amendment-3-telecommunication-shelter.jpeg';
import amendmentThreeShaftGate from '@photos/amendment-3-shaft-gate.jpeg';
import amendmentThreeLoadingPlatform from '@photos/amendment-3-loading-platform.jpeg';
import amendmentThreeDryTypeTransformer from '@photos/amendment-3-dry-type-transformer.jpeg';

export const officialLogo = logo;

export type ProductImageFit = 'contain' | 'cover';

export interface ProductMedia {
  src: string;
  altEn: string;
  altAr: string;
  fit: ProductImageFit;
}

const equipment = (src: string, altEn: string, altAr: string): ProductMedia => ({
  src,
  altEn,
  altAr,
  fit: 'contain',
});

const site = (src: string, altEn: string, altAr: string): ProductMedia => ({
  src,
  altEn,
  altAr,
  fit: 'cover',
});

const amendmentThreeProductMedia: Record<string, readonly ProductMedia[]> = {
  'dry-type-transformer': [equipment(amendmentThreeDryTypeTransformer, 'Cast-resin dry type transformer', 'محول جاف من راتنج مصبوب')],
  'loading-platforms': [
    site(photo13, 'External construction loading platform', 'منصة تحميل خارجية في موقع إنشاء'),
    site(amendmentThreeLoadingPlatform, 'Red construction loading platform', 'منصة تحميل حمراء في موقع إنشاء'),
  ],
  'shaft-gates': [
    site(photo14, 'Yellow construction shaft gate', 'بوابة صفراء لمنور الإنشاء'),
    site(amendmentThreeShaftGate, 'Orange construction shaft gate', 'بوابة برتقالية لمنور الإنشاء'),
  ],
  'telecommunication-shelter': [
    equipment(photo26, 'Outdoor telecommunication shelter', 'مأوى اتصالات خارجي'),
    equipment(amendmentThreeTelecommunicationShelter, 'Climate-controlled telecommunication shelter', 'مأوى اتصالات مزود بالتحكم المناخي'),
  ],
  'lcc-container': [
    equipment(photo27, 'Indoor LCC modular container', 'حاوية LCC معيارية داخلية'),
    site(photo28, 'LCC containers in the factory', 'حاويات LCC في المصنع'),
  ],
  'electrical-house-e-house': [
    site(photo29, 'Containerized electrical house', 'مبنى كهربائي داخل حاوية'),
    site(photo30, 'Electrical house switchgear interior', 'المعدات الكهربائية داخل المبنى الكهربائي'),
  ],
};

/**
 * Approved Amendment 2 product photography. This local, versioned map is the
 * fallback for the live catalog; an administrator may override it per product
 * through the catalog's optional imageUrls field without losing other edits.
 */
export const productMediaBySlug: Record<string, readonly ProductMedia[]> = {
  'ring-main-unit-rmu': [equipment(photo1, 'Ring Main Unit switchgear', 'وحدة حلقية رئيسية RMU')],
  'metering-rmu': [equipment(photo2, 'Metering RMU switchgear', 'وحدة RMU للقياس')],
  'oil-distribution-transformer': [equipment(photo3, 'Oil distribution transformer', 'محول توزيع زيتي')],
  'auto-isolation-transformer': [equipment(photo4, 'Auto isolation transformer', 'محول ذاتي وعزل')],
  'automatic-transfer-switch-ats': [equipment(photo5, 'Automatic transfer switch cabinet', 'خزانة مفتاح التحويل التلقائي')],
  'disconnect-switch': [equipment(photo6, 'ON/OFF disconnect switch', 'مفتاح فصل وتشغيل')],
  'power-factor-correction-pfc': [equipment(photo7, 'Power factor correction capacitor panel', 'لوحة تصحيح معامل القدرة')],
  'low-voltage-switchboard': [equipment(photo8, 'Low voltage switchboard production line', 'لوحات مفاتيح الجهد المنخفض')],
  'safety-nets': [
    site(photo9, 'Construction safety net installation', 'تركيب شبكات السلامة في موقع إنشاء'),
    site(photo10, 'Safety net protection on a high-rise building', 'شبكة سلامة لحماية مبنى مرتفع'),
  ],
  'edge-protection-systems': [
    site(photo11, 'Construction edge protection workers', 'عمال بجوار نظام حماية الحواف'),
    site(photo12, 'Red edge protection railing on a construction site', 'درابزين أحمر لحماية الحواف في موقع إنشاء'),
  ],
  'loading-platforms': [site(photo13, 'External construction loading platform', 'منصة تحميل خارجية في موقع إنشاء')],
  'shaft-gates': [site(photo14, 'Yellow construction shaft gate', 'بوابة صفراء لمنور الإنشاء')],
  'tower-crane-tie-supports': [
    site(photo15, 'Tower crane tie support on a high-rise construction site', 'دعامة ربط رافعة برجية في موقع إنشاء مرتفع'),
    site(photo16, 'Tower crane support installation at a construction site', 'تركيب دعامة رافعة برجية في موقع إنشاء'),
  ],
  'uninterruptible-power-supply-ups': [
    equipment(photo17, 'Modular uninterruptible power supply cabinet', 'خزانة مزود طاقة غير منقطع معيارية'),
    equipment(photo18, 'Uninterruptible power supply unit', 'وحدة مزود طاقة غير منقطع'),
    equipment(photo19, 'Tower uninterruptible power supply', 'مزود طاقة غير منقطع برجي'),
  ],
  'static-transfer-switch-sts': [equipment(photo20, 'Static transfer switch cabinet', 'خزانة مفتاح التحويل الثابت')],
  'static-voltage-regulator-svr': [equipment(photo21, 'Open static voltage regulator cabinet', 'خزانة منظم الجهد الثابت المفتوحة')],
  'automatic-voltage-regulator-avr': [equipment(photo22, 'Automatic voltage regulator cabinet', 'خزانة منظم الجهد التلقائي')],
  'frequency-converter': [equipment(photo23, 'Frequency converter cabinet', 'خزانة محول التردد')],
  'battery-charger': [equipment(photo25, 'Industrial battery charger cabinet', 'خزانة شاحن بطاريات صناعي')],
  'telecommunication-shelter': [equipment(photo26, 'Outdoor telecommunication shelter', 'مأوى اتصالات خارجي')],
  'lcc-container': [equipment(photo27, 'Indoor LCC modular container', 'حاوية LCC معيارية داخلية')],
  'electrical-house-e-house': [
    site(photo28, 'Electrical house modular building', 'مبنى كهربائي معياري'),
    site(photo29, 'Containerized electrical house', 'مبنى كهربائي داخل حاوية'),
    site(photo30, 'Electrical house switchgear interior', 'المعدات الكهربائية داخل المبنى الكهربائي'),
  ],
  ...amendmentThreeProductMedia,
};

export function getProductMedia(product: {
  slug: string;
  nameEn: string;
  nameAr: string;
  imageUrls?: readonly string[];
}): readonly ProductMedia[] {
  const adminImages = product.imageUrls?.filter((url) => url.trim().length > 0) ?? [];
  if (adminImages.length > 0) {
    return adminImages.map((src) => equipment(src, product.nameEn, product.nameAr));
  }

  return productMediaBySlug[product.slug] ?? [];
}

/** Backward-compatible primary-image lookup for existing product-card callers. */
export const productImageBySlug: Record<string, string> = Object.fromEntries(
  Object.entries(productMediaBySlug).map(([slug, media]) => [slug, media[0]?.src]),
);

export const testingCommissioningMedia = [
  site(photo31, 'Electrical panel measurement during testing and commissioning', 'قياس لوحة كهربائية أثناء الاختبار والتشغيل'),
  site(photo32, 'Technician testing electrical switchgear', 'فني يختبر معدات مفاتيح كهربائية'),
  site(photo33, 'Transformer and substation inspection', 'فحص محول ومحطة فرعية'),
  site(photo34, 'Cable joint installation and testing', 'تركيب واختبار وصلة كابل'),
] as const;

export const approvedImages = {
  powerDistribution: photo1,
  electricalSystems: photo8,
  automation: photo17,
  infrastructure: photo28,
  testing: photo31,
  testingDetail: photo32,
  engineering: photo33,
  safety: photo13,
  edgeProtection: photo11,
} as const;
