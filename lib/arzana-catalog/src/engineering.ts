/** Approved public service content transcribed from Descriptions.pdf (one page).
 * Services are deliberately separate from the product catalog and quote allow-list.
 */
export const engineeringPage = {
  route: '/engineering-design-calculations',
  canonical: 'https://www.arzanaco.com/engineering-design-calculations',
  title: 'Engineering Design & Calculations',
  titleAr: 'التصميم والحسابات الهندسية',
  introduction: 'Engineering calculations and design support for buildings, industrial facilities, equipment shelters and infrastructure projects.',
  introductionAr: 'حسابات هندسية ودعم في التصميم للمباني والمنشآت الصناعية وملاجئ المعدات ومشاريع البنية التحتية.',
  seoDescription: 'Arzana Arabia provides structural analysis, HVAC load calculations, foundation and anchorage design, and lighting calculations for buildings, industrial facilities and infrastructure projects.',
  seoDescriptionAr: 'تقدم أرزانا العربية خدمات التحليل الإنشائي وحسابات أحمال التكييف وتصميم الأساسات وأنظمة التثبيت وحسابات الإضاءة للمباني والمنشآت الصناعية ومشاريع البنية التحتية.',
} as const;

export const engineeringServices = [
  {
    id: 'structural', number: '01', shortTitle: 'Structural', shortTitleAr: 'الإنشاءات',
    title: 'Structural Analysis & Design', titleAr: 'التحليل والتصميم الإنشائي',
    category: 'Structural Engineering', categoryAr: 'الهندسة الإنشائية',
    software: ['SAP2000', 'STAAD.Pro'],
    softwareNote: 'SAP2000 or STAAD.Pro', softwareNoteAr: 'SAP2000 أو STAAD.Pro',
    description: 'We provide structural analysis and design for steel and reinforced concrete structures, including buildings, shelters, equipment supports and platforms. Our services cover gravity, wind and seismic load calculations, strength and deflection checks, and calculation reports supporting fabrication and construction.',
    descriptionAr: 'نقدم خدمات التحليل والتصميم الإنشائي للمنشآت الفولاذية والخرسانية المسلحة، بما يشمل المباني والملاجئ ودعامات المعدات والمنصات. تشمل خدماتنا حسابات أحمال الجاذبية والرياح والزلازل، والتحقق من المقاومة والترخيم، وإعداد تقارير الحسابات الداعمة لأعمال التصنيع والإنشاء.',
    capabilities: ['Gravity load calculations', 'Wind load calculations', 'Seismic load calculations', 'Strength checks', 'Deflection checks', 'Calculation reports'],
    capabilitiesAr: ['حسابات أحمال الجاذبية', 'حسابات أحمال الرياح', 'حسابات الأحمال الزلزالية', 'التحقق من المقاومة', 'التحقق من الترخيم', 'تقارير الحسابات'],
  },
  {
    id: 'hvac', number: '02', shortTitle: 'HVAC', shortTitleAr: 'التكييف',
    title: 'HVAC Load Calculations & Equipment Sizing', titleAr: 'حسابات أحمال التكييف وتحديد سعات المعدات',
    category: 'Mechanical Engineering', categoryAr: 'الهندسة الميكانيكية',
    software: ['Carrier HAP', 'Elite CHVAC'],
    softwareNote: 'Carrier HAP or Elite CHVAC', softwareNoteAr: 'Carrier HAP أو Elite CHVAC',
    description: 'We calculate cooling and heating loads for commercial buildings, industrial facilities, electrical rooms and equipment shelters. Our studies consider local climate, building materials, occupancy, ventilation and equipment heat gains to determine required cooling capacity and airflow, with reports supporting equipment selection.',
    descriptionAr: 'نحسب أحمال التبريد والتدفئة للمباني التجارية والمنشآت الصناعية والغرف الكهربائية وملاجئ المعدات. تراعي دراساتنا المناخ المحلي ومواد البناء والإشغال والتهوية والمكاسب الحرارية للمعدات، لتحديد سعة التبريد ومعدل تدفق الهواء المطلوبين، مع إعداد تقارير تدعم اختيار المعدات.',
    capabilities: ['Cooling load calculations', 'Heating load calculations', 'Ventilation', 'Equipment heat gains', 'Required cooling capacity', 'Airflow calculations'],
    capabilitiesAr: ['حسابات أحمال التبريد', 'حسابات أحمال التدفئة', 'التهوية', 'المكاسب الحرارية للمعدات', 'سعة التبريد المطلوبة', 'حسابات تدفق الهواء'],
  },
  {
    id: 'foundations', number: '03', shortTitle: 'Foundation', shortTitleAr: 'الأساسات',
    title: 'Foundation & Anchorage Design', titleAr: 'تصميم الأساسات وأنظمة التثبيت',
    category: 'Civil & Structural Engineering', categoryAr: 'الهندسة المدنية والإنشائية',
    software: ['SAFE', 'IDEA StatiCa'],
    softwareNote: 'SAFE, with IDEA StatiCa for applicable connection and anchorage checks',
    softwareNoteAr: 'SAFE، مع IDEA StatiCa للتحقق من الوصلات وأنظمة التثبيت حيث ينطبق ذلك',
    description: 'We design reinforced concrete foundations for buildings, steel structures and equipment supports. Our calculations use structural reactions and geotechnical inputs to assess bearing pressure, strength and reinforcement requirements, with supporting base plate, anchorage and local concrete checks where applicable.',
    descriptionAr: 'نصمم الأساسات الخرسانية المسلحة للمباني والمنشآت الفولاذية ودعامات المعدات. تعتمد حساباتنا على ردود الأفعال الإنشائية والمعطيات الجيوتقنية لتقييم ضغط التحمل والمقاومة ومتطلبات التسليح، مع إجراء فحوصات صفائح القواعد وأنظمة التثبيت والمقاومة الموضعية للخرسانة حيث ينطبق ذلك.',
    capabilities: ['Bearing pressure', 'Strength checks', 'Reinforcement requirements', 'Base plate checks where applicable', 'Anchorage checks where applicable', 'Local concrete checks where applicable'],
    capabilitiesAr: ['ضغط التحمل', 'التحقق من المقاومة', 'متطلبات التسليح', 'فحوصات صفائح القواعد حيث تنطبق', 'فحوصات أنظمة التثبيت حيث تنطبق', 'فحوصات الخرسانة الموضعية حيث تنطبق'],
  },
  {
    id: 'lighting', number: '04', shortTitle: 'Lighting', shortTitleAr: 'الإضاءة',
    title: 'Lighting Calculations & Design', titleAr: 'حسابات وتصميم الإضاءة',
    category: 'Electrical & Lighting Engineering', categoryAr: 'الهندسة الكهربائية وتصميم الإضاءة',
    software: ['DIALux evo', 'AGi32'],
    softwareNote: 'DIALux evo or AGi32', softwareNoteAr: 'DIALux evo أو AGi32',
    description: 'We provide indoor and outdoor lighting design for commercial buildings, industrial facilities, warehouses, streets and parking areas. Using DIALux evo or AGi32, we calculate illuminance (lux), uniformity and glare, optimize luminaire layouts, and prepare photometric reports, lighting schedules and 3D visualizations to support equipment selection and project review.',
    descriptionAr: 'نقدم خدمات تصميم الإضاءة الداخلية والخارجية للمباني التجارية والمنشآت الصناعية والمستودعات والشوارع ومواقف السيارات. باستخدام DIALux evo أو AGi32، نحسب الاستضاءة (لوكس) وانتظام توزيع الإضاءة والوهج، ونحسّن توزيع وحدات الإنارة، ونعد التقارير الفوتومترية وجداول الإنارة والتصورات ثلاثية الأبعاد لدعم اختيار المعدات ومراجعة المشروع.',
    capabilities: ['Illuminance (lux)', 'Uniformity', 'Glare', 'Luminaire layout optimization', 'Photometric reports', 'Lighting schedules', '3D visualizations'],
    capabilitiesAr: ['الاستضاءة (لوكس)', 'انتظام توزيع الإضاءة', 'الوهج', 'تحسين توزيع وحدات الإنارة', 'التقارير الفوتومترية', 'جداول الإنارة', 'تصورات ثلاثية الأبعاد'],
  },
] as const;

export type EngineeringService = (typeof engineeringServices)[number];
export type EngineeringServiceId = EngineeringService['id'];

/** Public assistant knowledge uses the same approved descriptions as the page. */
export function engineeringAnswer(question: string, language: 'en' | 'ar'): string | null {
  const query = question.toLowerCase().normalize('NFKC').replace(/[\u064b-\u065f\u0670]/g, '').replace(/[أإآ]/g, 'ا');
  const matches = [
    /\b(structural|sap2000|staad(?:\.pro)?|wind|seismic|deflection|steel design)\b|انشا[ئي]|رياح|زلزال|زلازل|زلزالي|ترخيم/,
    /\b(hvac|hap|chvac|cooling|heating|airflow|ventilation|equipment sizing)\b|تكييف|تبريد|تدفئة|تدفق الهواء|تهوية|سعات المعدات/,
    /\b(foundations?|anchorage|anchor|safe software|what is safe used for|idea statica|base plates?|bearing pressure|geotechnical)\b|اساسات|الاساس|تثبيت|صفائح القواعد|جيوتقني/,
    /\b(lighting|lux|dialux|agi32|illuminance|photometric|luminaires?|glare)\b|اضاءة|الانارة|لوكس|استضاءة|وهج|فوتومتري/,
  ];
  const selected = engineeringServices.filter((_, index) => matches[index].test(query));
  const general = /engineering (?:design|services?|calculations)|design (?:and|&) calculations|خدمات.*هندس|تصميم.*هندس|حسابات.*هندس/.test(query);
  if (!general && selected.length === 0) return null;
  const ar = language === 'ar';
  if (/\b(pric\w*|cost\w*|fees?|turnaround|certif\w*|licen[cs]\w*|guarantee\w*|partnership\w*|completed|previous|past projects|code compliance)\b|اسعار|تكلفة|مدة|شهادات|ترخيص|مرخص|ضمان|شراكة|مشاريع سابقة|مشاريع منجزة|مطابقة.*كود/.test(query)) {
    return ar
      ? 'تصف معلومات أرزانا المعتمدة نطاق الخدمات الهندسية والبرامج المستخدمة، ولا تحدد أسعارًا أو مدة تنفيذ أو شهادات أو تراخيص أو ضمانات أو مشاريع منجزة أو شراكات مع موردي البرامج. أرسل مخططاتك ومتطلبات المشروع لطلب عرض سعر وتأكيد التفاصيل.'
      : 'Arzana’s approved information describes the engineering services and software, but does not specify prices, turnaround times, certifications, licenses, guarantees, completed projects or software partnerships. Send your drawings and project requirements to request a quotation and confirm the details.';
  }
  if (selected.length > 0) return selected.map(service => `${ar ? service.titleAr : service.title}\n${ar ? service.descriptionAr : service.description}\n${ar ? 'البرامج المستخدمة' : 'Software'}: ${ar ? service.softwareNoteAr : service.softwareNote}.`).join('\n\n');
  return `${ar ? engineeringPage.titleAr : engineeringPage.title}\n${engineeringServices.map(service => `${ar ? service.titleAr : service.title} — ${ar ? service.softwareNoteAr : service.softwareNote}`).join('\n')}\n\n${ar ? 'أرسل مخططاتك ومتطلبات المشروع لطلب عرض سعر.' : 'Send your drawings and project requirements to request a quotation.'}`;
}
