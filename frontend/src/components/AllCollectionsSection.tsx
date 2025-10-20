import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchCollections, NftCollection } from '@/api/nft';


interface AllCollectionsSectionProps {
  onCollectionSelect: (collectionId: string) => void;
}

export function AllCollectionsSection({ onCollectionSelect }: AllCollectionsSectionProps) {
  const [sortBy, setSortBy] = useState<'volume' | 'floor' | 'items'>('volume');
  const [collections, setCollections] = useState<NftCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCollections().then((data) => {
      if (!mounted) return;
      setCollections(data);
      setError(null);
    }).catch((e) => {
      if (!mounted) return;
      setError(e?.message || 'Falha ao carregar coleções');
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const sortedCollections = useMemo(() => {
    const arr = [...collections];
    return arr.sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return Number(b.total_volume) - Number(a.total_volume);
        case 'floor':
          return Number(b.floor_price) - Number(a.floor_price);
        case 'items':
          return (b.items_count || 0) - (a.items_count || 0);
        default:
          return 0;
      }
    });
  }, [collections, sortBy]);

  const formatPrice = (price: string | number) => `R$ ${Number(price || 0).toFixed(2)}`;
  const formatVolume = (volume: string | number) => `R$ ${Number(volume || 0).toFixed(2)}`;

  return (
    <div className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Todas as <span className="text-[#FFE000]">Coleções</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore todas as coleções disponíveis no marketplace
          </p>
        </div>

        {/* Sorting Controls */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Button
            variant={sortBy === 'volume' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('volume')}
            className={sortBy === 'volume' ? 'bg-[#FFE000] text-black' : ''}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Volume 24h
          </Button>
          <Button
            variant={sortBy === 'floor' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('floor')}
            className={sortBy === 'floor' ? 'bg-[#FFE000] text-black' : ''}
          >
            Preço Mínimo
          </Button>
          <Button
            variant={sortBy === 'items' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('items')}
            className={sortBy === 'items' ? 'bg-[#FFE000] text-black' : ''}
          >
            Quantidade
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center text-muted-foreground">Carregando coleções...</div>
          )}
          {error && (
            <div className="col-span-full text-center text-red-500">{error}</div>
          )}
          {!loading && !error && sortedCollections.map((collection) => (
            <Card 
              key={collection.id}
              className="group cursor-pointer bg-card/50 backdrop-blur border-border/40 hover:border-[#FFE000]/30 transition-all duration-300 overflow-hidden"
              onClick={() => onCollectionSelect(collection.slug)}
            >
              <CardContent className="p-0">
                {/* Collection Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={collection.cover_image || collection.profile_image || `https://images.unsplash.com/search/photos?query=${encodeURIComponent(collection.name)}&w=400&h=200&fit=crop`}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Verified Badge */}
                  {/* backend ainda não tem verificação; placeholder condicional */}
                  {false && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#FFE000] text-black">
                        Verificada
                      </Badge>
                    </div>
                  )}

                  {/* View Collection Button */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-[#FFE000] hover:bg-[#FFD700] text-black">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>

                {/* Collection Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#FFE000] transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {collection.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Itens</span>
                      <span className="font-medium">{collection.items_count}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Preço mín.</span>
                      <span className="font-medium">{formatPrice(collection.floor_price)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Volume 24h</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatVolume(collection.total_volume)}</span>
                        {/* variação não disponível no backend ainda */}
                        <span className="text-sm text-muted-foreground">—</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}