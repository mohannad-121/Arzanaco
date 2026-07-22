import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { catalogProducts } from '@workspace/arzana-catalog';
import { categories as defaultCategories, type Category } from '../data/categories';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

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

export interface CatalogState {
  products: ManagedProduct[];
  categories: Category[];
}

interface CatalogSnapshot {
  catalog: CatalogState;
  updatedAt: string | null;
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

function createInitialCatalog(): CatalogState {
  return {
    products: catalogProducts.map((product) => ({
      ...product,
      applicationsEn: product.applicationsEn ? [...product.applicationsEn] : undefined,
      applicationsAr: product.applicationsAr ? [...product.applicationsAr] : undefined,
      types: 'types' in product && product.types ? [...product.types] : undefined,
    })),
    categories: defaultCategories.map((category) => ({ ...category })),
  };
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Validates the shared document without comparing it to the bundled catalog.
 * Product names, descriptions, categories, and options are intentionally
 * editable, so equality with the build-time fallback is never a valid check.
 */
export function normalizeCatalog(value: unknown): CatalogState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<CatalogState>;
  if (!Array.isArray(candidate.products) || !Array.isArray(candidate.categories)) return null;

  const categories = candidate.categories.map((category) => {
    if (
      !category ||
      typeof category.id !== 'string' ||
      typeof category.slug !== 'string' ||
      typeof category.nameEn !== 'string' ||
      typeof category.nameAr !== 'string'
    ) return null;

    return { ...category };
  });

  const products = candidate.products.map((product) => {
    if (
      !product ||
      typeof product.id !== 'string' ||
      typeof product.slug !== 'string' ||
      typeof product.categoryId !== 'string' ||
      typeof product.nameEn !== 'string' ||
      typeof product.nameAr !== 'string'
    ) return null;

    if (
      (product.descriptionEn !== undefined && typeof product.descriptionEn !== 'string') ||
      (product.descriptionAr !== undefined && typeof product.descriptionAr !== 'string') ||
      (product.applicationsEn !== undefined && !isStringArray(product.applicationsEn)) ||
      (product.applicationsAr !== undefined && !isStringArray(product.applicationsAr)) ||
      (product.types !== undefined && !isStringArray(product.types))
    ) return null;

    return {
      ...product,
      applicationsEn: product.applicationsEn ? [...product.applicationsEn] : undefined,
      applicationsAr: product.applicationsAr ? [...product.applicationsAr] : undefined,
      types: product.types ? [...product.types] : undefined,
    };
  });

  if (categories.some((category) => category === null) || products.some((product) => product === null)) {
    return null;
  }

  return { categories: categories as Category[], products: products as ManagedProduct[] };
}

function getCatalogServiceError() {
  return 'The shared catalog service is unavailable. Check the Supabase configuration and try again.';
}

function toSaveError(code?: string) {
  if (code === 'P0001') return new Error('Another catalog update was saved first. Reload the latest catalog and try again.');
  if (code === '42501') return new Error('You do not have permission to save the catalog.');
  return new Error('The catalog could not be saved. Your changes are still open—please try again.');
}

async function fetchRemoteCatalog(): Promise<CatalogSnapshot | null> {
  if (!supabase) throw new Error(getCatalogServiceError());

  const { data, error } = await supabase
    .from('catalog_state')
    .select('data, updated_at')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.error('[catalog] unable to load shared catalog', { code: error.code });
    throw new Error(getCatalogServiceError());
  }

  const catalog = normalizeCatalog(data?.data);
  return catalog ? { catalog, updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : null } : null;
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogState>(createInitialCatalog);
  const [catalogUpdatedAt, setCatalogUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const acceptRemoteCatalog = useCallback((snapshot: CatalogSnapshot) => {
    setCatalog(snapshot.catalog);
    setCatalogUpdatedAt(snapshot.updatedAt);
    setCatalogError(null);
  }, []);

  const refreshCatalog = useCallback(async () => {
    const snapshot = await fetchRemoteCatalog();
    if (snapshot) acceptRemoteCatalog(snapshot);
    return snapshot;
  }, [acceptRemoteCatalog]);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured || !supabase) {
      setCatalogError(getCatalogServiceError());
      setIsLoading(false);
      return undefined;
    }

    const loadCatalog = async () => {
      try {
        await refreshCatalog();
      } catch {
        if (active) setCatalogError(getCatalogServiceError());
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadCatalog();

    const refreshOnFocus = () => { void loadCatalog(); };
    window.addEventListener('focus', refreshOnFocus);
    const refreshTimer = window.setInterval(refreshOnFocus, 30_000);

    const channel = import.meta.env.VITE_DISABLE_CATALOG_REALTIME === 'true'
      ? null
      : supabase
          .channel('public-catalog')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'catalog_state', filter: 'id=eq.1' },
            (payload) => {
              const row = payload.new as { data?: unknown; updated_at?: unknown };
              const remoteCatalog = normalizeCatalog(row.data);
              if (remoteCatalog) {
                acceptRemoteCatalog({
                  catalog: remoteCatalog,
                  updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
                });
              } else {
                void loadCatalog();
              }
            },
          )
          .subscribe();

    return () => {
      active = false;
      window.removeEventListener('focus', refreshOnFocus);
      window.clearInterval(refreshTimer);
      if (channel) void supabase!.removeChannel(channel);
    };
  }, [acceptRemoteCatalog, refreshCatalog]);

  const persistCatalog = useCallback(async (next: CatalogState, password: string, expectedUpdatedAt: string | null) => {
    if (!supabase) throw new Error(getCatalogServiceError());

    const { data, error } = await supabase.rpc('save_catalog', {
      admin_password: password,
      new_catalog: next,
      expected_updated_at: expectedUpdatedAt,
    });

    if (error) {
      console.error('[catalog] unable to save shared catalog', { code: error.code });
      throw toSaveError(error.code);
    }

    const row = Array.isArray(data) ? data[0] : data;
    const savedCatalog = normalizeCatalog((row as { data?: unknown } | null)?.data);
    if (savedCatalog) {
      acceptRemoteCatalog({
        catalog: savedCatalog,
        updatedAt: typeof (row as { updated_at?: unknown }).updated_at === 'string'
          ? (row as { updated_at: string }).updated_at
          : null,
      });
      return;
    }

    // Older deployments returned only a timestamp. Always read the database
    // again instead of treating the caller's state as the source of truth.
    const refreshed = await refreshCatalog();
    if (!refreshed) throw new Error('The catalog row was not found after saving.');
  }, [acceptRemoteCatalog, refreshCatalog]);

  const updateCatalog = useCallback(async (
    password: string,
    transform: (current: CatalogState) => CatalogState,
  ) => {
    const latest = await fetchRemoteCatalog();
    if (!latest) throw new Error('The shared catalog has not been initialized yet.');
    await persistCatalog(transform(latest.catalog), password, latest.updatedAt);
  }, [persistCatalog]);

  const value = useMemo<CatalogContextValue>(() => ({
    ...catalog,
    isLoading,
    catalogError,
    authenticateAdmin: async (password) => {
      if (!supabase) throw new Error(getCatalogServiceError());

      const { data, error } = await supabase.rpc('verify_catalog_admin', {
        admin_password: password,
      });
      if (error) {
        console.error('[catalog] admin verification failed', { code: error.code });
        throw new Error(getCatalogServiceError());
      }
      if (data !== true) return false;

      const remote = await fetchRemoteCatalog();
      if (remote) {
        acceptRemoteCatalog(remote);
      } else {
        // The bundled catalog is an emergency seed only for an empty database.
        await persistCatalog(createInitialCatalog(), password, null);
      }

      return true;
    },
    saveProduct: async (product, password) => {
      await updateCatalog(password, (current) => ({
        ...current,
        products: current.products.some((item) => item.id === product.id)
          ? current.products.map((item) => item.id === product.id ? product : item)
          : [product, ...current.products],
      }));
    },
    deleteProduct: async (id, password) => {
      await updateCatalog(password, (current) => ({
        ...current,
        products: current.products.filter((product) => product.id !== id),
      }));
    },
    saveCategory: async (category, password) => {
      await updateCatalog(password, (current) => ({
        ...current,
        categories: current.categories.some((item) => item.id === category.id)
          ? current.categories.map((item) => item.id === category.id ? category : item)
          : [...current.categories, category],
      }));
    },
    deleteCategory: async (id, password) => {
      await updateCatalog(password, (current) => ({
        categories: current.categories.filter((category) => category.id !== id),
        products: current.products.filter((product) => product.categoryId !== id),
      }));
    },
  }), [acceptRemoteCatalog, catalog, catalogError, isLoading, persistCatalog, updateCatalog]);

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
