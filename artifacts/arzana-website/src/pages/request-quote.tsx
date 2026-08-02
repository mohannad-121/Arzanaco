import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { ArzanaCheckbox } from '../components/ArzanaCheckbox';
import { ArzanaTextInput } from '../components/ArzanaTextInput';
import {
  ArzanaPhoneInput,
  DEFAULT_PHONE_COUNTRY,
  isValidInternationalPhone,
  normalizeInternationalPhone,
  type PhoneCountry,
} from '../components/ArzanaPhoneInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useCatalog } from '../contexts/CatalogContext';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
]);

type QuoteFormData = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  productIds: string[];
  productDetails: string;
  website: string;
};

type QuoteField = Exclude<keyof QuoteFormData, 'website'> | 'attachment';
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
  productDetails: '',
  website: '',
};

export default function RequestQuote() {
  const { language } = useLanguage();
  const { categories, products } = useCatalog();
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [attachment, setAttachment] = useState<File | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(DEFAULT_PHONE_COUNTRY);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<QuoteSuccess | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy =
    language === 'ar'
      ? {
          eyebrow: 'طلب عرض سعر',
          title: 'أخبرنا بالمنتجات التي تهمك',
          introduction: 'حدد المنتجات من قائمة الكتالوج وأضف بيانات الاتصال حتى نتمكن من إعداد طلبك.',
          fullName: 'الاسم الكامل',
          company: 'اسم الشركة',
          email: 'البريد الإلكتروني',
          phone: 'رقم الهاتف',
          productDetails: 'تفاصيل المنتج أو المتطلبات',
          productDetailsPlaceholder: 'أضف أي مواصفات أو كميات أو متطلبات خاصة.',
          attachment: 'إرفاق ملف',
          attachmentHelp: 'اختياري. PDF أو Word أو Excel أو JPG أو PNG، حتى 3 ميجابايت.',
          removeAttachment: 'إزالة الملف',
          fullNamePlaceholder: 'أدخل الاسم الكامل',
          companyPlaceholder: 'أدخل اسم الشركة',
          emailPlaceholder: 'أدخل البريد الإلكتروني',
          phonePlaceholder: '',
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
          productDetailsError: 'أدخل تفاصيل لا تتجاوز 4000 حرف.',
          attachmentError: 'أرفق ملفاً مدعوماً لا يتجاوز 3 ميجابايت.',
          genericError: 'تعذر إرسال طلب عرض السعر. بياناتك ما زالت موجودة؛ يرجى المحاولة مرة أخرى.',
          successTitle: 'تم إرسال طلبك عبر البريد الإلكتروني',
          successDescription:
            'تم إرسال تفاصيل طلبك والمرفق، إن وُجد، مباشرةً إلى أرزانا عبر البريد الإلكتروني.',
          preparedProducts: 'المنتجات المجهزة للطلب:',
        }
      : {
          eyebrow: 'Request a Quote',
          title: 'Tell us which products interest you',
          introduction: 'Select products from the company catalog and add your contact details to prepare your request.',
          fullName: 'Full Name',
          company: 'Company Name',
          email: 'Email Address',
          phone: 'Phone Number',
          productDetails: 'Product Details or Requirements',
          productDetailsPlaceholder: 'Add specifications, quantities, or any special requirements.',
          attachment: 'Attach a File',
          attachmentHelp: 'Optional. PDF, Word, Excel, JPG, or PNG up to 3 MB.',
          removeAttachment: 'Remove file',
          fullNamePlaceholder: 'Enter your full name',
          companyPlaceholder: 'Enter your company name',
          emailPlaceholder: 'Enter your email address',
          phonePlaceholder: '',
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
          productDetailsError: 'Enter details of no more than 4,000 characters.',
          attachmentError: 'Attach a supported file no larger than 3 MB.',
          genericError:
            'We could not submit your quote request. Your details are still here—please try again.',
          successTitle: 'Your quote request was emailed to Arzana',
          successDescription:
            'Your request details and any attached file were sent directly to Arzana by email.',
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
    const normalizedPhone = normalizeInternationalPhone(formData.phone, selectedCountry);
    if (!isValidInternationalPhone(normalizedPhone)) {
      nextErrors.phone = formData.phone.trim() ? copy.phoneError : copy.requiredError;
    }
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

    setIsSubmitting(true);

    try {
      const encodedAttachment = attachment ? await encodeAttachment(attachment) : null;
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          companyName: formData.companyName.trim(),
          email: formData.email.trim(),
          phone: normalizeInternationalPhone(formData.phone, selectedCountry),
          productIds: formData.productIds,
          productDetails: formData.productDetails.trim(),
          attachment: encodedAttachment,
          language,
          website: formData.website,
        }),
      });
      const result = await readQuoteResponse(response);

      if (!response.ok || !isSuccessfulQuote(result)) {
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
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[quote] network request failed', { name: error instanceof Error ? error.name : 'unknown' });
      }
      setSubmissionError(quoteErrorCopy.network);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: Exclude<keyof QuoteFormData, 'productIds' | 'website'>, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionError(null);
    setSuccess(null);
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextAttachment = event.target.files?.[0] ?? null;
    if (!nextAttachment) return;

    if (nextAttachment.size > MAX_ATTACHMENT_BYTES || !ALLOWED_ATTACHMENT_TYPES.has(nextAttachment.type)) {
      setAttachment(null);
      event.target.value = '';
      setErrors((current) => ({ ...current, attachment: copy.attachmentError }));
      return;
    }

    setAttachment(nextAttachment);
    setErrors((current) => ({ ...current, attachment: undefined }));
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
    setFormData(initialFormData);
    setAttachment(null);
    if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    setSelectedCountry(DEFAULT_PHONE_COUNTRY);
    setErrors({});
    setSubmissionError(null);
    setSuccess(null);
  };

  return (
    <PageWrapper>
      <section className="page-hero py-28 md:py-36">
        <div className="site-container max-w-3xl">
          <p className="eyebrow mb-5 !text-white/70">
            {copy.eyebrow}
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-[-.04em] text-white md:text-6xl">{copy.title}</h1>
          <p className="text-lg leading-relaxed text-white/75">{copy.introduction}</p>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20"><div className="site-container max-w-4xl">
          <form noValidate onSubmit={handleSubmit} className="relative border border-border bg-card p-6 shadow-[0_18px_50px_rgba(39,40,42,.08)] md:p-10">
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
                <ArzanaTextInput
                  id="quote-full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  maxLength={160}
                  placeholder={copy.fullNamePlaceholder}
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
                <ArzanaTextInput
                  id="quote-company"
                  name="companyName"
                  type="text"
                  autoComplete="organization"
                  maxLength={160}
                  placeholder={copy.companyPlaceholder}
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
                <ArzanaTextInput
                  id="quote-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  placeholder={copy.emailPlaceholder}
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
                <ArzanaPhoneInput
                  id="quote-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(value) => updateField('phone', value)}
                  selectedCountry={selectedCountry}
                  onCountryChange={(country) => {
                    setSelectedCountry(country);
                    setErrors((current) => ({ ...current, phone: undefined }));
                    setSubmissionError(null);
                    setSuccess(null);
                  }}
                  placeholder={copy.phonePlaceholder}
                  language={language}
                  error={Boolean(errors.phone)}
                  describedBy={errors.phone ? 'quote-phone-error' : undefined}
                />
              </FormField>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="quote-product-details" className="text-sm font-medium text-foreground">
                  {copy.productDetails}
                </label>
                <textarea
                  id="quote-product-details"
                  name="productDetails"
                  rows={5}
                  maxLength={4000}
                  placeholder={copy.productDetailsPlaceholder}
                  value={formData.productDetails}
                  onChange={(event) => updateField('productDetails', event.target.value)}
                  aria-invalid={Boolean(errors.productDetails)}
                  aria-describedby={errors.productDetails ? 'quote-product-details-error' : undefined}
                  className="quote-dark-input min-h-32 resize-y"
                />
                {errors.productDetails && (
                  <p id="quote-product-details-error" role="alert" className="text-sm font-medium text-destructive">
                    {errors.productDetails}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="quote-attachment" className="text-sm font-medium text-foreground">
                  {copy.attachment}
                </label>
                <input
                  id="quote-attachment"
                  ref={attachmentInputRef}
                  name="attachment"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png"
                  onChange={handleAttachmentChange}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.attachment)}
                  aria-describedby="quote-attachment-help quote-attachment-error"
                  className="block w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground file:me-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <p id="quote-attachment-help" className="text-sm text-muted-foreground">{copy.attachmentHelp}</p>
                {attachment && (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <span className="min-w-0 truncate text-foreground">{attachment.name}</span>
                    <button
                      type="button"
                      className="shrink-0 font-medium text-primary hover:underline"
                      onClick={() => {
                        setAttachment(null);
                        if (attachmentInputRef.current) attachmentInputRef.current.value = '';
                      }}
                      disabled={isSubmitting}
                    >
                      {copy.removeAttachment}
                    </button>
                  </div>
                )}
                {errors.attachment && (
                  <p id="quote-attachment-error" role="alert" className="text-sm font-medium text-destructive">
                    {errors.attachment}
                  </p>
                )}
              </div>
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
                            <ArzanaCheckbox
                              key={product.id}
                              id={inputId}
                              name="productIds"
                              value={product.id}
                              checked={isSelected}
                              onChange={() => toggleProduct(product.id)}
                            >
                              {language === 'ar' ? product.nameAr : product.nameEn}
                            </ArzanaCheckbox>
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
    productDetailsError: string;
    attachmentError: string;
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
    ...(hasError('productDetails') ? { productDetails: copy.productDetailsError } : {}),
    ...(hasError('attachment') ? { attachment: copy.attachmentError } : {}),
  };
}

function encodeAttachment(file: File): Promise<{ filename: string; content: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const separatorIndex = result.indexOf(',');
      if (separatorIndex === -1) {
        reject(new Error('Unable to encode the selected file.'));
        return;
      }

      resolve({
        filename: file.name,
        content: result.slice(separatorIndex + 1),
        contentType: file.type,
      });
    };
    reader.readAsDataURL(file);
  });
}
