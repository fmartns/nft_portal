import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  creator?: string;
  likes?: number;
  views?: number;
  collection?: string;
  category?: string;
  rarity?: string;
  lastSale?: string;
  isAuction?: boolean;
  timeLeft?: string;
  priceChange?: number; // Percentual de mudança de preço (positivo = subiu, negativo = desceu)
  volume7d?: string; // Volume dos últimos 7 dias
  onClick?: () => void;
}

export function NFTCard({
  name,
  image,
  price,
  creator,
  likes,
  views,
  collection,
  category,
  rarity,
  lastSale,
  isAuction = false,
  timeLeft,
  priceChange = 0,
  volume7d = "R$ 0",
  onClick
}: NFTCardProps) {
  const resolveImageSrc = (val: string) => {
    if (!val) return '';
    const lower = val.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:')) {
      return val;
    }
    // Fallback: treat as a search term on Unsplash for mock/demo data
    return `https://images.unsplash.com/search/photos?query=${encodeURIComponent(val)}&w=400&h=300&fit=crop`;
  };

  return (
    <Card 
      className="group overflow-hidden bg-card/50 backdrop-blur border-border/40 hover:border-[#FFE000]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFE000]/10 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={resolveImageSrc(image)}
          alt={name}
          className="w-full h-44 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay com informações de mercado no hover */}
        <div className="absolute inset-0 bg-black/60 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div className="absolute bottom-3 left-3 space-y-1">
            {/* Variação de preço */}
            <div className="flex items-center space-x-1">
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
              </span>
              <span className="text-xs text-white/70">7d</span>
            </div>
            
            {/* Volume */}
            <div className="flex items-center space-x-1 text-white/90">
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs">Volume: {volume7d}</span>
            </div>
          </div>
        </div>

        {/* Badge de leilão */}
        {isAuction && timeLeft && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
            {timeLeft}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Nome do NFT */}
          <h3 className="font-medium text-base line-clamp-1 group-hover:text-[#FFE000] transition-colors">
            {name}
          </h3>
          
          {/* Collection Badge */}
          {collection && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {collection}
            </p>
          )}

          {/* Preço e ação */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-xs text-muted-foreground">Preço</p>
              <p className="font-medium text-[#FFE000] text-lg">
                R$ {price}
              </p>
            </div>
            <Button 
              size="sm" 
              disabled
              className="bg-muted/50 text-muted-foreground border-0 flex-shrink-0 cursor-not-allowed opacity-50"
            >
              {isAuction ? 'Apostar' : 'Comprar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}