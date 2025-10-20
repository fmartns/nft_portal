import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrendingSection } from './components/TrendingSection';
import { AllItemsMarketplace } from './components/AllItemsMarketplace';
import { AllCollectionsSection } from './components/AllCollectionsSection';
import { CollectionDetailSection } from './components/CollectionDetailSection';
import { NFTItemPage } from './components/NFTItemPage';
import { PromotionsPage } from './components/PromotionsPage';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to: string) => {
    const target = to.startsWith('/') ? to : `/${to}`;
    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
      setPath(target);
    }
  };

  const activeTab = useMemo(() => {
    if (path === '/' || path === '/home') return 'home';
    if (path === '/collections') return 'collections';
    if (path === '/promocoes') return 'promocoes';
    return 'collections'; // highlight Collections when viewing a collection slug
  }, [path]);

  const handleLogoClick = () => navigate('/');
  const handleTabChange = (tab: string) => {
    if (tab === 'home') navigate('/');
    else if (tab === 'collections') navigate('/collections');
    else if (tab === 'promocoes') navigate('/promocoes');
  };

  // Match routes: /, /collections, /promocoes, /:slug, /:slug/:productCode
  const itemRoute = useMemo(() => {
    const p = (path || '/').replace(/\/+$/, '');
    const segments = p.split('/').filter(Boolean);
    if (segments.length === 2) {
      return { slug: segments[0], productCode: segments[1] };
    }
    return null;
  }, [path]);

  const slugFromPath = useMemo(() => {
    const p = (path || '/').replace(/\/+$/, ''); // remove trailing slash
    if (!p || p === '/') return null;
    if (p === '/collections' || p === '/promocoes' || p === '/home') return null;
    // Treat any single-segment path as a collection slug
    const segments = p.split('/').filter(Boolean);
    if (segments.length === 1) return segments[0];
    return null;
  }, [path]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onLogoClick={handleLogoClick}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main>
        {itemRoute ? (
          <NFTItemPage
            slug={itemRoute.slug}
            productCode={itemRoute.productCode}
            onBack={() => window.history.back()}
          />
        ) : slugFromPath ? (
          <CollectionDetailSection 
            collectionId={slugFromPath}
            onBack={() => navigate('/collections')}
          />
        ) : path === '/collections' ? (
          <AllCollectionsSection onCollectionSelect={(slug) => navigate(`/${slug}`)} />
        ) : path === '/promocoes' ? (
          <PromotionsPage />
        ) : (
          <>
            <HeroSection />
            <TrendingSection />
            <AllItemsMarketplace />
            {/* StatsSection removed per request */}
          </>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}