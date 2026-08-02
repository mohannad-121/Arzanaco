import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

type RequestQuoteButtonProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  label?: string;
};

const sizes = {
  sm: 'min-h-11 px-4 text-xs ring-[3px]',
  md: 'min-h-12 px-5 text-sm ring-4',
  lg: 'min-h-14 px-6 text-base ring-[5px]',
};

export function RequestQuoteButton({
  size = 'md',
  className,
  onClick,
  href = '/request-quote',
  label,
}: RequestQuoteButtonProps) {
  const { language } = useLanguage();
  return <Link href={href} onClick={onClick} className={cn('group inline-flex items-center justify-center gap-2 rounded-full bg-[#9f183d] font-bold text-white shadow-[0_7px_18px_rgba(111,16,45,.22)] ring-[#ead0d9] transition duration-300 hover:bg-[#b51d49] hover:shadow-[0_10px_24px_rgba(111,16,45,.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6f102d]', sizes[size], className)}>{label ?? (language === 'ar' ? 'طلب عرض سعر' : 'Request a Quote')}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" /></Link>;
}
