import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { ChevronRight, Download, Mail, CheckCircle2 } from 'lucide-react';
import NotFound from './not-found';

import defaultProductImg from '@assets/product_rmu.jpg'; 
import upsImg from '@assets/product_ups.jpg';
import batteryImg from '@assets/product_batteries.jpg';
import meterImg from '@assets/product_meters.jpg';
import safetyImg from '@assets/area_safety.jpg';

const getImageForProduct = (slug: string) => {
  if (slug.includes('ups') || slug.includes('converter')) return upsImg;
  if (slug.includes('batter')) return batteryImg;
  if (slug.includes('meter') || slug.includes('relay')) return meterImg;
  if (slug.includes('safety') || slug.includes('protection') || slug.includes('gate')) return safetyImg;
  return defaultProductImg;
};

export default function ProductDetail({ params }: { params: { categorySlug: string, productSlug: string } }) {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const product = products.find(p => p.slug === params.productSlug);
  const category = categories.find(c => c.slug === params.categorySlug);

  if (!product || !category || product.categoryId !== category.id) {
    return <NotFound />;
  }

  const img = getImageForProduct(product.slug);
  
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <PageWrapper>
      {/* Breadcrumbs */}
      <div className="bg-muted py-4 border-b">
        <div className="container mx-auto px-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          <Link href="/products" className="hover:text-primary transition-colors">{t('nav.products')}</Link>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          <Link href={`/products/${category.slug}`} className="hover:text-primary transition-colors">
            {language === 'ar' ? category.nameAr : category.nameEn}
          </Link>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          <span className="text-foreground font-medium truncate">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden border">
              <img src={img} alt={product.nameEn} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                {language === 'ar' ? category.nameAr : category.nameEn}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {language === 'ar' ? product.nameAr : product.nameEn}
              </h1>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert mb-8">
              <p className="text-lg text-foreground/80 leading-relaxed">
                {language === 'ar' ? product.descriptionAr : product.descriptionEn}
              </p>
            </div>

            {product.types && product.types.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4">Available Types:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.types.map((type, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>{type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto pt-8 border-t flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setLocation('/request-quote')}>
                {t('nav.quote')}
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Technical Datasheet
              </Button>
              <Button size="lg" variant="ghost" className="gap-2" onClick={() => setLocation('/contact')}>
                <Mail className="w-4 h-4" /> Contact Engineering Team
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(rp => {
                const rpImg = getImageForProduct(rp.slug);
                return (
                  <Link key={rp.id} href={`/products/${category.slug}/${rp.slug}`}>
                    <div className="bg-card border rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors h-full flex flex-col">
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img src={rpImg} alt={rp.nameEn} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <div className="p-4 flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {language === 'ar' ? rp.nameAr : rp.nameEn}
                        </h4>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
