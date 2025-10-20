import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ShoppingCart, Heart, Share2, Download, Eye, Trash2 } from 'lucide-react';

interface BulkActionsPanelProps {
  selectedCount: number;
  totalPrice: string;
  onBulkPurchase: () => void;
  onAddToWishlist: () => void;
  onShare: () => void;
  onExport: () => void;
  onPreview: () => void;
  onClear: () => void;
}

export function BulkActionsPanel({
  selectedCount,
  totalPrice,
  onBulkPurchase,
  onAddToWishlist,
  onShare,
  onExport,
  onPreview,
  onClear
}: BulkActionsPanelProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-card/95 backdrop-blur border-border/40 shadow-2xl shadow-black/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Selection Info */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#FFE000] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-[#FFE000] text-black border-0">
                    {selectedCount} item{selectedCount > 1 ? 's' : ''}
                  </Badge>
                  <span className="text-sm text-muted-foreground">selecionado{selectedCount > 1 ? 's' : ''}</span>
                </div>
                <div className="text-lg font-bold text-[#FFE000]">
                  {totalPrice} ETH
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-12" />

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={onBulkPurchase}
                className="bg-[#FFE000] hover:bg-[#FFD700] text-black border-0"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar Todos
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={onAddToWishlist}
                className="border-[#FFE000]/30 hover:bg-[#FFE000]/10"
              >
                <Heart className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={onPreview}
                className="border-[#FFE000]/30 hover:bg-[#FFE000]/10"
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={onShare}
                className="border-[#FFE000]/30 hover:bg-[#FFE000]/10"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={onExport}
                className="border-[#FFE000]/30 hover:bg-[#FFE000]/10"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={onClear}
                className="border-red-500/30 hover:bg-red-500/10 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}