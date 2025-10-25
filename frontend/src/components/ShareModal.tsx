import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  collectionUrl: string;
}

export function ShareModal({ isOpen, onClose, collectionName, collectionUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Confira esta coleção NFT: ${collectionName}`;
  const encodedUrl = encodeURIComponent(collectionUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(collectionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const openShareLink = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-80 max-w-[90vw] border-2 border-[#FFE000]/50 shadow-2xl"
        style={{ backgroundColor: '#0A0A0F' }}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-bold text-[#FFE000] text-center">
            Compartilhar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* URL Input - Compacto */}
          <div className="flex gap-2">
            <Input
              value={collectionUrl}
              readOnly
              className="bg-muted/20 border-[#FFE000]/30 text-xs h-7 text-muted-foreground"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="border-[#FFE000]/50 hover:bg-[#FFE000]/20 h-7 px-2 text-[#FFE000]"
            >
              <Copy className="w-3 h-3" />
              {copied ? '✓' : ''}
            </Button>
          </div>

          {/* Social Media Buttons - Coluna */}
          <div className="space-y-2">
            <Button
              onClick={() => openShareLink(shareLinks.facebook)}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-0 h-8 text-sm cursor-pointer hover:scale-105 transition-all duration-200 flex items-center justify-start"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            
            <Button
              onClick={() => openShareLink(shareLinks.twitter)}
              className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white border-0 h-8 text-sm cursor-pointer hover:scale-105 transition-all duration-200 flex items-center justify-start"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            
            <Button
              onClick={() => openShareLink(shareLinks.whatsapp)}
              className="w-full bg-[#25D366] hover:bg-[#22C55E] text-white border-0 h-8 text-sm cursor-pointer hover:scale-105 transition-all duration-200 flex items-center justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
