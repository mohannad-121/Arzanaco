import metadata from '../../../../Engineering Design & Calculations photos/image-metadata.json';
import s1 from '@engineering/structural/01-steel-truss-framework.jpg';
import s2 from '@engineering/structural/02-steel-building-frame.jpg';
import s3 from '@engineering/structural/03-commercial-building.jpg';
import s4 from '@engineering/structural/04-concrete-frame-construction.jpg';
import h1 from '@engineering/hvac/01-commercial-ductwork.jpg';
import h2 from '@engineering/hvac/02-ventilation-louvre.jpg';
import h3 from '@engineering/hvac/HVACNEW.png';
import h4 from '@engineering/hvac/04-ceiling-air-distribution.jpg';
import f1 from '@engineering/foundations/01-foundation-excavation.jpg';
import f2 from '@engineering/foundations/02-reinforcement-mat.jpg';
import f3 from '@engineering/foundations/03-raft-foundation-construction.jpg';
import f4 from '@engineering/foundations/04-concrete-foundation-placement.jpg';
import l1 from '@engineering/lighting/01-office-lighting.jpg';
import l2 from '@engineering/lighting/02-warehouse-lighting.jpg';
import l3 from '@engineering/lighting/03-exterior-wall-lighting.jpg';
import l4 from '@engineering/lighting/04-architectural-lighting.jpg';
import type { EngineeringServiceId } from '@workspace/arzana-catalog/engineering';

// Match the authoritative file field, not the stock-photo candidate IDs or JSON order.
const sources: Record<string, string> = {
  'structural/01-steel-truss-framework.jpg': s1,
  'structural/02-steel-building-frame.jpg': s2,
  'structural/03-commercial-building.jpg': s3,
  'structural/04-concrete-frame-construction.jpg': s4,
  'hvac/01-commercial-ductwork.jpg': h1,
  'hvac/02-ventilation-louvre.jpg': h2,
  'hvac/03-air-conditioning-unit.jpg': h3,
  'hvac/04-ceiling-air-distribution.jpg': h4,
  'foundations/01-foundation-excavation.jpg': f1,
  'foundations/02-reinforcement-mat.jpg': f2,
  'foundations/03-raft-foundation-construction.jpg': f3,
  'foundations/04-concrete-foundation-placement.jpg': f4,
  'lighting/01-office-lighting.jpg': l1,
  'lighting/02-warehouse-lighting.jpg': l2,
  'lighting/03-exterior-wall-lighting.jpg': l3,
  'lighting/04-architectural-lighting.jpg': l4,
};
const arabicAlts = [
  'عوارض فولاذية وعناصر جمالون كما تبدو من الأسفل.',
  'أعمدة فولاذية وهيكل سقف وطوابق أثناء الإنشاء.',
  'واجهة منحنية لمبنى تجاري بواجهات زجاجية.',
  'أعمدة خرسانية مسلحة وأعمال إنشاء الطوابق مع دعامات مؤقتة.',
  'قنوات تهوية معدنية دائرية كبيرة تخدم مبنى تجاريًا.',
  'منظر قريب لشبكة تهوية معدنية وجدار مبنى.',
  'وحدة تكييف خارجية مثبتة على جدار أسفل مظلة معدنية.',
  'قنوات تهوية مكشوفة في السقف وناشر هواء مربع.',
  'منظر جوي لحفريات أساسات مبنى ومواقع القواعد.',
  'عامل يثبت شبكة كثيفة من حديد التسليح قبل صب الخرسانة.',
  'حفريات أساسات كبيرة مع أعمال تسليح وصب خرسانة جارية.',
  'صب خرسانة طازجة في خندق أساسات.',
  'محطات عمل مكتبية مضاءة بألواح إنارة مدمجة في السقف.',
  'مستودع من الداخل بوحدات إنارة مرتفعة تضيء الأرضية.',
  'مصابيح كروية خارجية مثبتة على الجدار تضيء واجهة مبنى.',
  'مساحة ضيافة مغطاة بإضاءة معمارية دافئة خطية ومدمجة.',
];

const arabicAltsById = Object.fromEntries(Object.keys(sources).map((id, index) => [id, arabicAlts[index]]));
export type EngineeringImage = { file: string; src: string; alt: string; altAr: string; width: number; height: number };
export const engineeringImages = Object.fromEntries(
  (['structural', 'hvac', 'foundations', 'lighting'] as const).map(category => [category,
    metadata.flatMap(image => image.category === category ? [{
      file: image.file, src: sources[image.file], alt: image.alt_text,
      altAr: arabicAltsById[image.file], width: image.width, height: image.height,
    }] : []),
  ]),
) as Record<EngineeringServiceId, EngineeringImage[]>;
