import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { Button } from './ui/button';
import { Wallet, Search, Menu, X } from 'lucide-react';
import { Input } from './ui/input';
import { fetchNFTByProductCode, fetchNFTItems, type NFTItem } from '@/api/nft';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeaderProps {
  onLogoClick?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Header({ onLogoClick, activeTab = 'home', onTabChange }: HeaderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Local navigation helper
  const goTo = (to: string) => {
    const target = to.startsWith('/') ? to : `/${to}`;
    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Erro ao conectar carteira:', error);
      }
    } else {
      alert('MetaMask não encontrado. Por favor, instale a extensão MetaMask.');
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // SearchBox component with typeahead suggestions (desktop and mobile reuse)
  function SearchBox({ className = '' }: { className?: string }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<NFTItem[]>([]);
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);

    // Close on outside click
    useEffect(() => {
      const onDown = (e: MouseEvent) => {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', onDown);
      return () => document.removeEventListener('mousedown', onDown);
    }, []);

    // Debounced fetch
    useEffect(() => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const q = query.trim();
      if (!q) {
        setItems([]);
        setOpen(false);
        setHighlight(-1);
        return;
      }
      timerRef.current = window.setTimeout(async () => {
        try {
          setLoading(true);
          const res = await fetchNFTItems({ search: q, page_size: 8, ordering: '-updated_at' });
          setItems(res.results || []);
          setOpen((res.results || []).length > 0);
          setHighlight(-1);
        } catch {
          setItems([]);
          setOpen(false);
          setHighlight(-1);
        } finally {
          setLoading(false);
        }
      }, 250);
      return () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [query]);

    const navigateToItem = (it: NFTItem) => {
      if (it.collection_slug && it.product_code) {
        goTo(`/${it.collection_slug}/${it.product_code}`);
      } else if (it.collection_slug) {
        goTo(`/${it.collection_slug}`);
      }
      setOpen(false);
    };

    const onSubmit = async () => {
      const q = query.trim();
      if (!q) return;
      // If there are suggestions and one is highlighted, go to it
      if (open && items.length > 0) {
        const index = highlight >= 0 ? highlight : 0;
        navigateToItem(items[index]);
        return;
      }
      // Try direct product_code match
      try {
        const direct = await fetchNFTByProductCode(q);
        if (direct) {
          navigateToItem(direct);
          return;
        }
      } catch {}
      // Fallback: if we had any items, go to the first
      if (items.length > 0) {
        navigateToItem(items[0]);
      }
      setOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || items.length === 0) {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSubmit();
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => (h + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => (h <= 0 ? items.length - 1 : h - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = highlight >= 0 ? highlight : 0;
        navigateToItem(items[idx]);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    return (
      <div ref={wrapperRef} className={`relative ${className}`}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar NFTs, coleções..."
            className="pl-10 bg-muted/30 border-border/40"
          />
        </div>

        {open && (
          <div className="absolute z-50 mt-2 w-full bg-card border border-border/40 rounded-md shadow-md">
            <ul className="max-h-80 overflow-y-auto py-1">
              {items.map((it, idx) => (
                <li
                  key={it.id}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseLeave={() => setHighlight(-1)}
                  onMouseDown={(e) => { e.preventDefault(); navigateToItem(it); }}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between ${idx === highlight ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex items-center min-w-0 mr-3 gap-3">
                    <div className="h-9 w-9 rounded-md overflow-hidden flex-shrink-0 bg-muted/40 border border-border/40">
                      <ImageWithFallback
                        src={it.image_url || ''}
                        alt={it.name || it.product_code || 'NFT'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{it.name || it.product_code}</p>
                      <p className="text-xs text-muted-foreground truncate">{it.collection_name || it.collection_slug}</p>
                    </div>
                  </div>
                  <div className="text-sm text-[#FFE000] font-semibold">
                    {typeof it.last_price_brl === 'string' || typeof it.last_price_brl === 'number' ? `R$ ${Number(it.last_price_brl || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
                  </div>
                </li>
              ))}
              {loading && (
                <li className="px-3 py-2 text-sm text-muted-foreground">Carregando…</li>
              )}
              {!loading && items.length === 0 && (
                <li className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0"
            onClick={onLogoClick}
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-lg bg-[#FFE000] flex items-center justify-center">
                <span className="text-black font-bold text-sm">H</span>
              </div>
            </div>
            <span className="text-lg font-bold text-[#FFE000]">
              Habbo Marketplace
            </span>
          </button>

          {/* Navigation Menu - Desktop */}
          <div className="hidden lg:flex items-center mx-8">
            <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                size="sm"
                className={`${activeTab === 'home' ? 'bg-[#FFE000] text-black hover:bg-[#FFD700]' : 'hover:bg-muted/50'}`}
                onClick={() => onTabChange?.('home')}
              >
                Home
              </Button>
              <Button
                variant={activeTab === 'collections' ? 'default' : 'ghost'}
                size="sm"
                className={`${activeTab === 'collections' ? 'bg-[#FFE000] text-black hover:bg-[#FFD700]' : 'hover:bg-muted/50'}`}
                onClick={() => onTabChange?.('collections')}
              >
                Coleções
              </Button>
              <Button
                variant={activeTab === 'promocoes' ? 'default' : 'ghost'}
                size="sm"
                className={`${activeTab === 'promocoes' ? 'bg-[#FFE000] text-black hover:bg-[#FFD700]' : 'hover:bg-muted/50'}`}
                onClick={() => onTabChange?.('promocoes')}
              >
                Promoções
              </Button>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-lg">
            <SearchBox className="w-full" />
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2 bg-[#FFE000]/10 px-3 py-1.5 rounded-lg border border-[#FFE000]/20">
                <div className="h-2 w-2 bg-[#FFE000] rounded-full animate-pulse"></div>
                <span className="text-sm">{formatAddress(walletAddress)}</span>
              </div>
            ) : (
              <Button 
                onClick={connectWallet}
                className="bg-[#FFE000] hover:bg-[#FFD700] text-black border-0"
              >
                <Wallet className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Conectar Carteira</span>
                <span className="sm:hidden">Conectar</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/40 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <SearchBox />
              
              {/* Mobile Navigation */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={activeTab === 'home' ? 'default' : 'ghost'}
                  className={`${activeTab === 'home' ? 'bg-[#FFE000] text-black' : ''}`}
                  onClick={() => {
                    onTabChange?.('home');
                    setIsMenuOpen(false);
                  }}
                >
                  Home
                </Button>
                <Button
                  variant={activeTab === 'collections' ? 'default' : 'ghost'}
                  className={`${activeTab === 'collections' ? 'bg-[#FFE000] text-black' : ''}`}
                  onClick={() => {
                    onTabChange?.('collections');
                    setIsMenuOpen(false);
                  }}
                >
                  Coleções
                </Button>
                <Button
                  variant={activeTab === 'promocoes' ? 'default' : 'ghost'}
                  className={`${activeTab === 'promocoes' ? 'bg-[#FFE000] text-black' : ''}`}
                  onClick={() => {
                    onTabChange?.('promocoes');
                    setIsMenuOpen(false);
                  }}
                >
                  Promoções
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}