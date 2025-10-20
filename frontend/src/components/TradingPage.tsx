import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, TrendingUp, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { NFTDetailModal } from './NFTDetailModal';

interface RecentSale {
  id: string;
  name: string;
  image: string;
  price: number;
  previousPrice: number;
  buyer: string;
  seller: string;
  timestamp: string;
  collection: string;
  verified: boolean;
}

const recentSales: RecentSale[] = [
  {
    id: '1',
    name: 'Trono de Ouro Imperial',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
    price: 1850,
    previousPrice: 1500,
    buyer: '0x742d...35a4',
    seller: '0x8b3f...92c1',
    timestamp: '2 minutos atrás',
    collection: 'Habbo Rares',
    verified: true,
  },
  {
    id: '2',
    name: 'Dragão Azul Místico',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    price: 2400,
    previousPrice: 2200,
    buyer: '0x1a2b...67d8',
    seller: '0x9c8d...43f2',
    timestamp: '15 minutos atrás',
    collection: 'Habbo Rares',
    verified: true,
  },
  {
    id: '3',
    name: 'Piano Clássico Vintage',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
    price: 920,
    previousPrice: 800,
    buyer: '0x4e5f...89ab',
    seller: '0x7g8h...12cd',
    timestamp: '32 minutos atrás',
    collection: 'Móveis Clássicos',
    verified: true,
  },
  {
    id: '4',
    name: 'Sofá Imperial Vermelho',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    price: 1200,
    previousPrice: 1100,
    buyer: '0x2d3e...45fg',
    seller: '0x6h7i...89jk',
    timestamp: '1 hora atrás',
    collection: 'Móveis Clássicos',
    verified: true,
  },
  {
    id: '5',
    name: 'Mesa de Cristal Rara',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400',
    price: 1050,
    previousPrice: 950,
    buyer: '0x9a0b...23cd',
    seller: '0x4e5f...67gh',
    timestamp: '1 hora atrás',
    collection: 'Decoração Premium',
    verified: false,
  },
  {
    id: '6',
    name: 'Poltrona Luxo Dourada',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    price: 780,
    previousPrice: 650,
    buyer: '0x7c8d...90ef',
    seller: '0x1a2b...34cd',
    timestamp: '2 horas atrás',
    collection: 'Móveis Clássicos',
    verified: true,
  },
  {
    id: '7',
    name: 'Espelho Antigo',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400',
    price: 560,
    previousPrice: 480,
    buyer: '0x5f6g...78hi',
    seller: '0x9j0k...12lm',
    timestamp: '2 horas atrás',
    collection: 'Decoração Premium',
    verified: true,
  },
  {
    id: '8',
    name: 'Lustre de Cristal',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    price: 1380,
    previousPrice: 1250,
    buyer: '0x3n4o...56pq',
    seller: '0x7r8s...90tu',
    timestamp: '3 horas atrás',
    collection: 'Decoração Premium',
    verified: true,
  },
  {
    id: '9',
    name: 'Cama King Size Luxo',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    price: 1680,
    previousPrice: 1450,
    buyer: '0x1v2w...34xy',
    seller: '0x5z6a...78bc',
    timestamp: '4 horas atrás',
    collection: 'Móveis Clássicos',
    verified: false,
  },
  {
    id: '10',
    name: 'Estante Imperial',
    image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=400',
    price: 890,
    previousPrice: 750,
    buyer: '0x9d0e...12fg',
    seller: '0x3h4i...56jk',
    timestamp: '5 horas atrás',
    collection: 'Móveis Clássicos',
    verified: true,
  },
  {
    id: '11',
    name: 'Quadro Abstrato Raro',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
    price: 620,
    previousPrice: 550,
    buyer: '0x7l8m...90no',
    seller: '0x1p2q...34rs',
    timestamp: '6 horas atrás',
    collection: 'Decoração Premium',
    verified: true,
  },
  {
    id: '12',
    name: 'Tapete Persa Luxo',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400',
    price: 1150,
    previousPrice: 980,
    buyer: '0x5t6u...78vw',
    seller: '0x9x0y...12za',
    timestamp: '7 horas atrás',
    collection: 'Decoração Premium',
    verified: true,
  },
];

export function TradingPage() {
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified'>('all');

  const filteredSales = filter === 'verified' 
    ? recentSales.filter(sale => sale.verified)
    : recentSales;

  const calculatePriceChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const handleCardClick = (id: string) => {
    setSelectedNFT(id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border/40 bg-gradient-to-b from-[#FFE000]/5 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-8 w-8 text-[#FFE000]" />
              <h1 className="text-4xl lg:text-5xl font-bold">
                Trading <span className="text-[#FFE000]">Center</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Acompanhe as vendas mais recentes do marketplace Habbo em tempo real
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Volume 24h</p>
                  <p className="text-xl font-bold text-[#FFE000]">R$ 15.240,00</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Vendas 24h</p>
                  <p className="text-xl font-bold">127</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Maior Venda</p>
                  <p className="text-xl font-bold text-[#FFE000]">R$ 2.400,00</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-[#FFE000] text-black hover:bg-[#FFD700]' : ''}
            >
              Todas as Vendas
            </Button>
            <Button
              variant={filter === 'verified' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('verified')}
              className={filter === 'verified' ? 'bg-[#FFE000] text-black hover:bg-[#FFD700]' : ''}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verificadas
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Vendas Recentes</h2>
          <p className="text-muted-foreground">
            {filteredSales.length} transações realizadas recentemente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSales.map((sale) => {
            const priceChange = calculatePriceChange(sale.price, sale.previousPrice);
            const isPositive = parseFloat(priceChange) > 0;

            return (
              <Card 
                key={sale.id} 
                className="group cursor-pointer hover:border-[#FFE000]/50 transition-all overflow-hidden"
                onClick={() => handleCardClick(sale.id)}
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={sale.image}
                    alt={sale.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Verified Badge */}
                  {sale.verified && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-[#FFE000] text-black hover:bg-[#FFD700] border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    </div>
                  )}

                  {/* Price Change Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="secondary"
                      className={`${
                        isPositive 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-red-500/90 text-white'
                      } border-0 backdrop-blur-sm`}
                    >
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +{priceChange}%
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Collection */}
                  <p className="text-xs text-muted-foreground mb-1">{sale.collection}</p>
                  
                  {/* Name */}
                  <h3 className="font-semibold mb-3 line-clamp-1 group-hover:text-[#FFE000] transition-colors">
                    {sale.name}
                  </h3>

                  {/* Price Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Preço de Venda</span>
                      <span className="font-bold text-[#FFE000]">
                        R$ {sale.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Preço Anterior</span>
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {sale.previousPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="pt-3 border-t border-border/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">De:</span>
                      <span className="font-mono">{sale.seller}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Para:</span>
                      <span className="font-mono">{sale.buyer}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                      <Clock className="w-3 h-3" />
                      {sale.timestamp}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <NFTDetailModal
          nftId={selectedNFT}
          isOpen={!!selectedNFT}
          onClose={() => setSelectedNFT(null)}
        />
      )}
    </div>
  );
}
