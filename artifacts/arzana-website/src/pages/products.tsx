import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Search } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Input } from '../components/ui/input';
import { useLanguage } from '../contexts/LanguageContext';
import { useCatalog } from '../contexts/CatalogContext';
import { getProductMedia } from '../data/assets';

export default function Products({ params }: { params?: { categorySlug?: string } }) {
  const { t, language } = useLanguage();
  const { categories, products } = useCatalog();
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
      <section className="page-hero py-24 md:py-32">
        <div className="site-container">
          <p className="eyebrow mb-5 !text-white/70">Arzana catalogue</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-[-.04em] text-white md:text-6xl">
            {activeCategoryData
              ? language === 'ar'
                ? activeCategoryData.nameAr
                : activeCategoryData.nameEn
              : t('products.title')}
          </h1>
        </div>
      </section>

      <section className="bg-[#d9d8d4] py-14 md:py-20"><div className="site-container">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 space-y-6 lg:sticky lg:top-28 lg:h-fit lg:w-72">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('products.search')}
                className="ps-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <nav aria-label={t('products.categories')} className="border border-[#b9b8b3] bg-[#edeae4] p-4 shadow-[0_14px_35px_rgba(39,40,42,.08)]">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[.14em] text-foreground">{t('products.categories')}</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      !activeCategory ? 'bg-primary text-white font-medium' : 'text-foreground/70 hover:bg-muted hover:text-primary'
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
                          ? 'bg-primary text-white font-medium'
                          : 'text-foreground/70 hover:bg-muted hover:text-primary'
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
            <p className="mb-7 border-b border-border pb-4 text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">
              {language === 'ar' ? `${filteredProducts.length} منتجاً` : `${filteredProducts.length} products`}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border bg-card py-24 text-center">
                <p className="text-muted-foreground">{t('products.empty')}</p>
                <button type="button" className="mt-4 text-sm font-semibold text-primary hover:underline" onClick={() => { setSearch(''); }}>
                  {language === 'ar' ? 'مسح البحث' : 'Clear search'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const category = categories.find((item) => item.id === product.categoryId);
                  const image = getProductMedia(product)[0];

                  return (
                    <article
                      key={product.id}
                      className="group relative flex min-h-72 flex-col overflow-hidden bg-[#f6f3ee] p-0 shadow-[0_10px_25px_rgba(39,40,42,.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(39,40,42,.16)]"
                    >
                      {image && (
                        <img
                          src={image.src}
                          alt={language === 'ar' ? image.altAr : image.altEn}
                          className={`h-52 w-full bg-[#c7c9c9] transition-transform duration-500 group-hover:scale-[1.035] ${image.fit === 'cover' ? 'object-cover' : 'object-contain p-7'}`}
                          loading="lazy"
                        />
                      )}
                      <div className="relative flex flex-1 flex-col p-6"><span className="absolute start-6 top-0 h-px w-10 bg-primary transition-[width] duration-300 group-hover:w-20" /><p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                        {category && (language === 'ar' ? category.nameAr : category.nameEn)}
                      </p>
                      <h2 className="text-xl font-bold leading-snug text-foreground">
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
                      <div className="mt-auto border-t border-foreground/10 pt-5">
                        <Link
                          href={`/products/${category?.slug}/${product.slug}`}
                          className="inline-flex items-center text-sm font-bold text-primary hover:underline"
                        >
                          {t('common.viewDetails')} <span className="ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
                        </Link>
                      </div></div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div></section>
    </PageWrapper>
  );
}
