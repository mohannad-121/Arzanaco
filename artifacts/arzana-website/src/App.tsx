import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { LanguageProvider } from './contexts/LanguageContext';
import { CatalogProvider } from './contexts/CatalogContext';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { PageTransitionLoader } from './components/layout/PageTransitionLoader';
import { AssistantProvider } from './components/ArzanaAssistant';

// Pages
import Home from './pages/home';
import About from './pages/about';
import Products from './pages/products';
import ProductDetail from './pages/product-detail';
import TestingCommissioning from './pages/testing';
import SafetySystems from './pages/safety';
import Clients from './pages/clients';
import Contact from './pages/contact';
import RequestQuote from './pages/request-quote';
import Privacy from './pages/privacy';
import Admin from './pages/admin';
import ArzanaAi from './pages/arzana-ai';
import NotFound from './pages/not-found';
import { lazy, Suspense } from 'react';

const EngineeringDesignCalculations = lazy(() => import('./pages/engineering-design-calculations'));

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      
      {/* Products Routing */}
      <Route path="/products" component={Products} />
      <Route path="/products/:categorySlug">
        {(params) => <Products params={params} />}
      </Route>
      <Route path="/products/:categorySlug/:productSlug">
        {(params) => <ProductDetail params={params} />}
      </Route>
      
      <Route path="/testing-commissioning" component={TestingCommissioning} />
      <Route path="/engineering-design-calculations">
        <Suspense fallback={<div role="status" className="min-h-screen bg-background pt-32 text-center">Loading / جارٍ التحميل…</div>}><EngineeringDesignCalculations /></Suspense>
      </Route>
      <Route path="/safety-systems" component={SafetySystems} />
      <Route path="/clients" component={Clients} />
      <Route path="/contact" component={Contact} />
      <Route path="/request-quote" component={RequestQuote} />
      <Route path="/arzana-ai" component={ArzanaAi} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin-panel" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CatalogProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <AssistantProvider>
              <ScrollToTop />
              <PageTransitionLoader />
              <Router />
              </AssistantProvider>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </CatalogProvider>
    </LanguageProvider>
  );
}

export default App;
