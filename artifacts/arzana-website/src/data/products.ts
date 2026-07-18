import { Category } from './categories';

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image?: string;
  types?: string[];
}

export const products: Product[] = [
  // MV/LV
  {
    id: "p1",
    slug: "ring-main-unit",
    categoryId: "cat-1",
    nameEn: "Ring Main Unit – RMU",
    nameAr: "وحدة الربط الحلقي",
    descriptionEn: "Compact medium-voltage switchgear for reliable power distribution, switching, isolation, and network protection.",
    descriptionAr: "معدات تحويل مدمجة للجهد المتوسط لتوزيع الطاقة بشكل موثوق، والتبديل، والعزل، وحماية الشبكة."
  },
  {
    id: "p2",
    slug: "metering-rmu",
    categoryId: "cat-1",
    nameEn: "Metering RMU",
    nameAr: "وحدة القياس الحلقية",
    descriptionEn: "Ring main unit configuration for medium-voltage power distribution and electrical metering applications.",
    descriptionAr: "وحدة ربط حلقي لتطبيقات توزيع الجهد المتوسط والقياس الكهربائي."
  },
  {
    id: "p3",
    slug: "dry-type-transformer",
    categoryId: "cat-1",
    nameEn: "Dry-Type Transformer",
    nameAr: "محول جاف",
    descriptionEn: "Dry-type transformer for electrical isolation, voltage transformation, and power distribution.",
    descriptionAr: "محول جاف للعزل الكهربائي وتحويل الجهد وتوزيع الطاقة.",
    types: ["Auto Transformer", "Isolation Transformer"]
  },
  {
    id: "p4",
    slug: "oil-distribution-transformer",
    categoryId: "cat-1",
    nameEn: "Oil Distribution Transformer",
    nameAr: "محول توزيع زيتي",
    descriptionEn: "Oil-filled distribution transformer for dependable voltage transformation.",
    descriptionAr: "محول توزيع معبأ بالزيت لتحويل الجهد بشكل موثوق.",
    types: ["Aluminium Conductor", "Copper Conductor"]
  },
  {
    id: "p5",
    slug: "automatic-transfer-switch",
    categoryId: "cat-1",
    nameEn: "Automatic Transfer Switch",
    nameAr: "مفتاح النقل التلقائي",
    descriptionEn: "Automatic switching between normal and backup power sources.",
    descriptionAr: "تبديل تلقائي بين مصادر الطاقة العادية والاحتياطية."
  },
  {
    id: "p6",
    slug: "lv-switchboard",
    categoryId: "cat-1",
    nameEn: "Low Voltage Switchboard",
    nameAr: "لوحة مفاتيح الجهد المنخفض",
    descriptionEn: "LV electrical distribution and control switchboards for commercial, infrastructure, and industrial installations.",
    descriptionAr: "لوحات توزيع وتحكم للجهد المنخفض للتركيبات التجارية والصناعية والبنية التحتية."
  },
  {
    id: "p7",
    slug: "disconnect-switch",
    categoryId: "cat-1",
    nameEn: "Disconnect Switch",
    nameAr: "مفتاح فصل",
    descriptionEn: "Electrical isolation and disconnection solutions for safe operation and maintenance.",
    descriptionAr: "حلول العزل والفصل الكهربائي للتشغيل والصيانة الآمنة."
  },
  {
    id: "p8",
    slug: "power-factor-correction",
    categoryId: "cat-1",
    nameEn: "Power Factor Correction",
    nameAr: "تصحيح معامل القدرة",
    descriptionEn: "Power factor correction solutions to improve electrical system efficiency and manage reactive power.",
    descriptionAr: "حلول تصحيح معامل القدرة لتحسين كفاءة النظام الكهربائي وإدارة القدرة التفاعلية."
  },

  // UPS & Stabilizers
  {
    id: "p9",
    slug: "ups",
    categoryId: "cat-2",
    nameEn: "Uninterruptible Power Supply – UPS",
    nameAr: "مزود الطاقة غير المنقطع",
    descriptionEn: "Backup power solutions protecting critical electrical and electronic loads.",
    descriptionAr: "حلول طاقة احتياطية لحماية الأحمال الكهربائية والإلكترونية الحرجة.",
    types: ["Line Interactive", "Online", "Modular"]
  },
  {
    id: "p10",
    slug: "static-transfer-switch",
    categoryId: "cat-2",
    nameEn: "Static Transfer Switches – STS",
    nameAr: "مفاتيح النقل الثابتة",
    descriptionEn: "High-speed static switching between independent power sources.",
    descriptionAr: "تبديل ثابت عالي السرعة بين مصادر طاقة مستقلة."
  },
  {
    id: "p11",
    slug: "static-voltage-regulator",
    categoryId: "cat-2",
    nameEn: "Static Voltage Regulators",
    nameAr: "منظمات الجهد الثابتة",
    descriptionEn: "Voltage-regulation for stable output for sensitive electrical equipment.",
    descriptionAr: "تنظيم الجهد للحصول على مخرجات مستقرة للمعدات الكهربائية الحساسة."
  },
  {
    id: "p12",
    slug: "avr-stabilizer",
    categoryId: "cat-2",
    nameEn: "Automatic Voltage Regulators / Stabilizers – AVR",
    nameAr: "منظمات الجهد الأوتوماتيكية / المثبتات",
    descriptionEn: "Automatic voltage stabilization for fluctuating electrical supplies.",
    descriptionAr: "تثبيت تلقائي للجهد للإمدادات الكهربائية المتقلبة."
  },
  {
    id: "p13",
    slug: "frequency-converter",
    categoryId: "cat-2",
    nameEn: "Frequency Converters",
    nameAr: "محولات التردد",
    descriptionEn: "Frequency conversion.",
    descriptionAr: "تحويل التردد.",
    types: ["50 Hz", "60 Hz", "400 Hz"]
  },
  {
    id: "p14",
    slug: "battery-charger",
    categoryId: "cat-2",
    nameEn: "Battery Chargers",
    nameAr: "شواحن البطاريات",
    descriptionEn: "Battery charging systems for industrial, standby, control, and backup-power applications.",
    descriptionAr: "أنظمة شحن البطاريات للتطبيقات الصناعية، الاحتياطية، التحكم."
  },

  // Safety
  {
    id: "p15",
    slug: "safety-nets",
    categoryId: "cat-3",
    nameEn: "Safety Nets",
    nameAr: "شبكات السلامة",
    descriptionEn: "Collective fall-protection net systems to reduce risks of work at height.",
    descriptionAr: "أنظمة شبكات الحماية من السقوط الجماعية للحد من مخاطر العمل على الارتفاعات."
  },
  {
    id: "p16",
    slug: "edge-protection",
    categoryId: "cat-3",
    nameEn: "Edge Protection",
    nameAr: "حماية الحواف",
    descriptionEn: "Temporary edge-protection systems for exposed slab edges, platforms, and elevated areas.",
    descriptionAr: "أنظمة حماية الحواف المؤقتة لحواف البلاط المكشوفة والمنصات والمناطق المرتفعة."
  },
  {
    id: "p17",
    slug: "loading-platforms",
    categoryId: "cat-3",
    nameEn: "Loading Platforms",
    nameAr: "منصات التحميل",
    descriptionEn: "Temporary construction loading platforms for safe material transfer between building levels.",
    descriptionAr: "منصات تحميل مؤقتة للبناء لنقل المواد بأمان بين مستويات المبنى."
  },
  {
    id: "p18",
    slug: "shaft-gates",
    categoryId: "cat-3",
    nameEn: "Shaft Gates",
    nameAr: "بوابات المصاعد والمناور",
    descriptionEn: "Temporary access-control and protection for open shafts and hazardous construction openings.",
    descriptionAr: "التحكم في الوصول المؤقت والحماية للفتحات المكشوفة وفتحات البناء الخطرة."
  },

  // Batteries
  {
    id: "p19",
    slug: "nickel-cadmium-batteries",
    categoryId: "cat-4",
    nameEn: "Nickel-Cadmium Batteries – Ni-Cd",
    nameAr: "بطاريات النيكل كادميوم",
    descriptionEn: "Industrial rechargeable batteries for demanding standby and backup-power applications.",
    descriptionAr: "بطاريات صناعية قابلة لإعادة الشحن لتطبيقات الطاقة الاحتياطية المتطلبة."
  },
  {
    id: "p20",
    slug: "lead-acid-batteries",
    categoryId: "cat-4",
    nameEn: "Lead-Acid Batteries",
    nameAr: "بطاريات الرصاص الحمضية",
    descriptionEn: "Lead-acid battery solutions for backup power, UPS, control systems, and industrial applications.",
    descriptionAr: "حلول بطاريات الرصاص الحمضية للطاقة الاحتياطية وأنظمة UPS.",
    types: ["AGM", "GEL", "Flooded Lead-Acid"]
  },
  {
    id: "p21",
    slug: "opzs-batteries",
    categoryId: "cat-4",
    nameEn: "OPzS Batteries",
    nameAr: "بطاريات OPzS",
    descriptionEn: "Stationary flooded tubular-plate batteries for long-duration standby and industrial applications.",
    descriptionAr: "بطاريات ثابتة أنبوبية للتطبيقات الصناعية والطاقة الاحتياطية طويلة الأمد."
  },
  {
    id: "p22",
    slug: "lithium-batteries",
    categoryId: "cat-4",
    nameEn: "Lithium Batteries",
    nameAr: "بطاريات الليثيوم",
    descriptionEn: "Compact and efficient energy storage for backup-power applications.",
    descriptionAr: "تخزين طاقة مدمج وفعال لتطبيقات الطاقة الاحتياطية."
  },

  // Meters
  {
    id: "p23",
    slug: "multifunction-meters",
    categoryId: "cat-5",
    nameEn: "Multifunction Meters",
    nameAr: "عدادات متعددة الوظائف",
    descriptionEn: "Electrical meters measuring multiple parameters from a single device.",
    descriptionAr: "عدادات كهربائية تقيس معلمات متعددة من جهاز واحد."
  },
  {
    id: "p24",
    slug: "digital-multimeters",
    categoryId: "cat-5",
    nameEn: "Digital Multimeters",
    nameAr: "مقياس متعدد رقمي",
    descriptionEn: "Portable or panel-based instruments for measuring voltage, current, and resistance.",
    descriptionAr: "أجهزة محمولة أو لوحية لقياس الجهد والتيار والمقاومة."
  },
  {
    id: "p25",
    slug: "digital-panel-meters",
    categoryId: "cat-5",
    nameEn: "Digital Panel Meters",
    nameAr: "عدادات لوحة رقمية",
    descriptionEn: "Panel-mounted digital instruments for displaying electrical and process measurements.",
    descriptionAr: "أجهزة رقمية تثبت على اللوحة لعرض القياسات الكهربائية."
  },
  {
    id: "p26",
    slug: "analog-panel-meters",
    categoryId: "cat-5",
    nameEn: "Analog Panel Meters",
    nameAr: "عدادات لوحة تناظرية",
    descriptionEn: "Panel-mounted analog instruments for visual monitoring of electrical values.",
    descriptionAr: "أجهزة تناظرية تثبت على اللوحة للمراقبة البصرية للقيم الكهربائية."
  },
  {
    id: "p27",
    slug: "kwh-energy-meters",
    categoryId: "cat-5",
    nameEn: "kWh Energy Meters",
    nameAr: "عدادات طاقة kWh",
    descriptionEn: "Energy meters for measuring electrical energy consumption.",
    descriptionAr: "عدادات طاقة لقياس استهلاك الطاقة الكهربائية."
  },
  {
    id: "p28",
    slug: "current-transformers",
    categoryId: "cat-5",
    nameEn: "Current Transformers",
    nameAr: "محولات تيار",
    descriptionEn: "Instrument transformers to scale electrical current for measurement and protection.",
    descriptionAr: "محولات قياس لتوسيع نطاق التيار الكهربائي للقياس والحماية."
  },
  {
    id: "p29",
    slug: "protection-relays",
    categoryId: "cat-5",
    nameEn: "Protection Relays",
    nameAr: "مرحلات حماية",
    descriptionEn: "Electrical protection devices detecting abnormal system conditions.",
    descriptionAr: "أجهزة حماية كهربائية للكشف عن ظروف النظام غير الطبيعية."
  },
  {
    id: "p30",
    slug: "transducers-isolators",
    categoryId: "cat-5",
    nameEn: "Transducers and Isolators",
    nameAr: "محولات الإشارة والعوازل",
    descriptionEn: "Signal conversion, measurement, and electrical isolation devices.",
    descriptionAr: "أجهزة تحويل الإشارات والقياس والعزل الكهربائي."
  },
  {
    id: "p31",
    slug: "temperature-controllers",
    categoryId: "cat-5",
    nameEn: "Temperature Controllers",
    nameAr: "متحكمات الحرارة",
    descriptionEn: "Controllers for monitoring and regulating temperature in electrical and industrial processes.",
    descriptionAr: "متحكمات لمراقبة وتنظيم درجة الحرارة في العمليات الكهربائية والصناعية."
  },
  {
    id: "p32",
    slug: "converters-recorders",
    categoryId: "cat-5",
    nameEn: "Converters and Recorders",
    nameAr: "محولات ومسجلات",
    descriptionEn: "Signal conversion, monitoring, recording, and process-data documentation devices.",
    descriptionAr: "أجهزة تحويل الإشارات والمراقبة والتسجيل وتوثيق بيانات العمليات."
  },
  {
    id: "p33",
    slug: "insulation-testers",
    categoryId: "cat-5",
    nameEn: "Insulation Testers",
    nameAr: "أجهزة اختبار العزل",
    descriptionEn: "Test instruments for evaluating electrical insulation resistance.",
    descriptionAr: "أجهزة اختبار لتقييم مقاومة العزل الكهربائي."
  },
  {
    id: "p34",
    slug: "rotary-switches",
    categoryId: "cat-5",
    nameEn: "Rotary Switches",
    nameAr: "مفاتيح دوارة",
    descriptionEn: "Multi-position electrical switches for selection, control, and measurement circuits.",
    descriptionAr: "مفاتيح كهربائية متعددة المواضع لدوائر الاختيار والتحكم والقياس."
  },

  // Shelters
  {
    id: "p35",
    slug: "telecom-shelter",
    categoryId: "cat-6",
    nameEn: "Telecommunication Shelter",
    nameAr: "غرف الاتصالات",
    descriptionEn: "Purpose-built shelter solutions for telecommunications equipment and supporting electrical systems.",
    descriptionAr: "حلول غرف مصممة خصيصًا لمعدات الاتصالات والأنظمة الكهربائية الداعمة."
  },
  {
    id: "p36",
    slug: "lcc-container",
    categoryId: "cat-6",
    nameEn: "LCC Container",
    nameAr: "حاوية تحكم محلية",
    descriptionEn: "Containerized electrical and control solutions designed around project-specific equipment requirements.",
    descriptionAr: "حلول كهربائية وتحكم في حاويات مصممة حسب متطلبات المعدات الخاصة بالمشروع."
  },
  {
    id: "p37",
    slug: "electrical-house",
    categoryId: "cat-6",
    nameEn: "Electrical House",
    nameAr: "غرف كهربائية جاهزة",
    descriptionEn: "Prefabricated electrical-house solutions for housing switchgear, control panels, power systems, and related equipment.",
    descriptionAr: "حلول الغرف الكهربائية الجاهزة لإيواء معدات التبديل ولوحات التحكم وأنظمة الطاقة."
  },

  // Racks
  {
    id: "p38",
    slug: "data-centre-cabinets",
    categoryId: "cat-7",
    nameEn: "Data Centre Cabinets",
    nameAr: "كبائن مراكز البيانات",
    descriptionEn: "Cabinet solutions for organizing, protecting, and managing data-centre and network equipment.",
    descriptionAr: "حلول كبائن لتنظيم وحماية وإدارة معدات مراكز البيانات والشبكات."
  },
  {
    id: "p39",
    slug: "battery-cabinets",
    categoryId: "cat-7",
    nameEn: "Battery Cabinets",
    nameAr: "كبائن البطاريات",
    descriptionEn: "Dedicated cabinets for organizing and protecting battery systems and their connections.",
    descriptionAr: "كبائن مخصصة لتنظيم وحماية أنظمة البطاريات وتوصيلاتها."
  },
  {
    id: "p40",
    slug: "battery-racks",
    categoryId: "cat-7",
    nameEn: "Battery Racks",
    nameAr: "رفوف البطاريات",
    descriptionEn: "Structural rack systems designed to support and organize stationary battery installations.",
    descriptionAr: "أنظمة رفوف هيكلية مصممة لدعم وتنظيم تركيبات البطاريات الثابتة."
  },

  // Fire
  {
    id: "p41",
    slug: "fire-alarm-systems",
    categoryId: "cat-8",
    nameEn: "Fire Alarm Systems",
    nameAr: "أنظمة إنذار الحريق",
    descriptionEn: "Detection, notification, and alarm-system solutions for commercial, industrial, and infrastructure applications.",
    descriptionAr: "حلول أنظمة الكشف والإشعار والإنذار للتطبيقات التجارية والصناعية."
  },
  {
    id: "p42",
    slug: "firefighting-systems",
    categoryId: "cat-8",
    nameEn: "Firefighting Systems",
    nameAr: "أنظمة مكافحة الحريق",
    descriptionEn: "Fire-protection and firefighting system solutions configured according to project requirements.",
    descriptionAr: "حلول أنظمة الحماية ومكافحة الحرائق مهيأة وفقاً لمتطلبات المشروع."
  },
  {
    id: "p43",
    slug: "fire-extinguishers",
    categoryId: "cat-8",
    nameEn: "Fire Extinguishers",
    nameAr: "طفايات حريق",
    descriptionEn: "Portable fire-extinguishing products for appropriate fire-risk applications.",
    descriptionAr: "منتجات إطفاء حريق محمولة لتطبيقات مخاطر الحريق المناسبة."
  },
  {
    id: "p44",
    slug: "led-obstruction-lights",
    categoryId: "cat-8",
    nameEn: "LED Obstruction Lights",
    nameAr: "مصابيح تحذير LED",
    descriptionEn: "LED warning and obstruction lighting for improving visibility of structures and hazards.",
    descriptionAr: "إضاءة تحذير وعوائق LED لتحسين رؤية الهياكل والمخاطر."
  }
];
