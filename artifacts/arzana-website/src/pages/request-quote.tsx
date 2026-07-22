import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { useLanguage } from '../contexts/LanguageContext';
import { useCatalog } from '../contexts/CatalogContext';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PHONE_ALLOWED_PATTERN = /^[0-9+().\-\s]+$/;

type QuoteFormData = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  productIds: string[];
  website: string;
};

type QuoteField = Exclude<keyof QuoteFormData, 'website'>;
type QuoteErrors = Partial<Record<QuoteField, string>>;

type QuoteSuccess = {
  quoteId: string;
  productNames: string[];
  whatsappUrl: string;
  emailStatus: 'sent' | 'failed' | 'configuration_error';
};

const initialFormData: QuoteFormData = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  productIds: [],
  website: '',
};

export default function RequestQuote() {
  const { language } = useLanguage();
  const { categories, products } = useCatalog();
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<QuoteSuccess | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popupRef = useRef<Window | null>(null);

  const copy =
    language === 'ar'
      ? {
          eyebrow: 'طلب عرض سعر',
          title: 'أخبرنا بالمنتجات التي تهمك',
          introduction: 'حدد المنتجات من قائمة الكتالوج وأضف بيانات الاتصال حتى نتمكن من إعداد طلبك.',
          fullName: 'الاسم الكامل',
          company: 'اسم الشركة أو المؤسسة',
          email: 'البريد الإلكتروني',
          phone: 'رقم الهاتف',
          products: 'المنتجات التي تهمك',
          required: 'مطلوب',
          selectProducts: 'اختر منتجاً واحداً على الأقل من كتالوج الشركة.',
          submit: 'إعداد طلب عرض السعر',
          sending: 'جارٍ الإرسال…',
          prepared: 'تم إعداد الطلب',
          reset: 'إعادة تعيين',
          tryAgain: 'إرسال طلب جديد',
          openWhatsApp: 'فتح واتساب',
          requiredError: 'هذا الحقل مطلوب.',
          emailError: 'أدخل عنوان بريد إلكتروني صالحاً.',
          phoneError: 'أدخل رقم هاتف صالحاً.',
          productsError: 'اختر منتجاً واحداً على الأقل من الكتالوج.',
          genericError: 'تعذر إرسال طلب عرض السعر. بياناتك ما زالت موجودة؛ يرجى المحاولة مرة أخرى.',
          successTitle: 'تم إرسال طلبك عبر البريد الإلكتروني',
          successDescription:
            'تم إرسال تفاصيل الطلب إلى أرزانا. تم تجهيز رسالة واتساب أيضاً؛ اضغط إرسال داخل واتساب لإكمال الإرسال عبر واتساب.',
          preparedProducts: 'المنتجات المجهزة للطلب:',
        }
      : {
          eyebrow: 'Request a Quote',
          title: 'Tell us which products interest you',
          introduction: 'Select products from the company catalog and add your contact details to prepare your request.',
          fullName: 'Full Name',
          company: 'Company or Business Name',
          email: 'Email Address',
          phone: 'Phone Number',
          products: 'Products You Are Interested In',
          required: 'Required',
          selectProducts: 'Select at least one product from the company catalog.',
          submit: 'Prepare Quote',
          sending: 'Sending…',
          prepared: 'Quote Prepared',
          reset: 'Reset',
          tryAgain: 'Try Again',
          openWhatsApp: 'Open WhatsApp',
          requiredError: 'This field is required.',
          emailError: 'Enter a valid email address.',
          phoneError: 'Enter a valid phone number.',
          productsError: 'Select at least one catalog product.',
          genericError:
            'We could not submit your quote request. Your details are still here—please try again.',
          successTitle: 'Your quote request was emailed to Arzana',
          successDescription:
            'Your email request was delivered. A WhatsApp message is also prepared; press Send inside WhatsApp to complete the WhatsApp submission.',
          preparedProducts: 'Products included in the request:',
        };

  const quoteErrorCopy =
    language === 'ar'
      ? {
          generic: 'تعذر إرسال طلب عرض السعر. بياناتك ما زالت موجودة؛ يرجى المحاولة مرة أخرى.',
          serviceUnavailable: 'خدمة طلب عرض السعر غير متاحة مؤقتاً. يرجى التواصل مع أرزانا مباشرة عبر واتساب.',
          emailDelivery: 'تعذر إرسال طلب عرض السعر عبر البريد الإلكتروني. تم الاحتفاظ ببياناتك؛ يرجى المحاولة مرة أخرى أو المتابعة عبر واتساب.',
          rateLimited: 'تم إجراء محاولات كثيرة. يرجى الانتظار قليلاً ثم المحاولة مجدداً.',
          validation: 'يرجى مراجعة الحقول المميزة.',
          network: 'تعذر الاتصال بخدمة طلب عرض السعر. يرجى التحقق من اتصالك بالإنترنت ثم المحاولة مرة أخرى.',
        }
      : {
          generic: 'We could not submit your quote request. Your details are still here—please try again.',
          serviceUnavailable: 'The quote service is temporarily unavailable. Please contact Arzana directly through WhatsApp.',
          emailDelivery: 'We could not deliver your quote by email. Your information has been preserved. Please try again or continue through WhatsApp.',
          rateLimited: 'Too many attempts were made. Please wait a moment and try again.',
          validation: 'Please review the highlighted fields.',
          network: 'We could not connect to the quote service. Please check your connection and try again.',
        };

  const validate = () => {
    const nextErrors: QuoteErrors = {};
    const selectedProducts = formData.productIds.map((productId) =>
      products.find((product) => product.id === productId),
    );

    if (!formData.fullName.trim()) nextErrors.fullName = copy.requiredError;
    if (!formData.companyName.trim()) nextErrors.companyName = copy.requiredError;
    if (!formData.email.trim()) {
      nextErrors.email = copy.requiredError;
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = copy.emailError;
    }
    if (!isValidPhone(formData.phone)) nextErrors.phone = formData.phone.trim() ? copy.phoneError : copy.requiredError;
    if (
      formData.productIds.length === 0 ||
      selectedProducts.some((product) => !product) ||
      new Set(formData.productIds).size !== formData.productIds.length
    ) {
      nextErrors.productIds = copy.productsError;
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || success) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmissionError(null);

    if (Object.keys(nextErrors).length > 0) {
      setSuccess(null);
      return;
    }

    // This blank tab is opened synchronously from the customer action. It is redirected
    // to WhatsApp only after the API confirms that the email was delivered.
    const popup = window.open('about:blank', '_blank');
    if (popup) popup.opener = null;
    popupRef.current = popup;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          companyName: formData.companyName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          productIds: formData.productIds,
          language,
          website: formData.website,
        }),
      });
      const result = await readQuoteResponse(response);

      if (!response.ok || !isSuccessfulQuote(result)) {
        if (popup && !popup.closed) popup.close();
        popupRef.current = null;
        const apiFieldErrors = getApiValidationErrors(result, copy);
        if (Object.keys(apiFieldErrors).length > 0) {
          setErrors((current) => ({ ...current, ...apiFieldErrors }));
        }
        if (import.meta.env.DEV) {
          console.warn('[quote] submission rejected', {
            status: response.status,
            code: getApiErrorCode(result),
          });
        }
        setSubmissionError(getSubmissionError(result, response.status, quoteErrorCopy));
        return;
      }

      setSuccess({
        quoteId: result.quoteId,
        productNames: result.productNames,
        whatsappUrl: result.whatsappUrl,
        emailStatus: result.emailStatus,
      });
      if (popup && !popup.closed) {
        popup.location.replace(result.whatsappUrl);
        popup.focus();
      }
      popupRef.current = null;
    } catch (error) {
      if (popup && !popup.closed) popup.close();
      popupRef.current = null;
      if (import.meta.env.DEV) {
        console.warn('[quote] network request failed', { name: error instanceof Error ? error.name : 'unknown' });
      }
      setSubmissionError(quoteErrorCopy.network);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: Exclude<QuoteField, 'productIds'>, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionError(null);
    setSuccess(null);
  };

  const toggleProduct = (productId: string) => {
    setFormData((current) => ({
      ...current,
      productIds: current.productIds.includes(productId)
        ? current.productIds.filter((selectedId) => selectedId !== productId)
        : [...current.productIds, productId],
    }));
    setErrors((current) => ({ ...current, productIds: undefined }));
    setSubmissionError(null);
    setSuccess(null);
  };

  const resetForm = () => {
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    popupRef.current = null;
    setFormData(initialFormData);
    setErrors({});
    setSubmissionError(null);
    setSuccess(null);
  };

  return (
    <PageWrapper>
      <section className="border-b bg-muted py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            {copy.eyebrow}
          </p>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">{copy.title}</h1>
          <p className="text-lg leading-relaxed text-foreground/70">{copy.introduction}</p>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <form noValidate onSubmit={handleSubmit} className="relative rounded-2xl border bg-card p-6 shadow-sm md:p-10">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="quote-website">Website</label>
              <input
                id="quote-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                id="quote-full-name"
                label={copy.fullName}
                error={errors.fullName}
                requiredLabel={copy.required}
              >
                <Input
                  id="quote-full-name"
                  name="fullName"
                  autoComplete="name"
                  maxLength={160}
                  value={formData.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'quote-full-name-error' : undefined}
                />
              </FormField>

              <FormField
                id="quote-company"
                label={copy.company}
                error={errors.companyName}
                requiredLabel={copy.required}
              >
                <Input
                  id="quote-company"
                  name="companyName"
                  autoComplete="organization"
                  maxLength={160}
                  value={formData.companyName}
                  onChange={(event) => updateField('companyName', event.target.value)}
                  aria-invalid={Boolean(errors.companyName)}
                  aria-describedby={errors.companyName ? 'quote-company-error' : undefined}
                />
              </FormField>

              <FormField
                id="quote-email"
                label={copy.email}
                error={errors.email}
                requiredLabel={copy.required}
              >
                <Input
                  id="quote-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'quote-email-error' : undefined}
                />
              </FormField>

              <FormField
                id="quote-phone"
                label={copy.phone}
                error={errors.phone}
                requiredLabel={copy.required}
              >
                <Input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={32}
                  value={formData.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'quote-phone-error' : undefined}
                />
              </FormField>
            </div>

            <fieldset className="mt-8">
              <legend className="text-base font-semibold text-foreground">
                {copy.products} <span className="text-primary">*</span>
              </legend>
              <p className="mt-2 text-sm text-muted-foreground">{copy.selectProducts}</p>
              {errors.productIds && (
                <p id="quote-products-error" role="alert" className="mt-2 text-sm font-medium text-destructive">
                  {errors.productIds}
                </p>
              )}

              <div
                className="mt-5 space-y-6"
                aria-invalid={Boolean(errors.productIds)}
                aria-describedby={errors.productIds ? 'quote-products-error' : undefined}
              >
                {categories.map((category) => {
                  const categoryProducts = products.filter((product) => product.categoryId === category.id);
                  if (categoryProducts.length === 0) return null;

                  return (
                    <div key={category.id} className="rounded-xl border bg-background p-4 sm:p-5">
                      <h2 className="mb-4 text-sm font-semibold text-foreground">
                        {language === 'ar' ? category.nameAr : category.nameEn}
                      </h2>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {categoryProducts.map((product) => {
                          const isSelected = formData.productIds.includes(product.id);
                          const inputId = `quote-product-${product.id}`;

                          return (
                            <div
                              key={product.id}
                              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                                isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <Checkbox
                                id={inputId}
                                checked={isSelected}
                                onCheckedChange={() => toggleProduct(product.id)}
                                className="mt-0.5"
                              />
                              <label htmlFor={inputId} className="cursor-pointer text-sm font-medium leading-snug text-foreground">
                                {language === 'ar' ? product.nameAr : product.nameEn}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {submissionError && (
              <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive">
                {submissionError}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                {success ? copy.tryAgain : copy.reset}
              </Button>
              <Button type="submit" disabled={isSubmitting || Boolean(success)}>
                {isSubmitting ? copy.sending : success ? copy.prepared : copy.submit}
              </Button>
            </div>
          </form>

          {success && (
            <div role="status" className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
              <h2 className="font-semibold text-foreground">
                {success.emailStatus === 'sent'
                  ? copy.successTitle
                  : language === 'ar'
                    ? 'تم حفظ طلب عرض السعر'
                    : 'Your quote request was saved'}
              </h2>
              <p className="mt-2 leading-relaxed text-foreground/75">
                {success.emailStatus === 'sent'
                  ? copy.successDescription
                  : language === 'ar'
                    ? 'تم حفظ طلب عرض السعر وتجهيز رسالة واتساب. تعذر تأكيد تسليم البريد الإلكتروني، لذا يرجى إكمال الإرسال عبر واتساب.'
                    : 'Your quote request was saved and a WhatsApp message is ready. We could not confirm email delivery, so please complete the request through WhatsApp.'}
              </p>
              <p className="mt-3 text-xs font-medium text-foreground/65" dir="ltr">
                {language === 'ar' ? 'الرقم المرجعي: ' : 'Reference: '}{success.quoteId}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => window.open(success.whatsappUrl, '_blank', 'noopener,noreferrer')}
              >
                {copy.openWhatsApp}
              </Button>
              <p className="mt-4 font-medium text-foreground">{copy.preparedProducts}</p>
              <ul className="mt-2 list-disc space-y-1 ps-5 text-foreground/75">
                {success.productNames.map((productName) => (
                  <li key={productName}>{productName}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

function FormField({
  id,
  label,
  error,
  requiredLabel,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  requiredLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label} <span className="sr-only">{requiredLabel}</span><span aria-hidden="true" className="text-primary">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function isValidPhone(value: string): boolean {
  const phone = value.trim();
  if (!phone || !PHONE_ALLOWED_PATTERN.test(phone)) return false;
  const digitCount = phone.replace(/\D/g, '').length;
  return digitCount >= 7 && digitCount <= 15;
}

function isSuccessfulQuote(value: unknown): value is {
  success: true;
  quoteId: string;
  productNames: string[];
  whatsappUrl: string;
  emailStatus: 'sent' | 'failed' | 'configuration_error';
} {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as {
    success?: unknown;
    quoteId?: unknown;
    productNames?: unknown;
    whatsappUrl?: unknown;
    emailStatus?: unknown;
  };
  return (
    candidate.success === true &&
    typeof candidate.quoteId === 'string' &&
    Array.isArray(candidate.productNames) &&
    candidate.productNames.every((name) => typeof name === 'string') &&
    typeof candidate.whatsappUrl === 'string' &&
    (candidate.emailStatus === 'sent' || candidate.emailStatus === 'failed' || candidate.emailStatus === 'configuration_error')
  );
}

async function readQuoteResponse(response: Response): Promise<unknown> {
  if (!response.headers.get('content-type')?.includes('application/json')) return null;
  return response.json().catch(() => null);
}

function getApiErrorCode(value: unknown): string | null {
  if (typeof value !== 'object' || value === null) return null;
  const code = (value as { code?: unknown }).code;
  return typeof code === 'string' ? code : null;
}

function getSubmissionError(
  value: unknown,
  status: number,
  copy: {
    generic: string;
    serviceUnavailable: string;
    emailDelivery: string;
    rateLimited: string;
    validation: string;
  },
): string {
  switch (getApiErrorCode(value)) {
    case 'DATABASE_SAVE_FAILED':
      return copy.generic;
    case 'QUOTE_SERVICE_UNAVAILABLE':
      return copy.serviceUnavailable;
    case 'EMAIL_DELIVERY_FAILED':
      return copy.emailDelivery;
    case 'RATE_LIMITED':
      return copy.rateLimited;
    case 'VALIDATION_FAILED':
      return copy.validation;
    default:
      if (status === 429) return copy.rateLimited;
      if (status === 400) return copy.validation;
      if (status === 404 || status >= 500) return copy.serviceUnavailable;
      return copy.generic;
  }
}

function getApiValidationErrors(
  value: unknown,
  copy: {
    requiredError: string;
    emailError: string;
    phoneError: string;
    productsError: string;
  },
): QuoteErrors {
  if (getApiErrorCode(value) !== 'VALIDATION_FAILED' || typeof value !== 'object' || value === null) {
    return {};
  }

  const errors = (value as { errors?: unknown }).errors;
  if (typeof errors !== 'object' || errors === null || Array.isArray(errors)) return {};

  const hasError = (field: QuoteField) => Object.hasOwn(errors, field);
  return {
    ...(hasError('fullName') ? { fullName: copy.requiredError } : {}),
    ...(hasError('companyName') ? { companyName: copy.requiredError } : {}),
    ...(hasError('email') ? { email: copy.emailError } : {}),
    ...(hasError('phone') ? { phone: copy.phoneError } : {}),
    ...(hasError('productIds') ? { productIds: copy.productsError } : {}),
  };
}
