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
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'arzana_catalog_v2';

export interface ManagedProduct {
  id: string;
  slug: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  applicationsEn?: readonly string[];
  applicationsAr?: readonly string[];
  types?: string[];
}

interface CatalogState {
  products: ManagedProduct[];
  categories: Category[];
}

interface CatalogContextValue extends CatalogState {
  isLoading: boolean;
  catalogError: string | null;
  authenticateAdmin: (password: string) => Promise<boolean>;
  saveProduct: (product: ManagedProduct, password: string) => Promise<void>;
  deleteProduct: (id: string, password: string) => Promise<void>;
  saveCategory: (category: Category, password: string) => Promise<void>;
  deleteCategory: (id: string, password: string) => Promise<void>;
}

const initialState: CatalogState = {
  products: catalogProducts.map((product) => ({
    ...product,
    types: 'types' in product && product.types ? [...product.types] : undefined,
  })),
  categories: defaultCategories.map((category) => ({ ...category })),
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function isCatalogState(value: unknown): value is CatalogState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CatalogState>;
  if (!Array.isArray(candidate.products) || !Array.isArray(candidate.categories)) return false;

  return candidate.categories.every((category) =>
    category &&
    typeof category.id === 'string' &&
    typeof category.slug === 'string' &&
    typeof category.nameEn === 'string' &&
    typeof category.nameAr === 'string',
  ) && candidate.products.every((product) =>
    product &&
    typeof product.id === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.categoryId === 'string' &&
    typeof product.nameEn === 'string' &&
    typeof product.nameAr === 'string',
  );
}

function isApprovedCatalogState(value: unknown): value is CatalogState {
  if (!isCatalogState(value)) return false;

  return (
    value.categories.length === initialState.categories.length &&
    value.products.length === initialState.products.length &&
    initialState.categories.every((category) =>
      value.categories.some(
        (candidate) =>
          candidate.id === category.id &&
          candidate.slug === category.slug &&
          candidate.nameEn === category.nameEn &&
          candidate.nameAr === category.nameAr,
      ),
    ) &&
    initialState.products.every((product) =>
      value.products.some(
        (candidate) =>
          candidate.id === product.id &&
          candidate.slug === product.slug &&
          candidate.categoryId === product.categoryId &&
          candidate.nameEn === product.nameEn &&
          candidate.nameAr === product.nameAr &&
          candidate.descriptionEn === product.descriptionEn &&
          candidate.descriptionAr === product.descriptionAr,
      ),
    )
  );
}

function readLocalCatalog(): CatalogState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    const parsed: unknown = JSON.parse(saved);
    return isApprovedCatalogState(parsed) ? parsed : initialState;
  } catch {
    return initialState;
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogState>(readLocalCatalog);
  const [isLoading, setIsLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const acceptRemoteCatalog = (value: unknown) => {
    if (!isApprovedCatalogState(value)) return;
    setCatalog(initialState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    setCatalogError(null);
  };

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      const { data, error } = await supabase
        .from('catalog_state')
        .select('data')
        .eq('id', 1)
        .maybeSingle();

      if (!active) return;
      if (error) {
        console.error('[catalog] unable to load shared catalog', { code: error.code });
        setCatalogError('The shared catalog is temporarily unavailable.');
      } else if (data?.data) {
        acceptRemoteCatalog(data.data);
      }
      setIsLoading(false);
    };

    void loadCatalog();

    const channel = import.meta.env.VITE_DISABLE_CATALOG_REALTIME === 'true'
      ? null
      : supabase
          .channel('public-catalog')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'catalog_state', filter: 'id=eq.1' },
            (payload) => acceptRemoteCatalog((payload.new as { data?: unknown }).data),
          )
          .subscribe();

    return () => {
      active = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const persistCatalog = async (next: CatalogState, password: string) => {
    const { error } = await supabase.rpc('save_catalog', {
      admin_password: password,
      new_catalog: next,
    });
    if (error) {
      console.error('[catalog] unable to save shared catalog', { code: error.code });
      throw new Error('Unable to save the shared catalog.');
    }
    acceptRemoteCatalog(next);
  };

  const value = useMemo<CatalogContextValue>(() => ({
    ...catalog,
    isLoading,
    catalogError,
    authenticateAdmin: async (password) => {
      const { data, error } = await supabase.rpc('verify_catalog_admin', {
        admin_password: password,
      });
      if (error) {
        console.error('[catalog] admin verification failed', { code: error.code });
        throw new Error('Unable to connect to the catalog service.');
      }
      if (data !== true) return false;

      const { data: remoteState, error: loadError } = await supabase
        .from('catalog_state')
        .select('data')
        .eq('id', 1)
        .single();
      if (loadError) throw new Error('Unable to load the shared catalog.');

      if (isCatalogState(remoteState.data)) {
        acceptRemoteCatalog(remoteState.data);
      } else {
        // First login migrates any catalog already saved by the administrator's
        // browser into Supabase, preserving edits made before shared storage existed.
        await persistCatalog(catalog, password);
      }

      return true;
    },
    saveProduct: async (product, password) => {
      const next = {
        ...catalog,
        products: catalog.products.some((item) => item.id === product.id)
          ? catalog.products.map((item) => item.id === product.id ? product : item)
          : [product, ...catalog.products],
      };
      await persistCatalog(next, password);
    },
    deleteProduct: async (id, password) => {
      await persistCatalog({
        ...catalog,
        products: catalog.products.filter((product) => product.id !== id),
      }, password);
    },
    saveCategory: async (category, password) => {
      const next = {
        ...catalog,
        categories: catalog.categories.some((item) => item.id === category.id)
          ? catalog.categories.map((item) => item.id === category.id ? category : item)
          : [...catalog.categories, category],
      };
      await persistCatalog(next, password);
    },
    deleteCategory: async (id, password) => {
      await persistCatalog({
        categories: catalog.categories.filter((category) => category.id !== id),
        products: catalog.products.filter((product) => product.categoryId !== id),
      }, password);
    },
  }), [catalog, catalogError, isLoading]);

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
