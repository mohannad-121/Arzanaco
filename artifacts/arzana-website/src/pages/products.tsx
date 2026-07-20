import { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLanguage } from '../contexts/LanguageContext';
import { useCatalog } from '../contexts/CatalogContext';

export default function Products({ params }: { params?: { categorySlug?: string } }) {
  const { t, language } = useLanguage();
  const { categories, products } = useCatalog();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const activeCategory = params?.categorySlug;
  const activeCategoryData = categories.find((category) => category.slug === activeCategory);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return products.filter((product) => {
      if (activeCategoryData && product.categoryId !== activeCategoryData.id) return false;
      if (!normalizedSearch) return true;

      return (
        product.nameEn.toLocaleLowerCase().includes(normalizedSearch) ||
        product.nameAr.toLocaleLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeCategoryData, products, search]);

  return (
    <PageWrapper>
      <section className="border-b bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground">
            {activeCategoryData
              ? language === 'ar'
                ? activeCategoryData.nameAr
                : activeCategoryData.nameEn
              : t('products.title')}
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 space-y-6 lg:w-64">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('products.search')}
                className="ps-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <nav aria-label={t('products.categories')} className="rounded-lg border bg-card p-4">
              <h2 className="mb-4 font-semibold text-foreground">{t('products.categories')}</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      !activeCategory ? 'bg-primary/10 font-medium text-primary' : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {t('common.all')}
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products/${category.slug}`}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        activeCategory === category.slug
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {language === 'ar' ? category.nameAr : category.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            <p className="mb-6 text-sm text-muted-foreground">
              {language === 'ar' ? `${filteredProducts.length} منتجاً` : `${filteredProducts.length} products`}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border bg-card py-24 text-center">
                <p className="text-muted-foreground">{t('products.empty')}</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setLocation('/products'); }}>
                  {language === 'ar' ? 'مسح البحث' : 'Clear search'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const category = categories.find((item) => item.id === product.categoryId);

                  return (
                    <article
                      key={product.id}
                      className="flex min-h-52 flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
                    >
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                        {category && (language === 'ar' ? category.nameAr : category.nameEn)}
                      </p>
                      <h2 className="text-xl font-semibold leading-snug text-foreground">
                        {language === 'ar' ? product.nameAr : product.nameEn}
                      </h2>
                      {(language === 'ar' ? product.descriptionAr : product.descriptionEn) && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {language === 'ar' ? product.descriptionAr : product.descriptionEn}
                        </p>
                      )}
                      {product.types && product.types.length > 0 && (
                        <p className="mt-3 text-sm text-muted-foreground">{product.types.join(' · ')}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between border-t pt-5">
                        <Link
                          href={`/products/${category?.slug}/${product.slug}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {t('common.viewDetails')}
                        </Link>
                        <Button size="sm" variant="outline" onClick={() => setLocation('/request-quote')}>
                          {language === 'ar' ? 'طلب عرض سعر' : 'Quote'}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
