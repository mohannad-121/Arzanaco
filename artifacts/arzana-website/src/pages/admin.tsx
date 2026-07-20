import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, FileText, MessageSquare, TrendingUp, Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminPanel = () => {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(true);
  const [products, setProducts] = useState<Array<{ id: string; nameEn: string; nameAr: string; category: string; descriptionEn: string; descriptionAr: string; price: number; date: string }>>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    category: 'Switchgear',
    descriptionEn: '',
    descriptionAr: '',
    price: '',
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  const copy =
    language === 'ar'
      ? {
          title: 'لوحة التحكم - Arzana',
          unauthorized: 'غير مصرح',
          enterPassword: 'أدخل كلمة المرور',
          login: 'دخول',
          logout: 'تسجيل خروج',
          dashboard: 'لوحة التحكم',
          stats: 'الإحصائيات',
          recentQuotes: 'طلبات العروض الأخيرة',
          contactSubmissions: 'رسائل الاتصال',
          visitors: 'الزوار',
          revenue: 'الإيرادات',
          date: 'التاريخ',
          month: 'الشهر',
          value: 'القيمة',
          total: 'الإجمالي',
          status: 'الحالة',
          pending: 'قيد الانتظار',
          completed: 'مكتمل',
          backup: 'احفظ بيانات',
          refresh: 'تحديث',
          products: 'المنتجات',
          addProduct: 'إضافة منتج',
          editProduct: 'تعديل منتج',
          deleteProduct: 'حذف منتج',
          productName: 'اسم المنتج',
          productNameEn: 'اسم المنتج (English)',
          productNameAr: 'اسم المنتج (العربية)',
          category: 'الفئة',
          description: 'الوصف',
          descriptionEn: 'الوصف (English)',
          descriptionAr: 'الوصف (العربية)',
          price: 'السعر',
          actions: 'الإجراءات',
          edit: 'تعديل',
          delete: 'حذف',
          save: 'حفظ',
          cancel: 'إلغاء',
          confirmDelete: 'هل أنت متأكد من حذف هذا المنتج؟',
          yes: 'نعم',
          no: 'لا',
        }
      : {
          title: 'Admin Panel - Arzana',
          unauthorized: 'Unauthorized',
          enterPassword: 'Enter Admin Password',
          login: 'Login',
          logout: 'Logout',
          dashboard: 'Dashboard',
          stats: 'Statistics',
          recentQuotes: 'Recent Quote Requests',
          contactSubmissions: 'Contact Submissions',
          visitors: 'Unique Visitors',
          revenue: 'Quote Inquiries by Category',
          date: 'Date',
          month: 'Month',
          value: 'Value',
          total: 'Total',
          status: 'Status',
          pending: 'Pending',
          completed: 'Completed',
          backup: 'Backup Data',
          refresh: 'Refresh',
          products: 'Products',
          addProduct: 'Add Product',
          editProduct: 'Edit Product',
          deleteProduct: 'Delete Product',
          productName: 'Product Name',
          productNameEn: 'Product Name (English)',
          productNameAr: 'Product Name (Arabic)',
          category: 'Category',
          description: 'Description',
          descriptionEn: 'Description (English)',
          descriptionAr: 'Description (Arabic)',
          price: 'Price',
          actions: 'Actions',
          edit: 'Edit',
          delete: 'Delete',
          save: 'Save',
          cancel: 'Cancel',
          confirmDelete: 'Are you sure you want to delete this product?',
          yes: 'Yes',
          no: 'No',
        };

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('arzana_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('arzana_products', JSON.stringify(products));
    }
  }, [products, isAuthenticated]);

  // Helper functions for CRUD
  const handleAddProduct = () => {
    if (editingId) {
      // Update existing product
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId, date: p.date } : p));
      setEditingId(null);
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
      };
      setProducts([newProduct, ...products]);
    }
    resetForm();
    setShowAddModal(false);
  };

  const handleEditProduct = (product: typeof products[0]) => {
    setEditingId(product.id);
    setFormData({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      category: product.category,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      price: product.price.toString(),
    });
    setShowAddModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameAr: '',
      category: 'Switchgear',
      descriptionEn: '',
      descriptionAr: '',
      price: '',
    });
    setEditingId(null);
  };

  // Sample data
  const visitorsData = [
    { date: 'Mon', visitors: 240 },
    { date: 'Tue', visitors: 221 },
    { date: 'Wed', visitors: 229 },
    { date: 'Thu', visitors: 200 },
    { date: 'Fri', visitors: 250 },
    { date: 'Sat', visitors: 210 },
    { date: 'Sun', visitors: 290 },
  ];

  const categoryData = [
    { name: 'Switchgear', value: 35 },
    { name: 'Transformers', value: 25 },
    { name: 'Protection Systems', value: 20 },
    { name: 'Other', value: 20 },
  ];

  const quoteData = [
    { id: 1, date: '2024-07-20', name: 'Ahmed Al-Rashid', category: 'Switchgear', status: 'pending' },
    { id: 2, date: '2024-07-19', name: 'Sara Al-Subaie', category: 'Transformers', status: 'completed' },
    { id: 3, date: '2024-07-18', name: 'Omar Al-Khalid', category: 'Protection Systems', status: 'pending' },
  ];

  const COLORS = ['#a41c47', '#d63d61', '#e67e9f', '#f0a8c3'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin@arzana2024') {
      setIsAuthenticated(true);
      setShowPasswordInput(false);
      setPassword('');
    } else {
      alert('Invalid password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowPasswordInput(true);
    setLocation('/');
  };

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl">{copy.dashboard}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder={copy.enterPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground"
                  required
                />
                <Button type="submit" className="w-full">
                  {copy.login}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{copy.dashboard}</h1>
            <p className="mt-2 text-muted-foreground">Welcome to the Arzana Admin Panel</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {copy.logout}
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-[#a41c47] text-[#a41c47]' : 'text-muted-foreground'}`}
          >
            {copy.dashboard}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-[#a41c47] text-[#a41c47]' : 'text-muted-foreground'}`}
          >
            {copy.products}
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{copy.visitors}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">1,624</div>
                    <Users className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="mt-2 text-xs text-green-600">+12% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{copy.recentQuotes}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">87</div>
                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="mt-2 text-xs text-green-600">+5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{copy.contactSubmissions}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">42</div>
                    <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="mt-2 text-xs text-yellow-600">8 pending responses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">12.5%</div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="mt-2 text-xs text-green-600">+2.1% from last period</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{copy.stats} - Weekly Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={visitorsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#a41c47" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{copy.revenue}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Quotes Table */}
            <Card>
              <CardHeader>
                <CardTitle>{copy.recentQuotes}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">Category</th>
                        <th className="py-2 text-left">{copy.date}</th>
                        <th className="py-2 text-left">{copy.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteData.map((quote) => (
                        <tr key={quote.id} className="border-b">
                          <td className="py-3">{quote.name}</td>
                          <td className="py-3">{quote.category}</td>
                          <td className="py-3">{quote.date}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {quote.status === 'pending' ? copy.pending : copy.completed}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline">{copy.refresh}</Button>
              <Button variant="outline">{copy.backup}</Button>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Button */}
            <Button onClick={() => { resetForm(); setShowAddModal(true); }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {copy.addProduct}
            </Button>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>{copy.products} ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No products yet. Add your first product!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left">{copy.productName}</th>
                          <th className="py-3 text-left">{copy.category}</th>
                          <th className="py-3 text-left">{copy.price}</th>
                          <th className="py-3 text-left">{copy.date}</th>
                          <th className="py-3 text-left">{copy.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="py-3">
                              <div>
                                <p className="font-medium">{product.nameEn}</p>
                                <p className="text-xs text-muted-foreground">{product.nameAr}</p>
                              </div>
                            </td>
                            <td className="py-3">{product.category}</td>
                            <td className="py-3">${product.price}</td>
                            <td className="py-3">{product.date}</td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditProduct(product)}
                                  className="flex items-center gap-1"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  {copy.edit}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeleteConfirmId(product.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  {copy.delete}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{editingId ? copy.editProduct : copy.addProduct}</CardTitle>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{copy.productNameEn}</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{copy.productNameAr}</label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{copy.category}</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option>Switchgear</option>
                      <option>Transformers</option>
                      <option>Protection Systems</option>
                      <option>Cables</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{copy.price}</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{copy.descriptionEn}</label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{copy.descriptionAr}</label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                  >
                    {copy.cancel}
                  </Button>
                  <Button onClick={handleAddProduct}>
                    {copy.save}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>{copy.confirmDelete}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  {copy.no}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProduct(deleteConfirmId)}
                >
                  {copy.yes}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default AdminPanel;
