import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { useLanguage } from '../contexts/LanguageContext';
import type { EngineeringImage } from '../data/engineering-images';

type Props = { images: EngineeringImage[]; title: string; layout: 'featured' | 'grid' | 'lighting' };

export function EngineeringImageGallery({ images, title, layout }: Props) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [selected, setSelected] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const current = selected === null ? null : images[selected];
  const move = (step: number) => setSelected(index => index === null ? null : (index + step + images.length) % images.length);

  return (
    <>
      <div className={`engineering-gallery engineering-gallery--${layout}`} aria-label={title}>
        {images.map((image, index) => (
          <button
            key={image.file} type="button" className="engineering-photo"
            aria-label={`${ar ? 'عرض الصورة' : 'View image'}: ${ar ? image.altAr : image.alt}`}
            onClick={event => { trigger.current = event.currentTarget; setSelected(index); }}
          >
            <img src={image.src} alt={ar ? image.altAr : image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
            <span className="engineering-photo__expand" aria-hidden="true"><Expand size={16} /></span>
            <span className="engineering-photo__number" aria-hidden="true" dir="ltr">{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent
          className="engineering-lightbox z-[90] max-h-[92dvh] max-w-[min(92vw,78rem)] border-white/20 bg-[var(--arzana-charcoal)] p-4 text-white sm:rounded-none md:p-7"
          overlayClassName="z-[89]"
          closeLabel={ar ? 'إغلاق معرض الصور' : 'Close gallery'}
          closeClassName="right-2 top-2 grid h-11 w-11 place-items-center"
          onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus({ preventScroll: true }); }}
          onKeyDown={event => {
            if (event.key === 'ArrowRight') { event.preventDefault(); move(ar ? -1 : 1); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); move(ar ? 1 : -1); }
          }}
        >
          <DialogTitle className="pe-10 text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="sr-only">{ar ? 'صور توضيحية للخدمة الهندسية. استخدم أزرار السابق والتالي أو مفاتيح الأسهم للتنقل، ومفتاح Escape للإغلاق.' : 'Engineering service illustrations. Use previous and next buttons or arrow keys to navigate; Escape closes the gallery.'}</DialogDescription>
          {current && <img className="max-h-[68dvh] w-full object-contain" src={current.src} alt={ar ? current.altAr : current.alt} width={current.width} height={current.height} />}
          <div className="flex items-center gap-3">
            <button type="button" className="engineering-lightbox__control" onClick={() => move(-1)} aria-label={ar ? 'الصورة السابقة' : 'Previous image'}><ChevronLeft size={20} className="rtl:rotate-180" /></button>
            <div className="min-w-0 flex-1 text-center" aria-live="polite" aria-atomic="true">
              <p className="text-xs tabular-nums text-white/65" dir="ltr">{(selected ?? 0) + 1} / {images.length}</p>
              <p className="mt-1 text-sm leading-relaxed">{current && (ar ? current.altAr : current.alt)}</p>
            </div>
            <button type="button" className="engineering-lightbox__control" onClick={() => move(1)} aria-label={ar ? 'الصورة التالية' : 'Next image'}><ChevronRight size={20} className="rtl:rotate-180" /></button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
