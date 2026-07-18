import { useState, type FormEvent, type ReactNode } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';

type QuoteFormData = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  productIds: string[];
};

type QuoteField = keyof QuoteFormData;
type QuoteErrors = Partial<Record<QuoteField, string>>;

const initialFormData: QuoteFormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  productIds: [],
};

export default function RequestQuote() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [preparedRequest, setPreparedRequest] = useState<{
    fullName: string;
    company: string;
    email: string;
    phone: string;
    products: string[];
  } | null>(null);

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
          reset: 'إعادة تعيين',
          requiredError: 'هذا الحقل مطلوب.',
          emailError: 'أدخل عنوان بريد إلكتروني صالحاً.',
          productsError: 'اختر منتجاً واحداً على الأقل.',
          noticeTitle: 'إرسال طلبات عروض الأسعار غير متصل بعد.',
          noticeDescription:
            'تم التحقق من البيانات أدناه وتجهيزها للتكامل مع خدمة الإرسال لاحقاً. يرجى التواصل مع فريق أرزانا العربية لإرسال الطلب حالياً.',
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
          submit: 'Prepare Quote Request',
          reset: 'Reset',
          requiredError: 'This field is required.',
          emailError: 'Enter a valid email address.',
          productsError: 'Select at least one product.',
          noticeTitle: 'Quote request submission is not connected yet.',
          noticeDescription:
            'The details below have been validated and prepared for a future submission integration. Please contact ARZANA Arabia to submit the request today.',
          preparedProducts: 'Products prepared for the request:',
        };

  const validate = () => {
    const nextErrors: QuoteErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = copy.requiredError;
    if (!formData.company.trim()) nextErrors.company = copy.requiredError;
    if (!formData.email.trim()) {
      nextErrors.email = copy.requiredError;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = copy.emailError;
    }
    if (!formData.phone.trim()) nextErrors.phone = copy.requiredError;
    if (formData.productIds.length === 0) nextErrors.productIds = copy.productsError;

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPreparedRequest(null);
      return;
    }

    const quoteRequest = {
      fullName: formData.fullName.trim(),
      company: formData.company.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      products: formData.productIds
        .map((productId) => products.find((product) => product.id === productId))
        .filter((product): product is (typeof products)[number] => Boolean(product))
        .map((product) => (language === 'ar' ? product.nameAr : product.nameEn)),
    };

    setPreparedRequest(quoteRequest);
  };

  const updateField = (field: Exclude<QuoteField, 'productIds'>, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPreparedRequest(null);
  };

  const toggleProduct = (productId: string) => {
    setFormData((current) => ({
      ...current,
      productIds: current.productIds.includes(productId)
        ? current.productIds.filter((selectedId) => selectedId !== productId)
        : [...current.productIds, productId],
    }));
    setErrors((current) => ({ ...current, productIds: undefined }));
    setPreparedRequest(null);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setPreparedRequest(null);
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
          <form noValidate onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 shadow-sm md:p-10">
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
                  value={formData.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'quote-full-name-error' : undefined}
                />
              </FormField>

              <FormField
                id="quote-company"
                label={copy.company}
                error={errors.company}
                requiredLabel={copy.required}
              >
                <Input
                  id="quote-company"
                  name="company"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? 'quote-company-error' : undefined}
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
                  autoComplete="tel"
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

            <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>
                {copy.reset}
              </Button>
              <Button type="submit">{copy.submit}</Button>
            </div>
          </form>

          {preparedRequest && (
            <div role="status" className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
              <h2 className="font-semibold text-foreground">{copy.noticeTitle}</h2>
              <p className="mt-2 leading-relaxed text-foreground/75">{copy.noticeDescription}</p>
              <p className="mt-4 font-medium text-foreground">{copy.preparedProducts}</p>
              <ul className="mt-2 list-disc space-y-1 ps-5 text-foreground/75">
                {preparedRequest.products.map((productName) => (
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
