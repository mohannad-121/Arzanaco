export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
}

export const categories: Category[] = [
  {
    id: 'cat-1',
    slug: 'mv-lv-solutions',
    nameEn: 'Power Distribution',
    nameAr: 'توزيع الطاقة',
  },
  {
    id: 'cat-2',
    slug: 'ups-stabilizers',
    nameEn: 'Power Quality Solutions',
    nameAr: 'حلول جودة الطاقة',
  },
  {
    id: 'cat-3',
    slug: 'safety-fall-protection',
    nameEn: 'Safety & Fall Protection Systems',
    nameAr: 'أنظمة السلامة والحماية من السقوط',
  },
  {
    id: 'cat-4',
    slug: 'industrial-batteries',
    nameEn: 'Battery Solutions',
    nameAr: 'حلول البطاريات',
  },
  {
    id: 'cat-5',
    slug: 'meters-instruments',
    nameEn: 'Electrical Measurement & Protection',
    nameAr: 'القياس والحماية الكهربائية',
  },
  {
    id: 'cat-6',
    slug: 'shelters-containers',
    nameEn: 'Modular Infrastructure',
    nameAr: 'البنية التحتية المعيارية',
  },
  {
    id: 'cat-7',
    slug: 'racks-cabinets',
    nameEn: 'Data Center Infrastructure',
    nameAr: 'بنية مراكز البيانات',
  },
  {
    id: 'cat-8',
    slug: 'fire-alarm-firefighting',
    nameEn: 'Fire Protection Systems',
    nameAr: 'أنظمة الحماية من الحريق',
  },
];
