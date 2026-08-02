import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../lib/utils';

export type PhoneCountry = {
  iso: string;
  dialCode: string;
  nameEn: string;
  nameAr: string;
};

export const phoneCountries: readonly PhoneCountry[] = [
  { iso: 'SA', dialCode: '+966', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية' },
  { iso: 'JO', dialCode: '+962', nameEn: 'Jordan', nameAr: 'الأردن' },
  { iso: 'AE', dialCode: '+971', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة' },
  { iso: 'DZ', dialCode: '+213', nameEn: 'Algeria', nameAr: 'الجزائر' },
  { iso: 'BH', dialCode: '+973', nameEn: 'Bahrain', nameAr: 'البحرين' },
  { iso: 'KM', dialCode: '+269', nameEn: 'Comoros', nameAr: 'جزر القمر' },
  { iso: 'DJ', dialCode: '+253', nameEn: 'Djibouti', nameAr: 'جيبوتي' },
  { iso: 'EG', dialCode: '+20', nameEn: 'Egypt', nameAr: 'مصر' },
  { iso: 'IQ', dialCode: '+964', nameEn: 'Iraq', nameAr: 'العراق' },
  { iso: 'KW', dialCode: '+965', nameEn: 'Kuwait', nameAr: 'الكويت' },
  { iso: 'LB', dialCode: '+961', nameEn: 'Lebanon', nameAr: 'لبنان' },
  { iso: 'LY', dialCode: '+218', nameEn: 'Libya', nameAr: 'ليبيا' },
  { iso: 'MR', dialCode: '+222', nameEn: 'Mauritania', nameAr: 'موريتانيا' },
  { iso: 'MA', dialCode: '+212', nameEn: 'Morocco', nameAr: 'المغرب' },
  { iso: 'OM', dialCode: '+968', nameEn: 'Oman', nameAr: 'عُمان' },
  { iso: 'PS', dialCode: '+970', nameEn: 'Palestine', nameAr: 'فلسطين' },
  { iso: 'QA', dialCode: '+974', nameEn: 'Qatar', nameAr: 'قطر' },
  { iso: 'SO', dialCode: '+252', nameEn: 'Somalia', nameAr: 'الصومال' },
  { iso: 'SD', dialCode: '+249', nameEn: 'Sudan', nameAr: 'السودان' },
  { iso: 'SY', dialCode: '+963', nameEn: 'Syria', nameAr: 'سوريا' },
  { iso: 'TN', dialCode: '+216', nameEn: 'Tunisia', nameAr: 'تونس' },
  { iso: 'YE', dialCode: '+967', nameEn: 'Yemen', nameAr: 'اليمن' },
  { iso: 'US', dialCode: '+1', nameEn: 'United States', nameAr: 'الولايات المتحدة' },
  { iso: 'GB', dialCode: '+44', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة' },
  { iso: 'FR', dialCode: '+33', nameEn: 'France', nameAr: 'فرنسا' },
  { iso: 'DE', dialCode: '+49', nameEn: 'Germany', nameAr: 'ألمانيا' },
  { iso: 'IT', dialCode: '+39', nameEn: 'Italy', nameAr: 'إيطاليا' },
  { iso: 'ES', dialCode: '+34', nameEn: 'Spain', nameAr: 'إسبانيا' },
  { iso: 'NL', dialCode: '+31', nameEn: 'Netherlands', nameAr: 'هولندا' },
  { iso: 'BE', dialCode: '+32', nameEn: 'Belgium', nameAr: 'بلجيكا' },
  { iso: 'SE', dialCode: '+46', nameEn: 'Sweden', nameAr: 'السويد' },
  { iso: 'NO', dialCode: '+47', nameEn: 'Norway', nameAr: 'النرويج' },
  { iso: 'DK', dialCode: '+45', nameEn: 'Denmark', nameAr: 'الدنمارك' },
  { iso: 'CH', dialCode: '+41', nameEn: 'Switzerland', nameAr: 'سويسرا' },
  { iso: 'AT', dialCode: '+43', nameEn: 'Austria', nameAr: 'النمسا' },
  { iso: 'IE', dialCode: '+353', nameEn: 'Ireland', nameAr: 'أيرلندا' },
  { iso: 'PT', dialCode: '+351', nameEn: 'Portugal', nameAr: 'البرتغال' },
  { iso: 'GR', dialCode: '+30', nameEn: 'Greece', nameAr: 'اليونان' },
  { iso: 'PL', dialCode: '+48', nameEn: 'Poland', nameAr: 'بولندا' },
  { iso: 'CZ', dialCode: '+420', nameEn: 'Czech Republic', nameAr: 'التشيك' },
  { iso: 'RO', dialCode: '+40', nameEn: 'Romania', nameAr: 'رومانيا' },
  { iso: 'HU', dialCode: '+36', nameEn: 'Hungary', nameAr: 'المجر' },
];

export const DEFAULT_PHONE_COUNTRY = phoneCountries[0];

const countriesByLongestCode = [...phoneCountries].sort(
  (left, right) => right.dialCode.length - left.dialCode.length,
);

export function normalizeInternationalPhone(value: string, country: PhoneCountry): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  let digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+')) {
    const enteredCountry = countriesByLongestCode.find((candidate) =>
      digits.startsWith(candidate.dialCode.slice(1)),
    );
    if (enteredCountry) digits = digits.slice(enteredCountry.dialCode.length - 1);
  }

  const localNumber = digits.replace(/^0+/, '');
  return localNumber ? `${country.dialCode}${localNumber}` : '';
}

export function isValidInternationalPhone(value: string): boolean {
  return /^\+\d{7,15}$/.test(value);
}

type ArzanaPhoneInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  selectedCountry: PhoneCountry;
  onCountryChange: (country: PhoneCountry) => void;
  placeholder: string;
  language: 'en' | 'ar';
  error?: boolean;
  disabled?: boolean;
  describedBy?: string;
};

export function ArzanaPhoneInput({
  id,
  name,
  value,
  onChange,
  selectedCountry,
  onCountryChange,
  placeholder,
  language,
  error = false,
  disabled = false,
  describedBy,
}: ArzanaPhoneInputProps) {
  const isArabic = language === 'ar';
  const countryLabel = isArabic ? 'رمز الدولة' : 'Country code';

  return (
    <div className={cn('quote-phone-field', error && 'quote-phone-field--error')} dir={isArabic ? 'rtl' : 'ltr'}>
      <Select
        value={selectedCountry.iso}
        onValueChange={(iso) => {
          const country = phoneCountries.find((item) => item.iso === iso);
          if (country) onCountryChange(country);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          className="quote-phone-country"
          aria-label={`${countryLabel}: ${isArabic ? selectedCountry.nameAr : selectedCountry.nameEn}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[100] max-h-80 min-w-[min(22rem,calc(100vw-2rem))] border-white/20 bg-[#202124] text-white">
          {phoneCountries.map((country) => (
            <SelectItem
              key={country.iso}
              value={country.iso}
              aria-label={isArabic ? country.nameAr : country.nameEn}
              className="py-2.5 text-white focus:bg-[#9f183d]/30 focus:text-white"
            >
              <span dir="ltr">{country.iso} {country.dialCode}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={32}
        dir="ltr"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9+().\-\s]/g, ''))}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error}
        aria-describedby={describedBy}
        className="quote-phone-local-input"
      />
    </div>
  );
}
