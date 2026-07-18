export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "mv-lv-solutions",
    nameEn: "MV / LV Turnkey Solutions",
    nameAr: "حلول الجهد المتوسط والمنخفض",
    descriptionEn: "Comprehensive medium and low voltage solutions for power distribution.",
    descriptionAr: "حلول شاملة للجهد المتوسط والمنخفض لتوزيع الطاقة."
  },
  {
    id: "cat-2",
    slug: "ups-stabilizers",
    nameEn: "UPS & Stabilizers",
    nameAr: "أنظمة عدم انقطاع التيار والمثبتات",
  },
  {
    id: "cat-3",
    slug: "safety-fall-protection",
    nameEn: "Safety & Fall Protection Systems",
    nameAr: "أنظمة السلامة والحماية من السقوط",
  },
  {
    id: "cat-4",
    slug: "industrial-batteries",
    nameEn: "Industrial Batteries",
    nameAr: "البطاريات الصناعية",
  },
  {
    id: "cat-5",
    slug: "meters-instruments",
    nameEn: "Meters & Precision Instruments",
    nameAr: "العدادات وأجهزة القياس الدقيقة",
  },
  {
    id: "cat-6",
    slug: "shelters-containers",
    nameEn: "Shelters & Containers",
    nameAr: "الغرف الجاهزة والحاويات",
  },
  {
    id: "cat-7",
    slug: "racks-cabinets",
    nameEn: "Racks & Cabinets",
    nameAr: "الكبائن والرفوف",
  },
  {
    id: "cat-8",
    slug: "fire-alarm-firefighting",
    nameEn: "Fire Alarm & Firefighting Systems",
    nameAr: "أنظمة إنذار ومكافحة الحريق",
  }
];
