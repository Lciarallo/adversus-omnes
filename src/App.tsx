import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { InfinitePayModal } from './components/InfinitePayModal';
import { HomePage } from './pages/HomePage';
import { EmptyState } from './components/ui/EmptyState';
import { BookOpen, Lock } from 'lucide-react';

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
  const { activeTab, setActiveTab, selectedReaderItem, catalog, currentUser, setRole } = useStore();

  // O leitor abre a versão atual da obra: a cópia guardada ao clicar pode
  // ter sido editada ou removida pelo administrador desde então.
  const readerItem =
    (selectedReaderItem && catalog.find(c => c.id === selectedReaderItem.id)) ||
    catalog.find(c => c.type === 'digital') ||
    catalog[0];

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
        if (!readerItem) {
          return (
            <div className="mx-auto max-w-2xl px-4 py-16">
              <EmptyState
                icon={<BookOpen size={22} aria-hidden="true" />}
                title="Esta obra não está mais no acervo"
                body="O documento pode ter sido removido do catálogo. O acervo online reúne tudo o que segue disponível para leitura."
                action={{ label: 'Abrir o acervo online', onClick: () => setActiveTab('digital') }}
              />
            </div>
          );
        }
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <DigitalViewer item={readerItem} onBack={() => setActiveTab('digital')} />
          </Suspense>
        );
      case 'admin':
        if (currentUser.role !== 'admin') {
          return (
            <div className="mx-auto max-w-2xl px-4 py-16">
              <EmptyState
                icon={<Lock size={22} aria-hidden="true" />}
                title="Painel restrito à administração"
                body="O painel administrativo só abre no perfil de administrador. Nesta demonstração, o perfil pode ser trocado a qualquer momento."
                action={{ label: 'Entrar como administrador', onClick: () => setRole('admin') }}
              />
            </div>
          );
        }
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
    <div className="museum-app min-h-screen bg-paper-500 text-ink flex flex-col justify-between selection:bg-rubrica selection:text-paper-800 w-full max-w-full overflow-x-clip">
      <a href="#conteudo" className="ch-skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="museum-main flex-grow w-full max-w-full overflow-x-clip outline-none">
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
