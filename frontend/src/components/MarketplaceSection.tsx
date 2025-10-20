import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Search, Filter, Grid3X3, List, SlidersHorizontal, ShoppingCart, Trash2 } from 'lucide-react';
import { NFTCard } from './NFTCard';
import { CollectionBanner } from './CollectionBanner';
import { BulkActionsPanel } from './BulkActionsPanel';

const categories = [
  { id: 'all', name: 'Todos', count: 1247 },
  { id: 'furniture', name: 'Móveis', count: 456 },
  { id: 'clothes', name: 'Roupas', count: 234 },
  { id: 'accessories', name: 'Acessórios', count: 189 },
  { id: 'pets', name: 'Pets', count: 156 },
  { id: 'rooms', name: 'Quartos', count: 98 },
  { id: 'rare', name: 'Raros', count: 67 },
  { id: 'limited', name: 'Limitados', count: 47 }
];

const rarityLevels = [
  { id: 'common', name: 'Comum', color: 'bg-gray-500' },
  { id: 'uncommon', name: 'Incomum', color: 'bg-green-500' },
  { id: 'rare', name: 'Raro', color: 'bg-blue-500' },
  { id: 'epic', name: 'Épico', color: 'bg-purple-500' },
  { id: 'legendary', name: 'Lendário', color: 'bg-yellow-500' },
  { id: 'ultra-rare', name: 'Ultra Raro', color: 'bg-red-500' }
];

const habboItems = [
  {
    id: '1',
    name: 'Throne Golden Deluxe',
    image: 'https://images.unsplash.com/photo-1536574753884-8c45a0431ecf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwaXhlbCUyMGFydCUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NTkzNjY1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '3.100',
    creator: 'HabboDesigner',
    likes: 342,
    views: 1890,
    category: 'Móveis',
    rarity: 'legendary',
    priceChange: 15.7,
    volume7d: 'R$ 18.600'
  },
  {
    id: '2',
    name: 'Pixel Sofa Retro',
    image: 'https://images.unsplash.com/photo-1670222061552-c273834aee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwZnVybml0dXJlJTIwcm9vbXxlbnwxfHx8fDE3NTkzNjY1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '1.640',
    creator: 'PixelMaster',
    likes: 156,
    views: 890,
    category: 'Móveis',
    rarity: 'rare',
    priceChange: -2.3,
    volume7d: 'R$ 8.200'
  },
  {
    id: '3',
    name: 'Dragon Pet Limited',
    image: 'https://images.unsplash.com/photo-1686943812586-65d1d30ab40f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByb29tJTIwZGVzaWdufGVufDF8fHx8MTc1OTM2NjU2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '5.000',
    creator: 'DragonBreeder',
    likes: 567,
    views: 2340,
    category: 'Pets',
    rarity: 'ultra-rare',
    priceChange: 8.9,
    volume7d: 'R$ 25.000'
  },
  {
    id: '4',
    name: 'Neon Chair Gaming',
    image: 'https://images.unsplash.com/photo-1536574753884-8c45a0431ecf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwaXhlbCUyMGFydCUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NTkzNjY1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '900',
    creator: 'GamerPro',
    likes: 89,
    views: 456,
    category: 'Móveis',
    rarity: 'uncommon',
    priceChange: 4.2,
    volume7d: 'R$ 4.500'
  },
  {
    id: '5',
    name: 'Crown Royal Deluxe',
    image: 'https://images.unsplash.com/photo-1670222061552-c273834aee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwZnVybml0dXJlJTIwcm9vbXxlbnwxfHx8fDE3NTkzNjY1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '3.740',
    creator: 'RoyalCrafter',
    likes: 234,
    views: 1230,
    category: 'Acessórios',
    rarity: 'epic',
    priceChange: -1.5,
    volume7d: 'R$ 18.700'
  },
  {
    id: '6',
    name: 'Vintage Bed Classic',
    image: 'https://images.unsplash.com/photo-1686943812586-65d1d30ab40f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByb29tJTIwZGVzaWdufGVufDF8fHx8MTc1OTM2NjU2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '1.360',
    creator: 'VintageCollector',
    likes: 145,
    views: 678,
    category: 'Móveis',
    rarity: 'rare',
    priceChange: 6.8,
    volume7d: 'R$ 6.800'
  },
  {
    id: '7',
    name: 'Sparkle Dress Party',
    image: 'https://images.unsplash.com/photo-1536574753884-8c45a0431ecf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NTkzNjY1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '2.460',
    creator: 'FashionStar',
    likes: 298,
    views: 1456,
    category: 'Roupas',
    rarity: 'epic',
    priceChange: -4.1,
    volume7d: 'R$ 12.300'
  },
  {
    id: '8',
    name: 'Robot Pet Future',
    image: 'https://images.unsplash.com/photo-1670222061552-c273834aee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwZnVybml0dXJlJTIwcm9vbXxlbnwxfHx8fDE3NTkzNjY1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '1.980',
    creator: 'TechBuilder',
    likes: 176,
    views: 823,
    category: 'Pets',
    rarity: 'rare',
    priceChange: 11.2,
    volume7d: 'R$ 9.900'
  }
];

export function MarketplaceSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const filteredItems = habboItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      categories.find(c => c.id === selectedCategory)?.name === item.category;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    const matchesSelection = !showSelectedOnly || selectedItems.includes(item.id);
    
    return matchesCategory && matchesSearch && matchesRarity && matchesSelection;
  });

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setShowSelectedOnly(false);
  };

  const getTotalSelectedPrice = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = habboItems.find(i => i.id === itemId);
      return total + (item ? parseFloat(item.price) : 0);
    }, 0).toFixed(2);
  };

  return (
    <section className="py-0 bg-background">
      {/* Collection Banner */}
      <CollectionBanner
        name="Habbo Rarities Collection"
        description="A maior coleção de items raros e exclusivos do universo Habbo. Móveis únicos, pets legendários e acessórios que fazem a diferença no seu quarto."
        coverImage="https://images.unsplash.com/photo-1661777997156-ccac1c9876e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiYW5uZXJ8ZW58MXx8fHwxNzU5MzY4OTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        logoImage="https://images.unsplash.com/photo-1652159043552-6c25eb2ea21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGZ1cm5pdHVyZSUyMGljb258ZW58MXx8fHwxNzU5NDA2MTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        creator="HabboOfficial"
        floorPrice="2.5"
        totalItems={1247}
        owners={856}
        totalVolume="1,847"
      />

      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Selection Controls */}
        {selectedItems.length > 0 && (
          <div className="mb-8">
            <Card className="bg-[#FFE000]/10 border-[#FFE000]/30">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5 text-[#FFE000]" />
                      <span className="font-medium">
                        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selecionado{selectedItems.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#FFE000]">
                      {getTotalSelectedPrice()} ETH
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                      className="border-[#FFE000]/30 hover:bg-[#FFE000]/10"
                    >
                      {showSelectedOnly ? 'Mostrar Todos' : 'Mostrar Selecionados'}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#FFE000] hover:bg-[#FFD700] text-black"
                    >
                      Comprar Selecionados
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearSelection}
                      className="border-red-500/30 hover:bg-red-500/10 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar com Filtros */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur border-border/40 sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Buscar Items</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Nome do item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted/30 border-border/40"
                      />
                    </div>
                  </div>

                  <Separator className="border-border/40" />

                  {/* Categories */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Categorias</label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-[#FFE000]/10 text-[#FFE000] border border-[#FFE000]/20'
                              : 'hover:bg-muted/30 text-muted-foreground'
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {category.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="border-border/40" />

                  {/* Rarity Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Raridade</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedRarity('all')}
                        className={`w-full flex items-center p-2 rounded-lg text-sm transition-colors ${
                          selectedRarity === 'all'
                            ? 'bg-[#FFE000]/10 text-[#FFE000] border border-[#FFE000]/20'
                            : 'hover:bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        Todas as raridades
                      </button>
                      {rarityLevels.map((rarity) => (
                        <button
                          key={rarity.id}
                          onClick={() => setSelectedRarity(rarity.id)}
                          className={`w-full flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                            selectedRarity === rarity.id
                              ? 'bg-[#FFE000]/10 text-[#FFE000] border border-[#FFE000]/20'
                              : 'hover:bg-muted/30 text-muted-foreground'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${rarity.color}`}></div>
                          <span>{rarity.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="border-border/40" />

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Faixa de Preço (ETH)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="bg-muted/30 border-border/40"
                      />
                      <Input
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="bg-muted/30 border-border/40"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[#FFE000] hover:bg-[#FFD700] text-black border-0"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredItems.length} items encontrados
                </span>
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="border-[#FFE000]/30 text-[#FFE000]">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length}
                      onCheckedChange={handleSelectAll}
                      className="border-[#FFE000]/50 data-[state=checked]:bg-[#FFE000] data-[state=checked]:border-[#FFE000]"
                    />
                    <span className="text-sm text-muted-foreground">
                      Selecionar todos
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-muted/30 border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Mais Popular</SelectItem>
                    <SelectItem value="recent">Mais Recente</SelectItem>
                    <SelectItem value="price-low">Menor Preço</SelectItem>
                    <SelectItem value="price-high">Maior Preço</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border border-border/40 rounded-lg bg-muted/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-[#FFE000]/10 text-[#FFE000]' : ''}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'bg-[#FFE000]/10 text-[#FFE000]' : ''}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredItems.map((item) => (
                <div key={item.id} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemSelect(item.id)}
                      className="bg-black/50 backdrop-blur border-white/30 data-[state=checked]:bg-[#FFE000] data-[state=checked]:border-[#FFE000]"
                    />
                  </div>
                  
                  <div className={`transition-all duration-200 ${
                    selectedItems.includes(item.id) 
                      ? 'ring-2 ring-[#FFE000] ring-offset-2 ring-offset-background' 
                      : ''
                  }`}>
                    <NFTCard {...item} />
                  </div>
                  
                  {/* Rarity indicator */}
                  <div className="absolute top-2 right-2">
                    <div className={`w-3 h-3 rounded-full ${
                      rarityLevels.find(r => r.id === item.rarity)?.color || 'bg-gray-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#FFE000]/30 hover:bg-[#FFE000]/10 hover:border-[#FFE000]/50"
              >
                Carregar Mais Items
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      <BulkActionsPanel
        selectedCount={selectedItems.length}
        totalPrice={getTotalSelectedPrice()}
        onBulkPurchase={() => {
          // Comprar items selecionados: implementar lógica de compra em massa
        }}
        onAddToWishlist={() => {
          // Adicionar à wishlist: implementar lógica de wishlist
        }}
        onShare={() => {
          // Compartilhar seleção: implementar lógica de compartilhamento
        }}
        onExport={() => {
          // Exportar seleção: implementar lógica de exportação
        }}
        onPreview={() => {
          // Visualizar seleção: implementar modal de preview
        }}
        onClear={clearSelection}
      />
    </section>
  );
}