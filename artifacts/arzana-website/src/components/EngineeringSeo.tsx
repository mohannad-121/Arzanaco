import { useEffect } from 'react';
import { engineeringPage } from '@workspace/arzana-catalog/engineering';
import { useLanguage } from '../contexts/LanguageContext';
import heroImage from '@engineering/structural/01-steel-truss-framework.jpg';

export function EngineeringSeo() {
  const { language } = useLanguage();
  useEffect(() => {
    const ar = language === 'ar';
    // Restore the SPA's baseline before taking our snapshot when entering from
    // the static social-crawler HTML, so metadata also cleans up on navigation.
    const defaultNode = document.querySelector('script[data-engineering-head-defaults]');
    if (defaultNode?.textContent) {
      const defaults = JSON.parse(defaultNode.textContent) as { title: string; meta: Record<string, string> };
      document.title = defaults.title;
      Object.entries(defaults.meta).forEach(([selector, content]) => document.head.querySelector(selector)?.setAttribute('content', content));
      for (const selector of ['link[rel="canonical"]', 'meta[property="og:url"]', 'meta[property="og:image"]', 'meta[property="og:image:alt"]', 'meta[property="og:locale"]', 'meta[name="twitter:image"]']) {
        if (!(selector in defaults.meta)) document.head.querySelector(selector)?.remove();
      }
      defaultNode.remove();
    }
    const oldTitle = document.title;
    const title = `${ar ? engineeringPage.titleAr : engineeringPage.title} | ${ar ? 'أرزانا العربية' : 'Arzana Arabia'}`;
    document.title = title;
    const cleanup: (() => void)[] = [];
    const set = (selector: string, tag: 'meta' | 'link', attributes: Record<string, string>) => {
      const existing = document.head.querySelector<HTMLElement>(selector);
      const node = existing ?? document.createElement(tag);
      const previous = Object.fromEntries(Object.keys(attributes).map(key => [key, node.getAttribute(key)]));
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      if (!existing) document.head.appendChild(node);
      cleanup.push(() => {
        if (!existing) { node.remove(); return; }
        Object.entries(previous).forEach(([key, value]) => value === null ? node.removeAttribute(key) : node.setAttribute(key, value));
      });
    };
    const description = ar ? engineeringPage.seoDescriptionAr : engineeringPage.seoDescription;
    set('meta[name="description"]', 'meta', { name: 'description', content: description });
    set('link[rel="canonical"]', 'link', { rel: 'canonical', href: engineeringPage.canonical });
    for (const [key, value] of Object.entries({ title, description, url: engineeringPage.canonical, image: new URL(heroImage, engineeringPage.canonical).href, 'image:alt': ar ? 'عوارض فولاذية وعناصر جمالون كما تبدو من الأسفل.' : 'Steel beams and truss members viewed from below.', locale: ar ? 'ar_SA' : 'en_US' })) {
      set(`meta[property="og:${key}"]`, 'meta', { property: `og:${key}`, content: value });
    }
    for (const [key, value] of Object.entries({ title, description, image: new URL(heroImage, engineeringPage.canonical).href })) {
      set(`meta[name="twitter:${key}"]`, 'meta', { name: `twitter:${key}`, content: value });
    }
    const breadcrumb = document.createElement('script');
    breadcrumb.type = 'application/ld+json';
    breadcrumb.dataset.engineeringBreadcrumb = '';
    breadcrumb.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: ar ? 'الرئيسية' : 'Home', item: 'https://www.arzanaco.com/' },
      { '@type': 'ListItem', position: 2, name: ar ? engineeringPage.titleAr : engineeringPage.title, item: engineeringPage.canonical },
    ] });
    const staticBreadcrumb = document.querySelector('script[data-engineering-static-breadcrumb]');
    staticBreadcrumb?.remove();
    document.head.appendChild(breadcrumb);
    return () => { document.title = oldTitle; cleanup.reverse().forEach(fn => fn()); breadcrumb.remove(); };
  }, [language]);
  return null;
}
