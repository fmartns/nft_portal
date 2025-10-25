import React, { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Heart, Share2, TrendingUp, TrendingDown, ShoppingCart, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { ShareModal } from './ShareModal';

interface NFTItem {
  id: string;
  name: string;
  image?: string;
  image_url?: string;
  price: number;
  lastSale: number;
  rarity: string;
  collection?: string;
}

interface NFTDetailModalProps {
  item: NFTItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data para histórico de preços (em Reais)
const mockPriceHistory = [
  { date: '11 Set', price: 25.00, volume: 2 },
  { date: '16 Set', price: 22.50, volume: 1 },
  { date: '21 Set', price: 28.00, volume: 3 },
  { date: '26 Set', price: 32.00, volume: 4 },
  { date: '01 Out', price: 27.50, volume: 1 },
  { date: '06 Out', price: 30.00, volume: 2 },
  { date: '11 Out', price: 35.00, volume: 5 }
];

// Mock data para listings (em Reais)
const mockListings = [
  { id: 1, price: 28.90, quantity: 1, expiration: '30 dias', seller: '0x1234...5678' },
  { id: 2, price: 29.50, quantity: 1, expiration: '30 dias', seller: '0x2345...6789' },
  { id: 3, price: 30.00, quantity: 1, expiration: '30 dias', seller: '0x3456...7890' },
  { id: 4, price: 31.90, quantity: 1, expiration: '30 dias', seller: '0x4567...8901' },
  { id: 5, price: 32.50, quantity: 1, expiration: '30 dias', seller: '0x5678...9012' }
];

// Mock data para ofertas (em Reais)
const mockOffers = [
  { id: 1, price: 15.00, quantity: 1, expiration: '7 dias', buyer: '0x9876...5432' },
  { id: 2, price: 18.50, quantity: 1, expiration: '7 dias', buyer: '0x8765...4321' },
  { id: 3, price: 20.00, quantity: 1, expiration: '7 dias', buyer: '0x7654...3210' }
];

// Mock attributes
const mockAttributes = [
  { trait: 'Type', value: 'nft_h22_small_bug2', rarity: '25%' },
  { trait: 'Rarity', value: 'Common', rarity: '45%' },
  { trait: 'Set', value: 'Habbo Classic', rarity: '15%' },
  { trait: 'Material', value: 'Digital', rarity: '100%' }
];

export function NFTDetailModal({ item, isOpen, onClose }: NFTDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeListingTab, setActiveListingTab] = useState('for-sale');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Debug: Log state changes
  console.log('NFTDetailModal render:', { 
    isOpen, 
    isShareModalOpen, 
    itemName: item?.name,
    hasItem: !!item 
  });

  // Debug: Monitor share modal state changes
  useEffect(() => {
    console.log('Share modal state changed:', isShareModalOpen);
  }, [isShareModalOpen]);

  if (!item) {
    return (
      <>
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          collectionName=""
          collectionUrl=""
        />
      </>
    );
  }

  const imageSrc = useMemo(() => {
    const raw = (item as any).image_url || (item as any).image || '';
    const lower = String(raw).toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:')) {
      return raw as string;
    }
    return `https://images.unsplash.com/search/photos?query=${encodeURIComponent(String(raw || item.name))}&w=800&h=800&fit=crop`;
  }, [item]);

  const price = Number((item as any).price ?? (item as any).last_price_brl ?? 0);
  const lastSale = Number((item as any).lastSale ?? 0);
  const priceChange = price - lastSale;
  const priceChangePercent = lastSale > 0 ? ((priceChange / lastSale) * 100).toFixed(2) : '0.00';
  const isPositive = priceChange >= 0;

  const totalListings = mockListings.length;
  const lowestPrice = Math.min(...mockListings.map(l => l.price));
  const totalPrice = lowestPrice * quantity;
  
  // Generate item URL
  const itemUrl = useMemo(() => {
    const productCode = (item as any).product_code || (item as any).id || 'unknown';
    return `${window.location.origin}/habbo-furni/${productCode}`;
  }, [item]);

  type EBProps = { children: React.ReactNode };
  type EBState = { hasError: boolean; error?: any };
  class ErrorBoundary extends React.Component<EBProps, EBState> {
    declare props: EBProps;
    state: EBState = { hasError: false };
    static getDerivedStateFromError(error: any) {
      return { hasError: true, error } as { hasError: boolean; error?: any };
    }
    render() {
      if (this.state.hasError) {
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Falha ao carregar o conteúdo</h3>
            <p className="text-sm text-muted-foreground mb-4">Ocorreu um erro ao renderizar os detalhes deste item.</p>
            <Button className="bg-[#FFE000] hover:bg-[#FFD700] text-black" onClick={onClose}>Fechar</Button>
          </div>
        );
      }
      return <>{this.props.children}</>;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="z-[60] max-w-[96vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[96vh] overflow-hidden bg-card border-[#FFE000]/20 p-0 shadow-2xl shadow-[#FFE000]/10">
        <ErrorBoundary>
        <div className="grid lg:grid-cols-2 gap-0 max-h-[96vh] overflow-y-auto scroll-smooth">
          {/* Left Side - Image and Chart */}
          <div className="bg-card/50 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Header for Mobile */}
            <div className="lg:hidden">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl sm:text-2xl mb-2">{item.name}</DialogTitle>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {totalListings} Anúncios
                      </Badge>
                      {item.collection && (
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">{item.collection}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`h-9 w-9 p-0 ${isFavorite ? 'text-red-500 border-red-500/30 bg-red-500/10' : ''}`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0"
                      onClick={() => {
                        console.log('Share button clicked', { itemName: item.name, itemUrl });
                        setIsShareModalOpen(true);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* NFT Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/30 shadow-lg">
              <ImageWithFallback
                src={imageSrc}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {(() => {
                const rarityKey = String((item as any).rarity || '').toLowerCase();
                if (!rarityKey) return null;
                const rarityLabel = rarityKey.charAt(0).toUpperCase() + rarityKey.slice(1);
                const color = rarityKey === 'common' ? 'bg-gray-500'
                  : rarityKey === 'uncommon' ? 'bg-green-500'
                  : rarityKey === 'rare' ? 'bg-blue-500'
                  : rarityKey === 'epic' ? 'bg-purple-500'
                  : rarityKey === 'legendary' ? 'bg-yellow-500'
                  : 'bg-black/60';
                return (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <Badge className={`${color} text-white text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                      {rarityLabel}
                    </Badge>
                  </div>
                );
              })()}
            </div>

            {/* Price Chart */}
            <Card className="bg-muted/30 border-border/40">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h3 className="font-medium text-base">Preço Médio Diário</h3>
                  <div className="flex space-x-2 flex-wrap">
                    <Button size="sm" variant="outline" className="text-xs h-8 px-3">7 Dias</Button>
                    <Button size="sm" variant="default" className="text-xs h-8 px-3 bg-[#FFE000] text-black">1 Mês</Button>
                    <Button size="sm" variant="outline" className="text-xs h-8 px-3">Total</Button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={mockPriceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888"
                      style={{ fontSize: '11px' }}
                      tick={{ fill: '#888' }}
                    />
                    <YAxis 
                      stroke="#888"
                      style={{ fontSize: '11px' }}
                      tickFormatter={(value) => `R$ ${value}`}
                      tick={{ fill: '#888' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a2e', 
                        border: '1px solid rgba(255,224,0,0.2)',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#FFE000' }}
                      formatter={(value: any) => [`R$ ${value}`, 'Preço']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#FFE000" 
                      strokeWidth={3}
                      dot={{ fill: '#FFE000', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-4 text-xs sm:text-sm border-[#FFE000]/30 hover:bg-[#FFE000]/10 hover:border-[#FFE000]/50 h-9"
                >
                  Histórico Detalhado
                </Button>
              </CardContent>
            </Card>

            {/* Attributes */}
            <Card className="bg-muted/30 border-border/40">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-medium mb-4 text-base">Atributos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {mockAttributes.map((attr, index) => (
                    <div 
                      key={index}
                      className="bg-card/50 rounded-lg p-3 border border-border/40 hover:border-[#FFE000]/30 transition-colors"
                    >
                      <div className="text-xs text-muted-foreground mb-1">{attr.trait}</div>
                      <div className="text-sm font-medium mb-1 truncate" title={attr.value}>{attr.value}</div>
                      <div className="text-xs text-[#FFE000]">{attr.rarity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Details and Listings */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Header for Desktop */}
            <div className="hidden lg:block">
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-2xl lg:text-3xl mb-2">{item.name}</DialogTitle>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Badge variant="secondary" className="text-sm">
                        {totalListings} Anúncios
                      </Badge>
                      {item.collection && (
                        <span className="text-sm text-muted-foreground">{item.collection}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`h-9 w-9 p-0 ${isFavorite ? 'text-red-500 border-red-500/30 bg-red-500/10' : ''}`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0"
                      onClick={() => {
                        console.log('Share button clicked', { itemName: item.name, itemUrl });
                        setIsShareModalOpen(true);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Price Summary */}
            <Card className="bg-card/80 backdrop-blur border-[#FFE000]/20">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Preço Total:</div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFE000]">
                      R$ {totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{priceChangePercent}% desde última venda
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-11 w-11 p-0 text-lg"
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-11 text-center bg-muted/30 border border-border/40 rounded-lg text-base"
                  min="1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-11 w-11 p-0 text-lg"
                >
                  +
                </Button>
                <select className="flex-1 h-11 bg-muted/30 border border-border/40 rounded-lg px-3 text-sm">
                  <option>Todos</option>
                  <option>R$ (Real)</option>
                  <option>PIX</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  disabled
                  className="bg-muted/50 text-muted-foreground h-12 text-base cursor-not-allowed opacity-50"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Comprar
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#FFE000]/30 bg-transparent hover:bg-[#FFE000] hover:text-black hover:border-[#FFE000] text-[#FFE000] h-12 text-base transition-all duration-300"
                  onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Tenho interesse no item NFT', '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            <Separator className="bg-border/40 my-2" />

            {/* Listings Tabs */}
            <Tabs value={activeListingTab} onValueChange={setActiveListingTab}>
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="for-sale" className="text-sm">À Venda</TabsTrigger>
                <TabsTrigger value="offers" className="text-sm">Ofertas</TabsTrigger>
              </TabsList>

              <TabsContent value="for-sale" className="mt-4">
                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm text-muted-foreground px-3 py-2 font-medium">
                    <div>Preço</div>
                    <div>Qtd</div>
                    <div className="hidden sm:block">Expira em</div>
                    <div></div>
                  </div>

                  {/* Listings */}
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {mockListings.map((listing) => (
                      <div 
                        key={listing.id}
                        className="grid grid-cols-4 gap-2 items-center p-3 sm:p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <div>
                          <div className="text-sm sm:text-base font-medium text-[#FFE000]">
                            R$ {listing.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-sm sm:text-base">{listing.quantity}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{listing.expiration}</div>
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            disabled
                            className="bg-muted/50 text-muted-foreground text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 cursor-not-allowed opacity-50"
                          >
                            Comprar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="offers" className="mt-4">
                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm text-muted-foreground px-3 py-2 font-medium">
                    <div>Preço</div>
                    <div>Qtd</div>
                    <div className="hidden sm:block">Expira em</div>
                    <div className="hidden sm:block">De</div>
                  </div>

                  {/* Offers */}
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {mockOffers.map((offer) => (
                      <div 
                        key={offer.id}
                        className="grid grid-cols-4 gap-2 items-center p-3 sm:p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <div>
                          <div className="text-sm sm:text-base font-medium text-[#FFE000]">
                            R$ {offer.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-sm sm:text-base">{offer.quantity}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{offer.expiration}</div>
                        <div className="text-xs text-right text-muted-foreground truncate hidden sm:block">
                          {offer.buyer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        </ErrorBoundary>
      </DialogContent>
      
      {/* Share Modal - Outside main dialog */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="bg-[#0A0A0F] border-2 border-[#FFE000]/50 p-4 rounded-lg">
            <h3 className="text-[#FFE000] mb-2">Compartilhar: {item.name}</h3>
            <p className="text-white text-sm mb-4">URL: {itemUrl}</p>
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="bg-[#FFE000] text-black px-4 py-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
