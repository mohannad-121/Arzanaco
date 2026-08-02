import type { HTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CornerCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  tone?: 'light' | 'dark' | 'media';
  arrowLabel?: string;
}

/** Shared, directional card treatment inspired by the supplied Uiverse motion. */
export function CornerCard({ children, tone = 'light', arrowLabel, className, ...props }: CornerCardProps) {
  return (
    <article className={cn('corner-card', `corner-card--${tone}`, className)} {...props}>
      <span className="corner-card__corner" aria-hidden="true"><ArrowRight className="h-4 w-4 rtl:rotate-180" /></span>
      <div className="corner-card__content">{children}</div>
      {arrowLabel && <span className="sr-only">{arrowLabel}</span>}
    </article>
  );
}
