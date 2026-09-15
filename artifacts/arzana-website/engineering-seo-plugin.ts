import type { Plugin } from 'vite';
import { engineeringPage, engineeringServices } from '../../lib/arzana-catalog/src/engineering';

/** A static metadata entry for direct visits and social crawlers; the same SPA
 * handles the page. Existing API functions and deployment architecture stay intact.
 */
export function engineeringSeoPlugin(): Plugin {
  return {
    name: 'engineering-route-seo', enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') throw new Error('Missing website HTML entry');
      const title = `${engineeringPage.title} | Arzana Arabia`;
      const defaultHtml = String(index.source);
      const defaults = {
        title: /<title>(.*?)<\/title>/.exec(defaultHtml)?.[1] ?? 'ARZANA Arabia Company Website',
        meta: Object.fromEntries([...defaultHtml.matchAll(/<meta (name|property)="([^"]+)" content="([^"]*)"/g)].map(match => [`meta[${match[1]}="${match[2]}"]`, match[3]])),
      };
      const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
      const photo = Object.keys(bundle).find(file => file.startsWith('assets/01-steel-truss-framework-') && file.endsWith('.jpg'));
      if (!photo) throw new Error('Missing engineering hero asset');
      const image = `https://www.arzanaco.com/${photo}`;
      let html = String(index.source)
        .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(engineeringPage.seoDescription)}`)
        .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g, `$1${escape(title)}`)
        .replace(/(<meta (?:property="og:description"|name="twitter:description") content=")[^"]*/g, `$1${escape(engineeringPage.seoDescription)}`);
      const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.arzanaco.com/' },
        { '@type': 'ListItem', position: 2, name: engineeringPage.title, item: engineeringPage.canonical },
      ] };
      html = html.replace('</head>', `
        <link rel="canonical" href="${engineeringPage.canonical}" />
        <meta property="og:url" content="${engineeringPage.canonical}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:image:alt" content="Steel beams and truss members viewed from below." />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:image" content="${image}" />
        <script data-engineering-static-breadcrumb type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
        <script data-engineering-head-defaults type="application/json">${JSON.stringify(defaults)}</script>
      </head>`);
      html = html.replace('</body>', `<noscript><main><h1>${escape(engineeringPage.title)}</h1><p>${escape(engineeringPage.introduction)}</p>${engineeringServices.map(service => `<section><h2>${escape(service.title)}</h2><p>${escape(service.category)}</p><p>${escape(service.description)}</p><p>${escape(service.softwareNote)}</p></section>`).join('')}<a href="/request-quote">Request a Quote</a></main></noscript></body>`);
      this.emitFile({ type: 'asset', fileName: 'engineering-design-calculations.html', source: html });
    },
  };
}
