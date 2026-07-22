export interface Client {
  id: string;
  name: string;
  logoPath: string;
  alt: string;
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
  .filter(([path]) => keyFromFileName(fileNameFromPath(path)) !== 'arz logo')
  .map(([path, logoPath]) => {
    const fileName = fileNameFromPath(path);
    const name = nameFromFileName(fileName);

    return {
      id: keyFromFileName(fileName),
      name,
      logoPath,
      alt: `${name} logo`,
    };
  })
  .sort((first, second) => first.name.localeCompare(second.name, undefined, { sensitivity: 'base' }));
