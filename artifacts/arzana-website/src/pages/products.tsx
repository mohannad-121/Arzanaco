import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Search } from 'lucide-react';
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
  const filteredProducts = useMemo(() => products.filter((product) => {
    if (activeCategoryData && product.categoryId !== activeCategoryData.id) return false;
    const query = search.trim().toLocaleLowerCase();
    return !query || product.nameEn.toLocaleLowerCase().includes(query) || product.nameAr.toLocaleLowerCase().includes(query);
  }), [activeCategoryData, products, search]);

  return <PageWrapper>
    <section className="page-hero py-24 md:py-32"><div className="site-container"><p className="eyebrow mb-5 !text-white/70">Arzana catalogue</p><h1 className="max-w-3xl text-4xl font-bold tracking-[-.04em] text-white md:text-6xl">{activeCategoryData ? language === 'ar' ? activeCategoryData.nameAr : activeCategoryData.nameEn : t('products.title')}</h1></div></section>
    <section className="bg-[#d9d8d4] py-14 md:py-20"><div className="site-container"><div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full shrink-0 space-y-6 lg:sticky lg:top-28 lg:h-fit lg:w-72"><div className="relative"><Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder={t('products.search')} className="h-12 ps-9" value={search} onChange={(event) => setSearch(event.target.value)} /></div><nav aria-label={t('products.categories')} className="border border-[#b9b8b3] bg-[#edeae4] p-4 shadow-[0_14px_35px_rgba(39,40,42,.08)]"><h2 className="mb-4 text-xs font-bold uppercase tracking-[.14em] text-foreground">{t('products.categories')}</h2><ul className="space-y-2"><li><Link href="/products" className={`block rounded-md px-3 py-2 text-sm transition-colors ${!activeCategory ? 'bg-primary font-medium text-white' : 'text-foreground/70 hover:bg-muted hover:text-primary'}`}>{t('common.all')}</Link></li>{categories.map((category) => <li key={category.id}><Link href={`/products/${category.slug}`} className={`block rounded-md px-3 py-2 text-sm transition-colors ${activeCategory === category.slug ? 'bg-primary font-medium text-white' : 'text-foreground/70 hover:bg-muted hover:text-primary'}`}>{language === 'ar' ? category.nameAr : category.nameEn}</Link></li>)}</ul></nav></aside>
      <div className="min-w-0 flex-1"><p className="mb-7 text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">{language === 'ar' ? `${filteredProducts.length} منتجاً` : `${filteredProducts.length} products`}</p>
        {filteredProducts.length === 0 ? <div className="border bg-card py-24 text-center"><p className="text-muted-foreground">{t('products.empty')}</p><button type="button" className="mt-4 text-sm font-semibold text-primary hover:underline" onClick={() => setSearch('')}>{language === 'ar' ? 'مسح البحث' : 'Clear search'}</button></div> : <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => {
          const category = categories.find((item) => item.id === product.categoryId);
          const image = getProductMedia(product)[0];
          return <Link key={product.id} href={`/products/${category?.slug}/${product.slug}`} className="corner-card group block min-h-[24rem] bg-[#f6f3ee]">
            <span className="corner-card__corner" aria-hidden="true"><ArrowRight className="h-4 w-4 rtl:rotate-180" /></span>
            {image ? <div className="relative h-56 overflow-hidden bg-[#c7c9c9]"><img src={image.src} alt={language === 'ar' ? image.altAr : image.altEn} loading="lazy" className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.035] ${image.fit === 'cover' ? 'object-cover' : 'object-contain p-7'}`} /></div> : <div className="relative h-36 bg-[linear-gradient(135deg,#343638,#7c1e32)]"><span className="absolute inset-0 industrial-grid opacity-20" /></div>}
            <div className="corner-card__content flex min-h-40 flex-col p-6"><p className="corner-card__accent text-xs font-semibold uppercase tracking-[.12em] text-primary">{category && (language === 'ar' ? category.nameAr : category.nameEn)}</p><h2 className="mt-3 text-xl font-bold leading-snug">{language === 'ar' ? product.nameAr : product.nameEn}</h2><span className="corner-card__accent mt-auto inline-flex items-center pt-5 text-sm font-bold text-primary">{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}<ArrowRight className="ms-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span></div>
          </Link>;
        })}</div>}
      </div>
    </div></div></section>
  </PageWrapper>;
}
