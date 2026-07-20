import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { catalogProducts } from '@workspace/arzana-catalog';
import { categories as defaultCategories, type Category } from '../data/categories';

const STORAGE_KEY = 'arzana_catalog_v1';

export interface ManagedProduct {
  id: string;
  slug: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  types?: string[];
}

interface CatalogState {
  products: ManagedProduct[];
  categories: Category[];
}

interface CatalogContextValue extends CatalogState {
  saveProduct: (product: ManagedProduct) => void;
  deleteProduct: (id: string) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const initialState: CatalogState = {
  products: catalogProducts.map((product) => ({ ...product, types: product.types ? [...product.types] : undefined })),
  categories: defaultCategories.map((category) => ({ ...category })),
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function isCatalogState(value: unknown): value is CatalogState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CatalogState>;
  return Array.isArray(candidate.products) && Array.isArray(candidate.categories);
}

function readCatalog(): CatalogState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    const parsed: unknown = JSON.parse(saved);
    return isCatalogState(parsed) ? parsed : initialState;
  } catch {
    return initialState;
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogState>(readCatalog);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    const syncCatalog = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const next: unknown = JSON.parse(event.newValue);
        if (isCatalogState(next)) setCatalog(next);
      } catch {
        // Ignore malformed catalog updates from another tab.
      }
    };
    window.addEventListener('storage', syncCatalog);
    return () => window.removeEventListener('storage', syncCatalog);
  }, []);

  const value = useMemo<CatalogContextValue>(() => ({
    ...catalog,
    saveProduct: (product) => setCatalog((current) => ({
      ...current,
      products: current.products.some((item) => item.id === product.id)
        ? current.products.map((item) => item.id === product.id ? product : item)
        : [product, ...current.products],
    })),
    deleteProduct: (id) => setCatalog((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    })),
    saveCategory: (category) => setCatalog((current) => ({
      ...current,
      categories: current.categories.some((item) => item.id === category.id)
        ? current.categories.map((item) => item.id === category.id ? category : item)
        : [...current.categories, category],
    })),
    deleteCategory: (id) => setCatalog((current) => ({
      categories: current.categories.filter((category) => category.id !== id),
      products: current.products.filter((product) => product.categoryId !== id),
    })),
  }), [catalog]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider');
  return context;
}

export function createSlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
