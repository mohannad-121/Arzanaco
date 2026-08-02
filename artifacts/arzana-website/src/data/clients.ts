import algihazLogo from '@logos/algihaz-holding.png';
import kecLogo from '@logos/kec.jpeg';
import ltConstructionLogo from '@logos/l-and-t-construction.png';
import tdpLogo from '@logos/tdp.jpeg';

export interface Client {
  id: string;
  name: string;
  logoPath: string;
  alt: string;
  /** Give the detailed L&T Construction mark more useful visual space. */
  emphasis?: 'large';
}

const logoModules = import.meta.glob(
  '../../../../logos/*.{png,jpg,jpeg,svg,webp}',
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
) as Record<string, string>;

const verifiedClientNames: Record<string, string> = {
  abb: 'ABB',
  alfanar: 'Alfanar',
  'eg&g middle east': 'EG&G Middle East',
  'el self': 'El Seif',
  'hc telecom': 'HC Telecom',
  'l and t construction': 'L & T Construction',
  'ministry of media': 'Ministry of Media',
  sans: 'SANS',
  'saudi customs': 'Saudi Customs',
  'السعودية للكهرباء': 'Saudi Electricity Company',
  'جامعة الملك سعود': 'King Saud University',
  'سفاري': 'Safari',
};

function fileNameFromPath(path: string) {
  return path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
}

function keyFromFileName(fileName: string) {
  return fileName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function nameFromFileName(fileName: string) {
  const key = keyFromFileName(fileName);
  const cleanedName = fileName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

  if (verifiedClientNames[key]) return verifiedClientNames[key];
  if (/^[a-z0-9 ]+$/i.test(cleanedName)) {
    return cleanedName.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
  }

  return cleanedName;
}

export const clients: Client[] = Object.entries(logoModules)
  .filter(([path]) => ![
    'arz logo',
    'l and t construction',
    'l-and-t-construction',
    'tdp',
    'kec',
    'algihaz holding',
    'communication',
    'outlook',
    'telephone call',
    'whatsapp',
  ].includes(keyFromFileName(fileNameFromPath(path))))
  .map(([path, logoPath]): Client => {
    const fileName = fileNameFromPath(path);
    const name = nameFromFileName(fileName);

    return {
      id: keyFromFileName(fileName),
      name,
      logoPath,
      alt: `${name} logo`,
    };
  })
  .concat([
    {
      id: 'l-and-t-construction',
      name: 'L&T Construction',
      logoPath: ltConstructionLogo,
      alt: 'L&T Construction Power Transmission & Distribution logo',
      emphasis: 'large' as const,
    },
    { id: 'tdp', name: 'TDP', logoPath: tdpLogo, alt: 'TDP logo' },
    { id: 'kec', name: 'KEC', logoPath: kecLogo, alt: 'KEC logo' },
    { id: 'algihaz-holding', name: 'Algihaz Holding', logoPath: algihazLogo, alt: 'Algihaz Holding logo' },
  ])
  .sort((first, second) => first.name.localeCompare(second.name, undefined, { sensitivity: 'base' }));
