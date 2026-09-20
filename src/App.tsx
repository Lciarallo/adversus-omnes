import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { InfinitePayModal } from './components/InfinitePayModal';
import { HomePage } from './pages/HomePage';

// Code-splitting with React.lazy for optimized bundle and performance
const PhysicalCatalog = lazy(() =>
  import('./components/PhysicalCatalog').then(module => ({ default: module.PhysicalCatalog }))
);
const DigitalCatalog = lazy(() =>
  import('./components/DigitalCatalog').then(module => ({ default: module.DigitalCatalog }))
);
const AuthorManager = lazy(() =>
  import('./components/AuthorManager').then(module => ({ default: module.AuthorManager }))
);
const ArticleCMS = lazy(() =>
  import('./components/ArticleCMS').then(module => ({ default: module.ArticleCMS }))
);
const SubscriptionPlans = lazy(() =>
  import('./components/SubscriptionPlans').then(module => ({ default: module.SubscriptionPlans }))
);
const DigitalViewer = lazy(() =>
  import('./components/DigitalViewer').then(module => ({ default: module.DigitalViewer }))
);
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard }))
);
const CustomerPortal = lazy(() =>
  import('./components/CustomerPortal').then(module => ({ default: module.CustomerPortal }))
);

const ViewLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 py-20">
    <div className="w-8 h-8 border-2 border-rubrica border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    <span className="text-xs font-mono text-ink-soft">Carregando acervo...</span>
  </div>
);

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedReaderItem, catalog } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'fisico':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <PhysicalCatalog />
          </Suspense>
        );
      case 'digital':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <DigitalCatalog />
          </Suspense>
        );
      case 'autores':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <AuthorManager />
          </Suspense>
        );
      case 'artigos':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <ArticleCMS />
          </Suspense>
        );
      case 'planos':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <SubscriptionPlans />
          </Suspense>
        );
      case 'leitor':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <DigitalViewer
              item={selectedReaderItem || catalog.find(c => c.type === 'digital') || catalog[0]}
              onBack={() => setActiveTab('digital')}
            />
          </Suspense>
        );
      case 'admin':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        );
      case 'minha-conta':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <CustomerPortal />
          </Suspense>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-paper-500 text-ink flex flex-col justify-between selection:bg-rubrica selection:text-paper-800 w-full max-w-full overflow-x-clip">
      <a href="#conteudo" className="ch-skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="flex-grow w-full max-w-full overflow-x-clip outline-none">
        {/* A chave remonta a fronteira a cada troca de seção: um erro numa
            view não deixa as outras inacessíveis. */}
        <ErrorBoundary key={activeTab}>{renderContent()}</ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <InfinitePayModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ToastProvider>
  );
};

export default App;
