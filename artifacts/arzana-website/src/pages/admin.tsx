import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Edit2, FolderCog, LogOut, Package, Plus, Trash2, X } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { createSlug, useCatalog, type ManagedProduct } from '@/contexts/CatalogContext';
import type { Category } from '@/data/categories';

const AUTH_KEY = 'arzana_admin_authenticated';
const FIELD_CLASS = 'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:ring-2 focus:ring-ring';

type ProductForm = {
  nameEn: string;
  nameAr: string;
  slug: string;
  categoryId: string;
  descriptionEn: string;
  descriptionAr: string;
  types: string;
};

type CategoryForm = { nameEn: string; nameAr: string; slug: string };

const emptyProductForm: ProductForm = {
  nameEn: '', nameAr: '', slug: '', categoryId: '', descriptionEn: '', descriptionAr: '', types: '',
};
const emptyCategoryForm: CategoryForm = { nameEn: '', nameAr: '', slug: '' };

export default function AdminPanel() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { products, categories, saveProduct, deleteProduct, saveCategory, deleteCategory } = useCatalog();
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'solutions'>('products');
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: 'product' | 'category'; id: string } | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!productForm.categoryId && categories[0]) {
      setProductForm((current) => ({ ...current, categoryId: categories[0].id }));
    }
  }, [categories, productForm.categoryId]);

  const copy = language === 'ar'
    ? {
        admin: 'إدارة محتوى أرزانة', login: 'تسجيل الدخول', password: 'كلمة مرور المسؤول', invalid: 'كلمة المرور غير صحيحة.',
        logout: 'تسجيل الخروج', products: 'المنتجات', solutions: 'الحلول / الفئات', addProduct: 'إضافة منتج', addSolution: 'إضافة حل',
        editProduct: 'تعديل المنتج', editSolution: 'تعديل الحل', englishName: 'الاسم بالإنجليزية', arabicName: 'الاسم بالعربية',
        slug: 'رابط الصفحة', category: 'الحل / الفئة', englishDescription: 'الوصف بالإنجليزية', arabicDescription: 'الوصف بالعربية',
        options: 'الخيارات (افصل بينها بفواصل)', edit: 'تعديل', remove: 'حذف', save: 'حفظ', cancel: 'إلغاء',
        required: 'يرجى إكمال جميع الحقول المطلوبة.', duplicateSlug: 'رابط الصفحة مستخدم بالفعل.', noProducts: 'لا توجد منتجات.', noSolutions: 'لا توجد حلول.',
        deleteProduct: 'هل تريد حذف هذا المنتج؟ سيختفي من الموقع.', deleteSolution: 'هل تريد حذف هذا الحل؟ سيتم أيضاً حذف جميع المنتجات التابعة له.',
      }
    : {
        admin: 'Arzana Content Manager', login: 'Log in', password: 'Admin password', invalid: 'Incorrect password.',
        logout: 'Log out', products: 'Products', solutions: 'Solutions / Categories', addProduct: 'Add product', addSolution: 'Add solution',
        editProduct: 'Edit product', editSolution: 'Edit solution', englishName: 'English name', arabicName: 'Arabic name',
        slug: 'Page URL', category: 'Solution / category', englishDescription: 'English description', arabicDescription: 'Arabic description',
        options: 'Options (comma separated)', edit: 'Edit', remove: 'Delete', save: 'Save', cancel: 'Cancel',
        required: 'Complete all required fields.', duplicateSlug: 'That page URL is already in use.', noProducts: 'No products available.', noSolutions: 'No solutions available.',
        deleteProduct: 'Delete this product? It will disappear from the website.', deleteSolution: 'Delete this solution? All products inside it will also be deleted.',
      };

  const categoryById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    if (password !== 'admin@arzana2024') {
      setLoginError(copy.invalid);
      setPassword('');
      return;
    }
    sessionStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
    setLoginError('');
    setPassword('');
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setLocation('/');
  };

  const openNewProduct = () => {
    setEditingProductId(null);
    setProductForm({ ...emptyProductForm, categoryId: categories[0]?.id ?? '' });
    setFormError('');
    setProductModalOpen(true);
  };

  const openProduct = (product: ManagedProduct) => {
    setEditingProductId(product.id);
    setProductForm({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      slug: product.slug,
      categoryId: product.categoryId,
      descriptionEn: product.descriptionEn ?? '',
      descriptionAr: product.descriptionAr ?? '',
      types: product.types?.join(', ') ?? '',
    });
    setFormError('');
    setProductModalOpen(true);
  };

  const submitProduct = (event: FormEvent) => {
    event.preventDefault();
    const slug = createSlug(productForm.slug || productForm.nameEn);
    if (!productForm.nameEn.trim() || !productForm.nameAr.trim() || !slug || !productForm.categoryId) {
      setFormError(copy.required);
      return;
    }
    if (products.some((product) => product.slug === slug && product.id !== editingProductId)) {
      setFormError(copy.duplicateSlug);
      return;
    }
    saveProduct({
      id: editingProductId ?? createId('product'),
      slug,
      categoryId: productForm.categoryId,
      nameEn: productForm.nameEn.trim(),
      nameAr: productForm.nameAr.trim(),
      descriptionEn: productForm.descriptionEn.trim() || undefined,
      descriptionAr: productForm.descriptionAr.trim() || undefined,
      types: productForm.types.split(',').map((item) => item.trim()).filter(Boolean),
    });
    setProductModalOpen(false);
  };

  const openNewCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
    setFormError('');
    setCategoryModalOpen(true);
  };

  const openCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ nameEn: category.nameEn, nameAr: category.nameAr, slug: category.slug });
    setFormError('');
    setCategoryModalOpen(true);
  };

  const submitCategory = (event: FormEvent) => {
    event.preventDefault();
    const slug = createSlug(categoryForm.slug || categoryForm.nameEn);
    if (!categoryForm.nameEn.trim() || !categoryForm.nameAr.trim() || !slug) {
      setFormError(copy.required);
      return;
    }
    if (categories.some((category) => category.slug === slug && category.id !== editingCategoryId)) {
      setFormError(copy.duplicateSlug);
      return;
    }
    saveCategory({ id: editingCategoryId ?? createId('category'), slug, nameEn: categoryForm.nameEn.trim(), nameAr: categoryForm.nameAr.trim() });
    setCategoryModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'product') deleteProduct(deleteTarget.id);
    else deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <main className="flex min-h-[70vh] items-center justify-center bg-muted/40 px-4 py-16">
          <Card className="w-full max-w-md">
            <CardHeader><CardTitle className="text-center text-2xl">{copy.admin}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="sr-only" htmlFor="admin-password">{copy.password}</label>
                <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.password} className="w-full rounded-md border bg-background px-3 py-2" required />
                {loginError && <p role="alert" className="text-sm text-destructive">{loginError}</p>}
                <Button type="submit" className="w-full">{copy.login}</Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="container mx-auto space-y-8 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-3xl font-bold md:text-4xl">{copy.admin}</h1><p className="mt-2 text-muted-foreground">{products.length} {copy.products.toLocaleLowerCase()} · {categories.length} {copy.solutions.toLocaleLowerCase()}</p></div>
          <Button variant="outline" onClick={logout}><LogOut className="me-2 h-4 w-4" />{copy.logout}</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card><CardContent className="flex items-center gap-4 p-6"><Package className="h-9 w-9 text-primary" /><div><p className="text-3xl font-bold">{products.length}</p><p className="text-sm text-muted-foreground">{copy.products}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><FolderCog className="h-9 w-9 text-primary" /><div><p className="text-3xl font-bold">{categories.length}</p><p className="text-sm text-muted-foreground">{copy.solutions}</p></div></CardContent></Card>
        </div>

        <div className="flex gap-2 border-b">
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')}>{copy.products}</TabButton>
          <TabButton active={activeTab === 'solutions'} onClick={() => setActiveTab('solutions')}>{copy.solutions}</TabButton>
        </div>

        {activeTab === 'products' ? (
          <ContentTable title={`${copy.products} (${products.length})`} actionLabel={copy.addProduct} onAction={openNewProduct} empty={products.length === 0 ? copy.noProducts : undefined}>
            {products.map((product) => (
              <div key={product.id} className="grid gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-[2fr_1.4fr_auto] md:items-center">
                <div><p className="font-semibold">{product.nameEn}</p><p className="text-sm text-muted-foreground">{product.nameAr}</p></div>
                <p className="text-sm text-muted-foreground">{categoryById.get(product.categoryId)?.nameEn ?? '—'}</p>
                <RowActions editLabel={copy.edit} deleteLabel={copy.remove} onEdit={() => openProduct(product)} onDelete={() => setDeleteTarget({ kind: 'product', id: product.id })} />
              </div>
            ))}
          </ContentTable>
        ) : (
          <ContentTable title={`${copy.solutions} (${categories.length})`} actionLabel={copy.addSolution} onAction={openNewCategory} empty={categories.length === 0 ? copy.noSolutions : undefined}>
            {categories.map((category) => (
              <div key={category.id} className="grid gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-[2fr_1fr_auto] md:items-center">
                <div><p className="font-semibold">{category.nameEn}</p><p className="text-sm text-muted-foreground">{category.nameAr}</p></div>
                <p className="text-sm text-muted-foreground">{products.filter((product) => product.categoryId === category.id).length} {copy.products.toLocaleLowerCase()}</p>
                <RowActions editLabel={copy.edit} deleteLabel={copy.remove} onEdit={() => openCategory(category)} onDelete={() => setDeleteTarget({ kind: 'category', id: category.id })} />
              </div>
            ))}
          </ContentTable>
        )}
      </main>

      {productModalOpen && (
        <Modal title={editingProductId ? copy.editProduct : copy.addProduct} onClose={() => setProductModalOpen(false)}>
          <form onSubmit={submitProduct} className="space-y-4">
            <TwoColumns>
              <Field label={copy.englishName} required><input value={productForm.nameEn} onChange={(event) => setProductForm({ ...productForm, nameEn: event.target.value, slug: editingProductId ? productForm.slug : createSlug(event.target.value) })} className={FIELD_CLASS} /></Field>
              <Field label={copy.arabicName} required><input dir="rtl" value={productForm.nameAr} onChange={(event) => setProductForm({ ...productForm, nameAr: event.target.value })} className={FIELD_CLASS} /></Field>
            </TwoColumns>
            <TwoColumns>
              <Field label={copy.slug} required><input value={productForm.slug} onChange={(event) => setProductForm({ ...productForm, slug: event.target.value })} className={FIELD_CLASS} /></Field>
              <Field label={copy.category} required><select value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })} className={FIELD_CLASS}>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameEn}</option>)}</select></Field>
            </TwoColumns>
            <Field label={copy.englishDescription}><textarea rows={3} value={productForm.descriptionEn} onChange={(event) => setProductForm({ ...productForm, descriptionEn: event.target.value })} className={FIELD_CLASS} /></Field>
            <Field label={copy.arabicDescription}><textarea dir="rtl" rows={3} value={productForm.descriptionAr} onChange={(event) => setProductForm({ ...productForm, descriptionAr: event.target.value })} className={FIELD_CLASS} /></Field>
            <Field label={copy.options}><input value={productForm.types} onChange={(event) => setProductForm({ ...productForm, types: event.target.value })} className={FIELD_CLASS} /></Field>
            {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
            <ModalActions cancel={copy.cancel} save={copy.save} onCancel={() => setProductModalOpen(false)} />
          </form>
        </Modal>
      )}

      {categoryModalOpen && (
        <Modal title={editingCategoryId ? copy.editSolution : copy.addSolution} onClose={() => setCategoryModalOpen(false)}>
          <form onSubmit={submitCategory} className="space-y-4">
            <TwoColumns>
              <Field label={copy.englishName} required><input value={categoryForm.nameEn} onChange={(event) => setCategoryForm({ ...categoryForm, nameEn: event.target.value, slug: editingCategoryId ? categoryForm.slug : createSlug(event.target.value) })} className={FIELD_CLASS} /></Field>
              <Field label={copy.arabicName} required><input dir="rtl" value={categoryForm.nameAr} onChange={(event) => setCategoryForm({ ...categoryForm, nameAr: event.target.value })} className={FIELD_CLASS} /></Field>
            </TwoColumns>
            <Field label={copy.slug} required><input value={categoryForm.slug} onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })} className={FIELD_CLASS} /></Field>
            {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
            <ModalActions cancel={copy.cancel} save={copy.save} onCancel={() => setCategoryModalOpen(false)} />
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title={deleteTarget.kind === 'product' ? copy.deleteProduct : copy.deleteSolution} onClose={() => setDeleteTarget(null)} compact>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDeleteTarget(null)}>{copy.cancel}</Button><Button variant="destructive" onClick={confirmDelete}>{copy.remove}</Button></div>
        </Modal>
      )}
    </PageWrapper>
  );
}

function createId(prefix: string) {
  return `${prefix}-${typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(36)}`;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} className={`border-b-2 px-4 py-3 font-medium ${active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{children}</button>;
}

function ContentTable({ title, actionLabel, onAction, empty, children }: { title: string; actionLabel: string; onAction: () => void; empty?: string; children: ReactNode }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between gap-3"><CardTitle>{title}</CardTitle><Button onClick={onAction}><Plus className="me-2 h-4 w-4" />{actionLabel}</Button></CardHeader><CardContent className="p-0">{empty ? <p className="p-10 text-center text-muted-foreground">{empty}</p> : children}</CardContent></Card>;
}

function RowActions({ editLabel, deleteLabel, onEdit, onDelete }: { editLabel: string; deleteLabel: string; onEdit: () => void; onDelete: () => void }) {
  return <div className="flex gap-2 md:justify-end"><Button size="sm" variant="outline" onClick={onEdit}><Edit2 className="me-1 h-3 w-3" />{editLabel}</Button><Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="me-1 h-3 w-3" />{deleteLabel}</Button></div>;
}

function Modal({ title, onClose, compact, children }: { title: string; onClose: () => void; compact?: boolean; children: ReactNode }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={title}><Card className={`max-h-[92vh] w-full overflow-y-auto ${compact ? 'max-w-lg' : 'max-w-3xl'}`}><CardHeader className="flex flex-row items-start justify-between gap-4"><CardTitle className="text-xl">{title}</CardTitle><button type="button" onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-muted-foreground" /></button></CardHeader><CardContent>{children}</CardContent></Card></div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="block space-y-1.5 text-sm font-medium">{label}{required && <span className="text-destructive"> *</span>}{children}</label>;
}

function TwoColumns({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function ModalActions({ cancel, save, onCancel }: { cancel: string; save: string; onCancel: () => void }) {
  return <div className="flex justify-end gap-3 border-t pt-4"><Button type="button" variant="outline" onClick={onCancel}>{cancel}</Button><Button type="submit">{save}</Button></div>;
}
