import { useEffect, useMemo, useState } from 'react';
import { CollectionBanner } from './CollectionBanner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { NFTCard } from './NFTCard';
import { NFTDetailModal } from './NFTDetailModal';
import { ArrowLeft, Search, Grid3X3, List, ShoppingCart, Trash2, Filter, Hammer, Package } from 'lucide-react';
import { fetchCollectionDetail, fetchNFTItems, NftCollection, Paginated, NFTItem } from '@/api/nft';

interface CollectionDetailSectionProps {
  collectionId: string; // now treated as slug
  onBack: () => void;
}

// Baseado no model NFTItem do Django
const rarityOptions = [
  { id: 'comum', name: 'Comum', color: 'bg-gray-500' },
  { id: 'incomum', name: 'Incomum', color: 'bg-green-500' },
  { id: 'raro', name: 'Raro', color: 'bg-blue-500' },
  { id: 'epico', name: 'Épico', color: 'bg-purple-500' },
  { id: 'lendario', name: 'Lendário', color: 'bg-yellow-500' },
  { id: 'ultra-raro', name: 'Ultra Raro', color: 'bg-red-500' }
];

const itemTypeOptions = [
  { id: 'mobilia', name: 'Mobília' },
  { id: 'decoracao', name: 'Decoração' },
  { id: 'pets', name: 'Pets' },
  { id: 'wallpaper', name: 'Papel de Parede' },
  { id: 'piso', name: 'Piso' },
  { id: 'efeitos', name: 'Efeitos' },
  { id: 'badge', name: 'Badge' },
];

const itemSubTypeOptions = [
  { id: 'cadeira', name: 'Cadeira', parent: 'mobilia' },
  { id: 'mesa', name: 'Mesa', parent: 'mobilia' },
  { id: 'cama', name: 'Cama', parent: 'mobilia' },
  { id: 'sofa', name: 'Sofá', parent: 'mobilia' },
  { id: 'estante', name: 'Estante', parent: 'mobilia' },
  { id: 'luminaria', name: 'Luminária', parent: 'decoracao' },
  { id: 'quadro', name: 'Quadro', parent: 'decoracao' },
  { id: 'planta', name: 'Planta', parent: 'decoracao' },
  { id: 'tapete', name: 'Tapete', parent: 'decoracao' },
];

const materialOptions = [
  { id: 'madeira', name: 'Madeira' },
  { id: 'metal', name: 'Metal' },
  { id: 'tecido', name: 'Tecido' },
  { id: 'plastico', name: 'Plástico' },
  { id: 'vidro', name: 'Vidro' },
  { id: 'cristal', name: 'Cristal' },
  { id: 'ouro', name: 'Ouro' },
  { id: 'prata', name: 'Prata' },
];

const sourceOptions = [
  { id: 'catalogo', name: 'Catálogo' },
  { id: 'evento', name: 'Evento Especial' },
  { id: 'limitado', name: 'Edição Limitada' },
  { id: 'raro', name: 'Achado Raro' },
  { id: 'exclusivo', name: 'Exclusivo' },
  { id: 'seasonal', name: 'Sazonal' },
];

function formatPriceBRL(value: string | number | null | undefined) {
  const num = Number(value || 0);
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CollectionDetailSection({ collectionId, onBack }: CollectionDetailSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price_low');
  const [filterRarity, setFilterRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState('all');
  const [selectedItemSubType, setSelectedItemSubType] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [showCraftedOnly, setShowCraftedOnly] = useState(false);
  const [showCraftMaterialsOnly, setShowCraftMaterialsOnly] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [collection, setCollection] = useState<NftCollection | null>(null);
  const [items, setItems] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load collection detail and items
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetchCollectionDetail(collectionId),
      fetchNFTItems({ collection_slug: collectionId, page_size: 100, ordering: 'name' })
    ]).then(([col, list]) => {
      if (!mounted) return;
      setCollection(col);
      setItems(list.results || []);
      setError(null);
    }).catch((e: any) => {
      if (!mounted) return;
      setError(e?.message || 'Falha ao carregar a coleção');
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [collectionId]);

  if (loading) {
    return (
      <div className="py-16 lg:py-24 text-center">
        <div className="container mx-auto px-4 lg:px-8 text-muted-foreground">Carregando coleção...</div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Coleção não encontrada</h2>
          <Button onClick={onBack} className="bg-[#FFE000] hover:bg-[#FFD700] text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Filter items from API
  let filteredItems = items.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.product_code && item.product_code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRarity = filterRarity === 'all' || item.rarity === filterRarity;
    const matchesItemType = selectedItemType === 'all' || item.item_type === selectedItemType;
    const matchesItemSubType = selectedItemSubType === 'all' || item.item_sub_type === selectedItemSubType;
    const matchesMaterial = selectedMaterial === 'all' || item.material === selectedMaterial;
    const matchesSource = selectedSource === 'all' || item.source === selectedSource;
    const matchesCrafted = !showCraftedOnly || item.is_crafted_item;
    const matchesCraftMaterial = !showCraftMaterialsOnly || item.is_craft_material;
    const matchesSelection = !showSelectedOnly || selectedItems.includes(item.id);
    
    const itemPrice = Number(item.last_price_brl || 0);
    const matchesMinPrice = !priceRange.min || itemPrice >= parseFloat(priceRange.min);
    const matchesMaxPrice = !priceRange.max || itemPrice <= parseFloat(priceRange.max);
    
    return matchesSearch && matchesRarity && matchesItemType && matchesItemSubType &&
           matchesMaterial && matchesSource && matchesCrafted && matchesCraftMaterial &&
           matchesSelection && matchesMinPrice && matchesMaxPrice;
  });

  // Sort items
  filteredItems = filteredItems.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'price_low':
        return a.last_price_brl - b.last_price_brl;
      case 'price_high':
        return b.last_price_brl - a.last_price_brl;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rarity':
        const rarityOrder = ['comum', 'incomum', 'raro', 'epico', 'lendario', 'ultra-raro'];
        return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      default:
        return 0;
    }
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
      setSelectedItems(filteredItems.map((item: any) => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setShowSelectedOnly(false);
  };

  const getTotalSelectedPrice = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = items.find((i: any) => i.id === itemId);
      const val = Number(item?.last_price_brl || 0);
      return total + val;
    }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const handleItemClick = (item: any) => {
    // Prefer navigating to item page route /:slug/:product_code
    const slug = collection?.slug || collectionId;
    const productCode = item?.product_code;
    if (slug && productCode) {
      const target = `/${slug}/${productCode}`;
      if (window.location.pathname !== target) {
        window.history.pushState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }
    // Fallback to modal if route data is missing
    setSelectedItemForModal(item);
    setIsModalOpen(true);
  };

  const clearAllFilters = () => {
    setFilterRarity('all');
    setSelectedItemType('all');
    setSelectedItemSubType('all');
    setSelectedMaterial('all');
    setSelectedSource('all');
    setPriceRange({ min: '', max: '' });
    setShowCraftedOnly(false);
    setShowCraftMaterialsOnly(false);
    setSearchQuery('');
  };

  return (
    <div>
      <NFTDetailModal 
        item={selectedItemForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItemForModal(null);
        }}
      />
      
      {/* Collection Banner */}
      {(() => {
        const isHabbo = (collection.creator_name || '').trim().toLowerCase() === 'habbo hotel';
        const bannerCover = isHabbo
          ? 'https://collectibles.habbo.com/hero-bg-xl.png'
          : (collection.profile_image || collection.cover_image || collection.name);
        const bannerLogo = collection.cover_image || collection.profile_image || collection.name;
        return (
          <CollectionBanner
            name={collection.name}
            description={collection.description}
            coverImage={bannerCover}
            logoImage={bannerLogo}
            creator={collection.author}
            floorPrice={collection.floor_price_eth}
            totalItems={collection.items_count}
            owners={collection.owners_count}
            totalVolume={collection.total_volume_eth}
            isVerified={false}
          />
        );
      })()}

      {/* Marketplace Section */}
      <section className="py-8 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Selection Summary */}
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
                        R$ {getTotalSelectedPrice()}
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
                        disabled
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
                      <label className="text-sm font-medium mb-2 block">Buscar</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Nome ou código..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-muted/30 border-border/40"
                        />
                      </div>
                    </div>

                    <Separator className="border-border/40" />

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-3 block text-[#FFE000]">Preço (R$)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Mín"
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className="bg-muted/30 border-border/40 text-sm"
                        />
                        <Input
                          placeholder="Máx"
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="bg-muted/30 border-border/40 text-sm"
                        />
                      </div>
                    </div>

                    <Separator className="border-border/40" />

                    {/* Item Characteristics */}
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-[#FFE000]">Características</h3>
                      
                      {/* Rarity */}
                      <div className="mb-4">
                        <label className="text-xs text-muted-foreground mb-2 block">Raridade</label>
                        <select
                          value={filterRarity}
                          onChange={(e) => setFilterRarity(e.target.value)}
                          className="w-full p-2 bg-muted/30 border border-border/40 rounded-lg text-sm"
                        >
                          <option value="all">Todas</option>
                          {rarityOptions.map((rarity) => (
                            <option key={rarity.id} value={rarity.id}>
                              {rarity.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Item Type */}
                      <div className="mb-4">
                        <label className="text-xs text-muted-foreground mb-2 block">Tipo de Item</label>
                        <select
                          value={selectedItemType}
                          onChange={(e) => {
                            setSelectedItemType(e.target.value);
                            setSelectedItemSubType('all');
                          }}
                          className="w-full p-2 bg-muted/30 border border-border/40 rounded-lg text-sm"
                        >
                          <option value="all">Todos</option>
                          {itemTypeOptions.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Item Sub Type */}
                      <div className="mb-4">
                        <label className="text-xs text-muted-foreground mb-2 block">Subtipo</label>
                        <select
                          value={selectedItemSubType}
                          onChange={(e) => setSelectedItemSubType(e.target.value)}
                          className="w-full p-2 bg-muted/30 border border-border/40 rounded-lg text-sm"
                          disabled={selectedItemType === 'all'}
                        >
                          <option value="all">Todos</option>
                          {itemSubTypeOptions
                            .filter(st => selectedItemType === 'all' || st.parent === selectedItemType)
                            .map((subtype) => (
                              <option key={subtype.id} value={subtype.id}>
                                {subtype.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Material */}
                      <div className="mb-4">
                        <label className="text-xs text-muted-foreground mb-2 block">Material</label>
                        <select
                          value={selectedMaterial}
                          onChange={(e) => setSelectedMaterial(e.target.value)}
                          className="w-full p-2 bg-muted/30 border border-border/40 rounded-lg text-sm"
                        >
                          <option value="all">Todos</option>
                          {materialOptions.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Source */}
                      <div className="mb-4">
                        <label className="text-xs text-muted-foreground mb-2 block">Origem</label>
                        <select
                          value={selectedSource}
                          onChange={(e) => setSelectedSource(e.target.value)}
                          className="w-full p-2 bg-muted/30 border border-border/40 rounded-lg text-sm"
                        >
                          <option value="all">Todas</option>
                          {sourceOptions.map((source) => (
                            <option key={source.id} value={source.id}>
                              {source.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Separator className="border-border/40" />

                    {/* Special Filters */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium block text-[#FFE000]">Filtros Especiais</label>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hammer className="w-4 h-4 text-muted-foreground" />
                          <label className="text-sm">Item Artesanal</label>
                        </div>
                        <button
                          onClick={() => setShowCraftedOnly(!showCraftedOnly)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            showCraftedOnly ? 'bg-[#FFE000]' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              showCraftedOnly ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <label className="text-sm">Material de Craft</label>
                        </div>
                        <button
                          onClick={() => setShowCraftMaterialsOnly(!showCraftMaterialsOnly)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            showCraftMaterialsOnly ? 'bg-[#FFE000]' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              showCraftMaterialsOnly ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <Separator className="border-border/40" />

                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-[#FFE000] hover:bg-[#FFD700] text-black border-0"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Aplicar Filtros
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={clearAllFilters}
                      >
                        Limpar Filtros
                      </Button>
                    </div>
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
                  {filterRarity !== 'all' && (
                    <Badge variant="outline" className="border-[#FFE000]/30 text-[#FFE000]">
                      {rarityOptions.find(r => r.id === filterRarity)?.name}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 bg-muted/30 border border-border/40 rounded-lg text-sm"
                  >
                    <option value="price_low">Menor Preço</option>
                    <option value="price_high">Maior Preço</option>
                    <option value="name">Nome</option>
                    <option value="rarity">Raridade</option>
                  </select>

                  <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      className={viewMode === 'grid' ? 'bg-[#FFE000] text-black hover:bg-[#FFD700]' : ''}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      className={viewMode === 'list' ? 'bg-[#FFE000] text-black hover:bg-[#FFD700]' : ''}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSelectAll}
                    className="border-[#FFE000]/30"
                  >
                    {selectedItems.length === filteredItems.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </Button>
                </div>
              </div>

              {/* Items Grid */}
              {filteredItems.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredItems.map((item: any) => (
                    <div key={item.id}>
                      <NFTCard
                        id={String(item.id)}
                        name={item.name}
                        image={item.image_url || collection.name}
                        price={formatPriceBRL(item.last_price_brl)}
                        collection={collection.name}
                        category={item.item_type}
                        rarity={item.rarity}
                        lastSale={"—"}
                        isAuction={false}
                        onClick={() => handleItemClick(item)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <Search className="w-14 h-14 text-[#FFE000]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nenhum item encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar seus filtros para encontrar mais resultados
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    className="bg-[#FFE000] hover:bg-[#FFD700] text-black"
                  >
                    Limpar Filtros
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
