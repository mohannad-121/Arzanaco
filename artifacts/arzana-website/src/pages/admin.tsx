import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';

const AdminPanel = () => {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(true);

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
                    <th className="py-2 text-left">Date</th>
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
    </PageWrapper>
  );
};

export default AdminPanel;
