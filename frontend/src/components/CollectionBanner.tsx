import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Users, Eye, Heart, Share2, MoreHorizontal } from 'lucide-react';

interface CollectionBannerProps {
  name: string;
  description: string;
  coverImage: string;
  logoImage: string;
  creator: string;
  floorPrice: string;
  totalItems: number;
  owners: number;
  totalVolume: string;
  isVerified?: boolean;
}

export function CollectionBanner({
  name,
  description,
  coverImage,
  logoImage,
  creator,
  floorPrice,
  totalItems,
  owners,
  totalVolume,
  isVerified = true
}: CollectionBannerProps) {
  const formatCount = (value: number | string | null | undefined) => {
    const n = Number(value ?? 0);
    return n.toLocaleString('pt-BR');
  };

  const formatEth = (value: string | number | null | undefined) => {
    const raw = String(value ?? '').toLowerCase().replace(/eth/g, '').trim();
    const num = parseFloat(raw);
    if (isNaN(num)) {
      // fallback: if it already includes ETH or is non-numeric, just ensure single ETH suffix
      const cleaned = String(value ?? '').replace(/(\s*eth)+/i, '').trim();
      return `${cleaned} ETH`;
    }
    return `${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH`;
  };

  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <ImageWithFallback
          src={coverImage}
          alt={`${name} collection cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Action buttons overlay */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Button size="sm" variant="outline" className="bg-black/20 backdrop-blur border-white/20 hover:bg-black/40">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-black/20 backdrop-blur border-white/20 hover:bg-black/40">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collection Info */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative mt-8 lg:mt-12">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border-4 border-background bg-card">
                <ImageWithFallback
                  src={logoImage}
                  alt={`${name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FFE000] rounded-full flex items-center justify-center border-2 border-background">
                  <Star className="w-4 h-4 text-black fill-black" />
                </div>
              )}
            </div>

            {/* Collection Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">{name}</h1>
                  {isVerified && (
                    <Badge className="bg-[#FFE000] text-black border-0">
                      Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Por</span>
                  <span className="font-medium text-[#FFE000]">{creator}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-card/50 backdrop-blur border-border/40">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl lg:text-2xl font-bold text-[#FFE000]">{formatCount(totalItems)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Items</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur border-border/40">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl lg:text-2xl font-bold text-[#FFE000]">{formatCount(owners)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Owners</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur border-border/40">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl lg:text-2xl font-bold text-[#FFE000]">{formatEth(floorPrice)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Floor Price</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur border-border/40">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl lg:text-2xl font-bold text-[#FFE000]">{formatEth(totalVolume)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Volume Total</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
              <Button className="bg-[#FFE000] hover:bg-[#FFD700] text-black border-0">
                <Heart className="w-4 h-4 mr-2" />
                Favoritar
              </Button>
              <Button variant="outline" className="border-[#FFE000]/30 hover:bg-[#FFE000]/10">
                <Eye className="w-4 h-4 mr-2" />
                Assistir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}