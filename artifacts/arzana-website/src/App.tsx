import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { LanguageProvider } from './contexts/LanguageContext';

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
import NotFound from './pages/not-found';

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
      <Route path="/safety-systems" component={SafetySystems} />
      <Route path="/clients" component={Clients} />
      <Route path="/contact" component={Contact} />
      <Route path="/request-quote" component={RequestQuote} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin-panel" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
