import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { InfinitePayModal } from './components/InfinitePayModal';
import { HomePage } from './pages/HomePage';
import { PhysicalCatalog } from './components/PhysicalCatalog';
import { DigitalCatalog } from './components/DigitalCatalog';
import { AuthorManager } from './components/AuthorManager';
import { ArticleCMS } from './components/ArticleCMS';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { DigitalViewer } from './components/DigitalViewer';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerPortal } from './components/CustomerPortal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedReaderItem, catalog } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'fisico':
        return <PhysicalCatalog />;
      case 'digital':
        return <DigitalCatalog />;
      case 'autores':
        return <AuthorManager />;
      case 'artigos':
        return <ArticleCMS />;
      case 'planos':
        return <SubscriptionPlans />;
      case 'leitor':
        return (
          <DigitalViewer
            item={selectedReaderItem || catalog.find(c => c.type === 'digital') || catalog[0]}
            onBack={() => setActiveTab('digital')}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      case 'minha-conta':
        return <CustomerPortal />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#101114] text-[#e8e6e3] flex flex-col justify-between selection:bg-[#c89b3c] selection:text-black">
      <Navbar />
      <main className="flex-grow">{renderContent()}</main>
      <Footer />
      <CartDrawer />
      <InfinitePayModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
