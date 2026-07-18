import React, { useState, useMemo } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { Link, useLocation } from 'wouter';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

import defaultProductImg from '@assets/product_rmu.jpg'; // fallback
import upsImg from '@assets/product_ups.jpg';
import batteryImg from '@assets/product_batteries.jpg';
import meterImg from '@assets/product_meters.jpg';
import safetyImg from '@assets/area_safety.jpg';

const getImageForProduct = (slug: string, categoryId: string) => {
  if (slug.includes('ups') || slug.includes('converter')) return upsImg;
  if (slug.includes('batter')) return batteryImg;
  if (slug.includes('meter') || slug.includes('relay')) return meterImg;
  if (slug.includes('safety') || slug.includes('protection') || slug.includes('gate')) return safetyImg;
  return defaultProductImg;
};

export default function Products({ params }: { params?: { categorySlug?: string } }) {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');

  const activeCategory = params?.categorySlug;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (activeCategory) {
        const cat = categories.find(c => c.slug === activeCategory);
        if (cat && p.categoryId !== cat.id) return false;
      }
      
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        return p.nameEn.toLowerCase().includes(q) || 
               p.nameAr.includes(q) || 
               p.descriptionEn.toLowerCase().includes(q) ||
               p.descriptionAr.includes(q);
      }
      return true;
    });
  }, [activeCategory, search]);

  const activeCatObj = categories.find(c => c.slug === activeCategory);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="bg-muted py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {activeCatObj ? (language === 'ar' ? activeCatObj.nameAr : activeCatObj.nameEn) : t('products.title')}
          </h1>
          {activeCatObj && (
            <p className="text-foreground/70 text-lg max-w-3xl">
              {language === 'ar' ? activeCatObj.descriptionAr : activeCatObj.descriptionEn}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder={t('products.search')} 
                  className="pl-9 bg-background"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">{t('products.categories')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className={`block px-3 py-2 rounded-md text-sm transition-colors ${!activeCategory ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}>
                    {t('common.all')}
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/products/${cat.slug}`} className={`block px-3 py-2 rounded-md text-sm transition-colors ${activeCategory === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}>
                      {language === 'ar' ? cat.nameAr : cat.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>Showing {filteredProducts.length} results</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-card border rounded-lg">
                <p className="text-muted-foreground">{t('products.empty')}</p>
                <Button variant="outline" className="mt-4" onClick={() => {setSearch(''); setLocation('/products');}}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const cat = categories.find(c => c.id === product.categoryId);
                  const img = getImageForProduct(product.slug, product.categoryId);
                  
                  return (
                    <div key={product.id} className="bg-card border rounded-lg overflow-hidden group flex flex-col h-full hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                        <img src={img} alt={product.nameEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-xs font-medium px-2 py-1 rounded shadow-sm text-foreground">
                          {cat ? (language === 'ar' ? cat.nameAr : cat.nameEn) : ''}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {language === 'ar' ? product.nameAr : product.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                          {language === 'ar' ? product.descriptionAr : product.descriptionEn}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t">
                          <Link href={`/products/${cat?.slug}/${product.slug}`} className="text-sm font-medium text-primary hover:underline">
                            {t('common.viewDetails')}
                          </Link>
                          <Button size="sm" variant="outline" onClick={() => setLocation('/request-quote')}>
                            Quote
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
