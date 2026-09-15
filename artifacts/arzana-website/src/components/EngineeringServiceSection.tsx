import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import type { EngineeringService } from '@workspace/arzana-catalog/engineering';
import { useLanguage } from '../contexts/LanguageContext';
import { engineeringImages } from '../data/engineering-images';
import { EngineeringImageGallery } from './EngineeringImageGallery';

export function EngineeringSoftwareBadge({ name }: { name: string }) {
  return <span className="engineering-software" dir="ltr"><span aria-hidden="true" />{name}</span>;
}

export function EngineeringServiceSection({ service }: { service: EngineeringService }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const reduced = useReducedMotion();
  const title = ar ? service.titleAr : service.title;
  const lighting = service.id === 'lighting';

  return (
    <section id={service.id} className={`engineering-service engineering-service--${service.id}`} aria-labelledby={`${service.id}-title`}>
      <div className="site-container">
        <div className="engineering-service__index">
          <span dir="ltr">{service.number}</span><span>{ar ? service.categoryAr : service.category}</span>
          <ArrowUpRight size={20} className="ms-auto rtl:-rotate-90" aria-hidden="true" />
        </div>
        <motion.div
          className={`engineering-service__composition ${lighting ? 'engineering-service__composition--lighting' : ''}`}
          initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduced ? 0 : 0.3 }}
        >
          <div className="engineering-service__copy">
            <h2 id={`${service.id}-title`}>{title}</h2>
            <p className="engineering-service__description">{ar ? service.descriptionAr : service.description}</p>
            <div className="engineering-service__tools">
              <h3>{ar ? 'برامج الحساب والتصميم' : 'Calculation & design software'}</h3>
              <div className="flex flex-wrap gap-2">{service.software.map(name => <EngineeringSoftwareBadge key={name} name={name} />)}</div>
              <p>{ar ? service.softwareNoteAr : service.softwareNote}</p>
            </div>
            <div className="engineering-service__scope">
              <h3>{ar ? 'نطاق الخدمة' : 'Service scope'}</h3>
              <ul>{(ar ? service.capabilitiesAr : service.capabilities).map(item => <li key={item}><Check size={14} aria-hidden="true" /><span>{item}</span></li>)}</ul>
            </div>
          </div>
          <EngineeringImageGallery images={engineeringImages[service.id]} title={title} layout={lighting ? 'lighting' : service.id === 'hvac' ? 'grid' : 'featured'} />
        </motion.div>
      </div>
    </section>
  );
}
